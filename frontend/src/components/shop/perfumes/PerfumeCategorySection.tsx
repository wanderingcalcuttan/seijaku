import type { ProductView } from "@/src/lib/product-types";

import PerfumeProductSlider from "./PerfumeProductSlider";

export type PerfumeSubGroup = {
  title: string;
  description?: string;
  products: ProductView[];
};

type PerfumeCategorySectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  categoryLabel: string;
  closingQuote?: string;
  products?: ProductView[];
  subGroups?: PerfumeSubGroup[];
  onViewDetails: (slug: string) => void;
};

export default function PerfumeCategorySection({
  id,
  eyebrow,
  title,
  description,
  categoryLabel,
  closingQuote,
  products,
  subGroups,
  onViewDetails,
}: PerfumeCategorySectionProps) {
  return (
    <section id={id} className="scroll-mt-[120px] py-10 sm:py-14 lg:py-16">
      <div className="page-container max-w-[1200px]">
        <div className="max-w-[560px]">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#8a745e]">{eyebrow}</p>
          <h2 className="mt-4 text-[clamp(28px,3.4vw,40px)] leading-[1.08] tracking-[-0.025em] text-[#1b1714]">
            {title}
          </h2>
          <p className="mt-4 max-w-[52ch] text-[15px] leading-[1.85] text-[#60584f]">{description}</p>
        </div>

        {products && products.length > 0 ? (
          <div className="mt-10">
            <PerfumeProductSlider
              products={products}
              categoryLabel={categoryLabel}
              onViewDetails={onViewDetails}
            />
          </div>
        ) : null}

        {subGroups?.map((group) => (
          <div key={group.title} className="mt-12 first-of-type:mt-10">
            <div className="max-w-[520px]">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#9a785d]">Section</p>
              <h3 className="mt-2 font-serif text-[24px] leading-[1.14] tracking-[-0.02em] text-[#1e1915] sm:text-[26px]">
                {group.title}
              </h3>
              {group.description ? (
                <p className="mt-2 text-[14px] leading-[1.85] text-[#635a50]">{group.description}</p>
              ) : null}
            </div>
            <div className="mt-6">
              <PerfumeProductSlider
                products={group.products}
                categoryLabel={categoryLabel}
                onViewDetails={onViewDetails}
              />
            </div>
          </div>
        ))}

        {closingQuote ? (
          <p className="mx-auto mt-12 max-w-[720px] text-center font-serif text-[22px] leading-[1.45] tracking-[-0.02em] text-[#746b60] sm:text-[26px]">
            {closingQuote}
          </p>
        ) : null}
      </div>
    </section>
  );
}
