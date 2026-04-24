import { publicBackendJson } from "@/src/lib/backend";
import { cacheTags } from "@/src/lib/cache-tags";
import type { ShopProduct, ShopUseCase } from "@/src/lib/shopAllItems";

// ProductView is the read-only public shape the page clients already
// consume. Structural subset of ShopProduct so ProductView[] assigns to
// ShopProduct[] positions without refactoring any card/drawer.
// Dropped fields: ritualTag / ritualTagHref — not modeled backend-side.
// Used by ~3 products on the pre-Phase-4a registry; reintroduce via a
// metadataJson field if/when the admin needs it.
export type ProductView = Omit<ShopProduct, "ritualTag" | "ritualTagHref">;

export type BackendProductStatus =
  | "IN_STOCK"
  | "LIMITED_EDITION"
  | "UPCOMING"
  | "OPEN_FOR_BOOKING"
  | "SOLD_OUT"
  | "WAITLIST"
  | "BOOKING_OPEN";

type BackendProductMedia = {
  type: string;
  asset: {
    id: string;
    url: string;
    altText: string | null;
    kind: "IMAGE" | "VIDEO" | "DOCUMENT";
  };
};

type BackendProductOptionValue = {
  label: string;
};

type BackendProductOption = {
  label: string;
  required: boolean;
  values: BackendProductOptionValue[];
};

type BackendProductBridgePageRef = { slug: string };

export type BackendProduct = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string | null;
  longDescription: string | null;
  type: string;
  material: string;
  useCase: string | null;
  priceAmount: number;
  currency: string;
  status: BackendProductStatus;
  workflowStatus: "DRAFT" | "PUBLISHED";
  imageAlt: string | null;
  ctaLabel: string | null;
  primaryImage: { url: string; altText: string | null } | null;
  media: BackendProductMedia[];
  options: BackendProductOption[];
  bridgePages: BackendProductBridgePageRef[];
};

const STATUS_DISPLAY: Record<BackendProductStatus, string> = {
  IN_STOCK: "In Stock",
  LIMITED_EDITION: "Limited Edition",
  UPCOMING: "Upcoming",
  OPEN_FOR_BOOKING: "Open for Booking",
  SOLD_OUT: "Sold Out",
  WAITLIST: "Waitlist",
  BOOKING_OPEN: "Booking Open",
};

const PLACEHOLDER_IMAGE = "/images/Home Page hero image 1.png";

export function productStatusToDisplay(status: BackendProductStatus): string {
  return STATUS_DISPLAY[status];
}

function formatPriceLabel(amount: number, currency: string): string {
  if (currency === "INR") {
    return `INR ${amount.toLocaleString("en-IN")}`;
  }
  return `${currency} ${amount.toLocaleString()}`;
}

// Drafts return null so caller can filter them out; everything else maps.
// `type`, `material`, `useCase`, `bridgeCategory` are asserted into the
// ShopProduct unions — free-text values outside the union will still render
// correctly in page clients (they read the string verbatim); frontend-level
// filter helpers elsewhere rely on the union but are unused on /shop/[slug].
export function normalizeBackendProduct(b: BackendProduct): ProductView | null {
  if (b.workflowStatus === "DRAFT") return null;

  const videoAsset = b.media.find((m) => m.asset.kind === "VIDEO")?.asset;
  const gallery = b.media
    .filter((m) => m.asset.kind === "IMAGE" && m.type !== "PRIMARY")
    .map((m) => m.asset.url);

  const image = b.primaryImage?.url ?? gallery[0] ?? PLACEHOLDER_IMAGE;
  const imageAlt = b.primaryImage?.altText ?? b.imageAlt ?? undefined;

  return {
    id: b.id,
    slug: b.slug,
    title: b.title,
    type: b.type as ProductView["type"],
    material: b.material as ProductView["material"],
    useCase: (b.useCase ?? undefined) as ProductView["useCase"],
    bridgeCategory: (b.bridgePages[0]?.slug ?? undefined) as ProductView["bridgeCategory"],
    shortDescription: b.shortDescription ?? undefined,
    longDescription: b.longDescription ?? undefined,
    price: b.priceAmount,
    priceLabel: formatPriceLabel(b.priceAmount, b.currency),
    image,
    imageAlt,
    gallery: gallery.length > 0 ? gallery : undefined,
    videoUrl: videoAsset?.url,
    ctaLabel: b.ctaLabel ?? undefined,
    status: STATUS_DISPLAY[b.status],
    customizationOptions:
      b.options.length > 0
        ? b.options.map((o) => ({
            label: o.label,
            values: o.values.map((v) => v.label),
            required: o.required || undefined,
          }))
        : undefined,
  };
}

export function normalizeBackendProducts(items: BackendProduct[]): ProductView[] {
  return items
    .map(normalizeBackendProduct)
    .filter((p): p is ProductView => p !== null);
}

// Fetches the full published catalog from the backend, normalized to the
// ProductView shape. /catalog/products already filters DRAFT server-side
// (backend/src/routes/public.ts), so the draft filter inside the normalizer
// is defensive.
export async function fetchProducts(): Promise<ProductView[]> {
  const { items } = await publicBackendJson<{ items: BackendProduct[] }>(
    "/catalog/products",
    { tags: [cacheTags.products] },
  );
  return normalizeBackendProducts(items);
}

// Pure replacement for `getShopUseCases()` — derives the distinct use-case
// list from a given product list instead of closing over the registry.
// `getShopTypes()` / `getShopMaterials()` in shopAllItems.ts return curated
// filter-chip taxonomies (not derived from products), so no equivalent
// collect* helpers are needed for those.
export function collectUseCases(products: ProductView[]): ShopUseCase[] {
  const set = new Set<ShopUseCase>();
  for (const p of products) {
    if (p.useCase) set.add(p.useCase);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}
