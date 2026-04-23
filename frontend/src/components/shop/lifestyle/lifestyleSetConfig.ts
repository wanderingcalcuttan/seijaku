import {
  isNotifyMeProduct,
  isUnbuyableProduct,
  shopProducts,
  type ShopBridgeSlug,
  type ShopProduct,
} from "@/src/lib/shopAllItems";

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

// Pull option lists out of `shopProducts` at module load. Filters out products
// that can't be bought right now (Sold Out / Upcoming / Waitlist) so the
// Live Calm Pouch dropdowns only surface items customers can actually gift.
// Sorted alphabetically for a stable picker order as the catalogue grows.
function buyableTitlesByBridge(bridge: ShopBridgeSlug): string[] {
  return shopProducts
    .filter((product): product is ShopProduct & { bridgeCategory: ShopBridgeSlug } =>
      product.bridgeCategory === bridge && !isUnbuyableProduct(product) && !isNotifyMeProduct(product),
    )
    .map((product) => product.title)
    .sort((a, b) => a.localeCompare(b));
}

const livePouchPerfumeOptions = buyableTitlesByBridge("perfumes");
const livePouchTextileOptions = buyableTitlesByBridge("scarves-and-squares");
const livePouchBroochOptions = buyableTitlesByBridge("dokra-ornaments");

export const lifestyleSections: LifestyleSectionConfig[] = [
  {
    title: "Morning & Pause",
    items: [
      {
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
      },
      {
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
      },
    ],
  },
  {
    title: "Personal Rituals",
    items: [
      {
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
      },
      {
        id: "listen-ritual-box-02",
        backingSlug: "reading-hour-set",
        title: "Listen Ritual Box 02",
        groupLabel: "Personal Rituals",
        includes: ["Ritual oil perfume (15 ml)", "Dokra conch brooch", "Cotton cambric napkin"],
        imageSrc: "/images/Seasonal Drop Raja-Kundo.jpg",
        imageAlt: "Listen Ritual Box 02 styled around a dokra conch and soft ritual textiles.",
      },
      {
        id: "attune-ritual-box-03",
        backingSlug: "evening-unwind-gift-set",
        title: "Attune Ritual Box 03",
        groupLabel: "Personal Rituals",
        includes: ["Ritual oil perfume (15 ml)", "Dokra temple bell brooch", "Cotton cambric napkin"],
        imageSrc: "/images/Seasonal Drop Rishi Chhatim.jpg",
        imageAlt: "Attune Ritual Box 03 arranged with a temple bell brooch and tactile ritual cloth.",
      },
    ],
  },
  {
    title: "Gifting",
    items: [
      {
        // Live Calm Gift Pouch pulls its dropdown options directly from
        // shopProducts (perfumes / scarves-and-squares / dokra-ornaments
        // bridges), excluding unbuyable (Sold Out / Upcoming / Waitlist)
        // products. As the catalogue grows, this picker auto-updates —
        // no edit to this config needed when a new perfume ships.
        id: "live-calm-gift-pouch",
        backingSlug: "dawn-reset-box",
        title: "Live Calm Gift Pouch",
        groupLabel: "Gifting",
        includes: ["Choose your perfume", "Choose your textile", "Choose your brooch"],
        fields: [
          {
            id: "perfume",
            label: "Choose your perfume",
            options: livePouchPerfumeOptions,
          },
          {
            id: "textile",
            label: "Choose your textile",
            options: livePouchTextileOptions,
          },
          {
            id: "brooch",
            label: "Choose your brooch",
            options: livePouchBroochOptions,
          },
        ],
        imageSrc: "/images/quiet-tea-ritual-box-lifestyle-neutral.png",
        imageAlt: "Live Calm Gift Pouch composed with fragrance, textile, and dokra gifting elements.",
      },
    ],
  },
];

export const homepageFeaturedLifestyleItems = lifestyleSections[0].items;
