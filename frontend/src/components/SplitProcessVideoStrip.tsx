type SplitProcessVideoStripProps = {
  videos?: Array<{ url?: string; poster?: string; alt?: string }>;
};

const processPanels = [
  { title: "perfume blending in-house" },
  { title: "gold foiling terracotta in-house" },
];

// Renders the "In the Making — Rituals take form" panel pair on /our-story.
// Each panel can be:
//   - <video src=...> when admin set a `ritualVideo<n>Url` (autoplay / muted /
//     loop / playsInline so it behaves like a silent looping animation)
//   - <img src={poster}> when admin set only the poster (no video URL)
//   - the original "Video loop" placeholder when neither is set
export default function SplitProcessVideoStrip({ videos = [] }: SplitProcessVideoStripProps) {
  return (
    <section aria-labelledby="process-strip-title" className="bg-[#ece5da] py-6 sm:py-8 lg:py-10">
      <div className="relative min-h-[360px] overflow-hidden sm:min-h-[420px] lg:min-h-[520px]">
        <div className="grid min-h-[360px] grid-cols-1 gap-px bg-[#d8cec1] sm:min-h-[420px] sm:grid-cols-2 lg:min-h-[520px]">
          {processPanels.map((panel, index) => {
            const video = videos[index];
            const url = video?.url && video.url.length > 0 ? video.url : null;
            const poster = video?.poster && video.poster.length > 0 ? video.poster : null;

            return (
              <div
                key={panel.title}
                className="relative flex min-h-[240px] items-center justify-center overflow-hidden bg-[#fffdf9] px-8 py-12 sm:min-h-[420px] sm:px-10 lg:min-h-[520px] lg:px-14"
              >
                {url ? (
                  <video
                    src={url}
                    poster={poster ?? undefined}
                    autoPlay
                    muted
                    loop
                    playsInline
                    aria-label={video?.alt ?? panel.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : poster ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={poster}
                    alt={video?.alt ?? panel.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex max-w-[18ch] flex-col items-center gap-4 text-center">
                    <p className="font-serif text-[clamp(28px,3.4vw,48px)] leading-[1.14] tracking-[-0.03em] text-[#2b241d]">
                      {panel.title}
                    </p>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-[#8b7f70] sm:text-[12px]">Video loop</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-6 flex justify-center px-6 text-center sm:top-8 sm:px-10">
          <div className="max-w-[34rem] text-[#4f4943]">
            <p className="text-[10px] uppercase tracking-[0.34em] text-[#8b7f70] sm:text-[11px]">IN THE MAKING</p>
            <h2
              id="process-strip-title"
              className="mt-4 font-serif text-[clamp(30px,4vw,52px)] leading-[1.04] tracking-[-0.03em] text-[#1f1a15]"
            >
              Rituals take form
            </h2>
            <p className="mx-auto mt-4 max-w-[30ch] text-[15px] leading-[1.82] text-[#5d574e] sm:text-[16px]">
              Scent composed by hand. Clay finished in stillness.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
