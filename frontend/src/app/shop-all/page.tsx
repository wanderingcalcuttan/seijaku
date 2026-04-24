import { redirect } from "next/navigation";

import { canonicalShopRoutes } from "@/src/lib/shop-routes";

export default function LegacyShopAllPage() {
  redirect(canonicalShopRoutes.shopAll);
}
