type SplitProcessVideoStripProps = {
  videos?: Array<{ url?: string; poster?: string; alt?: string; link?: string }>;
};

function getInstagramEmbedUrl(url: string) {
  try {
    const urlObj = new URL(url);
    const parts = urlObj.pathname.split("/").filter(Boolean);
    const indicators = ["reel", "reels", "p", "tv"];
    for (const indicator of indicators) {
      const idx = parts.indexOf(indicator);
      if (idx !== -1 && parts[idx + 1]) {
        const type = indicator === "reels" ? "reel" : indicator;
        return `https://www.instagram.com/${type}/${parts[idx + 1]}/embed/`;
      }
    }
  } catch (e) {
    // fallback
  }
  return url;
}

export default function SplitProcessVideoStrip({ videos = [] }: SplitProcessVideoStripProps) {
  const isFourGrid = videos.length >= 4;

  if (isFourGrid) {
    return (
      <section aria-labelledby="process-strip-title" className="bg-[#ece5da] py-16 sm:py-20 lg:py-24">
        <div className="page-container max-w-[1100px] mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="max-w-[34rem] text-left mb-10 sm:mb-12">
            <p className="text-[10px] uppercase tracking-[0.34em] text-[#8b7f70] sm:text-[11px]">IN THE MAKING</p>
            <h2
              id="process-strip-title"
              className="mt-4 font-serif text-[clamp(30px,4vw,52px)] leading-[1.04] tracking-[-0.03em] text-[#1f1a15]"
            >
              Rituals take form
            </h2>
            <p className="mt-4 text-[15px] leading-[1.82] text-[#5d574e] sm:text-[16px]">
              Scent composed by hand. Clay finished in stillness.
            </p>
          </div>

          {/* 2x2 Grid on Mobile, 4-column row on Desktop */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {videos.slice(0, 4).map((video, index) => {
              const url = video?.url && video.url.length > 0 ? video.url : null;
              const poster = video?.poster && video.poster.length > 0 ? video.poster : null;
              const link = video?.link && video.link.length > 0 ? video.link : null;
              const isInstagram =
                url &&
                (url.includes("instagram.com/reel/") ||
                  url.includes("instagram.com/reels/") ||
                  url.includes("instagram.com/p/") ||
                  url.includes("instagram.com/tv/"));

              const cardContent = (
                <>
                  {isInstagram ? (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <iframe
                        src={getInstagramEmbedUrl(url)}
                        style={{
                          position: "absolute",
                          top: "-60px",
                          left: "-2px",
                          width: "calc(100% + 4px)",
                          height: "calc(100% + 220px)",
                        }}
                        className="border-0"
                        scrolling="no"
                      />
                    </div>
                  ) : url ? (
                    <video
                      src={url}
                      poster={poster ?? undefined}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : poster ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={poster}
                      alt={video?.alt ?? `Video loop ${index + 1}`}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
                      <p className="font-serif text-[18px] text-[#2b241d]">In the Making</p>
                      <p className="text-[10px] uppercase tracking-wider text-[#8b7f70] mt-2">Video {index + 1}</p>
                    </div>
                  )}

                  {/* Premium Brand Signature Pill at the bottom */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-full py-1.5 px-3.5 flex items-center gap-2 shadow-md border border-black/5 whitespace-nowrap z-10 select-none pointer-events-none">
                    <span className="text-[10px] font-semibold text-[#1d1a17] tracking-[0.05em] font-sans">
                      seijaku
                    </span>
                    <div className="w-px h-3 bg-black/10" />
                    <span className="text-[9px] font-light text-[#8a8378] font-sans">
                      seijaku.co
                    </span>
                  </div>
                </>
              );

              if (link) {
                return (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={index}
                    className="relative overflow-hidden rounded-[20px] border border-black/5 bg-[#faf8f4] shadow-sm aspect-[9/16] transition-transform duration-300 hover:scale-[1.01] block cursor-pointer"
                  >
                    {cardContent}
                  </a>
                );
              }

              return (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-[20px] border border-black/5 bg-[#faf8f4] shadow-sm aspect-[9/16] transition-transform duration-300 hover:scale-[1.01]"
                >
                  {cardContent}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // Original fallback for 2-column layout (if less than 4 videos are provided)
  const processPanels = [
    { title: "perfume blending in-house" },
    { title: "gold foiling terracotta in-house" },
  ];

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
