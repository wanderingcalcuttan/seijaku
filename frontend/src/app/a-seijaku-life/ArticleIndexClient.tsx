"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

import SeijakuLifeArticleCard from "@/src/components/SeijakuLifeArticleCard";
import type { SeijakuLifeArticle } from "@/src/lib/seijaku-life-types";

type ArticleIndexClientProps = {
  articles: SeijakuLifeArticle[];
  categories: string[];
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ArticleIndexClient({ articles, categories }: ArticleIndexClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredArticles = useMemo(() => {
    if (activeCategory === "All") {
      return articles;
    }
    return articles.filter((article) => article.category === activeCategory);
  }, [activeCategory, articles]);

  return (
    <motion.div
      className="flex flex-col gap-10"
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div>
        <h2 className="text-[clamp(28px,3vw,38px)] leading-[1.14] tracking-[-0.02em] text-[#1f1a16]">
          Recent Entries
        </h2>
        <div className="mt-8 overflow-x-auto pb-2">
          <div className="flex min-w-max items-center gap-2 rounded-full bg-[#ece4d7] p-1.5">
            {categories.map((category) => {
              const isActive = category === activeCategory;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.17em] transition-colors duration-300 ${
                    isActive ? "bg-[#f9f5ed] text-[#1f1a16]" : "text-[#7d7368] hover:text-[#3f3933]"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-7 md:grid-cols-2 md:gap-9">
        {filteredArticles.map((article) => (
          <motion.div
            key={article.slug}
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-12%" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <SeijakuLifeArticleCard article={article} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
