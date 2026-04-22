"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { getShopProductUseCase, type ShopProduct } from "@/src/lib/shopAllItems";

import ShopProductActions from "./ShopProductActions";

type ProductDetailDrawerProps = {
  item: ShopProduct | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function ProductDetailDrawer({ item, isOpen, onClose }: ProductDetailDrawerProps) {
  const [activeMedia, setActiveMedia] = useState<number | null>(null);
  const gallery = item?.gallery ?? (item?.image ? [item.image] : []);
  const activeIndex = activeMedia !== null && gallery[activeMedia] ? activeMedia : 0;
  const activeImage = gallery[activeIndex] ?? item?.image;
  const useCase = item ? getShopProductUseCase(item) : undefined;

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!item) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[70] transition-opacity duration-300 ${
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!isOpen}
    >
      <button type="button" aria-label="Close details" className="absolute inset-0 bg-[rgba(21,18,15,0.36)]" onClick={onClose} />

      <aside className={`absolute inset-x-0 bottom-0 top-auto h-[88vh] w-full overflow-y-auto rounded-t-[28px] bg-[#f6f1e8] shadow-[0_-18px_40px_rgba(27,23,19,0.14)] transition-transform duration-300 md:inset-y-0 md:left-auto md:right-0 md:top-0 md:h-full md:max-w-[720px] md:rounded-none md:shadow-[-20px_0_45px_rgba(27,23,19,0.16)] ${isOpen ? "translate-y-0 md:translate-x-0" : "translate-y-full md:translate-x-full md:translate-y-0"}`}>
        <div className="flex items-center justify-between border-b border-black/6 px-5 py-4 sm:px-7">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#8f7a65]">{item.material ?? "Seijaku Object"}</p>
            <p className="mt-2 font-serif text-[24px] leading-[1.1] tracking-[-0.02em] text-[#1f1a16]">{item.title}</p>
          </div>
          <button type="button" onClick={onClose} className="text-[11px] uppercase tracking-[0.18em] text-[#5b5247]">
            Close
          </button>
        </div>

        <div className="p-5 sm:p-7">
          <div className="relative aspect-[4/4.3] overflow-hidden rounded-[26px] bg-[#ddd1c1]">
            {item.videoUrl ? (
              <video className="h-full w-full object-cover" controls playsInline poster={activeImage}>
                <source src={item.videoUrl} />
              </video>
            ) : activeImage ? (
              <Image src={activeImage} alt={item.imageAlt ?? item.title} fill sizes="(min-width: 768px) 48vw, 100vw" className="object-cover" />
            ) : null}
          </div>

          {gallery.length > 1 ? (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {gallery.map((image, index) => (
                <button
                  key={`${item.slug}-${image}`}
                  type="button"
                  onClick={() => setActiveMedia(index)}
                  className={`relative aspect-[4/3] overflow-hidden rounded-[18px] border ${activeIndex === index ? "border-[#2e4a36]" : "border-[#d8cec1]"}`}
                >
                  <Image src={image} alt={item.imageAlt ? `${item.imageAlt} View ${index + 1}` : `${item.title} view ${index + 1}`} fill sizes="30vw" className="object-cover" />
                </button>
              ))}
            </div>
          ) : null}

          <div className="mt-8 grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-start">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#8f7a65]">Type</p>
              <p className="mt-2 text-[14px] leading-[1.8] text-[#5f5850]">{item.type}</p>
              <p className="mt-5 text-[10px] uppercase tracking-[0.22em] text-[#8f7a65]">Material</p>
              <p className="mt-2 text-[14px] leading-[1.8] text-[#5f5850]">{item.material ?? "Not specified"}</p>
              {useCase ? (
                <>
                  <p className="mt-5 text-[10px] uppercase tracking-[0.22em] text-[#8f7a65]">Use Case</p>
                  <p className="mt-2 text-[14px] leading-[1.8] text-[#5f5850]">{useCase}</p>
                </>
              ) : null}
              <p className="mt-5 text-[10px] uppercase tracking-[0.22em] text-[#8f7a65]">Price</p>
              <p className="mt-2 text-[18px] text-[#2f2924]">{item.priceLabel}</p>
              {item.status ? (
                <>
                  <p className="mt-5 text-[10px] uppercase tracking-[0.22em] text-[#8f7a65]">Status</p>
                  <p className="mt-2 text-[14px] leading-[1.8] text-[#5f5850]">{item.status}</p>
                </>
              ) : null}
            </div>

            <div>
              <p className="text-[15px] leading-[1.85] text-[#5f5850]">
                {item.longDescription ?? item.shortDescription ?? "Detailed product notes will appear here as the catalog evolves."}
              </p>
              <div className="mt-8">
                <ShopProductActions item={item} onViewDetails={onClose} />
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

