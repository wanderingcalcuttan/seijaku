"use client";

import Image from "next/image";

import type { ShopProduct } from "@/src/lib/shopAllItems";

import ShopProductActions from "../ShopProductActions";

export type LifestyleSetField = {
  id: string;
  label: string;
  options: string[];
};

type LifestyleSetCardProps = {
  item: ShopProduct;
  displayTitle: string;
  groupLabel: string;
  includes: string[];
  fields?: LifestyleSetField[];
  selectedValues: Record<string, string>;
  onSelectValue: (fieldId: string, value: string) => void;
  onViewDetails: () => void;
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
};

export default function LifestyleSetCard({
  item,
  displayTitle,
  groupLabel,
  includes,
  fields = [],
  selectedValues,
  onSelectValue,
  onViewDetails,
  imageSrc,
  imageAlt,
  className = "",
}: LifestyleSetCardProps) {
  const hasFields = fields.length > 0;
  const allSelected = fields.every((field) => Boolean(selectedValues[field.id]));
  const checkoutLabel = hasFields
    ? fields.map((field) => `${field.label}: ${selectedValues[field.id]}`).filter(Boolean).join(" | ")
    : null;

  return (
    <article className={`group flex h-full flex-col rounded-xl bg-[#f7f5f2] p-7 shadow-sm sm:p-9 ${className}`.trim()}>
      <div className="grid gap-7 xl:grid-cols-[minmax(0,220px)_minmax(0,1fr)] xl:items-start">
        <div className="rounded-[18px] border border-[rgba(86,76,64,0.05)] bg-[rgba(232,223,210,0.62)] p-3.5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[14px] bg-[#e4dacd]">
            <Image
              src={imageSrc ?? item.image}
              alt={imageAlt ?? item.imageAlt ?? displayTitle}
              fill
              sizes="(min-width: 1536px) 14vw, (min-width: 1024px) 24vw, 100vw"
              className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.01]"
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col items-start">
          <p className="text-[9px] uppercase tracking-[0.24em] text-[#8b775f]">{groupLabel}</p>
          <h3 className="mt-5 text-[29px] leading-[1.08] tracking-[-0.025em] text-[#1b1714]">{displayTitle}</h3>
          <div className="mt-7 w-full">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#7a7064]">Includes</p>
            <ul className="mt-4 space-y-2.5 text-[14px] leading-[1.95] text-[#5f574d]">
              {includes.map((entry) => (
                <li key={entry} className="flex gap-3">
                  <span className="mt-[0.78em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#7f6d5a]" aria-hidden="true" />
                  <span>{entry}</span>
                </li>
              ))}
            </ul>
          </div>

          {hasFields ? (
            <div className="mt-8 w-full space-y-4">
              {fields.map((field) => (
                <div key={field.id}>
                  <label
                    htmlFor={`${item.slug}-${field.id}`}
                    className="mb-2.5 block text-[10px] uppercase tracking-[0.18em] text-[#86796b]"
                  >
                    {field.label}
                  </label>
                  <select
                    id={`${item.slug}-${field.id}`}
                    value={selectedValues[field.id] ?? ""}
                    onChange={(event) => onSelectValue(field.id, event.target.value)}
                    className="w-full rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-[14px] text-[#3f3831] outline-none transition-colors focus:border-[#2e4a36] focus:ring-2 focus:ring-[#2e4a36]/10"
                  >
                    <option value="">Select an option</option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          ) : null}

          <ShopProductActions
            className="mt-9"
            item={item}
            onViewDetails={onViewDetails}
            isBuyDisabled={hasFields && !allSelected}
            selection={{
              label: checkoutLabel,
              options: selectedValues,
            }}
          />
          <p className="mt-7 text-[14px] leading-relaxed text-[#6b6258]">{item.priceLabel}</p>
        </div>
      </div>
    </article>
  );
}
