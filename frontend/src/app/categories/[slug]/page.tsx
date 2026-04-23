import { redirect } from "next/navigation";

import { canonicalShopRoutes } from "@/src/lib/shopAllItems";
import { canonicalBridgeSlugs } from "@/src/lib/bridge-page-types";

type LegacyCategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function LegacyCategoryPage({ params }: LegacyCategoryPageProps) {
  const { slug } = await params;

  if (canonicalBridgeSlugs.includes(slug as (typeof canonicalBridgeSlugs)[number])) {
    redirect(`/shop/${slug}`);
  }

  redirect(canonicalShopRoutes.shopAll);
}
