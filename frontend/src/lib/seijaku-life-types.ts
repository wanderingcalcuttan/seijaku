import { publicBackendJson } from "@/src/lib/backend";
import { cacheTags } from "@/src/lib/cache-tags";

export type SeijakuLifeArticle = {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  image?: string;
  imageAlt?: string;
  featured?: boolean;
};

type BackendArticle = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  bodyMarkdown: string | null;
  featured: boolean;
  status: "DRAFT" | "PUBLISHED";
  publishedAt: string | null;
  primaryImage: { id: string; url: string; altText: string | null } | null;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
  updatedAt: string;
};

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function formatArticleDate(isoDate: string | null): string {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return "";
  return `${MONTH_NAMES[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function toViewModel(article: BackendArticle): SeijakuLifeArticle {
  return {
    slug: article.slug,
    title: article.title,
    category: article.category,
    date: formatArticleDate(article.publishedAt),
    excerpt: article.excerpt,
    image: article.primaryImage?.url ?? undefined,
    imageAlt: article.primaryImage?.altText ?? undefined,
    featured: article.featured,
  };
}

export async function fetchArticles(): Promise<SeijakuLifeArticle[]> {
  const { items } = await publicBackendJson<{ items: BackendArticle[] }>(
    "/content/articles",
    { tags: [cacheTags.articles] },
  );
  return items.map(toViewModel);
}

export async function fetchArticle(slug: string): Promise<SeijakuLifeArticle | null> {
  try {
    const { item } = await publicBackendJson<{ item: BackendArticle }>(
      `/content/articles/${encodeURIComponent(slug)}`,
      { tags: [cacheTags.articles] },
    );
    return toViewModel(item);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.toLowerCase().includes("article not found")) {
      return null;
    }
    throw err;
  }
}
