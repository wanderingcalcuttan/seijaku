"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { SeijakuLifeArticle } from "@/src/lib/seijaku-life-types";
import { log } from "console";

// Curated subset surfaced on /a-seijaku-life and on this home preview.
// Stays in sync with CURATED_ARTICLE_SLUGS in app/a-seijaku-life/page.tsx.
const CURATED_ARTICLE_SLUGS = [
  // "ritual-objects-for-urban-evenings",
  // "how-to-scent-textiles-right",
  // "inside-dokra-from-heritage-craft-to-wearable-artifact",
] as const;

const NEUTRAL_FALLBACK_SRC = "/images/quiet-tea-ritual-box-lifestyle-neutral.png";

type BackendArticleResponseItem = {
  slug: string;
  title: string;
  category: string;
  primaryImage: { url: string; altText: string | null } | null;
};

type ArticlesResponse = { items: BackendArticleResponseItem[] };

export default function JournalPreviewSection() {
  const [articles, setArticles] = useState<SeijakuLifeArticle[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/public/content/articles", {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) return;
        const data = (await res.json()) as ArticlesResponse;
        
        if (cancelled) return;

        const MAX_ARTICLES = 3; // Set to undefined or remove slice() if you want all
        const toView = (raw: typeof data.items[number]): SeijakuLifeArticle => ({
          slug: raw.slug,
          title: raw.title,
          category: raw.category,
          date: "",
          excerpt: "",
          bodyMarkdown: null,
          image: raw.primaryImage?.url ?? undefined,
          imageAlt: raw.primaryImage?.altText ?? undefined,
        });

        const bySlug = new Map(data.items.map((a) => [a.slug, a]));

        const curated = CURATED_ARTICLE_SLUGS.length === 0
            ? (MAX_ARTICLES == null
                ? data.items
                : data.items.slice(0, MAX_ARTICLES)
              ).map(toView)
            : CURATED_ARTICLE_SLUGS.flatMap((slug) => {
                const raw = bySlug.get(slug);
                return raw ? [toView(raw)] : [];
              });
        setArticles(curated);
      } catch {
        // Silent — section hides via the empty-state branch below.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="section-editorial bg-[#F3EFE7] pb-[84px]">
      <div className="page-container">
        <div className="max-w-[820px]">
          <p className="text-[10px] uppercase tracking-[0.24em] text-[#8f7455]">Fragrance Rituals &amp; Craft Journal</p>
          <h2 className="mt-4 text-[#1f1d1a]">Fragrance rituals, mindful living, and artisan craft stories</h2>
          <p className="mt-4 max-w-[46ch] text-[15px] leading-[1.82] text-[#61584f]">
            Guides on scenting textiles, calming rituals, and handcrafted dokra traditions from Bengal.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {articles.map((article) => {
            const src = article.image ?? NEUTRAL_FALLBACK_SRC;
            const alt = article.imageAlt ?? article.title;
            const href = `/a-seijaku-life/${article.slug}`;
            return (
              <article
                key={article.slug}
                className="rounded-[22px] border border-[#d8cec1] bg-[#faf7f1] shadow-[0_10px_28px_rgba(49,57,49,0.035)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(49,57,49,0.06)]"
              >
                <Link
                  href={href}
                  className="group block h-full rounded-[22px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8e806e] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f3efe7]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-t-[22px] bg-[#e8dfd2]">
                    <Image
                      src={src}
                      alt={alt}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="px-5 py-6">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#9a7c5b]">{article.category || "Journal"}</p>
                    <h3 className="mt-4 text-[25px] leading-[1.18] text-[#2d2721]">{article.title}</h3>
                    <span className="mt-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#516054] transition-colors duration-200 group-hover:text-[#1f2a21]">
                      <span>Read</span>
                      <span aria-hidden>&rarr;</span>
                    </span>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/a-seijaku-life"
            className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-full border border-[#d2c4b3] bg-[#2f5137] px-8 py-3.5 text-[11px] uppercase tracking-[0.22em] text-[#f4efe8] shadow-[0_14px_28px_rgba(47,81,55,0.14)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#25412c] hover:shadow-[0_18px_34px_rgba(47,81,55,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8e806e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3efe7]"
          >
            <span>View all journal entries</span>
            <span aria-hidden>&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
