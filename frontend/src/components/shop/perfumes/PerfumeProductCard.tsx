"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { canonicalShopRoutes, type ShopProduct } from "@/src/lib/shopAllItems";

import { useShopState } from "../ShopStateProvider";

type PerfumeProductCardProps = {
  item: ShopProduct;
  categoryLabel: string;
  onViewDetails: (slug: string) => void;
};

export default function PerfumeProductCard({ item, categoryLabel, onViewDetails }: PerfumeProductCardProps) {
  const router = useRouter();
  const { beginCheckout, isCollected, toggleCollection } = useShopState();
  const collected = isCollected(item.slug);

  const handleBuyNow = () => {
    beginCheckout(item.slug);
    router.push(canonicalShopRoutes.checkout);
  };

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
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <button
              type="button"
              onClick={handleBuyNow}
              className="inline-flex min-h-[40px] items-center justify-center rounded-full bg-[#294536] px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.22em] text-[#f4efe8] transition-colors duration-200 hover:bg-[#21382c]"
            >
              Buy Now
            </button>
            <button
              type="button"
              onClick={() => onViewDetails(item.slug)}
              className="text-[11px] uppercase tracking-[0.2em] text-[#4f473f] underline decoration-black/10 underline-offset-4 transition-opacity duration-200 hover:opacity-70"
            >
              View Details
            </button>
            <button
              type="button"
              onClick={() => toggleCollection(item.slug)}
              className={`text-[11px] uppercase tracking-[0.18em] transition-opacity duration-200 hover:opacity-70 ${
                collected ? "text-[#2e4a36]" : "text-[#5d5449]"
              }`}
            >
              {collected ? "Wishlisted" : "Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
