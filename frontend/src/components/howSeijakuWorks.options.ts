// Content driving the "How Seijaku works" section on the home page.
//
// ──────────────────────────────────────────────────────────────────────────────
// HOW TO ADD A NEW OPTION TO A DROPDOWN
// ──────────────────────────────────────────────────────────────────────────────
// 1. Open this file.
// 2. Find the step you want to extend — "Choose a scent" or "Choose an artifact".
// 3. Append a new entry to its `items` array with the shape:
//        { label, href, thumbnail, alt }
//    - label:     text shown on the dropdown row (keep short, ~40 chars)
//    - href:      destination on click (e.g. "/shop/<slug>" or a category route)
//    - thumbnail: image path; either a "/images/..." path or the helper
//                 `getShopProductBySlug("<slug>")?.image ?? "/images/fallback.png"`
//                 when the option maps to a real product in shopAllItems.ts
//    - alt:       screen-reader text for the thumbnail
//
// No other files need to change. Save, and the new row appears immediately.
//
// Step 3 ("Ritual" card with the video link) lives inline in
// HowSeijakuWorks.tsx — it's a single editorial link, not a dropdown.
// ──────────────────────────────────────────────────────────────────────────────

import { canonicalShopRoutes, getShopProductBySlug } from "@/src/lib/shopAllItems";

export type HowSeijakuWorksItem = {
  label: string;
  href: string;
  thumbnail: string;
  alt: string;
};

export type HowSeijakuWorksStep = {
  number: string;
  title: string;
  image: string;
  alt: string;
  panelTitle: string;
  items: HowSeijakuWorksItem[];
};

export const howSeijakuWorksSteps: HowSeijakuWorksStep[] = [
  {
    number: "01",
    title: "Choose a scent",
    image: "/images/Quiet Tea Ritual Box_lifestyle.JPG",
    alt: "Perfume ritual box and scent objects",
    panelTitle: "Curated scents",
    items: [
      {
        label: "Jasmine x Neroli Oil Blend - 15 ml",
        href: "/shop/jasmine-neroli-textile-oil",
        thumbnail: getShopProductBySlug("jasmine-neroli-textile-oil")?.image ?? "/images/Seijaku section img 1.png",
        alt: "Jasmine x Neroli oil blend",
      },
      {
        label: "Breath of Pines Perfume - 50 ml",
        href: "/shop/spirit-01-breath-of-pines",
        thumbnail: getShopProductBySlug("spirit-01-breath-of-pines")?.image ?? "/images/hero banner HP 1.png",
        alt: "Breath of Pines perfume",
      },
      {
        label: "Spearmint Fragrance Oil - 15 ml",
        href: canonicalShopRoutes.perfumes,
        thumbnail: "/images/Quiet Tea Ritual Box_lifestyle.JPG",
        alt: "Spearmint fragrance oil placeholder",
      },
    ],
  },
  {
    number: "02",
    title: "Choose an artifact",
    image: "/images/Seijaku section img 1.png",
    alt: "Handcrafted Seijaku artifact",
    panelTitle: "Curated objects",
    items: [
      {
        label: "Japanese Handfan Brooch",
        href: "/shop/japan-handfan-brooch",
        thumbnail: getShopProductBySlug("japan-handfan-brooch")?.image ?? "/images/japanese fan hero Our Story.png",
        alt: "Japanese Handfan Brooch",
      },
      {
        label: "Black Kitty Terracotta Diffuser",
        href: "/shop/reed-diffuser-cedar-smoke",
        thumbnail: getShopProductBySlug("reed-diffuser-cedar-smoke")?.image ?? "/images/our-story-hero-banner.png",
        alt: "Black Kitty Terracotta Diffuser",
      },
      {
        label: "Kolkata Summer Head Scarf",
        href: "/shop/kolkata-summer-modal-silk-scarf",
        thumbnail: getShopProductBySlug("kolkata-summer-modal-silk-scarf")?.image ?? "/images/Seijaku section img 1.png",
        alt: "Kolkata Summer Head Scarf",
      },
    ],
  },
];
