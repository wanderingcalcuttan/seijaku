import Image from "next/image";
import Link from "next/link";

import { fetchRetreats } from "@/src/lib/retreat-types";

export default async function RetreatGallery() {
  const retreats = await fetchRetreats();

  return (
    <section id="retreat-gallery" className="section-primary bg-[#F3EFE7] pt-[88px] md:pt-[112px]">
      <div className="page-container">
        <div className="section-divider pt-12">
          <div className="max-w-[620px]">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#8e755c]">Retreat Gallery</p>
            <h2 className="mt-4 text-[#1c1c1c]">Seasonal retreat discovery</h2>
            <p className="mt-4 max-w-[42ch] text-[16px] leading-[1.84] text-[#5d574e]">
              A quiet gallery of place-led retreats, each moving directly into its own detail page for deeper review.
            </p>
          </div>

          {retreats.length === 0 ? (
            <p className="mt-12 text-[15px] text-[#5d574e]">New retreats are being prepared. Check back shortly.</p>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2">
              {retreats.map((retreat) => (
                <Link
                  key={retreat.slug}
                  href={`/retreats/${retreat.slug}`}
                  className="group block rounded-[30px] border border-[#d8cec1] bg-[#faf7f1] p-4 hover:-translate-y-1"
                >
                  <div className="relative aspect-[16/9] overflow-hidden rounded-[22px]">
                    {retreat.image ? (
                      <Image
                        src={retreat.image}
                        alt={retreat.imageAlt ?? retreat.name}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.015]"
                      />
                    ) : (
                      <div className="h-full w-full bg-[linear-gradient(135deg,#dcd2c4_0%,#cbbca8_55%,#e2d8ca_100%)]" />
                    )}
                  </div>
                  <div className="px-3 pb-4 pt-8">
                    <h3 className="font-serif text-[32px] leading-[1.08] tracking-[-0.02em] text-[#1c1c1c]">
                      {retreat.name}
                    </h3>
                    <p className="mt-4 max-w-[34ch] text-[15px] leading-[1.82] text-[#5d574e]">
                      {retreat.shortDescription}
                    </p>
                    <span className="mt-7 inline-flex text-[12px] uppercase tracking-[0.18em] text-[#2e4a36]">
                      View Retreat &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
