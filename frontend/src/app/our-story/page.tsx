import Image from "next/image";
import Link from "next/link";

import { canonicalShopRoutes } from "@/src/lib/shop-routes";

import SplitProcessVideoStrip from "@/src/components/SplitProcessVideoStrip";
import OurStoryHero from "./OurStoryHero";

type EditorialSectionProps = {
  children: React.ReactNode;
  className?: string;
  width?: string;
};

function EditorialSection({ children, className = "", width = "max-w-4xl" }: EditorialSectionProps) {
  return (
    <section className={className}>
      <div className="page-container">
        <div className={width}>{children}</div>
      </div>
    </section>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-0 text-[#1c1c1c]">{children}</h2>;
}

const whyLines = [
  "Urban life is efficient.",
  "It is rarely intentional.",
  "Fragrance has become decorative.",
  "Gifting, transactional.",
  "Space, curated but restless.",
  "We design against drift.",
  "Scent as practice.",
  "Object as anchor.",
  "Ritual as continuity.",
  "Not ornament.",
  "Not intervention.",
  "Presence.",
];

const nameLines = [
  "Our name comes from the Japanese word for energised calm, tranquility within activity.",
  "At the heart of our mark:",
  "the juiful, jasmine, beloved by Tagore.",
  "Fragrant. Precise. Enduring.",
  "Bengal is not reference.",
  "It is foundation.",
  "Terracotta shaped by hand.",
  "Seasonal collections moving with Hemanta.",
  "Immersions across craft landscapes.",
  "Material carries memory.",
  "Ritual gives it form.",
];

const deliberateLines = [
  "You notice light.",
  "You arrange space.",
  "You mark the shift of seasons.",
  "You gift with meaning.",
  "Our objects are meant to be used.",
  "Returned to.",
  "Lived with.",
];

const heldItems = ["Literature", "Material", "Scent", "Season"];

const testimonialVideos = [
  {
    quote: "A Seijaku object changes the room without announcing itself.",
    label: "Video placeholder 01",
  },
  {
    quote: "The ritual felt less like an event and more like a return to attention.",
    label: "Video placeholder 02",
  },
  {
    quote: "Everything carries a sense of thought, season, and lived use.",
    label: "Video placeholder 03",
  },
];

export default function OurStoryPage() {
  return (
    <main className="min-h-screen bg-[#F3EFE7] pt-[72px] text-[#3a3a3a] sm:pt-[76px]">
      <OurStoryHero />

      <EditorialSection className="bg-[#eee7dc] py-16 sm:py-18 lg:py-20" width="max-w-3xl">
        <SectionHeading>Why Seijaku</SectionHeading>
        <div className="mt-7 space-y-2.5 text-[16px] font-light leading-[1.84] text-[#4f4943] sm:text-[17px] lg:text-[18px]">
          {whyLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </EditorialSection>

      <section className="bg-[#F3EFE7] py-18 sm:py-20 lg:py-22">
        <div className="page-container max-w-[1200px]">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div className="max-w-3xl">
              <SectionHeading>Seijaku</SectionHeading>
              <div className="mt-7 space-y-3 text-[16px] font-light leading-[1.84] text-[#5d574e] sm:text-[17px] lg:text-[18px]">
                {nameLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>

            <div className="lg:pt-1">
              <div className="relative overflow-hidden rounded-[24px]">
                <div className="relative aspect-[4/5] sm:aspect-[4/4.6] lg:aspect-[4/5]">
                  <Image
                    src="/images/seijaku sec img 2.png"
                    alt="Editorial image representing Seijaku's cultural foundation"
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover object-[center_48%]"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(20,18,16,0.22) 0%, rgba(20,18,16,0.04) 28%, rgba(20,18,16,0) 100%)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <EditorialSection className="bg-[#F3EFE7] py-16 sm:py-18 lg:py-20" width="max-w-3xl">
        <SectionHeading>For Those Who Live Deliberately</SectionHeading>
        <div className="mt-7 space-y-3 text-[16px] font-light leading-[1.85] text-[#5d574e] sm:text-[17px] lg:text-[18px]">
          {deliberateLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </EditorialSection>

      <SplitProcessVideoStrip />

      <section className="whatWeHold">
        <div className="whatWeHold__inner">
          <h2 className="whatWeHold__title">What We Hold</h2>

          <div className="whatWeHold__pillars">
            {heldItems.map((item) => (
              <div key={item} className="whatWeHold__pillar">
                {item}
              </div>
            ))}
          </div>

          <div className="whatWeHold__statement">
            <p>Calm, not cure.</p>
            <p>Continuity, not intensity.</p>
          </div>
        </div>
      </section>

      <section className="bg-[#F3EFE7] py-16 sm:py-18 lg:py-20">
        <div className="page-container max-w-[1200px]">
          <div className="max-w-3xl">
            <SectionHeading>In Their Words</SectionHeading>
          </div>
          <div className="mt-10 grid gap-10 md:grid-cols-2 xl:grid-cols-3 xl:gap-12">
            {testimonialVideos.map((item) => (
              <article key={item.label} className="group">
                <div className="relative overflow-hidden rounded-[24px] border border-[#d8cec1] bg-[#fcf8f2] shadow-[0_18px_48px_rgba(45,34,22,0.08)]">
                  <div className="relative aspect-[4/5] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9)_0%,rgba(245,238,229,0.9)_46%,rgba(233,224,212,0.95)_100%)]">
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.14)_0%,rgba(84,67,49,0.08)_100%)]" />
                    <div className="absolute left-5 top-5 rounded-full border border-[#d7ccbd] bg-white/70 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-[#8b7f70] backdrop-blur-sm">
                      {item.label}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center px-8 text-center">
                      <p className="max-w-[18ch] font-serif text-[clamp(24px,2.7vw,34px)] leading-[1.28] tracking-[-0.02em] text-[#2c241c]">
                        &ldquo;{item.quote}&rdquo;
                      </p>
                    </div>
                    <div className="absolute bottom-5 left-5 flex items-center gap-3 text-[#6d6255]">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#cdbfae] bg-[#fffaf4] text-[13px] uppercase tracking-[0.2em]">
                        Play
                      </span>
                      <span className="text-[11px] uppercase tracking-[0.28em] text-[#8b7f70]">Video testimonial</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#ece5da] py-18 sm:py-20 lg:py-22">
        <div className="page-container">
          <div className="max-w-3xl">
            <SectionHeading>Begin Anywhere</SectionHeading>
            <div className="mt-6 space-y-2 text-[16px] font-light leading-[1.84] text-[#5d574e] sm:text-[17px] lg:text-[18px]">
              <p>With a scent.</p>
              <p>With a page.</p>
              <p>With a season.</p>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:gap-10">
            <Link href={canonicalShopRoutes.shopAll} className="text-[13px] font-normal tracking-[0.05em] text-[#2e4a36] hover:underline">
              Explore our Collection
            </Link>
            <Link href="/#daily-ritual-room" className="text-[13px] font-normal tracking-[0.05em] text-[#2e4a36] hover:underline">
              Complete a Daily Ritual
            </Link>
            <Link href="/a-seijaku-life" className="text-[13px] font-normal tracking-[0.05em] text-[#2e4a36] hover:underline">
              Learn about crafts
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
