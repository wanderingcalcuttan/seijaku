import { fetchBridgePage } from "@/src/lib/bridge-page-types";
import { fetchProductBySlug, type ProductView } from "@/src/lib/product-types";

import SeasonalDropsPage from "./SeasonalDropsPage";

export const dynamic = "force-dynamic";

// Canonical Hemanta-collection slugs. These are the four products driving
// the Reserve cards on /seasonaldrops-hemanta. Renaming any of them must
// happen in lockstep with the matching `slug` field on the form entries
// in SeasonalDropsPage.tsx — see Decision #24.
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
