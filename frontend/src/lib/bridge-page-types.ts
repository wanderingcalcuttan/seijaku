import { publicBackendJson } from "@/src/lib/backend";
import { cacheTags } from "@/src/lib/cache-tags";
import {
  normalizeBackendProducts,
  type BackendProduct,
  type ProductView,
} from "@/src/lib/product-types";

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
  products: ProductView[];
  // Editorial-page slots (Decision #31). Read by /, /our-story, and
  // /seasonaldrops-hemanta. Empty / absent on every other bridge.
  homeCard1Image?: string;
  homeCard1Alt?: string;
  homeCard2Image?: string;
  homeCard2Alt?: string;
  homeCard3Image?: string;
  homeCard3Alt?: string;
  homeCard4Image?: string;
  homeCard4Alt?: string;
  ritualVideo1Url?: string;
  ritualVideo1Poster?: string;
  ritualVideo2Url?: string;
  ritualVideo2Poster?: string;
  formCard1Image?: string;
  formCard1Alt?: string;
  formCard2Image?: string;
  formCard2Alt?: string;
  formCard3Image?: string;
  formCard3Alt?: string;
  formCard4Image?: string;
  formCard4Alt?: string;
  imageBreak1Image?: string;
  imageBreak1Alt?: string;
  imageBreak2Image?: string;
  imageBreak2Alt?: string;
  imageBreak3Image?: string;
  imageBreak3Alt?: string;
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
  homeCard1Image: string | null;
  homeCard1Alt: string | null;
  homeCard2Image: string | null;
  homeCard2Alt: string | null;
  homeCard3Image: string | null;
  homeCard3Alt: string | null;
  homeCard4Image: string | null;
  homeCard4Alt: string | null;
  ritualVideo1Url: string | null;
  ritualVideo1Poster: string | null;
  ritualVideo2Url: string | null;
  ritualVideo2Poster: string | null;
  formCard1Image: string | null;
  formCard1Alt: string | null;
  formCard2Image: string | null;
  formCard2Alt: string | null;
  formCard3Image: string | null;
  formCard3Alt: string | null;
  formCard4Image: string | null;
  formCard4Alt: string | null;
  imageBreak1Image: string | null;
  imageBreak1Alt: string | null;
  imageBreak2Image: string | null;
  imageBreak2Alt: string | null;
  imageBreak3Image: string | null;
  imageBreak3Alt: string | null;
  products: BackendProduct[];
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
  const products = normalizeBackendProducts(backend.products);
  const productSlugs = products.map((p) => p.slug);

  const common = {
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
    productSlugs,
    products,
    homeCard1Image: nullToUndef(backend.homeCard1Image),
    homeCard1Alt: nullToUndef(backend.homeCard1Alt),
    homeCard2Image: nullToUndef(backend.homeCard2Image),
    homeCard2Alt: nullToUndef(backend.homeCard2Alt),
    homeCard3Image: nullToUndef(backend.homeCard3Image),
    homeCard3Alt: nullToUndef(backend.homeCard3Alt),
    homeCard4Image: nullToUndef(backend.homeCard4Image),
    homeCard4Alt: nullToUndef(backend.homeCard4Alt),
    ritualVideo1Url: nullToUndef(backend.ritualVideo1Url),
    ritualVideo1Poster: nullToUndef(backend.ritualVideo1Poster),
    ritualVideo2Url: nullToUndef(backend.ritualVideo2Url),
    ritualVideo2Poster: nullToUndef(backend.ritualVideo2Poster),
    formCard1Image: nullToUndef(backend.formCard1Image),
    formCard1Alt: nullToUndef(backend.formCard1Alt),
    formCard2Image: nullToUndef(backend.formCard2Image),
    formCard2Alt: nullToUndef(backend.formCard2Alt),
    formCard3Image: nullToUndef(backend.formCard3Image),
    formCard3Alt: nullToUndef(backend.formCard3Alt),
    formCard4Image: nullToUndef(backend.formCard4Image),
    formCard4Alt: nullToUndef(backend.formCard4Alt),
    imageBreak1Image: nullToUndef(backend.imageBreak1Image),
    imageBreak1Alt: nullToUndef(backend.imageBreak1Alt),
    imageBreak2Image: nullToUndef(backend.imageBreak2Image),
    imageBreak2Alt: nullToUndef(backend.imageBreak2Alt),
    imageBreak3Image: nullToUndef(backend.imageBreak3Image),
    imageBreak3Alt: nullToUndef(backend.imageBreak3Alt),
  } as const;

  // Canonical vs admin-created slugs are distinguished at the route layer
  // (the six canonical ones map to bespoke page clients). The returned
  // config shape is identical in both branches.
  return {
    slug: backend.slug as ShopBridgeSlug,
    ...common,
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
