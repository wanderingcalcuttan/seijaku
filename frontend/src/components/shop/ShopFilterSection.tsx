"use client";

type ShopFilterSectionProps<T extends string> = {
  title: string;
  options: readonly T[];
  value: T | "All";
  onChange: (value: T | "All") => void;
  includeAll?: boolean;
  allLabel?: string;
  idPrefix: string;
};

export default function ShopFilterSection<T extends string>({
  title,
  options,
  value,
  onChange,
  includeAll = true,
  allLabel = "All",
  idPrefix,
}: ShopFilterSectionProps<T>) {
  const headingId = `${idPrefix}-label`;
  const entries: Array<{ key: string; label: string; selected: boolean; select: () => void }> = [];

  if (includeAll) {
    entries.push({
      key: "All",
      label: allLabel,
      selected: value === "All",
      select: () => onChange("All"),
    });
  }

  for (const option of options) {
    entries.push({
      key: option,
      label: option,
      selected: value === option,
      select: () => onChange(option),
    });
  }

  return (
    <section aria-labelledby={headingId}>
      <p id={headingId} className="text-[10px] uppercase tracking-[0.28em] text-[#7b7064]">
        {title}
      </p>
      <div role="radiogroup" aria-labelledby={headingId} className="mt-3 flex flex-wrap gap-2">
        {entries.map((entry) => (
          <button
            key={entry.key}
            type="button"
            role="radio"
            aria-checked={entry.selected}
            onClick={entry.select}
            className={`rounded-full border px-3.5 py-2 text-[10px] uppercase tracking-[0.16em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8c7b68] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3efe7] ${
              entry.selected
                ? "border-[#2e4a36] bg-[#2e4a36] text-[#f4efe8]"
                : "border-[rgba(111,100,86,0.14)] bg-[rgba(251,247,240,0.96)] text-[#5a5148] hover:border-[rgba(96,86,74,0.22)] hover:bg-[#f8f2e9]"
            }`}
          >
            {entry.label}
          </button>
        ))}
      </div>
    </section>
  );
}
