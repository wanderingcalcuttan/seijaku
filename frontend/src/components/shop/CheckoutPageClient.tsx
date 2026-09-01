"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";

import { loadRazorpayCheckout, type RazorpayPaymentResponse } from "@/src/lib/razorpay";
import { canonicalShopRoutes } from "@/src/lib/shop-routes";
import {
  normalizeBackendProduct,
  type BackendProduct,
  type ProductView,
} from "@/src/lib/product-types";

import { useShopState } from "./ShopStateProvider";

type CreateOrderResponse = {
  orderId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
};

export default function CheckoutPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { checkoutItemSlug, checkoutVariantLabel, checkoutSelectedOptions, clearCheckout } = useShopState();
  // Resolve the active slug in priority order: ?item= URL query (most
  // reliable across prefetch/navigation races, since URL travels with the
  // navigation) → in-memory provider state. Buy Now sets both; landing here
  // from another path (reload, deeplink) hits provider state (which itself
  // hydrates from localStorage on first mount).
  const querySlug = searchParams.get("item");
  const activeSlug = useMemo(
    () => (querySlug && querySlug.length > 0 ? querySlug : checkoutItemSlug),
    [querySlug, checkoutItemSlug],
  );
  const [item, setItem] = useState<ProductView | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(Boolean(activeSlug));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [shippingLine1, setShippingLine1] = useState("");
  const [shippingLine2, setShippingLine2] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingState, setShippingState] = useState("");
  const [shippingPincode, setShippingPincode] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [estimatedDeliveryDays, setEstimatedDeliveryDays] = useState<string | null>(null);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);

  // Calculate total with shipping (GST is included in item.price)
  const totalWithShipping = shippingCost !== null && item ? item.price + shippingCost : item?.price ?? 0;

  // Resolve the selected slug against the backend. Single attempt; on failure
  // the component falls through to the empty state (matches the pre-migration
  // registry-miss branch). Cached in `item` state so rerenders don't refetch.
  useEffect(() => {
    if (!activeSlug) {
      setItem(null);
      setIsInitialLoading(false);
      return;
    }
    setIsInitialLoading(true);
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/public/catalog/products/${encodeURIComponent(activeSlug)}`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        // Backend returns { item: <product> }; unwrap before normalizing or
        // normalizeBackendProduct sees missing fields and returns null.
        const body = (await res.json()) as { item: BackendProduct };
        const view = normalizeBackendProduct(body.item);
        if (!cancelled) setItem(view);
      } catch {
        if (!cancelled) setItem(null);
      } finally {
        if (!cancelled) setIsInitialLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeSlug]);

  // Calculate shipping when address is complete
  useEffect(() => {
    if (
      !item ||
      !shippingPincode ||
      shippingPincode.length !== 6 ||
      !shippingCity.trim() ||
      !shippingState.trim()
    ) {
      setShippingCost(null);
      setEstimatedDeliveryDays(null);
      return;
    }

    setIsCalculatingShipping(true);
    let cancelled = false;

    (async () => {
      try {
        // Use actual product dimensions from item data
        const res = await fetch("/api/public/shipping/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pincode: shippingPincode,
            weightKg: (item.weightGrams ?? 500) / 1000, // Convert grams to kg
            lengthCm: item.lengthCm ?? 0,
            breadthCm: item.breadthCm ?? 0,
            heightCm: item.heightCm ?? 0,
          }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as {
          shippingCost: number;
          estimatedDeliveryDays: string;
        };
        console.log(data);
        if (!cancelled) {
          setShippingCost(data.shippingCost);
          setEstimatedDeliveryDays(data.estimatedDeliveryDays);
        }
      } catch {
        if (!cancelled) {
          setShippingCost(100); // Default fallback
          setEstimatedDeliveryDays("5-7");
        }
      } finally {
        if (!cancelled) setIsCalculatingShipping(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [item, shippingPincode, shippingCity, shippingState]);

  if (isInitialLoading) {
    return (
      <main className="min-h-screen bg-[#f3efe7] pt-[72px] text-[#3a3a3a] sm:pt-[76px]">
        {/* <section className="section-primary pt-24 sm:pt-28"> */}
        <div className="page-container max-w-[900px] rounded-[30px] border border-[#d8cec1] mt-24 sm:mt-28 bg-[#faf7f1] px-8 py-12 text-center">
          <p className="text-[14px] leading-[1.85] text-[#625b53]">Loading your selected product…</p>
        </div>
        {/* </section> */}
      </main>
    );
  }

  if (!item) {
    return (
      <main className="min-h-screen bg-[#f3efe7] pt-[72px] text-[#3a3a3a] sm:pt-[76px]">
        <section className="section-primary pt-24 sm:pt-28">
          <div className="page-container max-w-[900px] rounded-[30px] border border-[#d8cec1] bg-[#faf7f1] px-8 py-12 text-center">
            <p className="font-serif text-[34px] leading-[1.12] tracking-[-0.02em] text-[#1f1a16]">No item is ready for checkout yet.</p>
            <p className="mx-auto mt-4 max-w-[36ch] text-[15px] leading-[1.85] text-[#625b53]">
              Choose Buy Now from any product card or detail drawer and the selected object will arrive here ready to complete.
            </p>
            <Link
              href={canonicalShopRoutes.shopAll}
              className="mt-8 inline-flex items-center justify-center rounded-full bg-[#2e4a36] px-7 py-4 text-[12px] font-medium uppercase tracking-[0.18em] text-[#f4efe8] hover:bg-[#243c2c]"
            >
              Browse Shop All
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f3efe7] pt-[72px] text-[#3a3a3a] sm:pt-[76px]">
      <section className="section-primary pt-24 sm:pt-28">
        <div className="page-container grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[30px] border border-[#d8cec1] bg-[#faf7f1] p-8 sm:p-10">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#9a785d]">Checkout</p>
            <h1 className="mt-5 max-w-[12ch] text-[clamp(38px,4vw,56px)] leading-[1.04] tracking-[-0.025em] text-[#1d1a17]">Complete your Seijaku order.</h1>
            <p className="mt-5 max-w-[46ch] text-[15px] leading-[1.85] text-[#5f584f]">
              This route is intentionally minimal: your selected product is held here so the next step feels direct and unambiguous.
            </p>

            <div className="mt-10 space-y-4 rounded-[24px] bg-[#f2eadf] p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#8f7a65]">Selected product</p>
                  <p className="mt-2 font-serif text-[30px] leading-[1.1] tracking-[-0.02em] text-[#1f1a16]">{item.title}</p>
                </div>
                <p className="text-[16px] text-[#2f2924]">{item.priceLabel}</p>
              </div>
              <p className="max-w-[40ch] text-[14px] leading-[1.85] text-[#625b53]">{item.shortDescription}</p>
              {checkoutVariantLabel ? (
                <div className="rounded-[18px] border border-[rgba(111,100,86,0.12)] bg-[#faf7f1] px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#8f7a65]">Selected option</p>
                  <p className="mt-2 text-[14px] leading-[1.7] text-[#4b433b]">{checkoutVariantLabel}</p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-[30px] border border-[#d8cec1] bg-[#eae3d8] p-8 sm:p-10">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#8d7d6d]">Order summary</p>
            <div className="mt-6 space-y-4 text-[14px] leading-[1.8] text-[#5d554b]">
              <div className="flex items-center justify-between gap-4">
                <span>Product</span>
                <div className="text-right">
                  <div>{item.priceLabel}</div>
                  <div className="text-[12px] text-[#8d7d6d]">Included GST</div>
                </div>
              </div>
              {checkoutVariantLabel ? (
                <div className="flex items-start justify-between gap-4">
                  <span>Variant</span>
                  <span className="max-w-[16rem] text-right">{checkoutVariantLabel}</span>
                </div>
              ) : null}
              <div className="flex items-center justify-between gap-4">
                <span>Shipping Charges</span>
                <span>
                  {isCalculatingShipping ? (
                    <span className="text-[12px] text-[#8d7d6d]">Calculating...</span>
                  ) : shippingCost !== null ? (
                    <div className="text-right">
                      <div>INR {shippingCost.toLocaleString("en-IN")}</div>
                      <div className="text-[12px] text-[#8d7d6d]">Est. {estimatedDeliveryDays} days</div>
                    </div>
                  ) : (
                    "Enter address to calculate"
                  )}
                </span>
              </div>
              <div className="h-px bg-black/8" />
              <div className="flex items-center justify-between gap-4 text-[16px] text-[#1f1a16]">
                <span>Total</span>
                <span>INR {totalWithShipping.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="grid gap-4">
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-[18px] border border-[#cfc3b4] bg-[#faf7f1] px-4 py-3 text-[14px] text-[#2f2924] outline-none focus:border-[#2e4a36] focus:ring-2 focus:ring-[#2e4a36]/15"
                />
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-[18px] border border-[#cfc3b4] bg-[#faf7f1] px-4 py-3 text-[14px] text-[#2f2924] outline-none focus:border-[#2e4a36] focus:ring-2 focus:ring-[#2e4a36]/15"
                />
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="w-full rounded-[18px] border border-[#cfc3b4] bg-[#faf7f1] px-4 py-3 text-[14px] text-[#2f2924] outline-none focus:border-[#2e4a36] focus:ring-2 focus:ring-[#2e4a36]/15"
                />
                <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-[#8d7d6d]">Shipping address</p>
                <input
                  type="text"
                  placeholder="Address line 1"
                  value={shippingLine1}
                  onChange={(event) => setShippingLine1(event.target.value)}
                  className="w-full rounded-[18px] border border-[#cfc3b4] bg-[#faf7f1] px-4 py-3 text-[14px] text-[#2f2924] outline-none focus:border-[#2e4a36] focus:ring-2 focus:ring-[#2e4a36]/15"
                />
                <input
                  type="text"
                  placeholder="Address line 2 (optional)"
                  value={shippingLine2}
                  onChange={(event) => setShippingLine2(event.target.value)}
                  className="w-full rounded-[18px] border border-[#cfc3b4] bg-[#faf7f1] px-4 py-3 text-[14px] text-[#2f2924] outline-none focus:border-[#2e4a36] focus:ring-2 focus:ring-[#2e4a36]/15"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="City"
                    value={shippingCity}
                    onChange={(event) => setShippingCity(event.target.value)}
                    className="w-full rounded-[18px] border border-[#cfc3b4] bg-[#faf7f1] px-4 py-3 text-[14px] text-[#2f2924] outline-none focus:border-[#2e4a36] focus:ring-2 focus:ring-[#2e4a36]/15"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={shippingState}
                    onChange={(event) => setShippingState(event.target.value)}
                    className="w-full rounded-[18px] border border-[#cfc3b4] bg-[#faf7f1] px-4 py-3 text-[14px] text-[#2f2924] outline-none focus:border-[#2e4a36] focus:ring-2 focus:ring-[#2e4a36]/15"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Pincode (6 digits)"
                    value={shippingPincode}
                    onChange={(event) => setShippingPincode(event.target.value.replace(/[^0-9]/g, ""))}
                    className="w-full rounded-[18px] border border-[#cfc3b4] bg-[#faf7f1] px-4 py-3 text-[14px] text-[#2f2924] outline-none focus:border-[#2e4a36] focus:ring-2 focus:ring-[#2e4a36]/15"
                  />
                  <input
                    type="text"
                    value="India"
                    readOnly
                    aria-readonly
                    className="w-full rounded-[18px] border border-[#cfc3b4] bg-[#ece5d9] px-4 py-3 text-[14px] text-[#736a5f] outline-none"
                  />
                </div>
                <textarea
                  rows={4}
                  placeholder="Anything we should know before we contact you?"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  className="w-full rounded-[18px] border border-[#cfc3b4] bg-[#faf7f1] px-4 py-3 text-[14px] leading-[1.8] text-[#2f2924] outline-none focus:border-[#2e4a36] focus:ring-2 focus:ring-[#2e4a36]/15"
                />
              </div>

              {notice ? <p className="rounded-[18px] border border-[#cde0d2] bg-[#eef8f0] px-4 py-3 text-[13px] text-[#2c6541]">{notice}</p> : null}
              {error ? <p className="rounded-[18px] border border-[#e7c1ba] bg-[#fff1ee] px-4 py-3 text-[13px] text-[#9f4332]">{error}</p> : null}

              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  startTransition(async () => {
                    setNotice(null);
                    setError(null);

                    // Client-side validation. Server-side Zod still
                    // enforces the same rules — this is for fast UX
                    // feedback before we open Razorpay.
                    if (!name.trim() || !email.trim() || !phone.trim()) {
                      setError("Please fill in your name, email, and phone.");
                      return;
                    }
                    if (
                      !shippingLine1.trim() ||
                      !shippingCity.trim() ||
                      !shippingState.trim()
                    ) {
                      setError("Please complete your shipping address.");
                      return;
                    }
                    if (!/^[0-9]{6}$/.test(shippingPincode)) {
                      setError("Pincode must be 6 digits.");
                      return;
                    }

                    // 1. Create the Razorpay order on our backend.
                    let orderRes: Response;
                    try {
                      orderRes = await fetch("/api/public/payments/orders", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          name,
                          email,
                          phone,
                          notes,
                          source: "frontend-checkout",
                          shippingLine1,
                          shippingLine2: shippingLine2 || undefined,
                          shippingCity,
                          shippingState,
                          shippingPincode,
                          shippingCountry: "IN",
                          items: [
                            {
                              productSlug: item.slug,
                              quantity: 1,
                              selectedOptions: checkoutSelectedOptions ?? undefined,
                              variantSummary: checkoutVariantLabel ?? undefined,
                            },
                          ],
                        }),
                      });
                    } catch {
                      setError("Couldn't reach our servers. Check your connection and try again.");
                      return;
                    }

                    if (!orderRes.ok) {
                      const data = (await orderRes.json().catch(() => null)) as { error?: string } | null;
                      setError(data?.error ?? "Unable to start payment. Please try again.");
                      return;
                    }
                    const order = (await orderRes.json()) as CreateOrderResponse;

                    // 2. Load Razorpay Checkout SDK (10s timeout, single shot).
                    let Razorpay;
                    try {
                      Razorpay = await loadRazorpayCheckout();
                    } catch {
                      setError("Payment provider didn't load. Refresh and try again.");
                      return;
                    }

                    // 3. Open Razorpay Checkout. handler() runs after a successful charge.
                    const rzp = new Razorpay({
                      key: order.keyId,
                      order_id: order.razorpayOrderId,
                      amount: order.amount,
                      currency: order.currency,
                      name: "Seijaku",
                      description: item.title,
                      prefill: { name, email, contact: phone },
                      theme: { color: "#2e4a36" },
                      handler: async (response: RazorpayPaymentResponse) => {
                        try {
                          const verifyRes = await fetch("/api/public/payments/verify", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(response),
                          });
                          if (verifyRes.ok) {
                            clearCheckout();
                            setName("");
                            setEmail("");
                            setPhone("");
                            setNotes("");
                            setShippingLine1("");
                            setShippingLine2("");
                            setShippingCity("");
                            setShippingState("");
                            setShippingPincode("");
                            router.push(`/checkout/order-confirmed?order=${order.orderId}`);
                          } else {
                            setError(
                              "Payment was received but verification failed. If you were charged, our team will reconcile via webhook within minutes — you'll receive an email.",
                            );
                          }
                        } catch {
                          setError(
                            "Payment was received but verification couldn't reach our servers. The webhook will reconcile shortly.",
                          );
                        }
                      },
                      modal: {
                        // User dismissed without paying — no row update needed; the
                        // OrderRequest stays at paymentStatus = CREATED.
                        ondismiss: () => undefined,
                      },
                    });
                    rzp.open();
                  });
                }}
                className="inline-flex w-full items-center justify-center rounded-full bg-[#2e4a36] px-7 py-4 text-[12px] font-medium uppercase tracking-[0.18em] text-[#f4efe8] hover:bg-[#243c2c] disabled:cursor-not-allowed disabled:bg-[#a8a095]"
              >
                {isPending ? "Opening Payment" : "Pay Now"}
              </button>
              <p className="text-[12px] leading-[1.8] text-[#6c6257]">
                Secure checkout via Razorpay. You'll be charged once payment is confirmed.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
