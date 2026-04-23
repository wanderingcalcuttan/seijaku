import { publicBackendJson } from "@/src/lib/backend";
import { cacheTags } from "@/src/lib/cache-tags";

export type ShopBridgeSlug =
  | "lifestyle"
  | "perfumes"
  | "scarves-and-squares"
  | "diffusers"
  | "dokra-ornaments"
  | "seasonaldrops";

export const canonicalBridgeSlugs: ShopBridgeSlug[] = [
  "lifestyle",
  "perfumes",
  "scarves-and-squares",
  "diffusers",
  "dokra-ornaments",
  "seasonaldrops",
];

// Stable display labels + canonical hrefs for each bridge slug. Used by
// client-only code (Navbar, SearchOverlay) that can't call the backend
// server-side. Admin edits to a bridge page's navLabel only affect the
// server-rendered /shop/[slug] page; this map stays code-owned. The set is
// small (6 entries) and changes are rare — not worth a client-side fetch.
export const bridgeNavLabelBySlug: Record<ShopBridgeSlug, string> = {
  lifestyle: "Lifestyle",
  perfumes: "Perfumes",
  "scarves-and-squares": "Scarves & Squares",
  diffusers: "Diffusers",
  "dokra-ornaments": "Dokra Brooches",
  seasonaldrops: "Seasonal Drops",
};

export function bridgeHrefBySlug(slug: ShopBridgeSlug): string {
  return `/shop/${slug}`;
}

// Shape the storefront page clients already consume. Kept intentionally
// identical to the pre-migration `ShopBridgePageConfig` so the five
// per-bridge clients (LifestylePageClient, PerfumesPageClient, etc.) need
// no structural changes.
export type ShopBridgePageConfig = {
  slug: ShopBridgeSlug;
  href: string;
  navLabel: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string[];
  heroImage: string;
  heroImageAlt: string;
  heroImagePosition?: string;
  heroQuote: string;
  introEyebrow: string;
  introTitle: string;
  introDescription: string;
  productSectionEyebrow?: string;
  productSectionTitle?: string;
  productSectionDescription?: string;
  interludeImage?: string;
  interludeImageAlt?: string;
  postCtaTitle?: string;
  postCtaDescription?: string;
  postCtaPrimaryLabel?: string;
  postCtaPrimaryHref?: string;
  postCtaSecondaryLabel?: string;
  postCtaSecondaryHref?: string;
  seoFootnote?: string;
  productSlugs: string[];
};

type BackendBridgePage = {
  id: string;
  slug: string;
  navLabel: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string[];
  heroImage: string;
  heroImageAlt: string;
  heroImagePosition: string | null;
  heroQuote: string;
  introEyebrow: string | null;
  introTitle: string;
  introDescription: string;
  interludeImage: string | null;
  interludeImageAlt: string | null;
  productSectionEyebrow: string | null;
  productSectionTitle: string | null;
  productSectionDescription: string | null;
  postCtaTitle: string | null;
  postCtaDescription: string | null;
  postCtaPrimaryLabel: string | null;
  postCtaPrimaryHref: string | null;
  postCtaSecondaryLabel: string | null;
  postCtaSecondaryHref: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoFootnote: string | null;
  content: Record<string, unknown> | null;
  products: Array<{ slug: string }>;
  createdAt: string;
  updatedAt: string;
};

function nullToUndef<T>(v: T | null): T | undefined {
  return v === null ? undefined : v;
}

export function isShopBridgeSlug(value: string): value is ShopBridgeSlug {
  return (canonicalBridgeSlugs as string[]).includes(value);
}

function normalize(backend: BackendBridgePage): ShopBridgePageConfig {
  if (!isShopBridgeSlug(backend.slug)) {
    // An admin-created slug that isn't one of the six canonical ones. We
    // still return a valid config; the storefront will render via the
    // generic ShopBridgePageClient fallback rather than a per-bridge client.
    return {
      slug: backend.slug as ShopBridgeSlug,
      href: `/shop/${backend.slug}`,
      navLabel: backend.navLabel,
      heroEyebrow: backend.heroEyebrow,
      heroTitle: backend.heroTitle,
      heroDescription: backend.heroDescription,
      heroImage: backend.heroImage,
      heroImageAlt: backend.heroImageAlt,
      heroImagePosition: nullToUndef(backend.heroImagePosition),
      heroQuote: backend.heroQuote,
      introEyebrow: backend.introEyebrow ?? "",
      introTitle: backend.introTitle,
      introDescription: backend.introDescription,
      productSectionEyebrow: nullToUndef(backend.productSectionEyebrow),
      productSectionTitle: nullToUndef(backend.productSectionTitle),
      productSectionDescription: nullToUndef(backend.productSectionDescription),
      interludeImage: nullToUndef(backend.interludeImage),
      interludeImageAlt: nullToUndef(backend.interludeImageAlt),
      postCtaTitle: nullToUndef(backend.postCtaTitle),
      postCtaDescription: nullToUndef(backend.postCtaDescription),
      postCtaPrimaryLabel: nullToUndef(backend.postCtaPrimaryLabel),
      postCtaPrimaryHref: nullToUndef(backend.postCtaPrimaryHref),
      postCtaSecondaryLabel: nullToUndef(backend.postCtaSecondaryLabel),
      postCtaSecondaryHref: nullToUndef(backend.postCtaSecondaryHref),
      seoFootnote: nullToUndef(backend.seoFootnote),
      productSlugs: backend.products.map((p) => p.slug),
    };
  }

  return {
    slug: backend.slug,
    href: `/shop/${backend.slug}`,
    navLabel: backend.navLabel,
    heroEyebrow: backend.heroEyebrow,
    heroTitle: backend.heroTitle,
    heroDescription: backend.heroDescription,
    heroImage: backend.heroImage,
    heroImageAlt: backend.heroImageAlt,
    heroImagePosition: nullToUndef(backend.heroImagePosition),
    heroQuote: backend.heroQuote,
    introEyebrow: backend.introEyebrow ?? "",
    introTitle: backend.introTitle,
    introDescription: backend.introDescription,
    productSectionEyebrow: nullToUndef(backend.productSectionEyebrow),
    productSectionTitle: nullToUndef(backend.productSectionTitle),
    productSectionDescription: nullToUndef(backend.productSectionDescription),
    interludeImage: nullToUndef(backend.interludeImage),
    interludeImageAlt: nullToUndef(backend.interludeImageAlt),
    postCtaTitle: nullToUndef(backend.postCtaTitle),
    postCtaDescription: nullToUndef(backend.postCtaDescription),
    postCtaPrimaryLabel: nullToUndef(backend.postCtaPrimaryLabel),
    postCtaPrimaryHref: nullToUndef(backend.postCtaPrimaryHref),
    postCtaSecondaryLabel: nullToUndef(backend.postCtaSecondaryLabel),
    postCtaSecondaryHref: nullToUndef(backend.postCtaSecondaryHref),
    seoFootnote: nullToUndef(backend.seoFootnote),
    productSlugs: backend.products.map((p) => p.slug),
  };
}

const bridgeFetchTags = [cacheTags.bridgePages, cacheTags.products];

export async function fetchBridgePage(slug: string): Promise<ShopBridgePageConfig | null> {
  try {
    const { item } = await publicBackendJson<{ item: BackendBridgePage }>(
      `/catalog/bridge-pages/${encodeURIComponent(slug)}`,
      { tags: bridgeFetchTags },
    );
    return normalize(item);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.toLowerCase().includes("not found")) {
      return null;
    }
    throw err;
  }
}
