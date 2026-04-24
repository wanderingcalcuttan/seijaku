"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { ProductView } from "@/src/lib/product-types";

import PerfumeProductCard from "./PerfumeProductCard";

type PerfumeProductSliderProps = {
  products: ProductView[];
  categoryLabel: string;
  onViewDetails: (slug: string) => void;
};

export default function PerfumeProductSlider({
  products,
  categoryLabel,
  onViewDetails,
}: PerfumeProductSliderProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 1);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) {
      return undefined;
    }
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  const scrollBy = (direction: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="-mx-4 flex snap-x snap-mandatory items-stretch gap-6 overflow-x-auto scroll-smooth px-4 pb-2 [-ms-overflow-style:none] [overscroll-behavior-x:contain] [scrollbar-width:none] sm:-mx-5 sm:px-5 [&::-webkit-scrollbar]:hidden"
      >
        {products.map((item) => (
          <div
            key={item.slug}
            className="flex shrink-0 basis-[78%] snap-start sm:basis-[46%] lg:basis-[31%] xl:basis-[23%]"
          >
            <div className="flex w-full">
              <PerfumeProductCard
                item={item}
                categoryLabel={categoryLabel}
                onViewDetails={onViewDetails}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scrollBy(-1)}
        disabled={!canScrollLeft}
        aria-label="Previous products"
        className="absolute -left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(86,76,64,0.16)] bg-[#fbf8f2] text-[#2e4a36] shadow-[0_8px_18px_rgba(41,34,27,0.08)] transition-opacity duration-200 hover:bg-[#f4efe8] disabled:pointer-events-none disabled:opacity-0 lg:inline-flex"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button
        type="button"
        onClick={() => scrollBy(1)}
        disabled={!canScrollRight}
        aria-label="Next products"
        className="absolute -right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(86,76,64,0.16)] bg-[#fbf8f2] text-[#2e4a36] shadow-[0_8px_18px_rgba(41,34,27,0.08)] transition-opacity duration-200 hover:bg-[#f4efe8] disabled:pointer-events-none disabled:opacity-0 lg:inline-flex"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
