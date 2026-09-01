import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import ArticleBody from "@/src/components/article/ArticleBody";
import { fetchArticle, fetchArticles, type SeijakuLifeArticle } from "@/src/lib/seijaku-life-types";

export const dynamic = "force-dynamic";

const RELATED_LIMIT = 2;
const WORDS_PER_MINUTE = 200;

type SeijakuLifeArticlePageProps = {
  params: Promise<{ slug: string }>;
};

function estimateReadingMinutes(markdown: string | null | undefined): number {
  if (!markdown) return 0;
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  if (words === 0) return 0;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export async function generateMetadata({ params }: SeijakuLifeArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticle(slug);
  if (!article) {
    return { title: "Article | Seijaku" };
  }
  return {
    title: article.seoTitle ?? `${article.title} | Seijaku`,
    description: article.seoDescription ?? article.excerpt,
  };
}

export default async function SeijakuLifeArticlePage({ params }: SeijakuLifeArticlePageProps) {
  const { slug } = await params;
  const article = await fetchArticle(slug);
  if (!article) {
    notFound();
  }

  const readingMinutes = estimateReadingMinutes(article.bodyMarkdown);
  const allArticles = await fetchArticles().catch(() => [] as SeijakuLifeArticle[]);
  const related = allArticles.filter((entry) => entry.slug !== article.slug).slice(0, RELATED_LIMIT);

  return (
    <main className="min-h-screen bg-[#f3efe7] pt-[72px] text-[#3a3329] sm:pt-[76px]">
      {/* HERO IMAGE */}
      {/* <section className="section-primary pt-12 sm:pt-16"> */}
        <div className="page-container max-w-[960px] pt-12">
          {article.image ? (
            <figure>
              <div className="relative aspect-[3/2] overflow-hidden rounded-[28px] border border-[rgba(86,76,64,0.08)] bg-[#e9e0d3] shadow-[0_18px_40px_rgba(41,34,27,0.06)]">
                <Image
                  src={article.image}
                  alt={article.imageAlt ?? article.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 960px, 100vw"
                  className="object-cover object-center"
                />
              </div>
              {article.imageAlt ? (
                <figcaption className="mt-4 max-w-[60ch] text-[12px] leading-[1.7] text-[#7d7267]">
                  {article.imageAlt}
                </figcaption>
              ) : null}
            </figure>
          ) : (
            <div className="aspect-[3/2] rounded-[28px] border border-[rgba(86,76,64,0.08)] bg-[linear-gradient(180deg,rgba(250,247,241,0.95)_0%,rgba(238,228,213,0.95)_100%)] shadow-[0_18px_40px_rgba(41,34,27,0.04)]" />
          )}
        </div>
      {/* </section> */}

      {/* HEADER */}
      {/* <section className="section-primary pb-4 pt-2"> */}
        <div className="page-container max-w-[820px] pt-2">
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#9a785d]">{article.category}</p>
          <h1 className="mt-5 max-w-[20ch] font-serif text-[clamp(36px,5vw,56px)] leading-[1.06] tracking-[-0.025em] text-[#1d1a17]">
            {article.title}
          </h1>
          <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] uppercase tracking-[0.22em] text-[#7d7267]">
            <span>Seijaku Editorial</span>
            <span aria-hidden className="text-[#c5b9a7]">·</span>
            {article.date ? <span>{article.date}</span> : null}
            {readingMinutes > 0 ? (
              <>
                <span aria-hidden className="text-[#c5b9a7]">·</span>
                <span>{readingMinutes} min read</span>
              </>
            ) : null}
          </div>
        </div>
      {/* </section> */}

      {/* DEK */}
      {/* <section className="section-primary pt-2"> */}
        <div className="page-container max-w-[820px] pt-2">
          <p className="max-w-[60ch] font-serif text-[clamp(20px,2.2vw,24px)] leading-[1.5] text-[#5b5246]">
            {article.excerpt}
          </p>
          <div className="mt-12 h-px w-16 bg-[#9a785d]" />
        </div>
      {/* </section> */}

      {/* BODY */}
      {/* <section className="section-primary pb-16 pt-10 sm:pb-20"> */}
        <div className="page-container max-w-[820px] pt-10">
          {article.bodyMarkdown && article.bodyMarkdown.trim().length > 0 ? (
            <ArticleBody markdown={article.bodyMarkdown} />
          ) : (
            <p className="max-w-[60ch] text-[15px] italic leading-[1.85] text-[#7d7267]">
              Full article coming soon.
            </p>
          )}
        </div>
      {/* </section> */}

      {/* RELATED */}
      {related.length > 0 ? (
        // <section className="section-primary pb-24 pt-4">
          <div className="page-container max-w-[1100px] pt-4">
            <div className="border-t border-[rgba(86,76,64,0.12)] pt-12">
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#9a785d]">More from Seijaku Life</p>
              <div className="mt-8 grid gap-8 md:grid-cols-2 md:gap-10">
                {related.map((entry) => (
                  <Link
                    key={entry.slug}
                    href={`/a-seijaku-life/${entry.slug}`}
                    className="group block rounded-[24px] border border-[rgba(86,76,64,0.08)] bg-[#faf7f1] p-5 transition-colors duration-200 hover:border-[rgba(86,76,64,0.18)]"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-[#e9e0d3]">
                      {entry.image ? (
                        <Image
                          src={entry.image}
                          alt={entry.imageAlt ?? entry.title}
                          fill
                          sizes="(min-width: 768px) 50vw, 100vw"
                          className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                      ) : null}
                    </div>
                    <p className="mt-5 text-[10px] uppercase tracking-[0.28em] text-[#9a785d]">{entry.category}</p>
                    <h2 className="mt-2 max-w-[24ch] font-serif text-[clamp(20px,2vw,24px)] leading-[1.18] tracking-[-0.015em] text-[#1d1a17]">
                      {entry.title}
                    </h2>
                    {entry.date ? (
                      <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-[#8a7f73]">{entry.date}</p>
                    ) : null}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        // </section>
      ) : null}
    </main>
  );
}
