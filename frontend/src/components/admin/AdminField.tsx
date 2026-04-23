type AdminFieldProps = {
  label: string;
  children: React.ReactNode;
  hint?: string;
  // Optional per-field error message rendered as red sub-text below the input.
  // Used by server-side Zod errors surfaced through `issues.fieldErrors`.
  error?: string | null;
};

export function AdminField({ label, children, hint, error }: AdminFieldProps) {
  return (
    <label className="block space-y-2">
      <span className="block text-[11px] font-medium uppercase tracking-[0.18em] text-[#6a5d50]">{label}</span>
      {children}
      {error ? (
        <span className="block text-[12px] leading-[1.65] text-[#9f4332]" role="alert">
          {error}
        </span>
      ) : hint ? (
        <span className="block text-[12px] leading-[1.7] text-[#8a8075]">{hint}</span>
      ) : null}
    </label>
  );
}

export const adminInputClassName =
  "w-full rounded-2xl border border-[#d7cec1] bg-white px-4 py-3 text-[14px] text-[#2f2a26] outline-none transition focus:border-[#365b3f] focus:ring-2 focus:ring-[#365b3f]/15";

export const adminTextareaClassName =
  "w-full rounded-2xl border border-[#d7cec1] bg-white px-4 py-3 text-[14px] leading-[1.7] text-[#2f2a26] outline-none transition focus:border-[#365b3f] focus:ring-2 focus:ring-[#365b3f]/15";

export const adminButtonClassName =
  "inline-flex items-center justify-center rounded-full bg-[#2e4a36] px-5 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#f4efe8] transition hover:bg-[#243c2c] disabled:cursor-not-allowed disabled:bg-[#b9afa3]";

export const adminSecondaryButtonClassName =
  "inline-flex items-center justify-center rounded-full border border-[#cdbfae] bg-[#f8f2e8] px-5 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#3a3129] transition hover:bg-[#f0e6d8]";

export const adminDangerButtonClassName =
  "inline-flex items-center justify-center rounded-full border border-[#e3c6bf] bg-[#fff4f2] px-5 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#9f4332] transition hover:bg-[#ffe8e2]";
