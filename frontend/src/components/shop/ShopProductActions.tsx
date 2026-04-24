"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { canonicalShopRoutes } from "@/src/lib/shop-routes";
import {
  isNotifyMeProduct,
  isUnbuyableProduct,
  type ProductView,
} from "@/src/lib/product-types";

import NotifyMeModal from "./NotifyMeModal";
import { useShopState } from "./ShopStateProvider";

type ShopProductActionsProps = {
  item: ProductView;
  onViewDetails: () => void;
  selection?: {
    label?: string | null;
    options?: Record<string, string> | null;
  };
  isBuyDisabled?: boolean;
  buyLabel?: string;
  className?: string;
};

export default function ShopProductActions({
  item,
  onViewDetails,
  selection,
  isBuyDisabled = false,
  buyLabel = "Buy Now",
  className = "",
}: ShopProductActionsProps) {
  const router = useRouter();
  const { beginCheckout, isCollected, toggleCollection } = useShopState();
  const collected = isCollected(item.slug);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);

  const notifyMe = isNotifyMeProduct(item);
  const unbuyable = !notifyMe && isUnbuyableProduct(item);

  const handleBuyNow = () => {
    beginCheckout(item.slug, selection);
    router.push(canonicalShopRoutes.checkout);
  };

  return (
    <>
      <div className={`flex flex-wrap items-center gap-x-4 gap-y-3 ${className}`.trim()}>
        {notifyMe ? (
          <button
            type="button"
            onClick={() => setIsNotifyOpen(true)}
            className="inline-flex min-h-[42px] items-center justify-center rounded-full bg-[#294536] px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.22em] text-[#f4efe8] transition-colors duration-200 hover:bg-[#21382c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8c7b68] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f6f1e8]"
          >
            Notify Me
          </button>
        ) : unbuyable ? (
          <span className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-[rgba(111,100,86,0.18)] bg-[rgba(255,255,255,0.6)] px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.22em] text-[#7a7064]">
            {item.status}
          </span>
        ) : (
          <button
            type="button"
            disabled={isBuyDisabled}
            onClick={handleBuyNow}
            className="inline-flex min-h-[42px] items-center justify-center rounded-full bg-[#294536] px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.22em] text-[#f4efe8] transition-colors duration-200 hover:bg-[#21382c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8c7b68] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f6f1e8] disabled:cursor-not-allowed disabled:bg-[#a8a095] disabled:text-[#f4efe8]/90"
          >
            {buyLabel}
          </button>
        )}
        <button
          type="button"
          onClick={onViewDetails}
          className="text-[11px] uppercase tracking-[0.2em] text-[#4f473f] underline decoration-black/10 underline-offset-4 transition-opacity duration-200 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8c7b68] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f6f1e8]"
        >
          View Details
        </button>
        <button
          type="button"
          onClick={() => toggleCollection(item.slug)}
          className={`text-[11px] uppercase tracking-[0.18em] transition-opacity duration-200 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8c7b68] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f6f1e8] ${
            collected ? "text-[#2e4a36]" : "text-[#5d5449]"
          }`}
        >
          {collected ? "Wishlisted" : "Add to Wishlist"}
        </button>
      </div>

      <NotifyMeModal item={notifyMe ? item : null} isOpen={isNotifyOpen} onClose={() => setIsNotifyOpen(false)} />
    </>
  );
}
