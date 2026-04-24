"use client";

import Image from "next/image";

import type { ProductView } from "@/src/lib/product-types";

import ShopProductActions from "./ShopProductActions";

type CompactProductCardProps = {
  item: ProductView;
  onViewDetails: (slug: string) => void;
};

export default function CompactProductCard({ item, onViewDetails }: CompactProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-[24px] border border-[rgba(111,100,86,0.11)] bg-[linear-gradient(180deg,#fbf8f2_0%,#f7f1e8_100%)] shadow-[0_10px_24px_rgba(44,37,28,0.03)] transition-all duration-300 hover:-translate-y-[1px] hover:border-[rgba(111,100,86,0.18)] hover:shadow-[0_16px_30px_rgba(44,37,28,0.045)]">
      <button type="button" onClick={() => onViewDetails(item.slug)} className="block w-full text-left focus-visible:outline-none">
        <div className="relative aspect-[4/4.45] overflow-hidden bg-[#e7dfd1]">
          <Image
            src={item.image}
            alt={item.imageAlt ?? item.title}
            fill
            sizes="(min-width: 1280px) 18vw, (min-width: 768px) 28vw, 48vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.015]"
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(28,24,20,0)_58%,rgba(28,24,20,0.08)_100%)]" />
        </div>
      </button>

      <div className="px-4 pb-4 pt-4 sm:px-4">
        <p className="text-[9px] uppercase tracking-[0.22em] text-[#91806d]">{item.type}</p>
        <h2 className="mt-2 font-serif text-[21px] leading-[1.12] tracking-[-0.022em] text-[#1f1a16]">{item.title}</h2>
        <p className="mt-2 line-clamp-2 min-h-[2.9rem] text-[13px] leading-[1.68] text-[#625a51]">
          {item.shortDescription ?? "Quietly composed Seijaku object."}
        </p>
        <div className="mt-4">
          <p className="text-[9px] uppercase tracking-[0.18em] text-[#8f7a65]">Price</p>
          <p className="mt-1 text-[14px] text-[#2f2924]">{item.priceLabel}</p>
        </div>
        <div className="mt-4 border-t border-black/6 pt-4">
          <ShopProductActions item={item} onViewDetails={() => onViewDetails(item.slug)} />
        </div>
      </div>
    </article>
  );
}
