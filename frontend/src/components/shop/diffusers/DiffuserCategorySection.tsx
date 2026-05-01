import type { ProductView } from "@/src/lib/product-types";

import DiffuserProductCard from "./DiffuserProductCard";

export type DiffuserCategorySectionData = {
  id: string;
  title: string;
  categoryLabel: string;
  product: ProductView;
  description: string;
  variantLabel?: string;
  options?: string[];
};

type DiffuserCategorySectionProps = {
  section: DiffuserCategorySectionData;
  selectedOption: string;
  onSelectOption: (value: string) => void;
  onViewDetails: () => void;
  reverse?: boolean;
};

export default function DiffuserCategorySection({
  section,
  selectedOption,
  onSelectOption,
  onViewDetails,
  reverse = false,
}: DiffuserCategorySectionProps) {
  return (
    <section id={section.id} className="py-10 sm:py-14 lg:py-16">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center lg:gap-12 xl:grid-cols-[minmax(0,1fr)_440px] xl:gap-16">
        <div className={reverse ? "lg:order-2 lg:pl-4" : "lg:pr-4"}>
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#8a745e]">{section.categoryLabel}</p>
          <h2 className="mt-4 max-w-[13ch] text-[clamp(30px,3.4vw,42px)] leading-[1.08] tracking-[-0.025em] text-[#1b1714]">
            {section.title}
          </h2>
          <p className="mt-4 max-w-[40ch] text-[15px] leading-[1.9] text-[#60584f]">{section.description}</p>
        </div>

        <div className={reverse ? "lg:order-1" : ""}>
          <DiffuserProductCard
            item={section.product}
            categoryLabel={section.categoryLabel}
            description={section.description}
            variantLabel={section.variantLabel}
            options={section.options}
            selectedOption={selectedOption}
            onSelectOption={onSelectOption}
            onViewDetails={onViewDetails}
          />
        </div>
      </div>
    </section>
  );
}
