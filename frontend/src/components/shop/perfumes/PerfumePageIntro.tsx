import type { ReactNode } from "react";

import Image from "next/image";

type PerfumePageIntroProps = {
  eyebrow: string;
  title: string;
  description: string[];
  image: string;
  imageAlt: string;
  imagePosition?: string;
  quote: string;
  children?: ReactNode;
};

export default function PerfumePageIntro({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  imagePosition,
  quote,
  children,
}: PerfumePageIntroProps) {
  return (
    <section className="section-primary pb-8 pt-20 sm:pb-10 sm:pt-24">
      <div className="page-container max-w-[1200px]">
        <div className="grid gap-8 rounded-[30px] border border-[rgba(86,76,64,0.08)] bg-[linear-gradient(180deg,rgba(250,247,241,0.86)_0%,rgba(244,239,231,0.94)_100%)] p-6 shadow-[0_16px_36px_rgba(41,34,27,0.04)] sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] lg:items-center lg:gap-12 lg:p-10">
          <div className="max-w-[520px]">
            <p className="text-[10px] uppercase tracking-[0.34em] text-[#8a745e]">{eyebrow}</p>
            <h1 className="mt-4 max-w-[14ch] text-[clamp(38px,4.5vw,58px)] leading-[1.04] tracking-[-0.03em] text-[#1a1713]">
              {title}
            </h1>
            <div className="mt-5 max-w-[44ch] space-y-3 text-[15px] leading-[1.85] text-[#5b554d] sm:text-[16px]">
              {description.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            {children ? (
              <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">{children}</div>
            ) : null}
          </div>

          <div className="relative overflow-hidden rounded-[24px] border border-[rgba(86,76,64,0.1)] bg-[#e9e0d3] p-3 shadow-[0_14px_28px_rgba(41,34,27,0.05)]">
            <div className="relative aspect-[4/3.6] overflow-hidden rounded-[18px]">
              <Image
                src={image}
                alt={imageAlt}
                fill
                priority
                sizes="(min-width: 1024px) 34vw, 100vw"
                className={`object-cover ${imagePosition ?? "object-center"}`}
              />
            </div>
            <div className="pointer-events-none absolute inset-x-7 bottom-7 rounded-[16px] border border-white/30 bg-[linear-gradient(180deg,rgba(255,255,255,0.28),rgba(255,255,255,0.08))] p-4 backdrop-blur-[1.5px]">
              <p className="max-w-[22ch] font-serif text-[22px] leading-[1.12] text-white sm:text-[24px]">{quote}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
