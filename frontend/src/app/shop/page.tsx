import { Suspense } from "react";

import ShopAllPageClient from "@/src/components/shop/ShopAllPageClient";
import { fetchProducts } from "@/src/lib/product-types";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const products = await fetchProducts();

  return (
    <Suspense fallback={null}>
      <ShopAllPageClient products={products} />
    </Suspense>
  );
}
