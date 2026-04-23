import Image from "next/image";
import Link from "next/link";

import type { SeijakuLifeArticle } from "@/src/lib/seijaku-life-types";

type SeijakuLifeArticleCardProps = {
  article: SeijakuLifeArticle;
  featured?: boolean;
  priority?: boolean;
};

export default function SeijakuLifeArticleCard({ article, featured = false, priority = false }: SeijakuLifeArticleCardProps) {
  const href = `/a-seijaku-life/${article.slug}`;

  if (featured) {
    return (
      <Link
        href={href}
        className="group block overflow-hidden rounded-[24px] bg-[#f8f3ea] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#7f715f]"
      >
        <div className="grid gap-0 lg:grid-cols-[1.12fr_0.88fr]">
          <div className="relative aspect-[4/3] overflow-hidden bg-[#d8cfc2]">
            {article.image ? (
              <Image
                src={article.image}
                alt={article.imageAlt || article.title}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                priority={priority}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
            ) : (
              <div className="h-full w-full bg-[linear-gradient(135deg,#dcd2c4_0%,#cbbca8_55%,#e2d8ca_100%)]" />
            )}
          </div>

          <div className="flex items-center px-8 py-9 sm:px-10 sm:py-11 lg:px-12">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#8f7a65]">{article.category}</p>
              <h2 className="mt-4 text-[clamp(30px,3.5vw,46px)] leading-[1.1] tracking-[-0.02em] text-[#1f1a16] transition-opacity duration-300 group-hover:opacity-85">
                {article.title}
              </h2>
              <p className="mt-5 max-w-[34ch] text-[15px] leading-[1.82] text-[#5d564d]">{article.excerpt}</p>
              <p className="mt-8 text-[11px] uppercase tracking-[0.2em] text-[#8a7f73]">{article.date}</p>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group block rounded-[18px] bg-[#f7f2e9] px-6 py-6 transition-colors duration-300 hover:bg-[#f4eee4] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#7f715f] sm:px-7 sm:py-7"
    >
      <div className="relative aspect-[16/9] overflow-hidden rounded-[14px] bg-[#ddd1c1]">
        {article.image ? (
          <Image
            src={article.image}
            alt={article.imageAlt || article.title}
            fill
            sizes="(min-width: 1024px) 34vw, (min-width: 768px) 46vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
          />
        ) : (
          <div className="h-full w-full bg-[linear-gradient(140deg,#dcd2c6_0%,#cdbca8_60%,#e8ddd0_100%)]" />
        )}
      </div>

      <div className="mt-5">
        <p className="text-[10px] uppercase tracking-[0.22em] text-[#8f7a65]">{article.category}</p>
        <h3 className="mt-3 text-[clamp(24px,2.7vw,31px)] leading-[1.16] tracking-[-0.018em] text-[#1f1a16] transition-opacity duration-300 group-hover:opacity-85">
          {article.title}
        </h3>
        <p className="mt-4 max-w-[35ch] text-[15px] leading-[1.8] text-[#5f5850]">{article.excerpt}</p>
        <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-[#8a7f73]">{article.date}</p>
      </div>
    </Link>
  );
}
