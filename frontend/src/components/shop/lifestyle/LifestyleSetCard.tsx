"use client";

import Image from "next/image";

import type { ProductView } from "@/src/lib/product-types";

import ShopProductActions from "../ShopProductActions";

export type LifestyleSetField = {
  id: string;
  label: string;
  options: string[];
  // Optional multi-select. Defaults to SINGLE (a `<select>` dropdown) when
  // omitted. When set to "MULTI", the card renders a checkbox list capped at
  // `maxSelections` and gates Buy Now until `minSelections` are checked.
  selectionMode?: "SINGLE" | "MULTI";
  minSelections?: number;
  maxSelections?: number;
};

// A field's selected value: string for SINGLE, string[] for MULTI.
export type LifestyleFieldValue = string | string[];

type LifestyleSetCardProps = {
  item: ProductView;
  displayTitle: string;
  groupLabel: string;
  includes: string[];
  fields?: LifestyleSetField[];
  selectedValues: Record<string, LifestyleFieldValue>;
  onSelectValue: (fieldId: string, value: LifestyleFieldValue) => void;
  onViewDetails: () => void;
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
};

function asArray(value: LifestyleFieldValue | undefined): string[] {
  if (Array.isArray(value)) return value;
  return [];
}

function asString(value: LifestyleFieldValue | undefined): string {
  if (typeof value === "string") return value;
  return "";
}

function fieldSatisfied(field: LifestyleSetField, raw: LifestyleFieldValue | undefined) {
  if (field.selectionMode === "MULTI") {
    const current = asArray(raw);
    const min = field.minSelections ?? 1;
    return current.length >= min;
  }
  return Boolean(asString(raw));
}

function formatFieldLabel(field: LifestyleSetField, raw: LifestyleFieldValue | undefined): string {
  if (field.selectionMode === "MULTI") {
    const current = asArray(raw);
    if (current.length === 0) return "";
    return `${field.label}: ${current.join(", ")}`;
  }
  const value = asString(raw);
  return value ? `${field.label}: ${value}` : "";
}

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
  const allSatisfied = fields.every((field) => fieldSatisfied(field, selectedValues[field.id]));
  const checkoutLabel = hasFields
    ? fields
        .map((field) => formatFieldLabel(field, selectedValues[field.id]))
        .filter(Boolean)
        .join(" | ")
    : null;
  const checkoutOptions: Record<string, string> = {};
  for (const field of fields) {
    const raw = selectedValues[field.id];
    if (field.selectionMode === "MULTI") {
      const current = asArray(raw);
      if (current.length > 0) {
        checkoutOptions[field.label] = current.join(", ");
      }
    } else {
      const value = asString(raw);
      if (value) {
        checkoutOptions[field.label] = value;
      }
    }
  }

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
            <div className="mt-8 w-full space-y-5">
              {fields.map((field) => {
                if (field.selectionMode === "MULTI") {
                  const current = asArray(selectedValues[field.id]);
                  const min = field.minSelections ?? 1;
                  const max = field.maxSelections;
                  const capReached = max !== undefined && current.length >= max;
                  return (
                    <fieldset key={field.id} className="w-full">
                      <legend className="mb-2.5 block text-[10px] uppercase tracking-[0.18em] text-[#86796b]">
                        {field.label}
                      </legend>
                      <div className="space-y-2">
                        {field.options.map((option) => {
                          const checked = current.includes(option);
                          const disableForCap = !checked && capReached;
                          return (
                            <label
                              key={option}
                              className={`flex cursor-pointer items-center gap-3 rounded-md border px-3.5 py-2.5 text-[14px] transition-colors ${
                                checked
                                  ? "border-[#2e4a36] bg-[#eef4ef] text-[#2b3f32]"
                                  : disableForCap
                                    ? "cursor-not-allowed border-neutral-200 bg-white/60 text-[#9a9289]"
                                    : "border-neutral-300 bg-white text-[#3f3831] hover:border-[#b3a895]"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                disabled={disableForCap}
                                onChange={() => {
                                  const next = checked
                                    ? current.filter((entry) => entry !== option)
                                    : [...current, option];
                                  onSelectValue(field.id, next);
                                }}
                                className="h-4 w-4 accent-[#2e4a36]"
                              />
                              <span>{option}</span>
                            </label>
                          );
                        })}
                      </div>
                      <p className="mt-2 text-[11px] leading-[1.6] text-[#85796b]">
                        {max !== undefined && max === min
                          ? `Pick exactly ${min}.`
                          : `Pick at least ${min}${max !== undefined ? ` (max ${max})` : ""}.`}
                        {current.length > 0 ? ` Selected: ${current.length}.` : null}
                      </p>
                    </fieldset>
                  );
                }

                const selectValue = asString(selectedValues[field.id]);
                return (
                  <div key={field.id}>
                    <label
                      htmlFor={`${item.slug}-${field.id}`}
                      className="mb-2.5 block text-[10px] uppercase tracking-[0.18em] text-[#86796b]"
                    >
                      {field.label}
                    </label>
                    <select
                      id={`${item.slug}-${field.id}`}
                      value={selectValue}
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
                );
              })}
            </div>
          ) : null}

          <ShopProductActions
            className="mt-9"
            item={item}
            onViewDetails={onViewDetails}
            isBuyDisabled={hasFields && !allSatisfied}
            selection={{
              label: checkoutLabel,
              options: checkoutOptions,
            }}
          />
          <p className="mt-7 text-[14px] leading-relaxed text-[#6b6258]">{item.priceLabel}</p>
        </div>
      </div>
    </article>
  );
}
