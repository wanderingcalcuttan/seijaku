"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { RefObject, useRef } from "react";

type HeroBannerProps = {
  heroRef?: RefObject<HTMLElement | null>;
  imageSrc?: string;
  imageAlt?: string;
};

const heroEyebrowColor = "#e2d6c0";
const heroHeadlineColor = "#d8f0da";
const heroSubtextColor = "#c8e6cc";

const HERO_BACKGROUND_FALLBACK = "/images/Ritual set HP Hero 1.png";
// ID of the first post-hero wrapper on the home page. The Find Your Calm
// button uses this target; if the id is ever removed the button is a no-op.
const SCROLL_TARGET_ID = "home-next";

export default function HeroBanner({ heroRef, imageSrc, imageAlt }: HeroBannerProps) {
  const localRef = useRef<HTMLElement | null>(null);
  const sectionRef = heroRef ?? localRef;
  const heroImage = imageSrc && imageSrc.length > 0 ? imageSrc : HERO_BACKGROUND_FALLBACK;

  const handleScrollDown = () => {
    if (typeof window === "undefined") {
      return;
    }
    const target = document.getElementById(SCROLL_TARGET_ID);
    if (!target) {
      return;
    }
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
  };

  return (
    <section
      ref={sectionRef}
      aria-label="Seijaku home hero"
      className="relative isolate mt-[118px] min-h-[72svh] w-full overflow-hidden bg-[#352d27] pb-[64px] pt-[128px] sm:mt-[124px] sm:min-h-[75svh] sm:pb-[72px] sm:pt-[140px] md:mt-[128px] md:min-h-[78svh] md:pb-[88px] md:pt-[150px] lg:mt-[132px] lg:min-h-[84vh] lg:pb-[112px] lg:pt-[162px] xl:min-h-[88vh] xl:pb-[128px] xl:pt-[172px]"
    >
      <div aria-hidden className="absolute inset-0 z-0">
        <Image
          src={heroImage}
          alt={imageAlt ?? ""}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[right_center]"
        />
      </div>

      <div aria-hidden className="absolute inset-0 z-[1] bg-[rgba(10,8,7,0.18)]" />
      <div
        aria-hidden
        className="absolute inset-0 z-[2] bg-[linear-gradient(180deg,rgba(10,8,7,0.14)_0%,rgba(10,8,7,0.18)_22%,rgba(10,8,7,0.24)_56%,rgba(10,8,7,0.44)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 z-10 w-[84%] bg-[linear-gradient(90deg,rgba(9,8,7,0.82)_0%,rgba(9,8,7,0.72)_20%,rgba(9,8,7,0.56)_38%,rgba(9,8,7,0.32)_56%,rgba(9,8,7,0.12)_76%,rgba(9,8,7,0)_100%)] sm:w-[76%] lg:w-[60%] xl:w-[54%]"
      />
      <div
        aria-hidden
        className="absolute left-[20px] top-[118px] z-[15] h-[230px] w-[min(640px,calc(100%-40px))] rounded-[30px] bg-[radial-gradient(circle_at_18%_24%,rgba(10,8,7,0.62)_0%,rgba(10,8,7,0.48)_42%,rgba(10,8,7,0.2)_72%,rgba(10,8,7,0)_100%)] blur-2xl sm:left-[28px] sm:top-[126px] sm:h-[250px] sm:w-[min(680px,calc(100%-56px))] md:left-[36px] md:top-[136px] lg:left-[52px] lg:top-[148px] lg:h-[290px] lg:w-[620px] xl:left-[72px] xl:top-[160px] xl:w-[660px]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-10 h-[36%] bg-[linear-gradient(180deg,rgba(10,8,7,0)_0%,rgba(10,8,7,0.1)_20%,rgba(10,8,7,0.28)_68%,rgba(10,8,7,0.54)_100%)]"
      />

      <div className="page-container relative z-20 flex min-h-[calc(72svh-192px)] flex-col sm:min-h-[calc(75svh-212px)] md:min-h-[calc(78svh-238px)] lg:min-h-[calc(84vh-274px)] xl:min-h-[calc(88vh-300px)]">
        <div className="relative z-30 max-w-[700px] pt-2 sm:pt-4 md:pt-6 lg:pt-8 xl:pt-10">
          <div className="max-w-[620px] text-left">
            <p
              className="text-[11px] font-medium uppercase tracking-[0.32em] drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)] sm:text-[12px]"
              style={{ color: heroEyebrowColor }}
            >
              Seijaku: Quietly Arranged
            </p>
            <h1
              className="mt-5 font-serif text-[clamp(44px,6vw,80px)] font-medium leading-[0.94] tracking-[-0.035em] [text-wrap:balance] drop-shadow-[0_4px_18px_rgba(0,0,0,0.52)]"
              style={{ color: heroHeadlineColor }}
            >
              Perfume rituals for modern calm
            </h1>
            <p
              className="mt-6 max-w-[35rem] text-[15px] font-medium leading-[1.9] drop-shadow-[0_3px_14px_rgba(0,0,0,0.45)] sm:text-[16px] sm:leading-[1.95]"
              style={{ color: heroSubtextColor }}
            >
              Signature scents paired with handcrafted Bengal forms - made to gift or keep.
            </p>
          </div>
        </div>

        <div className="mt-auto flex flex-col items-center gap-5 pt-14 sm:flex-row sm:justify-center sm:gap-10 lg:gap-12 lg:pt-20">
          <button
            type="button"
            onClick={handleScrollDown}
            aria-label="Find your calm — scroll to the next section"
            className="inline-flex items-center gap-2 border-b border-[rgba(240,225,205,0.6)] pb-[6px] text-[12px] font-medium uppercase tracking-[0.28em] text-[#f4e7d6] transition-all duration-300 ease-out hover:border-[rgba(240,225,205,0.95)] hover:text-[#fff4e7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2e4cf] focus-visible:ring-offset-4 focus-visible:ring-offset-transparent sm:text-[13px]"
          >
            <span>Find Your Calm</span>
            <ChevronDown aria-hidden size={16} strokeWidth={1.8} className="translate-y-[1px]" />
          </button>

          <Link
            href="/shop/lifestyle"
            className="inline-flex items-center border-b border-[rgba(240,225,205,0.6)] pb-[6px] text-[12px] font-medium uppercase tracking-[0.28em] text-[#f4e7d6] transition-all duration-300 ease-out hover:border-[rgba(240,225,205,0.95)] hover:text-[#fff4e7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2e4cf] focus-visible:ring-offset-4 focus-visible:ring-offset-transparent sm:text-[13px]"
          >
            <span>Start with a Ritual Set</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
