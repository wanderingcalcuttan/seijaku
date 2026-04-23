import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import DiffusersPageClient from "@/src/components/shop/diffusers/DiffusersPageClient";
import LifestylePageClient from "@/src/components/shop/lifestyle/LifestylePageClient";
import PerfumesPageClient from "@/src/components/shop/perfumes/PerfumesPageClient";
import ShopBridgePageClient from "@/src/components/shop/ShopBridgePageClient";
import TextilesPageClient from "@/src/components/shop/textiles/TextilesPageClient";
import {
  canonicalBridgeSlugs,
  canonicalShopRoutes,
  getShopBridgePageBySlug,
  getShopBridgeProducts,
  type ShopBridgeSlug,
} from "@/src/lib/shopAllItems";

type ShopSlugPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return canonicalBridgeSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ShopSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getShopBridgePageBySlug(slug);

  if (!page) {
    return {
      title: "Shop | Seijaku",
    };
  }

  if (slug === "diffusers") {
    return {
      title: "Luxury Diffusers & Refillable Home Fragrance | Seijaku",
      description:
        "Explore Seijaku's handcrafted luxury diffusers with refillable fragrance oils and wax melts. Tea, coffee, cat, and bird nest inspired home fragrance rituals.",
    };
  }

  if (slug === "lifestyle") {
    return {
      title: "Luxury Ritual Sets & Curated Gifts | Seijaku",
      description:
        "Explore Seijaku's composed ritual sets for morning, pause, gifting, and everyday stillness, pairing fragrance, textiles, and handcrafted objects.",
    };
  }

  if (slug === "scarves-and-squares") {
    return {
      title: "Luxury Scarves & Pocket Squares in Modal Silk | Seijaku",
      description:
        "Explore Seijaku's luxury modal silk scarves and pocket squares, designed with quiet colour stories and fragrance pairings for refined daily ritual and gifting.",
    };
  }

  if (slug === "seasonaldrops") {
    return {
      title: "Seasonal Drops Archive | Seijaku",
      description:
        "Browse Seijaku's limited seasonal drops — Hemanta and future releases. Diffuser sets, ritual boxes, and place-led fragrance work that returns only through immersive gatherings.",
    };
  }

  return {
    title: `${page.navLabel} | Seijaku`,
    description: page.heroDescription.join(" "),
  };
}

export default async function ShopSlugPage({ params }: ShopSlugPageProps) {
  const { slug } = await params;
  const page = getShopBridgePageBySlug(slug);

  if (!page) {
    redirect(`${canonicalShopRoutes.shopAll}?item=${slug}`);
  }

  const products = getShopBridgeProducts(slug as ShopBridgeSlug);

  if (slug === "diffusers") {
    return (
      <Suspense fallback={null}>
        <DiffusersPageClient products={products} />
      </Suspense>
    );
  }

  if (slug === "perfumes") {
    return (
      <Suspense fallback={null}>
        <PerfumesPageClient page={page} products={products} />
      </Suspense>
    );
  }

  if (slug === "lifestyle") {
    return (
      <Suspense fallback={null}>
        <LifestylePageClient products={products} />
      </Suspense>
    );
  }

  if (slug === "scarves-and-squares") {
    return (
      <Suspense fallback={null}>
        <TextilesPageClient products={products} />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={null}>
      <ShopBridgePageClient page={page} products={products} />
    </Suspense>
  );
}
