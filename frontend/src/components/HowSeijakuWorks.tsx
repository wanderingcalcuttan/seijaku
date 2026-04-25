"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  normalizeBackendStory,
  type BackendStory,
  type StoryView,
} from "@/src/lib/story-types";
import type { ProductView } from "@/src/lib/product-types";

type StepDescriptor = {
  number: string;
  title: string;
  panelTitle: string;
  background: string;
  alt: string;
  items: { label: string; href: string; thumbnail: string; alt: string }[];
};

// Deterministic small hash → use to pick a stable image per (story, slot)
// without per-render randomness or hydration jitter. New story = new
// rotation; same story always renders the same backgrounds.
function hashString(input: string): number {
  let h = 5381;
  for (let i = 0; i < input.length; i += 1) {
    h = ((h * 33) ^ input.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function pickBackground(seedKey: string, candidates: string[], fallback: string): string {
  const valid = candidates.filter(Boolean);
  if (valid.length === 0) return fallback;
  return valid[hashString(seedKey) % valid.length];
}

function buildStepsFromStory(story: StoryView): StepDescriptor[] {
  const perfumeImages = story.perfumes.map((p) => p.image).filter(Boolean);
  const artifactImages = story.artifacts.map((p) => p.image).filter(Boolean);
  const allImages = [...perfumeImages, ...artifactImages];

  const toItem = (p: ProductView) => ({
    label: p.title,
    href: `/shop/${p.slug}`,
    thumbnail: p.image,
    alt: p.imageAlt ?? p.title,
  });

  const fallback = "/images/Seijaku section img 1.png";

  return [
    {
      number: "01",
      title: "Choose a scent",
      panelTitle: "Curated scents",
      background: pickBackground(`${story.id}:01`, perfumeImages, fallback),
      alt: "Curated scent imagery",
      items: story.perfumes.map(toItem),
    },
    {
      number: "02",
      title: "Choose an artifact",
      panelTitle: "Curated objects",
      background: pickBackground(`${story.id}:02`, artifactImages, fallback),
      alt: "Curated artifact imagery",
      items: story.artifacts.map(toItem),
    },
    {
      number: "03",
      title: "Ritual",
      panelTitle: "",
      background: pickBackground(`${story.id}:03`, allImages, fallback),
      alt: "Ritual demonstration",
      items: [],
    },
  ];
}

function ExpandablePanelItem({ item }: { item: { label: string; href: string; thumbnail: string; alt: string } }) {
  return (
    <Link
      href={item.href}
      className="group/item flex items-center gap-3 rounded-[14px] px-1 py-1.5 transition-colors duration-200 hover:bg-[rgba(237,230,217,0.52)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8e806e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f2ea]"
    >
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[12px] bg-[#e7ddd0]">
        <Image src={item.thumbnail} alt={item.alt} fill sizes="48px" className="object-cover transition-transform duration-300 group-hover/item:scale-[1.03]" />
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
        <span className="min-w-0 font-serif text-[18px] leading-[1.18] text-[#2f2922]">{item.label}</span>
        <span aria-hidden className="shrink-0 text-[14px] text-[#7b6a59] transition-transform duration-200 group-hover/item:translate-x-0.5">
          &rarr;
        </span>
      </div>
    </Link>
  );
}

function StepExpandable({
  step,
  isOpen,
  onOpen,
  onToggle,
}: {
  step: StepDescriptor;
  isOpen: boolean;
  onOpen: () => void;
  onToggle: () => void;
}) {
  return (
    <article className="flex flex-col items-center text-center lg:items-start lg:text-left">
      <div className="relative mx-auto aspect-square w-[180px] overflow-hidden rounded-full border border-[#ddd2c4] bg-[#e8dfd2] shadow-[0_10px_28px_rgba(49,57,49,0.05)] sm:w-[190px] lg:mx-0 lg:w-[210px]">
        <Image
          src={step.background}
          alt={step.alt}
          fill
          sizes="(min-width: 1024px) 210px, (min-width: 640px) 190px, 180px"
          className="object-cover transition-transform duration-500"
        />
      </div>
      <p className="mt-5 text-[10px] uppercase tracking-[0.24em] text-[#a27f58]">{step.number}</p>
      <div className="mt-3 flex items-center justify-center gap-3 lg:justify-start">
        <p className="font-serif text-[24px] leading-[1.18] text-[#302a23] sm:text-[25px]">{step.title}</p>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-label={`${isOpen ? "Close" : "Open"} ${step.title} details`}
          onMouseEnter={onOpen}
          onFocus={onOpen}
          onClick={(event) => {
            event.stopPropagation();
            onToggle();
          }}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#d9cfbf] bg-[#f7f2ea] text-[#6e6256] transition-all duration-200 hover:border-[#cdbda8] hover:text-[#302a23] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8e806e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f8f3eb]"
        >
          <span className={`text-[18px] leading-none transition-transform duration-200 ${isOpen ? "rotate-45" : "rotate-0"}`}>+</span>
        </button>
      </div>

      <div
        className={[
          "w-full overflow-hidden rounded-[16px] bg-[rgba(248,243,235,0.98)] text-left shadow-[0_16px_36px_rgba(41,34,27,0.08)] ring-1 ring-[rgba(112,96,78,0.06)] transition-all duration-200 motion-reduce:transition-none",
          isOpen ? "mt-5 max-h-[480px] translate-y-0 opacity-100" : "mt-0 max-h-0 translate-y-1 opacity-0",
        ].join(" ")}
      >
        <div className="px-4 py-4 sm:px-5 sm:py-5">
          <p className="text-[10px] uppercase tracking-[0.24em] text-[#8b775f]">{step.panelTitle}</p>
          <div className="mt-3 space-y-1">
            {step.items.map((item) => (
              <ExpandablePanelItem key={item.label} item={item} />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function HowSeijakuWorks() {
  const [story, setStory] = useState<StoryView | null>(null);
  const [hasResolved, setHasResolved] = useState(false);
  const [openStep, setOpenStep] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Lazy fetch on mount. The home page is a "use client" tree; rather than
  // restructure the home shell into a server component, mirror the
  // RitualSetsSection pattern and fetch from /api/public/catalog/story/current.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/public/content/story/current", {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) {
          if (!cancelled) setHasResolved(true);
          return;
        }
        const { item } = (await res.json()) as { item: BackendStory };
        if (cancelled) return;
        setStory(normalizeBackendStory(item));
        setHasResolved(true);
      } catch {
        if (!cancelled) setHasResolved(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpenStep(null);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const steps = useMemo(() => (story ? buildStepsFromStory(story) : []), [story]);

  // Hide the section entirely when no active story exists or while the fetch
  // is still in flight on first paint. Decision #29 — explicit empty state.
  if (!hasResolved || !story) return null;

  return (
    <section className="section-editorial bg-[#F3EFE7] pt-0">
      <div className="page-container">
        <div className="rounded-[28px] border border-[#ddd2c4] bg-[#f8f3eb] px-6 py-8 sm:px-8 md:px-10 md:py-10">
          <div className="max-w-[560px]">
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#8f7455]">How Seijaku works</p>
            <p className="mt-3 text-[15px] leading-[1.8] text-[#61574d]">A quiet ritual can begin in three simple gestures.</p>
          </div>

          <div ref={containerRef} className="mt-8 grid items-start gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-3 lg:gap-8 xl:gap-10">
            {steps.slice(0, 2).map((step) => (
              <StepExpandable
                key={step.number}
                step={step}
                isOpen={openStep === step.number}
                onOpen={() => setOpenStep(step.number)}
                onToggle={() => setOpenStep((current) => (current === step.number ? null : step.number))}
              />
            ))}

            <article className="flex flex-col items-center text-center">
              <div className="relative mx-auto aspect-square w-[180px] overflow-hidden rounded-full border border-[#ddd2c4] bg-[#e8dfd2] shadow-[0_10px_28px_rgba(49,57,49,0.05)] sm:w-[190px] lg:w-[210px]">
                <Image
                  src={steps[2]?.background ?? "/images/hero banner Home.png"}
                  alt={steps[2]?.alt ?? "Editorial ritual imagery for Seijaku practice"}
                  fill
                  sizes="(min-width: 1024px) 210px, (min-width: 640px) 190px, 180px"
                  className="object-cover"
                />
              </div>
              <p className="mt-5 text-[10px] uppercase tracking-[0.24em] text-[#a27f58]">03</p>
              <p className="mt-3 font-serif text-[24px] leading-[1.18] text-[#302a23] sm:text-[25px]">Ritual</p>
              <a
                href={story.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#4f473f] underline decoration-black/10 underline-offset-4 transition-opacity duration-200 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8e806e] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f8f3eb]"
              >
                <span>Follow a 2-minute ritual</span>
                <span aria-hidden>&rarr;</span>
                <span>Watch</span>
              </a>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
