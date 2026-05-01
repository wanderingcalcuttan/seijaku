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

export type LifestyleSectionConfig = {
  title: string;
  items: LifestyleCardConfig[];
};

function buyableTitlesByBridge(products: ProductView[], bridge: ShopBridgeSlug): string[] {
  return products
    .filter((p) => p.bridgeCategory === bridge && !isUnbuyableProduct(p) && !isNotifyMeProduct(p))
    .map((p) => p.title)
    .sort((a, b) => a.localeCompare(b));
}

export function buildLifestyleSections(products: ProductView[]): LifestyleSectionConfig[] {
  const liveCalmGiftPouch: LifestyleCardConfig = {
    id: "live-calm-gift-pouch",
    backingSlug: "",
    title: "Live Calm Gift Pouch",
    groupLabel: "Gifting",
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

  return [
    {
      title: "Gifting",
      items: [liveCalmGiftPouch],
    },
  ];
}
