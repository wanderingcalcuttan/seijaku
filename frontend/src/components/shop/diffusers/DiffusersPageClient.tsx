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

const sectionContent: Omit<DiffuserCategorySectionData, "product">[] = [
  {
    id: "tea-themed-diffusers",
    title: "Tea-Themed Diffusers",
    categoryLabel: "Tea-Themed Diffusers",
    description: "Tea-inspired forms for desks, reading corners, and smaller rooms.",
    variantLabel: "Choose fragrance oil",
    options: [
      "Lavender Green Fragrance Oil 15 ml",
      "Spearmint Fragrance Oil 15 ml",
      "Ginger Lime Fragrance Oil 15 ml",
      "Jasmine Fragrance Oil 15 ml",
      "Chamomile Fragrance Oil 15 ml",
    ],
    atmosphere: "Rooted in the memory of the clay bhaanr, this form brings warmth and a gentler domestic rhythm.",
  },
  {
    id: "coffee-themed-diffusers",
    title: "Coffee-Themed Diffusers",
    categoryLabel: "Coffee-Themed Diffusers",
    description: "Coffee-led diffuser forms for worktables, studio pauses, and slower afternoons.",
    variantLabel: "Choose wax melts",
    options: [
      "Coffee Break Wax Melts 50 gm",
      "Cool Caramel Wax Melts 50 gm",
      "Choco Dar Wax Melts 50 gm",
    ],
    atmosphere: "A warmer ritual object shaped around pause, focus, and the softened pace of a break.",
  },
  {
    id: "cat-diffusers",
    title: "Cat Diffusers",
    categoryLabel: "Cat Diffusers",
    description: "Terracotta cat forms that bring warmth and character to compact home spaces.",
    variantLabel: "Choose fragrance oil",
    options: [
      "Basmati Fragrance Oil 15 ml",
      "Gondhoraj Lime Fragrance Oil 15 ml",
      "Garam Masala Fragrance Oil 15 ml",
    ],
    atmosphere: "Playful in silhouette yet restrained in finish, these pieces keep the room light and considered.",
  },
  {
    id: "bird-nest-diffusers",
    title: "Bird Nest Diffusers",
    categoryLabel: "Bird Nest Diffusers",
    description: "Nest-inspired diffuser forms for restful corners and more reflective moments.",
    variantLabel: "Choose fragrance oil",
    options: [
      "Eucalyptus Fragrance Oil 15 ml",
      "Beli Flower Fragrance Oil 15 ml",
      "Jasmine Fragrance Oil 15 ml",
      "Rose Fragrance Oil 15 ml",
      "Sandalwood Fragrance Oil 15 ml",
    ],
    atmosphere: "Outdoor softness, quieter textures, and a calmer mood for spaces that ask for less noise.",
  },
];

const productOrder = [
  "stone-oil-diffuser",
  "brass-tea-light-diffuser",
  "reed-diffuser-cedar-smoke",
  "clay-vessel-diffuser",
] as const;

export default function DiffusersPageClient({ products }: DiffusersPageClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const selectedSlug = searchParams.get("item");

  const diffuserProductsBySlug = useMemo(() => new Map(products.map((product) => [product.slug, product])), [products]);

  const selectedProduct = selectedSlug ? diffuserProductsBySlug.get(selectedSlug) ?? null : null;

  const sections = useMemo(
    () =>
      sectionContent
        .map((section, index) => {
          const product = diffuserProductsBySlug.get(productOrder[index]);

          if (!product) {
            return null;
          }

          return {
            ...section,
            product,
          } satisfies DiffuserCategorySectionData;
        })
        .filter((section): section is DiffuserCategorySectionData => Boolean(section)),
    [diffuserProductsBySlug]
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
            href="#tea-themed-diffusers"
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

        <section className="section-primary pt-2 sm:pt-4">
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
