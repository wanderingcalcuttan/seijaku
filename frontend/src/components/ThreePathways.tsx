import Link from "next/link";

import { canonicalShopRoutes } from "@/src/lib/shop-routes";

const pathways = [
  {
    title: "Objects of Stillness",
    description:
      "Design-led scent and tactile objects crafted to anchor everyday spaces in quiet intention and sensory depth.",
    detail: "Curated ritual boxes",
    cta: "Enter Objects",
    href: canonicalShopRoutes.lifestyle,
    panelLabel: "Curated ritual boxes",
    rotation: "-1.75deg",
  },
  {
    title: "Guided Rituals",
    description:
      "Research-informed multisensory experiences designed to gently reset modern urban fatigue.",
    detail: "Private group bookings and curated formats",
    cta: "Enter Rituals",
    href: "/ritual",
    panelLabel: "Private group bookings and curated formats",
    rotation: "1.2deg",
  },
  {
    title: "Immersive Retreats",
    description:
      "Three-night cultural immersions shaped by Bengal's craft landscapes and seasonal rhythms.",
    detail: "Limited, seasonally curated cohorts",
    cta: "Explore Retreats",
    href: "/retreats",
    panelLabel: "Limited, seasonally curated cohorts",
    rotation: "-1deg",
  },
];

export default function ThreePathways() {
  return (
    <section className="section-secondary bg-[#EAE3D8]">
      <div className="page-container">
        <div className="max-w-[680px]">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#a57f5b]">Every Practice Begins Somewhere.</p>
          <h2 className="mt-4 text-[#1e1d1a]">Three Pathways Into the Seijaku Experience</h2>
          <p className="mt-4 max-w-[620px] text-[16px] leading-[1.8] text-[#5c665e]">
            Objects for the everyday. Rituals for continuity. Retreats for immersion.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {pathways.map((pathway) => (
            <article
              key={pathway.title}
              className="group overflow-hidden rounded-[24px] border border-[#D8CEC1] bg-[#FAF7F1] shadow-[0_10px_28px_rgba(49,57,49,0.035)] hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(49,57,49,0.06)]"
            >
              <div className="relative h-[360px] overflow-hidden bg-[#f1ebe2]">
                <div
                  aria-hidden
                  className="absolute inset-[18px] rounded-[18px] border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.2),rgba(0,0,0,0.02))] opacity-80 transition-transform duration-[900ms] ease-out group-hover:scale-[1.02] group-hover:rotate-0"
                  style={{ transform: `rotate(${pathway.rotation})` }}
                />
                <div className="absolute left-3 top-2 z-10 flex items-center gap-1.5 text-[12px] text-[#383838]">
                  <span aria-hidden className="text-[12px] leading-none">[ ]</span>
                  <span>{pathway.panelLabel}</span>
                </div>
              </div>

              <div className="h-px w-[76%] bg-[#d4c2a1]" />

              <div className="px-7 pb-8 pt-8">
                <h3 className="font-serif text-[24px] leading-[1.2] tracking-[-0.02em] text-[#312a24]">{pathway.title}</h3>
                <p className="mt-4 max-w-[30ch] text-[15px] leading-[1.85] text-[#746d66]">{pathway.description}</p>
                <p className="mt-5 text-[11px] uppercase tracking-[0.16em] text-[#aa7c57]">{pathway.detail}</p>
                <Link
                  href={pathway.href}
                  className="mt-7 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#5b665e] transition-colors duration-200 hover:text-[#1f2a21]"
                >
                  <span>{pathway.cta}</span>
                  <span aria-hidden className="text-[14px] leading-none">&rarr;</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
