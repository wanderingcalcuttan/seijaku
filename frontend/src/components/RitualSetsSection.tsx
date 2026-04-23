"use client";

import Link from "next/link";
import { useState } from "react";

import ProductDetailDrawer from "@/src/components/shop/ProductDetailDrawer";
import LifestyleSetCard, { type LifestyleFieldValue } from "@/src/components/shop/lifestyle/LifestyleSetCard";
import { homepageFeaturedLifestyleItems } from "@/src/components/shop/lifestyle/lifestyleSetConfig";
import { canonicalShopRoutes, getShopProductBySlug } from "@/src/lib/shopAllItems";

export default function RitualSetsSection() {
  const [selectedValues, setSelectedValues] = useState<Record<string, Record<string, LifestyleFieldValue>>>({});
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const selectedProduct = selectedSlug ? getShopProductBySlug(selectedSlug) ?? null : null;

  const cards = homepageFeaturedLifestyleItems
    .map((entry) => {
      const item = getShopProductBySlug(entry.backingSlug);
      if (!item) return null;

      return (
        <LifestyleSetCard
          key={entry.id}
          item={item}
          displayTitle={entry.title}
          groupLabel={entry.groupLabel}
          includes={entry.includes}
          fields={entry.fields}
          selectedValues={selectedValues[entry.id] ?? {}}
          onSelectValue={(fieldId, value) =>
            setSelectedValues((current) => ({
              ...current,
              [entry.id]: {
                ...(current[entry.id] ?? {}),
                [fieldId]: value,
              },
            }))
          }
          onViewDetails={() => setSelectedSlug(item.slug)}
          imageSrc={entry.imageSrc}
          imageAlt={entry.imageAlt}
        />
      );
    })
    .filter(Boolean);

  if (cards.length === 0) {
    return null;
  }

  return (
    <>
      <section className="section-primary bg-[#F3EFE7] pt-0">
        <div className="page-container">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-[640px]">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#8f7455]">Featured Sets</p>
              <h2 className="mt-4 text-[#1e1d1a]">A curated shelf from Seijaku Lifestyle.</h2>
              <p className="mt-4 max-w-[44ch] text-[15px] leading-[1.82] text-[#5d625d]">
                Discover two ritual sets composed for pause, gifting, and everyday return.
              </p>
            </div>
            <p className="text-[14px] leading-[1.8] text-[#72685c]">Designed to gift, keep, and return to.</p>
          </div>

          <div className="mt-10 grid gap-12 lg:grid-cols-2">{cards}</div>

          <div className="mt-10 flex justify-center">
            <Link
              href={canonicalShopRoutes.lifestyle}
              className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-[#d2c4b3] bg-[#2f5137] px-9 py-3.5 text-[11px] uppercase tracking-[0.22em] text-[#f4efe8] shadow-[0_14px_28px_rgba(47,81,55,0.14)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#25412c] hover:shadow-[0_18px_34px_rgba(47,81,55,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8e806e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3efe7]"
            >
              Browse all sets
            </Link>
          </div>
        </div>
      </section>

      <ProductDetailDrawer item={selectedProduct} isOpen={Boolean(selectedProduct)} onClose={() => setSelectedSlug(null)} />
    </>
  );
}
