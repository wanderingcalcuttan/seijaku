import Link from "next/link";

import SeijakuLifeArticleCard from "@/src/components/SeijakuLifeArticleCard";
import { fetchArticles } from "@/src/lib/seijaku-life-types";

export const dynamic = "force-dynamic";

// Curated subset of /admin/articles surfaced on /a-seijaku-life and on
// the home page JournalPreviewSection. First slug renders as the large
// editorial card; the other two stack beside it. Render order is
// brand-controlled here, not driven by the article's `featured` flag.
const CURATED_ARTICLE_SLUGS = [
  "ritual-objects-for-urban-evenings",
  "how-to-scent-textiles-right",
  "inside-dokra-from-heritage-craft-to-wearable-artifact",
] as const;

export default async function ASeijakuLifePage() {
  const allArticles = await fetchArticles();
  const articlesBySlug = new Map(allArticles.map((a) => [a.slug, a]));
  const articles = CURATED_ARTICLE_SLUGS.flatMap((slug) => {
    const article = articlesBySlug.get(slug);
    return article ? [article] : [];
  });

  const [featured, ...rest] = articles;

  return (
    <main className="min-h-screen bg-[#f3efe7] pt-[72px] text-[#3a3a3a] sm:pt-[76px]">
      <section className="section-primary pb-8 pt-20 sm:pt-24">
        <div className="page-container max-w-[980px]">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#9a785d]">Journal</p>
          <h1 className="mt-5 max-w-[10ch] text-[clamp(44px,5.2vw,68px)] leading-[1.02] tracking-[-0.028em] text-[#1d1a17]">
            A Seijaku Life
          </h1>
          <p className="mt-7 max-w-[42ch] text-[17px] leading-[1.9] text-[#5f584f]">
            Notes on ritual, season, making, and the quieter textures of living.
          </p>
          <p className="mt-5 max-w-[62ch] text-[13px] leading-[1.9] tracking-[0.01em] text-[#7c7368]">
            A journal of reflections, processes, objects, places, and slow observations from the world of Seijaku.
          </p>
          <div className="mt-12 h-px w-full bg-black/6" />
        </div>
      </section>

      {articles.length > 0 && (
        <section className="section-editorial pb-16 pt-4 sm:pb-20">
          <div className="page-container max-w-[1200px]">
            <div className="grid gap-7 lg:grid-cols-[1.4fr_1fr] lg:gap-9">
              {featured && (
                <div className="lg:row-span-2">
                  <SeijakuLifeArticleCard article={featured} featured priority />
                </div>
              )}

              {rest.map((article) => (
                <SeijakuLifeArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-secondary pb-0">
        <div className="page-container max-w-[1080px]">
          <div className="rounded-[22px] bg-[#e9e1d4] px-7 py-10 sm:px-10 sm:py-12 md:px-12 md:py-14">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#8d7a66]">Seijaku Notes</p>
            <h2 className="mt-4 max-w-[16ch] text-[clamp(28px,3.2vw,40px)] leading-[1.12] tracking-[-0.02em] text-[#1f1a16]">
              Stay close to the season.
            </h2>
            <p className="mt-5 max-w-[52ch] text-[15px] leading-[1.85] text-[#5f5850]">
              Receive occasional notes from Seijaku on new writings, seasonal releases, and quiet offerings.
            </p>
            <Link
              href="#"
              className="mt-8 inline-flex items-center justify-center rounded-full border border-[#b9ab97] px-7 py-3.5 text-[11px] uppercase tracking-[0.18em] text-[#2f2924] transition-colors duration-300 hover:border-[#8f7f6c] hover:bg-[#f7f1e8]"
            >
              Join the Newsletter
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
