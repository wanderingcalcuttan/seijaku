import type { ShopBridgeSlug } from "@/src/lib/shop-routes";
import {
  isNotifyMeProduct,
  isUnbuyableProduct,
  type ProductView,
} from "@/src/lib/product-types";

import { type LifestyleSetField } from "./LifestyleSetCard";

export type LifestyleCardConfig = {
  id: string;
  backingSlug: string;
  title: string;
  groupLabel: string;
  includes: string[];
  fields?: LifestyleSetField[];
  imageSrc?: string;
  imageAlt?: string;
};

// Curated slug lists for the editorial sections on /shop/lifestyle.
// If a slug stops resolving (product deleted / renamed in admin), the
// section silently drops that card; the section as a whole still renders.
export const DAYTIME_PAUSES_SLUGS = [
  "kolkata-tea-calm-box",
  "ceramic-coffee-ritual-box",
] as const;

export const PERSONAL_RITUALS_SLUGS = [
  "personal-ritual-set-00",
  "unfold-ritual-gift-set",
  "listen-ritual-gift-set",
  "attune-personal-gift-set",
] as const;

export const CUSTOM_GIFTING_SLUG = "live-calm-curated-pouch";

function buyableTitlesByBridge(products: ProductView[], bridge: ShopBridgeSlug): string[] {
  return products
    .filter((p) => p.bridgeCategory === bridge && !isUnbuyableProduct(p) && !isNotifyMeProduct(p))
    .map((p) => p.title)
    .sort((a, b) => a.localeCompare(b));
}

// The Custom Gifting picker. Three SINGLE selects whose options are the
// titles of buyable products in each bridge — keeps the picker truthful as
// the catalog evolves without a code change.
export function buildLiveCalmPouchCard(products: ProductView[]): LifestyleCardConfig {
  return {
    id: "live-calm-curated-pouch",
    backingSlug: CUSTOM_GIFTING_SLUG,
    title: "Live Calm Gift Pouch",
    groupLabel: "Custom Gifting",
    includes: ["Choose your perfume", "Choose your textile", "Choose your brooch"],
    fields: [
      {
        id: "perfume",
        label: "Choose your perfume",
        options: buyableTitlesByBridge(products, "perfumes"),
      },
      {
        id: "textile",
        label: "Choose your textile",
        options: buyableTitlesByBridge(products, "scarves-and-squares"),
      },
      {
        id: "brooch",
        label: "Choose your brooch",
        options: buyableTitlesByBridge(products, "dokra-ornaments"),
      },
    ],
  };
}
