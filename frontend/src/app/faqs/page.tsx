import type { Metadata } from "next";
import Link from "next/link";
import FaqAccordionClient from "./FaqAccordionClient";

export const metadata: Metadata = {
  title: "FAQs | Seijaku",
  description: "Frequently asked questions about Seijaku's artisanal craftsmanship, ingredients, order delivery, shipping, and community rituals.",
};

export default function FaqsPage() {
  return (
    <main className="min-h-screen bg-[#f3efe7] pt-[90px] text-[#3a3a3a] sm:pt-[100px]">
      <section className="section-primary pb-8 pt-16 sm:pt-20">
        <div className="page-container max-w-[800px]">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#9a785d]">Information</p>
          <h1 className="mt-5 text-[clamp(36px,4.5vw,56px)] leading-[1.1] tracking-[-0.03em] text-[#1d1a17]">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-[15px] font-light leading-[1.8] text-[#5d574e]">
            Whether you&apos;re discovering Seijaku for the first time or waiting for your order to arrive, we&apos;ve answered some of the questions we&apos;re most often asked. If you can&apos;t find what you&apos;re looking for, we&apos;d be happy to help at <a href="mailto:lifeatseijaku@gmail.com" className="text-[#365b3f] hover:underline">lifeatseijaku@gmail.com</a>.
          </p>
          <div className="mt-10 h-px w-full bg-black/6" />
        </div>
      </section>

      <section className="pb-24 pt-4">
        <div className="page-container max-w-[800px]">
          <FaqAccordionClient />

          <div className="mt-16 flex flex-wrap gap-6 border-t border-black/6 pt-8">
            <Link href="/" className="text-[13px] font-normal tracking-[0.05em] text-[#365b3f] hover:underline">
              ← Return Home
            </Link>
            <Link href="/shop" className="text-[13px] font-normal tracking-[0.05em] text-[#365b3f] hover:underline">
              Explore our Collection
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
