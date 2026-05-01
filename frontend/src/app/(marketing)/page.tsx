"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import BrowseWorldSection from "@/src/components/BrowseWorldSection";
import CraftProofSection from "@/src/components/CraftProofSection";
import HeroBanner from "@/src/components/HeroBanner";
import HowSeijakuWorks from "@/src/components/HowSeijakuWorks";
import JournalPreviewSection from "@/src/components/JournalPreviewSection";
import RitualRoom from "@/src/components/RitualRoom";
import RitualSetsSection from "@/src/components/RitualSetsSection";
import SeasonalDropBanner from "@/src/components/SeasonalDropBanner";
import SeasonalStoryStrip from "@/src/components/SeasonalStoryStrip";

// Editorial slots fetched lazily from the "home" bridge page on mount.
// Falls back to bundled assets in HeroBanner / BrowseWorldSection until
// the catalog responds; on Render Free cold-start (Decision #13) the
// initial paint shows fallbacks while the request is in flight.
type HomeBridgeSlots = {
  heroImage?: string;
  heroImageAlt?: string;
  homeCard1Image?: string;
  homeCard2Image?: string;
  homeCard3Image?: string;
  homeCard4Image?: string;
};

export default function HomePage() {
  const heroRef = useRef<HTMLElement | null>(null);
  const [bridge, setBridge] = useState<HomeBridgeSlots>({});
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const sectionY = useTransform(scrollYProgress, [0.6, 1], [100, 0]);
  const sectionOpacity = useTransform(scrollYProgress, [0.6, 1], [0, 1]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/public/catalog/bridge-pages/home", {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) return;
        const data = (await res.json()) as { item?: HomeBridgeSlots };
        if (cancelled || !data.item) return;
        setBridge({
          heroImage: data.item.heroImage,
          heroImageAlt: data.item.heroImageAlt,
          homeCard1Image: data.item.homeCard1Image,
          homeCard2Image: data.item.homeCard2Image,
          homeCard3Image: data.item.homeCard3Image,
          homeCard4Image: data.item.homeCard4Image,
        });
      } catch {
        // Silent — fallbacks render.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-home-reveal]"));
    if (!targets.length) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="home-story min-h-screen bg-[#F3EFE7] text-[#3a3a3a]">
      <HeroBanner heroRef={heroRef} imageSrc={bridge.heroImage} imageAlt={bridge.heroImageAlt} />
      {/* id="home-next" is the smooth-scroll target for the hero's Find Your Calm button (see HeroBanner.tsx SCROLL_TARGET_ID). */}
      <motion.div id="home-next" className="relative z-20 home-section-shell home-bridge-warm" data-home-reveal style={{ y: sectionY, opacity: sectionOpacity }}>
        <BrowseWorldSection
          cardOverrides={{
            card1Image: bridge.homeCard1Image,
            card2Image: bridge.homeCard2Image,
            card3Image: bridge.homeCard3Image,
            card4Image: bridge.homeCard4Image,
          }}
        />
      </motion.div>
      <div className="home-section-shell home-bridge-soft" data-home-reveal>
        <HowSeijakuWorks />
      </div>
      <div className="home-section-shell home-bridge-soft" data-home-reveal>
        <RitualSetsSection />
      </div>
      <div className="home-section-shell home-bridge-soft" data-home-reveal>
        <RitualRoom />
      </div>
      <div className="home-section-shell home-bridge-warm" data-home-reveal>
        <CraftProofSection />
      </div>
      <div className="home-section-shell home-bridge-soft" data-home-reveal>
        <SeasonalStoryStrip />
      </div>
      <div className="home-section-shell home-bridge-warm" data-home-reveal>
        <SeasonalDropBanner />
      </div>
      <div className="home-section-shell home-bridge-soft" data-home-reveal>
        <JournalPreviewSection />
      </div>
    </main>
  );
}
