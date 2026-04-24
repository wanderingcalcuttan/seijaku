"use client";

import Image from "next/image";

import type { ProductView } from "@/src/lib/product-types";

import ShopProductActions from "./ShopProductActions";

type EditorialProductRowProps = {
  item: ProductView;
  onViewDetails: (slug: string) => void;
  index?: number;
};

export default function EditorialProductRow({ item, onViewDetails, index = 0 }: EditorialProductRowProps) {
  const reverse = index % 2 === 1;

  return (
    <article className="section-divider py-10 sm:py-12">
      <div className={`grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12 ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
        <div className="relative aspect-[4/3.3] overflow-hidden rounded-[30px] border border-[#d8cec1] bg-[#e7dfd1]">
          <Image src={item.image} alt={item.imageAlt ?? item.title} fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-[10px] uppercase tracking-[0.26em] text-[#9a785d]">{item.material}</p>
          <h2 className="mt-4 max-w-[14ch] text-[clamp(34px,4vw,48px)] leading-[1.06] tracking-[-0.025em] text-[#1f1a16]">
            {item.title}
          </h2>
          <p className="mt-5 max-w-[42ch] text-[16px] leading-[1.85] text-[#5f5850]">{item.shortDescription}</p>
          <p className="mt-6 text-[16px] text-[#2f2924]">{item.priceLabel}</p>
          <ShopProductActions className="mt-8" item={item} onViewDetails={() => onViewDetails(item.slug)} />
        </div>
      </div>
    </article>
  );
}
