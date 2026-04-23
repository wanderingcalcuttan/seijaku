import Link from "next/link";
import Image from "next/image";

export default function SeasonalDropBanner() {
  return (
    <section className="bg-[#EAE3D8] pb-[96px] pt-0 md:pb-[96px]">
        <div className="relative h-[64vh] min-h-[500px] w-full overflow-hidden bg-black md:h-[70vh] md:min-h-[620px]">
            <Image
              src="/images/Hemanta drop HP banner 2.png"
              alt="Hemanta seasonal drop"
              fill
              priority
              sizes="100vw"
              className="block h-full w-full object-cover object-[center_50%]"
              style={{ animation: "seijaku-hemanta-zoom 16s ease-out infinite alternate" }}
            />

            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-[1]"
              style={{
                background:
                  "linear-gradient(90deg, rgba(0,0,0,0.46) 0%, rgba(0,0,0,0.2) 42%, rgba(0,0,0,0.42) 100%)",
              }}
            />

            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-[2]"
              style={{
                background:
                  "radial-gradient(circle at 0% 0%, rgba(0,0,0,0.26), transparent 24%), radial-gradient(circle at 100% 0%, rgba(0,0,0,0.24), transparent 24%), radial-gradient(circle at 0% 100%, rgba(0,0,0,0.3), transparent 26%), radial-gradient(circle at 100% 100%, rgba(0,0,0,0.28), transparent 26%), linear-gradient(to top, rgba(0,0,0,0.44) 0%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.08) 100%)",
              }}
            />

            <div className="absolute inset-0 z-[3] flex items-end justify-end px-7 pb-10 sm:px-10 sm:pb-12 md:px-[5vw] md:pb-[4vw]">
              <div className="w-full max-w-[360px] text-left md:max-w-[420px]">
                <p className="text-[11px] uppercase tracking-[0.26em]" style={{ color: "#d7c397" }}>
                  Last Season&apos;s Celebration:
                </p>
                <h3
                  className="mt-8 font-serif text-[48px] leading-[1.02] tracking-[-0.03em] md:text-[66px]"
                  style={{ color: "#EAF7EC" }}
                >
                  Hemanta
                </h3>
                <p className="mt-3 text-[15px] leading-[1.7] md:text-[16px]" style={{ color: "#DEEFE1" }}>
                  &quot;The Red Oleanders&quot; in its centenary year
                </p>
                <Link
                  href="/seasonaldrops-hemanta"
                  className="mt-8 inline-flex rounded-full border border-white/70 px-8 py-4 text-[14px] font-medium text-white hover:bg-white/12"
                >
                  Dive In
                </Link>
                <p className="mt-5 max-w-[22ch] text-[14px] leading-[1.65]" style={{ color: "#D2E3D4" }}>
                  Handcrafted forms where story becomes texture and fragrance becomes memory.
                </p>
              </div>
            </div>
        </div>

      <style jsx>{`
        @keyframes seijaku-hemanta-zoom {
          0% {
            transform: scale(1.02);
          }
          100% {
            transform: scale(1.08);
          }
        }
      `}</style>
    </section>
  );
}
