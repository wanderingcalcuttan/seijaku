"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  bridgeHrefBySlug,
  bridgeNavLabelBySlug,
  isShopBridgeSlug,
} from "@/src/lib/bridge-page-types";
import {
  normalizeBackendProducts,
  type BackendProduct,
  type ProductView,
} from "@/src/lib/product-types";

type SearchOverlayProps = {
  open: boolean;
  onClose: () => void;
};

type SearchResult = {
  product: ProductView;
  bridgeHref: string | null;
  bridgeLabel: string | null;
  score: number;
};

const MAX_RESULTS = 12;

function scoreProduct(product: ProductView, q: string): number {
  const needle = q.toLowerCase().trim();
  if (!needle) return 0;

  const haystacks: Array<{ text: string; weight: number }> = [
    { text: product.title ?? "", weight: 10 },
    { text: product.type ?? "", weight: 4 },
    { text: product.material ?? "", weight: 4 },
    { text: product.bridgeCategory ?? "", weight: 3 },
    { text: product.useCase ?? "", weight: 3 },
    { text: product.shortDescription ?? "", weight: 1 },
    { text: product.longDescription ?? "", weight: 1 },
  ];

  let score = 0;
  for (const { text, weight } of haystacks) {
    const lower = text.toLowerCase();
    if (!lower) continue;
    if (lower === needle) score += weight * 5;
    else if (lower.startsWith(needle)) score += weight * 3;
    else if (lower.includes(needle)) score += weight;
  }
  return score;
}

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<ProductView[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const fetchStartedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input when the overlay opens. Query reset is handled by
  // the parent via handleClose (see below) so we don't call setState in
  // an effect body.
  useEffect(() => {
    if (!open) return;
    // Slight delay so the element exists after conditional render.
    const t = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => window.clearTimeout(t);
  }, [open]);

  const handleClose = useCallback(() => {
    setQuery("");
    onClose();
  }, [onClose]);

  // Close on Escape. Attach only while open so we don't hold the listener.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, handleClose]);

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Lazy-load the catalog the first time the overlay opens. Cached for the
  // component's lifetime — reopening the overlay doesn't refetch. Single
  // attempt; on failure we render a quiet load-error state below.
  useEffect(() => {
    if (!open || fetchStartedRef.current) return;
    fetchStartedRef.current = true;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/public/catalog/products", {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const { items } = (await res.json()) as { items: BackendProduct[] };
        if (cancelled) return;
        setProducts(normalizeBackendProducts(items));
      } catch {
        if (cancelled) return;
        setLoadError(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open]);

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim();
    if (!q || !products) return [];

    const scored: SearchResult[] = [];
    for (const product of products) {
      const score = scoreProduct(product, q);
      if (score <= 0) continue;

      const bridgeSlug = product.bridgeCategory;
      const isCanonical = bridgeSlug && isShopBridgeSlug(bridgeSlug);
      scored.push({
        product,
        bridgeHref: isCanonical ? bridgeHrefBySlug(bridgeSlug) : null,
        bridgeLabel: isCanonical ? bridgeNavLabelBySlug[bridgeSlug] : null,
        score,
      });
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, MAX_RESULTS);
  }, [query, products]);

  if (!open) return null;

  const trimmedQuery = query.trim();
  const isLoading = products === null && !loadError;

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-[#1d1916]/90 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Search products"
    >
      {/* Input row at top. Mirrors navbar height visually. */}
      <div className="border-b border-white/10 bg-[#1d1916]/95 px-5 py-5 sm:px-8 md:px-10 lg:px-14 xl:px-[72px]">
        <div className="mx-auto flex max-w-[1480px] items-center gap-3">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, materials, rituals…"
            className="flex-1 bg-transparent text-[20px] text-[#e0c98a] placeholder:text-[#8d7254] focus:outline-none sm:text-[24px]"
            aria-label="Search query"
          />
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-2 text-[#e0c98a] transition hover:bg-white/5"
            aria-label="Close search"
          >
            <X size={20} strokeWidth={1.9} />
          </button>
        </div>
      </div>

      {/* Results / hints */}
      <div
        className="flex-1 overflow-y-auto px-5 py-8 sm:px-8 md:px-10 lg:px-14 xl:px-[72px]"
        onClick={(e) => {
          // Click on empty background closes; clicks on cards will stop propagation via Link's default.
          if (e.target === e.currentTarget) handleClose();
        }}
      >
        <div className="mx-auto max-w-[1480px]">
          {!trimmedQuery ? (
            <div className="pt-10 text-center text-[14px] text-[#b5a98a]">
              Start typing to search the shop. Try &ldquo;diffuser&rdquo;, &ldquo;dokra&rdquo;, or &ldquo;silk&rdquo;.
            </div>
          ) : isLoading ? (
            <div className="pt-10 text-center text-[14px] text-[#b5a98a]">Loading catalog…</div>
          ) : loadError ? (
            <div className="pt-10 text-center text-[14px] text-[#b5a98a]">
              Couldn&rsquo;t load the catalog. Please try again in a moment.
            </div>
          ) : results.length === 0 ? (
            <div className="pt-10 text-center text-[14px] text-[#b5a98a]">
              No matches for &ldquo;{query}&rdquo;. Try a different term.
            </div>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {results.map(({ product, bridgeHref, bridgeLabel }) => {
                // Fall back to the shop root if a product isn't attached to a
                // bridge page (shouldn't happen today, but guard for safety).
                const href = bridgeHref ?? "/shop";
                return (
                  <li key={product.id}>
                    <Link
                      href={href}
                      onClick={handleClose}
                      className="group flex gap-3 rounded-2xl border border-white/10 bg-[#2a2420] p-3 transition hover:border-[#e0c98a]/60 hover:bg-[#332b26]"
                    >
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-[#3a3129]">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.imageAlt ?? product.title}
                            fill
                            sizes="80px"
                            className="object-cover"
                            unoptimized={product.image.startsWith("http")}
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[15px] font-medium text-[#e0c98a]">{product.title}</div>
                        <div className="mt-1 truncate text-[11px] uppercase tracking-[0.16em] text-[#8d7254]">
                          {[product.type, product.material].filter(Boolean).join(" · ")}
                        </div>
                        {bridgeLabel ? (
                          <div className="mt-1 truncate text-[11px] text-[#b5a98a]">in {bridgeLabel}</div>
                        ) : null}
                        {product.priceLabel ? (
                          <div className="mt-1 text-[13px] text-[#e0c98a]">{product.priceLabel}</div>
                        ) : null}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
