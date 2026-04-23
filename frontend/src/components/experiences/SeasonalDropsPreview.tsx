import Image from "next/image";
import Link from "next/link";

const drops = [
  {
    name: "Hemanta Edition",
    description: "Literary scent objects and tactile forms for the late-light season.",
    image: "/images/Hemanta drop HP banner 1.png",
    imagePosition: "object-[center_40%]",
  },
  {
    name: "Monsoon Study",
    description: "Material notes gathered around rainfall, river air, and slower interiors.",
    image: "/images/seijaku_seasonal_drop_cinematic_banner.png",
    imagePosition: "object-[center_52%]",
  },
  {
    name: "Quiet Vessel Series",
    description: "A restrained collection of forms where fragrance and daily use converge.",
    image: "/images/Home Page hero image 1.png",
    imagePosition: "object-[center_48%]",
  },
];

export default function SeasonalDropsPreview() {
  return (
    <section id="seasonal-drops" className="section-primary bg-[#EAE3D8] pt-[88px] md:pt-[112px]">
      <div className="page-container">
        <div className="section-divider pt-12">
          <div className="max-w-[620px]">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#8e755c]">Seasonal Drops</p>
            <h2 className="mt-4 text-[#1c1c1c]">Seasonal Drops</h2>
            <p className="mt-4 max-w-[42ch] text-[16px] leading-[1.82] text-[#5d574e]">
              Limited collections where literature, material, and fragrance converge.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {drops.map((drop) => (
              <article key={drop.name} className="rounded-[26px] border border-[#d8cec1] bg-[#faf7f1] p-4">
                <div className="relative aspect-[4/4.6] overflow-hidden rounded-[18px]">
                  <Image
                    src={drop.image}
                    alt={drop.name}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className={`object-cover ${drop.imagePosition}`}
                  />
                </div>
                <div className="px-3 pb-3 pt-7">
                  <h3 className="font-serif text-[28px] leading-[1.08] tracking-[-0.02em] text-[#1c1c1c]">{drop.name}</h3>
                  <p className="mt-3 text-[15px] leading-[1.8] text-[#5d574e]">{drop.description}</p>
                </div>
              </article>
            ))}
          </div>

          <Link
            href="/seasonaldrops-hemanta"
            className="mt-10 inline-flex text-[12px] uppercase tracking-[0.18em] text-[#2e4a36] hover:text-[#1d3024]"
          >
            Explore Seasonal Drops &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
