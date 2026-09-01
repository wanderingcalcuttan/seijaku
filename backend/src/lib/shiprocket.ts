import { env } from "../config.js";
import { HttpError } from "../utils/http.js";

// Shiprocket integration. The API authenticates with email + password
// (no key-based scheme), exchanging them for a JWT valid ~10 days.
// We cache the token at module scope and refresh lazily — never on a
// timer, never recursively. A single in-flight refresh promise dedupes
// concurrent callers. See DECISIONS.md#34.

const API_BASE = "https://apiv2.shiprocket.in/v1/external";
const REQUEST_TIMEOUT_MS = 10_000;
// Refresh proactively before Shiprocket's nominal expiry. Their JWT
// lifetime is documented as 240h (10 days); we treat the cached token
// as valid for 9 days to leave headroom against clock skew + edge
// invalidation. Tokens that come back with an explicit `expires_in`
// override this default.
const DEFAULT_TOKEN_TTL_MS = 9 * 24 * 60 * 60 * 1000;

type CachedToken = {
  value: string;
  expiresAt: number;
};

let cachedToken: CachedToken | null = null;
let refreshInFlight: Promise<string> | null = null;

type LoginResponse = {
  token: string;
  // Shiprocket's response shape varies; both `expires_in` (seconds) and
  // `expiry` (epoch seconds) have been observed in their docs.
  expires_in?: number;
  expiry?: number;
};

async function loginAndCache(): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: env.SHIPROCKET_EMAIL,
        password: env.SHIPROCKET_PASSWORD,
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[shiprocket] auth.login non-2xx", res.status, body);
      throw new HttpError(502, "shiprocket_auth_failed");
    }
    const data = (await res.json()) as LoginResponse;
    if (!data.token) {
      throw new HttpError(502, "shiprocket_auth_no_token");
    }
    const ttlMs = data.expires_in
      ? data.expires_in * 1000
      : data.expiry
        ? Math.max(0, data.expiry * 1000 - Date.now())
        : DEFAULT_TOKEN_TTL_MS;
    cachedToken = {
      value: data.token,
      // Refresh slightly before nominal expiry to avoid mid-call invalidation.
      expiresAt: Date.now() + Math.floor(ttlMs * 0.95),
    };
    return data.token;
  } catch (err) {
    if (err instanceof HttpError) throw err;
    if ((err as { name?: string })?.name === "AbortError") {
      throw new HttpError(504, "shiprocket_unreachable");
    }
    console.error("[shiprocket] auth.login unexpected", err);
    throw new HttpError(502, "shiprocket_unreachable");
  } finally {
    clearTimeout(timer);
  }
}

export async function getShiprocketToken(forceRefresh = false): Promise<string> {
  if (!forceRefresh && cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.value;
  }
  // Coalesce concurrent callers into a single login request.
  if (refreshInFlight) return refreshInFlight;
  refreshInFlight = loginAndCache().finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
}

// Reset the cached token. Called only when a request comes back 401 so
// the very next call retries with a fresh login.
function invalidateToken() {
  cachedToken = null;
}

// ─── Order creation ──────────────────────────────────────────────────────

export type ShiprocketOrderItem = {
  name: string;
  sku: string;
  units: number;
  selling_price: number;
  hsn?: string;
};

export type CreateShiprocketOrderInput = {
  orderId: string;
  orderDate: Date;
  pickupLocation: string;
  billing: {
    customerName: string;
    line1: string;
    line2?: string | null;
    city: string;
    state: string;
    pincode: string;
    country: string;
    email: string;
    phone: string;
  };
  items: ShiprocketOrderItem[];
  subTotal: number;
  weightKg: number;
  lengthCm: number;
  breadthCm: number;
  heightCm: number;
};

export type CreateShiprocketOrderResult = {
  shiprocketOrderId: string;
  shiprocketShipmentId: string;
  awbCode?: string;
  courierName?: string;
};

type ShiprocketCreateOrderResponse = {
  order_id?: number | string;
  shipment_id?: number | string;
  awb_code?: string;
  courier_name?: string;
  status?: string;
  status_code?: number;
  message?: string;
};

function splitName(name: string): { first: string; last: string } {
  const trimmed = name.trim();
  if (!trimmed) return { first: "Customer", last: "." };
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    // Shiprocket requires a non-empty last_name. Repeat the single name
    // so we satisfy the schema without inventing a different identity.
    return { first: parts[0], last: parts[0] };
  }
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

function buildPayload(input: CreateShiprocketOrderInput) {
  const { first, last } = splitName(input.billing.customerName);
  return {
    order_id: input.orderId,
    order_date: input.orderDate.toISOString().slice(0, 19).replace("T", " "),
    pickup_location: input.pickupLocation,
    channel_id: "",
    comment: "",
    billing_customer_name: first,
    billing_last_name: last,
    billing_address: input.billing.line1,
    billing_address_2: input.billing.line2 ?? "",
    billing_city: input.billing.city,
    billing_pincode: input.billing.pincode,
    billing_state: input.billing.state,
    billing_country: input.billing.country,
    billing_email: input.billing.email,
    billing_phone: input.billing.phone,
    shipping_is_billing: true,
    order_items: input.items.map((item) => ({
      name: item.name,
      sku: item.sku,
      units: item.units,
      selling_price: item.selling_price,
      hsn: item.hsn ?? "",
    })),
    payment_method: "Prepaid" as const,
    sub_total: input.subTotal,
    length: input.lengthCm,
    breadth: input.breadthCm,
    height: input.heightCm,
    weight: input.weightKg,
  };
}

// Exported for testing — pure function with no side effects.
export const buildShiprocketOrderPayload = buildPayload;

async function shiprocketFetch<T>(
  path: string,
  init: RequestInit,
  { retryOn401 = true }: { retryOn401?: boolean } = {},
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const token = await getShiprocketToken();
    const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        ...(init.headers ?? {}),
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    });
    if (res.status === 401 && retryOn401) {
      // Token was rejected — invalidate the cache and retry exactly
      // once. No loop, no recursion — `retryOn401: false` on the retry.
      invalidateToken();
      clearTimeout(timer);
      return shiprocketFetch<T>(path, init, { retryOn401: false });
    }
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[shiprocket]", path, "non-2xx", res.status, body);
      throw new HttpError(502, "shiprocket_rejected");
    }
    return (await res.json()) as T;
  } catch (err) {
    if (err instanceof HttpError) throw err;
    if ((err as { name?: string })?.name === "AbortError") {
      throw new HttpError(504, "shiprocket_unreachable");
    }
    console.error("[shiprocket]", path, "unexpected", err);
    throw new HttpError(502, "shiprocket_unreachable");
  } finally {
    clearTimeout(timer);
  }
}

export async function createShiprocketOrder(
  input: CreateShiprocketOrderInput,
): Promise<CreateShiprocketOrderResult> {
  const payload = buildPayload(input);
  const data = await shiprocketFetch<ShiprocketCreateOrderResponse>(
    "/orders/create/adhoc",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
  if (!data.order_id || !data.shipment_id) {
    console.error("[shiprocket] orders.create missing ids", data);
    throw new HttpError(502, "shiprocket_invalid_response");
  }
  return {
    shiprocketOrderId: String(data.order_id),
    shiprocketShipmentId: String(data.shipment_id),
    awbCode: data.awb_code,
    courierName: data.courier_name,
  };
}

// ─── Shipping rate calculation ───────────────────────────────────────────

export type ShippingRateInput = {
  pincode: string;
  weightKg: number;
  lengthCm: number;
  breadthCm: number;
  heightCm: number;
};

export type ShippingRateResult = {
  rate: number;
  estimatedDeliveryDays: string;
};

type ShiprocketRateResponse = {
  status?: number;
  data?: {
    available_courier_companies?: Array<{
      courier_name?: string;
      rate?: number;
      etd?: string;
      estimated_delivery_days?: string;
    }>;
  };
  message?: string;
};

// Calculate shipping rates using Shiprocket API. Returns the cheapest rate
// and its estimated delivery days. Used by the frontend checkout to display
// estimated shipping cost and delivery timeline.
export async function calculateShippingRate(
  input: ShippingRateInput,
): Promise<ShippingRateResult> {
  const params = new URLSearchParams({
    pickup_postcode: "700094",
    delivery_postcode: input.pincode,
    weight: String(input.weightKg),
    length: String(input.lengthCm),
    breadth: String(input.breadthCm),
    height: String(input.heightCm),
    cod: "0",
  });

  const data = await shiprocketFetch<ShiprocketRateResponse>(
    `/courier/serviceability/?${params.toString()}`,
    {
      method: "GET",
    },
  );
  
  if (!data.data?.available_courier_companies || data.data.available_courier_companies.length === 0) {
    console.warn("[shiprocket] no rates available for pincode", input.pincode);
    // Return default shipping cost and delivery estimate if no rates found
    return {
      rate: 100,
      estimatedDeliveryDays: "5-7",
    };
  }

  // Find the courier with the cheapest rate
  let cheapestCourier = data.data.available_courier_companies[0];
  for (const courier of data.data.available_courier_companies) {
    if ((courier.rate ?? 0) > 0 && (courier.rate ?? Infinity) < (cheapestCourier.rate ?? Infinity)) {
      cheapestCourier = courier;
    }
  }

  const rate = cheapestCourier.rate ?? 100;
  const estimatedDeliveryDays = cheapestCourier.estimated_delivery_days ?? "5-7";
  
  return {
    rate: rate > 0 ? rate : 100,
    estimatedDeliveryDays,
  };
}

// ─── Admin helpers ───────────────────────────────────────────────────────

export type PickupLocation = {
  pickupLocation: string;
  addressLine1: string;
  city: string;
  state: string;
  pincode: string;
};

type ShiprocketPickupResponse = {
  data?: {
    shipping_address?: Array<{
      pickup_location?: string;
      address?: string;
      city?: string;
      state?: string;
      pin_code?: string | number;
    }>;
  };
};

export async function listPickupLocations(): Promise<PickupLocation[]> {
  const data = await shiprocketFetch<ShiprocketPickupResponse>(
    "/settings/company/pickup",
    { method: "GET" },
  );
  return (data.data?.shipping_address ?? [])
    .filter((entry) => entry.pickup_location)
    .map((entry) => ({
      pickupLocation: entry.pickup_location ?? "",
      addressLine1: entry.address ?? "",
      city: entry.city ?? "",
      state: entry.state ?? "",
      pincode: String(entry.pin_code ?? ""),
    }));
}

// Cheap sanity check: forces a token fetch. Returns true on success;
// throws HttpError on failure (caller decides whether to surface the
// error code or just bool-coerce).
export async function testShiprocketAuth(): Promise<{ ok: true }> {
  await getShiprocketToken(true);
  return { ok: true };
}
