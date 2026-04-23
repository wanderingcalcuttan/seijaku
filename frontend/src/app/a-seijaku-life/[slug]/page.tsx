import { notFound } from "next/navigation";

import { fetchArticle } from "@/src/lib/seijaku-life-types";

export const dynamic = "force-dynamic";

type SeijakuLifeArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function SeijakuLifeArticlePage({ params }: SeijakuLifeArticlePageProps) {
  const { slug } = await params;
  const article = await fetchArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f3efe7] pt-[72px] text-[#3a3a3a] sm:pt-[76px]">
      <section className="section-primary">
        <div className="page-container max-w-[820px]">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#9a785d]">{article.category}</p>
          <h1 className="mt-5 max-w-[16ch]">{article.title}</h1>
          {article.date ? (
            <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-[#8a7f73]">{article.date}</p>
          ) : null}
          <div className="mt-12 h-px w-full bg-black/6" />
          <p className="mt-10 max-w-[58ch] text-[17px] leading-[1.95] text-[#5f5850]">{article.excerpt}</p>
          <p className="mt-8 max-w-[58ch] text-[15px] leading-[1.9] text-[#6a6258]">
            Full editorial article template prepared for future long-form publication.
          </p>
        </div>
      </section>
    </main>
  );
}
