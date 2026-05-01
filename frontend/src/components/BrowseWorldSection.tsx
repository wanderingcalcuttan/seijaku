"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type BrowseCard = {
  title: string;
  detail: string;
  images?: string[];
};

const browseCards: BrowseCard[] = [
  {
    title: "Skin",
    detail: "Perfumes for close wear, memory, and gifting.",
    images: [
      "/images/hero banner HP 1.png",
      "/images/our-story-hero-banner.png",
      "/images/Hemanta drop HP banner 1.png",
      "/images/Hemanta drop HP banner 2.png",
    ],
  },
  {
    title: "Textiles",
    detail: "Scarves and squares that carry scent through movement and touch.",
    images: [
      "/images/Seijaku section img 1.png",
      "/images/seijaku sec img 2.png",
      "/images/Quiet Tea Ritual Box_lifestyle.JPG",
      "/images/Evening Unwind Set.png",
    ],
  },
  {
    title: "Home",
    detail: "Diffusers shaped by room, atmosphere, and pace.",
    images: [
      "/images/Home Page hero image 1.png",
      "/images/quiet-tea-ritual-box-lifestyle-neutral.png",
      "/images/Seijaku Lifestyle img 1.png",
      "/images/our-story-hero-banner.png",
    ],
  },
  {
    title: "Objects",
    detail: "Dokra ornaments and quiet metal forms for shelf and altar.",
    images: [
      "/images/Seasonal Drop Listen before shaping.jpg",
      "/images/Seasonal Drop Raja-Kundo.jpg",
      "/images/Seasonal Drop Nandini Raktakarabi.jpg",
      "/images/Seasonal Drop Rishi Chhatim.jpg",
    ],
  },
];

function RotatingCardImage({ title, images }: { title: string; images?: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const safeImages = useMemo(() => {
    const list = (images ?? []).filter(Boolean);
    return list.length > 0 ? list : ["/images/quiet-tea-ritual-box-lifestyle-neutral.png"];
  }, [images]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);

    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || safeImages.length <= 1) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % safeImages.length);
    }, 4200);

    return () => window.clearInterval(interval);
  }, [prefersReducedMotion, safeImages]);

  return (
    <div className="relative aspect-[5/4] w-full overflow-hidden rounded-[18px] bg-[#e7ddd0] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
      {safeImages.map((image, index) => (
        <Image
          key={`${title}-${image}`}
          src={image}
          alt={`${title} fragrance ritual visual ${index + 1}`}
          fill
          sizes="(min-width: 1280px) 22vw, (min-width: 768px) 44vw, 100vw"
          className={`object-cover transition-opacity duration-[1600ms] ease-out ${activeIndex === index ? "opacity-100" : "opacity-0"}`}
          priority={index === 0}
        />
      ))}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(24,20,17,0.02)_0%,rgba(24,20,17,0.10)_100%)]" />
    </div>
  );
}

export type BrowseWorldCardOverrides = {
  card1Image?: string;
  card2Image?: string;
  card3Image?: string;
  card4Image?: string;
};

type BrowseWorldSectionProps = {
  cardOverrides?: BrowseWorldCardOverrides;
};

export default function BrowseWorldSection({ cardOverrides }: BrowseWorldSectionProps = {}) {
  // When admin uploads a single hero image for a card via /admin/bridge-pages
  // (slug "home"), it replaces the rotating fallback list; the card shows a
  // static image instead of cycling. Decision #31.
  const overridesByIndex: (string | undefined)[] = [
    cardOverrides?.card1Image,
    cardOverrides?.card2Image,
    cardOverrides?.card3Image,
    cardOverrides?.card4Image,
  ];

  return (
    <section className="section-secondary bg-[#EAE3D8]">
      <div className="page-container">
        <div className="max-w-[760px]">
          <p className="text-[11px] tracking-[0.02em] text-[#8f7455]">Rituals for body, home, and objects</p>
          <h2 className="mt-4 text-[#1e1d1a]">Explore fragrance rituals for modern living</h2>
          <p className="mt-4 max-w-[46ch] text-[15px] leading-[1.82] text-[#5d625d]">
            Discover scent-led pathways for skin, textiles, home, and handcrafted objects.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {browseCards.map((card, index) => {
            const override = overridesByIndex[index];
            const images = override && override.length > 0 ? [override] : card.images;
            return (
              <article
                key={card.title}
                className="rounded-[24px] border border-[#d8cec1] bg-[#faf7f1] px-6 py-6 shadow-[0_10px_28px_rgba(49,57,49,0.035)]"
              >
                <div className="flex h-full flex-col">
                  <RotatingCardImage title={card.title} images={images} />
                  <h3 className="mt-5 text-[26px] leading-[1.1] text-[#2d2721]">{card.title}</h3>
                  <p className="mt-4 max-w-[24ch] text-[15px] leading-[1.8] text-[#6d645a]">{card.detail}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
