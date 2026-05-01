"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import ProductDetailDrawer from "@/src/components/shop/ProductDetailDrawer";
import { canonicalShopRoutes } from "@/src/lib/shop-routes";
import { type ProductView } from "@/src/lib/product-types";

import DiffuserCategorySection, { type DiffuserCategorySectionData } from "./DiffuserCategorySection";
import DiffuserPageIntro from "./DiffuserPageIntro";

type DiffusersPageClientProps = {
  products: ProductView[];
};

export default function DiffusersPageClient({ products }: DiffusersPageClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const selectedSlug = searchParams.get("item");

  const diffuserProductsBySlug = useMemo(() => new Map(products.map((product) => [product.slug, product])), [products]);

  const selectedProduct = selectedSlug ? diffuserProductsBySlug.get(selectedSlug) ?? null : null;

  const sections = useMemo<DiffuserCategorySectionData[]>(
    () =>
      products.map((product) => {
        const firstOption = product.customizationOptions?.[0];
        return {
          id: product.slug,
          title: product.title,
          categoryLabel: product.type,
          product,
          description: product.shortDescription ?? "",
          variantLabel: firstOption?.label,
          options: firstOption?.values,
          atmosphere: product.longDescription,
        };
      }),
    [products],
  );

  const updateQuery = (slug?: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (slug) {
      params.set("item", slug);
    } else {
      params.delete("item");
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <>
      <main className="min-h-screen bg-[#f3efe7] pt-[72px] text-[#3a3a3a] sm:pt-[76px]">
        <DiffuserPageIntro
          eyebrow="HOME FRAGRANCES"
          title="Diffusers for quiet corners and slower rituals"
          intro="Crafted for desks, reading nooks, entryways, and intimate rooms, Seijaku diffusers bring scent into the home with quiet presence. Each form is paired with refillable fragrance oils or wax melts for a slower, more intentional home ritual."
        >
          <Link
            href="#diffusers"
            className="inline-flex items-center justify-center rounded-full bg-[#294536] px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#f4efe8] transition-colors duration-200 hover:bg-[#21382c]"
          >
            Explore Diffusers
          </Link>
          <Link
            href={canonicalShopRoutes.shopAll}
            className="text-[11px] uppercase tracking-[0.2em] text-[#5b5247] underline decoration-black/10 underline-offset-4 transition-opacity duration-200 hover:opacity-70"
          >
            Shop All
          </Link>
        </DiffuserPageIntro>

        <section id="diffusers" className="section-primary pt-2 sm:pt-4 scroll-mt-[120px]" data-reveal>
          <div className="page-container max-w-[1200px]">
            <div className="space-y-1 border-t border-[rgba(79,71,63,0.08)] pt-8 sm:pt-10">
              {sections.map((section, index) => (
                <div key={section.id} className={index > 0 ? "border-t border-[rgba(79,71,63,0.06)]" : ""}>
                  <DiffuserCategorySection
                    section={section}
                    reverse={index % 2 === 1}
                    selectedOption={selectedVariants[section.product.slug] ?? ""}
                    onSelectOption={(value) =>
                      setSelectedVariants((current) => ({
                        ...current,
                        [section.product.slug]: value,
                      }))
                    }
                    onViewDetails={() => updateQuery(section.product.slug)}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-editorial pt-6 sm:pt-8">
          <div className="page-container max-w-[980px]">
            <div className="rounded-[28px] border border-[rgba(86,76,64,0.1)] bg-[linear-gradient(180deg,rgba(250,247,241,0.92)_0%,rgba(244,239,231,0.95)_100%)] px-6 py-8 sm:px-10 sm:py-10">
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#8a745e]">Editorial Note</p>
              <h2 className="mt-4 max-w-[16ch] text-[clamp(28px,3.4vw,40px)] leading-[1.08] tracking-[-0.02em] text-[#1b1714]">
                Refillable fragrance rituals for modern homes
              </h2>
              <p className="mt-5 max-w-[60ch] text-[15px] leading-[1.9] text-[#60584f]">
                Seijaku diffusers are crafted as artisanal home fragrance objects, pairing considered forms with refillable oils and wax melts. Choose a diffuser form that suits your space, then pair it with a quieter mood for a calmer way to scent smaller rooms with warmth, utility, and restraint.
              </p>
            </div>
          </div>
        </section>
      </main>

      <ProductDetailDrawer item={selectedProduct} isOpen={Boolean(selectedProduct)} onClose={() => updateQuery()} />
    </>
  );
}
