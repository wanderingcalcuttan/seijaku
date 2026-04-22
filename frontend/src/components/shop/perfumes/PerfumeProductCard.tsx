"use client";

import Image from "next/image";

import type { ShopProduct } from "@/src/lib/shopAllItems";

import ShopProductActions from "../ShopProductActions";

type PerfumeProductCardProps = {
  item: ShopProduct;
  categoryLabel: string;
  onViewDetails: (slug: string) => void;
};

export default function PerfumeProductCard({ item, categoryLabel, onViewDetails }: PerfumeProductCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-[rgba(86,76,64,0.1)] bg-[linear-gradient(180deg,rgba(251,248,242,0.96)_0%,rgba(246,240,232,0.98)_100%)] shadow-[0_14px_30px_rgba(41,34,27,0.04)] transition-all duration-300 hover:-translate-y-[2px] hover:border-[rgba(86,76,64,0.16)] hover:shadow-[0_20px_36px_rgba(41,34,27,0.06)]">
      <button
        type="button"
        onClick={() => onViewDetails(item.slug)}
        className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8c7b68] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f6f1e8]"
        aria-label={`View details for ${item.title}`}
      >
        <div className="relative mx-4 mt-4 aspect-[4/4.75] overflow-hidden rounded-[18px] bg-[#e7dfd4] sm:mx-5 sm:mt-5">
          <Image
            src={item.image}
            alt={item.imageAlt ?? item.title}
            fill
            sizes="(min-width: 1280px) 260px, (min-width: 768px) 30vw, 88vw"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>
      </button>

      <div className="flex flex-1 flex-col px-4 pb-5 pt-4 sm:px-5 sm:pb-6 sm:pt-5">
        <p className="text-[10px] uppercase tracking-[0.26em] text-[#8b775f]">{categoryLabel}</p>
        <h3 className="mt-3 font-serif text-[22px] leading-[1.12] tracking-[-0.02em] text-[#1b1714]">{item.title}</h3>
        {item.shortDescription ? (
          <p className="mt-3 text-[14px] leading-[1.82] text-[#5f574d]">{item.shortDescription}</p>
        ) : null}
        <p className="mt-4 text-[14px] text-[#312b25]">{item.priceLabel}</p>

        <div className="mt-auto pt-5">
          <ShopProductActions item={item} onViewDetails={() => onViewDetails(item.slug)} />
        </div>
      </div>
    </article>
  );
}
