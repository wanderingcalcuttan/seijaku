// Shop domain taxonomy types, filter-option unions, matcher predicates, and
// the release-date lookup table. All pure / static — no dependency on the
// backend catalog. Consumed by product-types.ts (for ProductView's field
// types) and the shop filter UI (ShopAllPageClient, ShopFilterRail,
// ShopFilterDrawer). See Decision #26.

export type ShopItemType =
  | "Ritual Box"
  | "Perfume"
  | "Fragrance Oil"
  | "Wax Melt"
  | "Scarf / Square"
  | "Diffuser"
  | "Dokra Ornament"
  | "Program"
  | "Retreat";

export type ShopMaterial =
  | "Composed Sets"
  | "Botanical Fragrance"
  | "Handwoven Textiles"
  | "Clay & Stone"
  | "Dokra Metal"
  | "Guided Experience";

export type ShopUseCase = "skin" | "cloth" | "diffusion objects";

export type ShopSortOption =
  | "Recommended"
  | "Newest"
  | "Price low to high"
  | "Price high to low";

export const sortOptions = [
  "Recommended",
  "Newest",
  "Price low to high",
  "Price high to low",
] as const;

export type ShopTypeFilterOption =
  | "Fragrances"
  | "Body"
  | "Diffusers"
  | "Objects"
  | "Textiles"
  | "Gift Sets"
  | "For Yourself"
  | "For a Loved One"
  | "Dokra Ornaments"
  | "Home Objects: Diffusers"
  | "Scarves & Squares"
  | "Programs"
  | "Retreats";

export type ShopMaterialFilterOption =
  | "Oil-based Perfumes"
  | "Ethanol-based Perfumes"
  | "Clay & Stone"
  | "Dokra (Metal)"
  | "Handwoven textiles"
  | "Printed textiles";

const shopTypeFilterOptions: ShopTypeFilterOption[] = [
  "Fragrances",
  "Body",
  "Diffusers",
  "Objects",
  "Textiles",
  "Gift Sets",
  "For Yourself",
  "For a Loved One",
  "Dokra Ornaments",
  "Home Objects: Diffusers",
  "Scarves & Squares",
  "Programs",
  "Retreats",
];

const shopMaterialFilterOptions: ShopMaterialFilterOption[] = [
  "Oil-based Perfumes",
  "Ethanol-based Perfumes",
  "Clay & Stone",
  "Dokra (Metal)",
  "Handwoven textiles",
  "Printed textiles",
];

export function getShopTypes(): ShopTypeFilterOption[] {
  return shopTypeFilterOptions;
}

export function getShopMaterials(): ShopMaterialFilterOption[] {
  return shopMaterialFilterOptions;
}

// Matchers take a structural subset so they can consume ProductView (or any
// caller's product shape) without forcing a circular import on product-types.
export function matchesShopTypeFilter(
  item: { type: ShopItemType },
  selectedType: ShopTypeFilterOption | "All",
): boolean {
  if (selectedType === "All") return true;
  if (selectedType === "Fragrances") return item.type === "Perfume" || item.type === "Diffuser";
  if (selectedType === "Body") return item.type === "Perfume";
  if (selectedType === "Diffusers" || selectedType === "Home Objects: Diffusers") return item.type === "Diffuser";
  if (selectedType === "Objects" || selectedType === "Dokra Ornaments") return item.type === "Dokra Ornament";
  if (selectedType === "Textiles" || selectedType === "Scarves & Squares") return item.type === "Scarf / Square";
  if (selectedType === "Gift Sets" || selectedType === "For Yourself" || selectedType === "For a Loved One") return item.type === "Ritual Box";
  if (selectedType === "Programs") return item.type === "Program";
  if (selectedType === "Retreats") return item.type === "Retreat";
  return false;
}

export function matchesShopMaterialFilter(
  item: { type: ShopItemType; material: ShopMaterial },
  selectedMaterial: ShopMaterialFilterOption | "All",
): boolean {
  if (selectedMaterial === "All") return true;
  if (selectedMaterial === "Oil-based Perfumes" || selectedMaterial === "Ethanol-based Perfumes") return item.type === "Perfume";
  if (selectedMaterial === "Clay & Stone") return item.material === "Clay & Stone";
  if (selectedMaterial === "Dokra (Metal)") return item.material === "Dokra Metal";
  if (selectedMaterial === "Handwoven textiles" || selectedMaterial === "Printed textiles") return item.material === "Handwoven Textiles";
  return false;
}

// Hand-maintained editorial release-date map for the "Newest" sort order on
// /shop. Not modeled on the backend — these dates pre-date the backend
// migration and no product record carries a comparable field. If this needs
// to become admin-editable, add a `releasedAt` column on Product and swap
// this lookup for a prop read. Slugs not in the map sort under the fallback.
const shopProductReleaseDates: Record<string, string> = {
  "quiet-tea-ritual-box": "2026-03-12",
  "reading-hour-set": "2026-03-08",
  "dawn-reset-box": "2026-03-03",
  "evening-unwind-gift-set": "2026-02-25",
  "smoke-tea-parfum": "2026-03-15",
  "saffron-plum-attar": "2026-03-10",
  "neroli-linen-mist": "2026-03-01",
  "hinoki-morning-oil": "2026-02-20",
  "table-ritual-napkin-pair": "2026-03-11",
  "tea-room-pocket-square": "2026-03-05",
  "rain-quiet-wrap": "2026-02-28",
  "mulberry-dawn-scarf": "2026-02-18",
  "clay-vessel-diffuser": "2026-03-14",
  "reed-diffuser-cedar-smoke": "2026-03-07",
  "brass-tea-light-diffuser": "2026-02-27",
  "stone-oil-diffuser": "2026-02-22",
  "threshold-bell-ornament": "2026-03-13",
  "dokra-bird-figure": "2026-03-09",
  "dokra-talisman-pair": "2026-02-26",
  "quiet-lamp-charm": "2026-02-19",
  "adult-unwind-program": "2026-03-06",
  "elder-reset-program": "2026-02-24",
  "autumn-quiet-retreat": "2026-02-16",
};

export function getShopProductReleaseDate(item: { slug: string }): string {
  return shopProductReleaseDates[item.slug] ?? "2026-01-01";
}
