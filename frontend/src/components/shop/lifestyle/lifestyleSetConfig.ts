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

// Derive the Live Calm Gift Pouch's picker options from the live catalog.
// Filters out products that can't be bought right now (Sold Out / Upcoming /
// Waitlist) so the dropdowns only surface items customers can actually gift.
// Sorted alphabetically for a stable picker order as the catalogue grows.
function buyableTitlesByBridge(products: ProductView[], bridge: ShopBridgeSlug): string[] {
  return products
    .filter((p) => p.bridgeCategory === bridge && !isUnbuyableProduct(p) && !isNotifyMeProduct(p))
    .map((p) => p.title)
    .sort((a, b) => a.localeCompare(b));
}

// Static cards — no product-derived fields. Factored to module consts so the
// builder below composes them without reallocation per call.

const kolkataChaiCalmBox: LifestyleCardConfig = {
  id: "kolkata-chai-calm-box",
  backingSlug: "quiet-tea-ritual-box",
  title: "Kolkata Chai Calm Box",
  groupLabel: "Morning & Pause",
  includes: [
    "Terracotta diffuser inspired by Kolkata chai cups",
    "2 terracotta tea cups",
    "2 fragrance oils (pick any 2)",
    "2 tea bags",
  ],
  fields: [
    {
      id: "oils",
      label: "Pick any 2 fragrance oils",
      options: ["Lavender Green", "Chamomile", "Spearmint", "Ginger Lemon", "Jasmine"],
      selectionMode: "MULTI",
      minSelections: 2,
      maxSelections: 2,
    },
  ],
  imageSrc: "/images/Quiet Tea Ritual Box_lifestyle.JPG",
  imageAlt: "Kolkata Chai Calm Box arranged with terracotta ritual objects in a warm editorial still life.",
};

const coffeeBreakBox: LifestyleCardConfig = {
  id: "coffee-break-box",
  backingSlug: "evening-unwind-gift-set",
  title: "Coffee Break Box",
  groupLabel: "Morning & Pause",
  includes: ["Ceramic coffee tumbler diffuser", "Rice husk coffee mug", "1 scented wax melt"],
  fields: [
    {
      id: "wax-blend",
      label: "Select wax blend",
      options: ["Cool Caramel", "Coffee Break", "Choco Dark"],
    },
  ],
  imageSrc: "/images/Evening Unwind Set.png",
  imageAlt: "Coffee Break Box styled with diffuser, mug, and warm studio-toned ritual accents.",
};

const unfoldRitualBox01: LifestyleCardConfig = {
  id: "unfold-ritual-box-01",
  backingSlug: "dawn-reset-box",
  title: "Unfold Ritual Box 01",
  groupLabel: "Personal Rituals",
  includes: ["Ritual oil perfume (15 ml)", "Dokra brooch", "Cotton cambric napkin"],
  fields: [
    {
      id: "brooch",
      label: "Choose your brooch",
      options: ["Japan handfan", "Bengal handfan"],
    },
  ],
  imageSrc: "/images/Seijaku Lifestyle img 1.png",
  imageAlt: "Unfold Ritual Box 01 composed with perfume, textile, and quiet metal detail.",
};

const listenRitualBox02: LifestyleCardConfig = {
  id: "listen-ritual-box-02",
  backingSlug: "reading-hour-set",
  title: "Listen Ritual Box 02",
  groupLabel: "Personal Rituals",
  includes: ["Ritual oil perfume (15 ml)", "Dokra conch brooch", "Cotton cambric napkin"],
  imageSrc: "/images/Seasonal Drop Raja-Kundo.jpg",
  imageAlt: "Listen Ritual Box 02 styled around a dokra conch and soft ritual textiles.",
};

const attuneRitualBox03: LifestyleCardConfig = {
  id: "attune-ritual-box-03",
  backingSlug: "evening-unwind-gift-set",
  title: "Attune Ritual Box 03",
  groupLabel: "Personal Rituals",
  includes: ["Ritual oil perfume (15 ml)", "Dokra temple bell brooch", "Cotton cambric napkin"],
  imageSrc: "/images/Seasonal Drop Rishi Chhatim.jpg",
  imageAlt: "Attune Ritual Box 03 arranged with a temple bell brooch and tactile ritual cloth.",
};

// Homepage "Featured Sets" preview is the Morning & Pause pair. Both cards
// have fully-static option lists, so this slice needs no product data and
// can stay a pure const export.
export const homepageFeaturedLifestyleItems: LifestyleCardConfig[] = [
  kolkataChaiCalmBox,
  coffeeBreakBox,
];

// Compose the full three-section layout given a live product list. Only the
// Live Calm Gift Pouch's dropdown options depend on the catalog; everything
// else is module-scope static.
export function buildLifestyleSections(products: ProductView[]): LifestyleSectionConfig[] {
  const liveCalmGiftPouch: LifestyleCardConfig = {
    id: "live-calm-gift-pouch",
    backingSlug: "dawn-reset-box",
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
    imageSrc: "/images/quiet-tea-ritual-box-lifestyle-neutral.png",
    imageAlt: "Live Calm Gift Pouch composed with fragrance, textile, and dokra gifting elements.",
  };

  return [
    {
      title: "Morning & Pause",
      items: [kolkataChaiCalmBox, coffeeBreakBox],
    },
    {
      title: "Personal Rituals",
      items: [unfoldRitualBox01, listenRitualBox02, attuneRitualBox03],
    },
    {
      title: "Gifting",
      items: [liveCalmGiftPouch],
    },
  ];
}
