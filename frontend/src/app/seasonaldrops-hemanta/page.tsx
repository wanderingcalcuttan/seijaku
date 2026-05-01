import { fetchBridgePage } from "@/src/lib/bridge-page-types";
import { fetchProductBySlug, type ProductView } from "@/src/lib/product-types";

import SeasonalDropsPage from "./SeasonalDropsPage";

export const dynamic = "force-dynamic";

const HEMANTA_SLUGS = [
  "hemanta-nandini",
  "hemanta-raja-diffuser",
  "hemanta-ispani",
  "hemanta-rishi-diffuser",
] as const;

export default async function Page() {
  const [bridge, ...resolved] = await Promise.all([
    fetchBridgePage("seasonaldrops-hemanta"),
    ...HEMANTA_SLUGS.map(fetchProductBySlug),
  ]);
  const productsBySlug: Record<string, ProductView> = {};
  HEMANTA_SLUGS.forEach((slug, i) => {
    const view = resolved[i];
    if (view) productsBySlug[slug] = view;
  });

  return <SeasonalDropsPage productsBySlug={productsBySlug} bridge={bridge ?? null} />;
}
