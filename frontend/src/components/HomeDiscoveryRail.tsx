"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function HomeDiscoveryRail() {
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY.current;
      const shouldHide = scrollingDown && currentScrollY > 140;

      setIsHidden(shouldHide);
      lastScrollY.current = currentScrollY;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      aria-label="Brand story"
      className={[
        "border-b border-[rgba(76,67,57,0.08)] bg-[rgba(236,229,216,0.98)] shadow-[0_8px_24px_rgba(28,22,18,0.06)] backdrop-blur-[12px] transition-transform duration-300",
        isHidden ? "pointer-events-none -translate-y-full" : "translate-y-0",
      ].join(" ")}
    >
      <div className="page-container py-3">
        <div className="flex items-center justify-center">
          <Link
            href="/our-story"
            aria-label="Go to The Seijaku Story"
            className="inline-flex min-h-[36px] shrink-0 items-center whitespace-nowrap px-2 text-[12px] font-medium uppercase tracking-[0.2em] text-[#40372f] transition-colors duration-200 hover:text-[#1f1a16] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8e806e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#ebe3d6] sm:text-[13px]"
            style={{ fontFamily: '"Iowan Old Style", "Times New Roman", serif' }}
          >
            The Seijaku Story
          </Link>
        </div>
      </div>
    </nav>
  );
}
