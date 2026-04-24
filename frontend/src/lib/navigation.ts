import { canonicalShopRoutes } from "@/src/lib/shop-routes";

export type NavItem = {
  label: string;
  href: string;
};

export type DrawerEntry = {
  label: string;
  href?: string;
  children?: NavItem[];
};

export type DrawerSection = {
  label: string;
  entries: DrawerEntry[];
};

export const primaryNavItems: NavItem[] = [
  { label: "Curated gifts", href: canonicalShopRoutes.lifestyle },
  { label: "Perfumes", href: canonicalShopRoutes.perfumes },
  { label: "Diffusers", href: canonicalShopRoutes.diffusers },
  { label: "Ornaments", href: canonicalShopRoutes.dokraOrnaments },
  { label: "Cloth", href: canonicalShopRoutes.scarvesAndSquares },
  { label: "Seasonal Drop", href: "/seasonaldrops-hemanta" },
];

export const drawerSections: DrawerSection[] = [
  {
    label: "By Type",
    entries: [
      {
        label: "Fragrances",
        children: [
          { label: "Body", href: canonicalShopRoutes.perfumes },
          { label: "Diffusers", href: canonicalShopRoutes.diffusers },
          { label: "Objects", href: canonicalShopRoutes.dokraOrnaments },
          { label: "Textiles", href: canonicalShopRoutes.scarvesAndSquares },
        ],
      },
      {
        label: "Gift Sets",
        children: [
          { label: "For Yourself", href: canonicalShopRoutes.lifestyle },
          { label: "For a Loved One", href: canonicalShopRoutes.lifestyle },
        ],
      },
      { label: "Dokra Ornaments", href: canonicalShopRoutes.dokraOrnaments },
      { label: "Home Objects: Diffusers", href: canonicalShopRoutes.diffusers },
      { label: "Scarves & Squares", href: canonicalShopRoutes.scarvesAndSquares },
      { label: "Shop All", href: canonicalShopRoutes.shopAll },
    ],
  },
  {
    label: "By Material",
    entries: [
      { label: "Oil-based Perfumes", href: canonicalShopRoutes.perfumes },
      { label: "Ethanol-based Perfumes", href: canonicalShopRoutes.perfumes },
      { label: "Clay & Stone", href: canonicalShopRoutes.diffusers },
      { label: "Dokra (Metal)", href: canonicalShopRoutes.dokraOrnaments },
      { label: "Handwoven textiles", href: canonicalShopRoutes.scarvesAndSquares },
      { label: "Printed textiles", href: canonicalShopRoutes.scarvesAndSquares },
    ],
  },
];
