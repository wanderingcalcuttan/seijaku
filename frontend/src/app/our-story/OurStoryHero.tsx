type OurStoryHeroProps = {
  imageSrc?: string;
};

const FALLBACK_HERO = "/images/japanese fan hero Our Story.png";

export default function OurStoryHero({ imageSrc }: OurStoryHeroProps = {}) {
  const resolvedSrc = imageSrc && imageSrc.length > 0 ? imageSrc : FALLBACK_HERO;
  return (
    <section
      aria-labelledby="our-story-hero-title"
      className="relative min-h-[330px] overflow-hidden bg-[linear-gradient(135deg,#562934_0%,#6a3340_42%,#7a3d49_100%)] md:min-h-[390px] lg:min-h-[425px]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-[position:72%_center] bg-no-repeat"
        style={{ backgroundImage: `url("${resolvedSrc}")` }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,16,14,0.62)_0%,rgba(18,16,14,0.32)_18%,rgba(18,16,14,0.08)_36%,rgba(18,16,14,0.08)_64%,rgba(18,16,14,0.34)_84%,rgba(18,16,14,0.62)_100%)]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-[58%] bg-[radial-gradient(circle_at_20%_48%,rgba(12,12,10,0.42),transparent_62%)]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,248,241,0.06)_0%,rgba(255,248,241,0.02)_22%,rgba(30,24,20,0.18)_100%)]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.08] mix-blend-soft-light [background-image:radial-gradient(rgba(255,255,255,0.65)_0.55px,transparent_0.55px)] [background-size:4px_4px]"
      />

      <div className="relative mx-auto flex min-h-[330px] max-w-[1240px] items-end px-6 pb-8 pt-22 sm:px-8 md:min-h-[390px] md:pb-10 md:pt-24 lg:min-h-[425px] lg:px-10 lg:pb-12 lg:pt-28">
        <div className="max-w-xl">
          <div className="inline-block max-w-xl px-1 py-1">
          <p
            className="text-[11px] uppercase tracking-[0.24em] [text-shadow:0_2px_12px_rgba(0,0,0,0.48)]"
            style={{ color: "#f3e4c8" }}
          >
            OUR STORY
          </p>
          <h1
            id="our-story-hero-title"
            className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl leading-tight tracking-tight max-w-xl mt-4 font-serif font-normal [text-shadow:0_3px_20px_rgba(0,0,0,0.52)]"
            style={{ color: "#f6ead7" }}
          >
            Seijaku began with a quiet conviction
          </h1>
          <div className="mt-5 space-y-3 !text-white">
            <p className="!m-0 !max-w-none !text-[14px] !font-normal !leading-[1.7] !text-white sm:!text-[18px]" style={{ color: "#ffffff" }}>
              The objects we live with shape the quality of our inner lives.
            </p>
            <p className="!m-0 !max-w-none !text-[14px] !font-normal !leading-[1.7] !text-white sm:!text-[18px]" style={{ color: "#ffffff" }}>
              Founded in Kolkata.
            </p>
            <p className="!m-0 !max-w-none !text-[14px] !font-normal !leading-[1.7] !text-white sm:!text-[18px]" style={{ color: "#ffffff" }}>
              Rooted in craft.
            </p>
            <p className="!m-0 !max-w-none !text-[14px] !font-normal !leading-[1.7] !text-white sm:!text-[18px]" style={{ color: "#ffffff" }}>
              Guided by season.
            </p>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
