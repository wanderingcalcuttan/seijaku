"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import ProductDetailDrawer from "@/src/components/shop/ProductDetailDrawer";
import { canonicalShopRoutes } from "@/src/lib/shopAllItems";
import { type ProductView } from "@/src/lib/product-types";

import LifestylePageIntro from "./LifestylePageIntro";
import LifestyleSetCard, { type LifestyleFieldValue } from "./LifestyleSetCard";
import { buildLifestyleSections } from "./lifestyleSetConfig";

type LifestylePageClientProps = {
  products: ProductView[];
};

export default function LifestylePageClient({ products }: LifestylePageClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  // Per-card field values: outer key = card id, inner key = field id, value is
  // string (SINGLE fields) or string[] (MULTI fields). See LifestyleSetCard.
  const [selectedValues, setSelectedValues] = useState<Record<string, Record<string, LifestyleFieldValue>>>({});
  const productsBySlug = useMemo(() => new Map(products.map((product) => [product.slug, product])), [products]);
  const selectedSlug = searchParams.get("item");
  const selectedProduct = selectedSlug ? productsBySlug.get(selectedSlug) ?? null : null;

  const lifestyleSections = useMemo(() => buildLifestyleSections(products), [products]);

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
      <main className="min-h-screen bg-[#f3efe7] px-6 pt-[72px] text-[#3a3a3a] sm:pt-[76px] md:px-12">
        <LifestylePageIntro
          title="Composed ritual sets for everyday calm"
          intro="Objects that shape quiet habits - morning, pause, and return."
          imageSrc="/images/Seijaku Lifestyle img 1.png"
          imageAlt="Seijaku ritual objects arranged as a composed lifestyle still life."
        >
          <Link
            href="#ritual-sets"
            className="inline-flex min-h-[42px] items-center justify-center rounded-full bg-[#294536] px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.22em] text-[#f4efe8] transition-colors duration-200 hover:bg-[#21382c]"
          >
            Explore Sets
          </Link>
          <Link
            href={canonicalShopRoutes.shopAll}
            className="text-[11px] uppercase tracking-[0.2em] text-[#4f473f] underline decoration-black/10 underline-offset-4 transition-opacity duration-200 hover:opacity-70"
          >
            Shop All
          </Link>
        </LifestylePageIntro>

        <section id="ritual-sets" className="mx-auto max-w-[1200px] pb-24 pt-8 sm:pb-28 sm:pt-10">
          <h2 className="mb-14 max-w-[16ch] text-[clamp(34px,4vw,50px)] leading-[1.08] tracking-[-0.025em] text-[#1b1714] sm:mb-16">
            Ritual sets for different moments of the day
          </h2>

          <div className="space-y-24 sm:space-y-28">
            {lifestyleSections.map((section) => {
              const cards = section.items
                .map((entry) => {
                  const item = productsBySlug.get(entry.backingSlug);
                  if (!item) return null;

                  return (
                    <div id={entry.id} key={entry.id} className="scroll-mt-[108px]">
                      <LifestyleSetCard
                        item={item}
                        displayTitle={entry.title}
                        groupLabel={entry.groupLabel}
                        includes={entry.includes}
                        fields={entry.fields}
                        selectedValues={selectedValues[entry.id] ?? {}}
                        onSelectValue={(fieldId, value) =>
                          setSelectedValues((current) => ({
                            ...current,
                            [entry.id]: {
                              ...(current[entry.id] ?? {}),
                              [fieldId]: value,
                            },
                          }))
                        }
                        onViewDetails={() => updateQuery(item.slug)}
                        imageSrc={entry.imageSrc}
                        imageAlt={entry.imageAlt}
                      />
                    </div>
                  );
                })
                .filter(Boolean);

              if (cards.length === 0) {
                return null;
              }

              const isPersonalRituals = section.title === "Personal Rituals";
              const isGifting = section.title === "Gifting";

              return (
                <section key={section.title} className="pt-2 sm:pt-4">
                  <div className="mb-10 max-w-[460px] sm:mb-12">
                    <h3 className="text-[clamp(24px,2.8vw,31px)] leading-[1.12] tracking-[-0.02em] text-[#1b1714]">
                      {section.title}
                    </h3>
                  </div>

                  {isPersonalRituals ? (
                    <div className="grid gap-12 md:grid-cols-2 2xl:grid-cols-3">{cards}</div>
                  ) : isGifting ? (
                    <div className="grid gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(300px,0.92fr)] lg:items-stretch">
                      <div>{cards[0]}</div>
                      <aside className="flex h-full flex-col justify-center rounded-[28px] bg-[linear-gradient(180deg,rgba(248,243,236,0.98)_0%,rgba(241,234,224,0.96)_100%)] px-7 py-10 shadow-sm sm:px-9 lg:px-10">
                        <p className="text-[10px] uppercase tracking-[0.26em] text-[#8b775f]">Custom gifting</p>
                        <h3 className="mt-5 max-w-[13ch] text-[clamp(28px,3.4vw,40px)] leading-[1.08] tracking-[-0.025em] text-[#1b1714]">
                          A composed gift, assembled with care
                        </h3>
                        <p className="mt-6 max-w-[34ch] text-[15px] leading-[1.9] text-[#5f574d]">
                          Choose a perfume, a textile, and a dokra form to shape a gift that feels personal, useful, and quietly distinctive.
                        </p>
                        <p className="mt-5 max-w-[32ch] text-[13px] leading-[1.85] text-[#756b60]">
                          Ideal for intimate gifting, festive gestures, and thoughtful keepsakes.
                        </p>
                      </aside>
                    </div>
                  ) : (
                    <div className="grid gap-12 lg:grid-cols-2">{cards}</div>
                  )}
                </section>
              );
            })}
          </div>
        </section>

        <section className="mx-auto mb-24 max-w-[1200px] rounded-[30px] bg-[linear-gradient(180deg,rgba(244,238,229,0.98)_0%,rgba(238,231,220,0.98)_100%)] px-7 py-16 sm:px-10 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-center lg:gap-14">
            <div className="max-w-[600px]">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#8a745e]">Editorial</p>
              <h2 className="mt-5 max-w-[14ch] text-[clamp(32px,4vw,46px)] leading-[1.08] tracking-[-0.025em] text-[#1b1714]">
                From object to daily practice
              </h2>
              <p className="mt-6 max-w-[42ch] text-[16px] leading-[1.9] text-[#60584f]">
                Each set is designed to become a small, repeatable ritual - shaping how you begin, pause, and return.
              </p>
              <p className="mt-5 text-[14px] leading-[1.9] text-[#746c62]">
                Dates for upcoming guided programs to be announced soon.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center lg:justify-start">
                <Link
                  href="/ritual"
                  className="text-[12px] uppercase tracking-[0.2em] text-[#2e4a36] underline decoration-black/10 underline-offset-4 transition-opacity duration-200 hover:opacity-70"
                >
                  Start a Daily Ritual &rarr;
                </Link>
                <Link
                  href="/seasonaldrops-hemanta"
                  className="inline-flex min-h-[42px] items-center justify-center rounded-full bg-[#294536] px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.22em] text-[#f4efe8] transition-colors duration-200 hover:bg-[#21382c]"
                >
                  Explore Seasonal Drop
                </Link>
              </div>
            </div>

            <div className="min-h-[300px] rounded-[26px] border border-[rgba(86,76,64,0.05)] bg-[linear-gradient(180deg,rgba(250,247,241,0.68)_0%,rgba(241,233,223,0.88)_100%)] shadow-sm" />
          </div>
        </section>
      </main>

      <ProductDetailDrawer item={selectedProduct} isOpen={Boolean(selectedProduct)} onClose={() => updateQuery()} />
    </>
  );
}

