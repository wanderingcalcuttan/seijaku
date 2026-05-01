import Image from "next/image";
import Link from "next/link";

import type { SeijakuLifeArticle } from "@/src/lib/seijaku-life-types";

type SeijakuLifeArticleCardProps = {
  article: SeijakuLifeArticle;
  featured?: boolean;
  priority?: boolean;
};

function ImageFallback({ category }: { category: string }) {
  const initial = (category || "Journal").trim().charAt(0).toUpperCase();
  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(120%_120%_at_30%_20%,#e7dccb_0%,#cdbca8_55%,#a89880_100%)]">
      <span className="font-serif text-[clamp(56px,7vw,96px)] leading-none text-[#f4ecdf]/85">
        {initial}
      </span>
    </div>
  );
}

export default function SeijakuLifeArticleCard({ article, featured = false, priority = false }: SeijakuLifeArticleCardProps) {
  const href = `/a-seijaku-life/${article.slug}`;

  if (featured) {
    return (
      <Link
        href={href}
        className="group flex h-full flex-col overflow-hidden rounded-[24px] bg-[#f8f3ea] transition-shadow duration-300 hover:shadow-[0_18px_40px_rgba(49,57,49,0.08)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#7f715f]"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-[#d8cfc2]">
          {article.image ? (
            <Image
              src={article.image}
              alt={article.imageAlt || article.title}
              fill
              sizes="(min-width: 1024px) 56vw, 100vw"
              priority={priority}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
            />
          ) : (
            <ImageFallback category={article.category} />
          )}
        </div>

        <div className="flex flex-1 flex-col px-7 py-9 sm:px-9 sm:py-11 lg:px-11">
          <p className="text-[10px] uppercase tracking-[0.24em] text-[#8f7a65]">{article.category}</p>
          <h2 className="mt-4 text-[clamp(30px,3.2vw,42px)] leading-[1.1] tracking-[-0.02em] text-[#1f1a16] transition-opacity duration-300 group-hover:opacity-85">
            {article.title}
          </h2>
          <p className="mt-5 max-w-[42ch] text-[15px] leading-[1.82] text-[#5d564d]">{article.excerpt}</p>
          <div className="mt-auto flex items-center justify-between pt-8">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#8a7f73]">{article.date}</p>
            <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#516054] transition-colors duration-200 group-hover:text-[#1f2a21]">
              <span>Read</span>
              <span aria-hidden>&rarr;</span>
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-[20px] bg-[#f7f2e9] transition-colors duration-300 hover:bg-[#f4eee4] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#7f715f]"
    >
      <div className="relative aspect-[5/4] overflow-hidden bg-[#ddd1c1]">
        {article.image ? (
          <Image
            src={article.image}
            alt={article.imageAlt || article.title}
            fill
            sizes="(min-width: 1024px) 38vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
          />
        ) : (
          <ImageFallback category={article.category} />
        )}
      </div>

      <div className="flex flex-1 flex-col px-6 py-7 sm:px-7">
        <p className="text-[10px] uppercase tracking-[0.22em] text-[#8f7a65]">{article.category}</p>
        <h3 className="mt-3 text-[clamp(22px,2.2vw,28px)] leading-[1.18] tracking-[-0.018em] text-[#1f1a16] transition-opacity duration-300 group-hover:opacity-85">
          {article.title}
        </h3>
        <p className="mt-3 line-clamp-3 max-w-[40ch] text-[14.5px] leading-[1.78] text-[#5f5850]">{article.excerpt}</p>
        <div className="mt-auto flex items-center justify-between pt-6">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#8a7f73]">{article.date}</p>
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#516054] transition-colors duration-200 group-hover:text-[#1f2a21]">
            <span>Read</span>
            <span aria-hidden>&rarr;</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
