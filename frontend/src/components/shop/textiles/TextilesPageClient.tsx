"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import ProductDetailDrawer from "@/src/components/shop/ProductDetailDrawer";
import { canonicalShopRoutes } from "@/src/lib/shopAllItems";
import { type ProductView } from "@/src/lib/product-types";

import TextileCategorySection, { type TextileDisplayItem } from "./TextileCategorySection";
import TextilesPageIntro from "./TextilesPageIntro";

type TextilesPageClientProps = {
  products: ProductView[];
};

const scarfSlugs = [
  "bengal-japan-modal-silk-scarf",
  "pine-forest-modal-silk-scarf",
  "kolkata-summer-modal-silk-scarf",
  "coffee-clear-modal-silk-scarf",
] as const;

const pocketSquareSlugs = [
  "bengal-japan-modal-silk-pocket-square",
  "pine-forest-modal-silk-pocket-square",
  "kolkata-summer-modal-silk-pocket-square",
  "coffee-clear-modal-silk-pocket-square",
] as const;

const colourOptions = ["Forest Green", "Red Earth"];
const breathOfPinesHref = `${canonicalShopRoutes.perfumes}?item=spirit-01-breath-of-pines`;
const summerHeldCloseHref = `${canonicalShopRoutes.perfumes}?item=body-01-summer-held-close`;
const morningDeskHref = `${canonicalShopRoutes.perfumes}?item=mind-01-the-morning-desk`;

export default function TextilesPageClient({ products }: TextilesPageClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const selectedSlug = searchParams.get("item");

  const productsBySlug = useMemo(() => new Map(products.map((product) => [product.slug, product])), [products]);

  const selectedProduct = selectedSlug ? productsBySlug.get(selectedSlug) ?? null : null;

  const scarves = useMemo<TextileDisplayItem[]>(() => {
    const items: TextileDisplayItem[] = [];

    for (const slug of scarfSlugs) {
      const product = productsBySlug.get(slug);
      if (!product) continue;

      if (slug === "bengal-japan-modal-silk-scarf") {
        items.push({
          product,
          description:
            "A modal silk scarf composed in forest green and red earth tones, expressing a quiet dialogue between Bengal craft sensibility and Japanese restraint.",
          selectorLabel: "Choose colour",
          selectorOptions: colourOptions,
        });
        continue;
      }

      if (slug === "pine-forest-modal-silk-scarf") {
        items.push({
          product,
          description: "A softened modal silk scarf inspired by pine shade, quiet air, and contemplative movement.",
          pairingLabel: "Suggested pairing: Breath of Pines Perfume",
          pairingHref: breathOfPinesHref,
        });
        continue;
      }

      if (slug === "kolkata-summer-modal-silk-scarf") {
        items.push({
          product,
          description:
            "A modal silk scarf shaped by warm light, city softness, and the gentle brightness of an Indian summer.",
          pairingLabel: "Suggested pairing: Summer, Held Close Perfume",
          pairingHref: summerHeldCloseHref,
        });
        continue;
      }

      items.push({
        product,
        description:
          "A calm, modern modal silk scarf with a grounded palette suited to desks, early hours, and quiet momentum.",
        pairingLabel: "Suggested pairing: The Morning Desk Perfume",
        pairingHref: morningDeskHref,
      });
    }

    return items;
  }, [productsBySlug]);

  const pocketSquares = useMemo<TextileDisplayItem[]>(() => {
    const items: TextileDisplayItem[] = [];

    for (const slug of pocketSquareSlugs) {
      const product = productsBySlug.get(slug);
      if (!product) continue;

      if (slug === "bengal-japan-modal-silk-pocket-square") {
        items.push({
          product,
          description:
            "A modal silk pocket square in forest green and red earth, designed as a compact expression of cross-cultural textile quietness.",
          selectorLabel: "Choose colour",
          selectorOptions: colourOptions,
        });
        continue;
      }

      if (slug === "pine-forest-modal-silk-pocket-square") {
        items.push({
          product,
          description:
            "A modal silk pocket square carrying a cool, wooded calm for formalwear, gifting, and everyday detail.",
          pairingLabel: "Suggested pairing: Breath of Pines Perfume",
          pairingHref: breathOfPinesHref,
        });
        continue;
      }

      if (slug === "kolkata-summer-modal-silk-pocket-square") {
        items.push({
          product,
          description:
            "A lighter, sun-touched modal silk pocket square inspired by summer air, movement, and lived warmth.",
          pairingLabel: "Suggested pairing: Summer, Held Close Perfume",
          pairingHref: summerHeldCloseHref,
        });
        continue;
      }

      items.push({
        product,
        description:
          "A grounded, elegant modal silk pocket square suited to work rituals, gifting, and subtle evening dressing.",
        pairingLabel: "Suggested pairing: The Morning Desk Perfume",
        pairingHref: morningDeskHref,
      });
    }

    return items;
  }, [productsBySlug]);

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
        <TextilesPageIntro
          eyebrow="TEXTILES IN RITUAL"
          title="Scarves and pocket squares shaped by colour, texture, and quiet ritual"
          intro="These modal silk textiles carry colour, gesture, and a softened trace of scent."
          secondaryIntro="Designed for work, travel, gifting, and everyday refinement."
        >
          <Link
            href="#scarves"
            className="inline-flex min-h-[42px] items-center justify-center rounded-full bg-[#294536] px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.22em] text-[#f4efe8] transition-colors duration-200 hover:bg-[#21382c]"
          >
            Explore Textiles
          </Link>
          <Link
            href={canonicalShopRoutes.shopAll}
            className="text-[11px] uppercase tracking-[0.2em] text-[#4f473f] underline decoration-black/10 underline-offset-4 transition-opacity duration-200 hover:opacity-70"
          >
            Shop All
          </Link>
        </TextilesPageIntro>

        <section className="section-primary pt-2 sm:pt-4">
          <div className="page-container max-w-[1200px]">
            <p className="max-w-[58ch] text-[14px] leading-[1.9] text-[#5f574d]">
              These textiles are arranged by form and use, with scarves for drape and daily wear and pocket squares for detail and gifting, alongside colour stories that sit naturally beside Seijaku fragrances.
            </p>

            <TextileCategorySection
              id="scarves"
              title="Scarves"
              intro="For drape, softness, and everyday ritual dressing."
              items={scarves}
              selectedOptions={selectedOptions}
              onSelectOption={(slug, value) =>
                setSelectedOptions((current) => ({
                  ...current,
                  [slug]: value,
                }))
              }
              onViewDetails={updateQuery}
            />

            <div className="border-t border-[rgba(79,71,63,0.05)] pt-2 sm:pt-4">
              <TextileCategorySection
                id="pocket-squares"
                title="Pocket Squares"
                intro="For detail, occasion, gifting, and small gestures of refinement."
                items={pocketSquares}
                selectedOptions={selectedOptions}
                onSelectOption={(slug, value) =>
                  setSelectedOptions((current) => ({
                    ...current,
                    [slug]: value,
                  }))
                }
                onViewDetails={updateQuery}
              />
            </div>
          </div>
        </section>

        <section className="section-editorial pt-6 sm:pt-8">
          <div className="page-container max-w-[980px]">
            <div className="rounded-[30px] border border-[rgba(86,76,64,0.08)] bg-[linear-gradient(180deg,rgba(250,247,241,0.92)_0%,rgba(244,239,231,0.96)_100%)] px-7 py-9 sm:px-10 sm:py-11">
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#8a745e]">Editorial Note</p>
              <h2 className="mt-4 max-w-[16ch] text-[clamp(28px,3.4vw,40px)] leading-[1.08] tracking-[-0.02em] text-[#1b1714]">
                Textiles designed for quiet gifting and personal ritual
              </h2>
              <p className="mt-5 max-w-[54ch] text-[15px] leading-[1.95] text-[#60584f]">
                Seijaku luxury scarves and modal silk pocket squares are shaped through considered colour, tactile drape, and fragrance pairing, creating artisanal textiles that move easily between refined gifting, daily wear, and quieter personal ritual.
              </p>
            </div>
          </div>
        </section>
      </main>

      <ProductDetailDrawer item={selectedProduct} isOpen={Boolean(selectedProduct)} onClose={() => updateQuery()} />
    </>
  );
}
