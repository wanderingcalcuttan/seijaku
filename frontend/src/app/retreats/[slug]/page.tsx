import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import RetreatInquiryForm from "@/src/components/RetreatInquiryForm";
import { fetchRetreat } from "@/src/lib/retreat-types";

export const dynamic = "force-dynamic";

type RetreatDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function RetreatDetailPage({ params }: RetreatDetailPageProps) {
  const { slug } = await params;
  const retreat = await fetchRetreat(slug);

  if (!retreat) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F3EFE7] pt-[72px] text-[#3a3a3a] sm:pt-[76px]">
      <section className="section-primary bg-[#F3EFE7]">
        <div className="page-container">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#8e755c]">Retreat Detail</p>
              <h1 className="mt-5 max-w-[12ch] text-[clamp(38px,5vw,60px)] leading-[1.02] tracking-[-0.03em] text-[#1c1c1c]">
                {retreat.name}
              </h1>
              <p className="mt-6 max-w-[42ch] text-[17px] leading-[1.82] text-[#5d574e]">{retreat.detailDescription}</p>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[20px] border border-[#d8cec1] bg-[#faf7f1] px-5 py-5">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#8e755c]">Location</p>
                  <p className="mt-2 text-[16px] text-[#1c1c1c]">{retreat.location}</p>
                </div>
                <div className="rounded-[20px] border border-[#d8cec1] bg-[#faf7f1] px-5 py-5">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#8e755c]">Season</p>
                  <p className="mt-2 text-[16px] text-[#1c1c1c]">{retreat.season}</p>
                </div>
                <div className="rounded-[20px] border border-[#d8cec1] bg-[#faf7f1] px-5 py-5">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#8e755c]">Format</p>
                  <p className="mt-2 text-[16px] text-[#1c1c1c]">{retreat.format}</p>
                </div>
              </div>
              <p className="mt-8 text-[15px] leading-[1.82] text-[#5d574e]">
                Cohort size: {retreat.groupSize}. This page is the product-detail layer before collection or checkout.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center rounded-full bg-[#2e4a36] px-7 py-4 text-[12px] font-medium uppercase tracking-[0.18em] text-[#f4efe8] hover:bg-[#243c2c]"
                >
                  Add to Collection
                </Link>
                <Link
                  href="/experiences"
                  className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.18em] text-[#2e4a36] hover:text-[#1d3024]"
                >
                  <span>Back to Experiences</span>
                  <span aria-hidden>&rarr;</span>
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[28px] border border-[#d8cec1] bg-[#faf7f1] p-4">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[22px]">
                  {retreat.image ? (
                    <Image
                      src={retreat.image}
                      alt={retreat.imageAlt ?? retreat.name}
                      fill
                      sizes="(min-width: 1024px) 42vw, 100vw"
                      className="object-cover object-center"
                    />
                  ) : (
                    <div className="h-full w-full bg-[linear-gradient(135deg,#dcd2c4_0%,#cbbca8_55%,#e2d8ca_100%)]" />
                  )}
                </div>
              </div>

              <RetreatInquiryForm slug={retreat.slug} title={retreat.name} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
