"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";

import AdminCard from "@/src/components/admin/AdminCard";
import { AdminField, adminButtonClassName, adminDangerButtonClassName, adminInputClassName, adminSecondaryButtonClassName, adminTextareaClassName } from "@/src/components/admin/AdminField";

type FieldOption = {
  label: string;
  value: string;
};

export type ResourceField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "checkbox" | "number" | "datetime" | "json" | "stringArray" | "email" | "password" | "image";
  options?: FieldOption[];
  placeholder?: string;
  rows?: number;
  required?: boolean;
  hint?: string;
};

function ImageField({ value, onChange }: { value: string; onChange: (next: string) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setUploadError(null);
    setIsUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("kind", "IMAGE");
      const res = await fetch("/api/admin/proxy/media/upload", { method: "POST", body: form });
      const data = (await res.json().catch(() => null)) as { error?: string; item?: { url?: string } } | null;
      if (!res.ok || !data?.item?.url) {
        setUploadError(data?.error ?? "Upload failed.");
        return;
      }
      onChange(data.item.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt=""
          className="h-32 w-full rounded-xl border border-[#d7cec1] bg-white object-cover"
        />
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void handleFile(file);
          }}
        />
        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className={adminSecondaryButtonClassName}
        >
          {isUploading ? "Uploading…" : value ? "Replace image" : "Upload image"}
        </button>
        {value ? (
          <button
            type="button"
            disabled={isUploading}
            onClick={() => onChange("")}
            className={adminSecondaryButtonClassName}
          >
            Clear
          </button>
        ) : null}
      </div>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="…or paste an image URL / path"
        className={adminInputClassName}
      />
      {uploadError ? <p className="text-[12px] text-[#9f4332]">{uploadError}</p> : null}
    </div>
  );
}

type ResourceManagerProps<T extends { id: string }> = {
  items: T[];
  resourcePath: string;
  fields: ResourceField[];
  titleField: keyof T & string;
  subtitleField?: keyof T & string;
  newItem: Record<string, unknown>;
  canDelete?: boolean;
  emptyStateTitle?: string;
  emptyStateBody?: string;
};

function serializeValue(field: ResourceField, value: unknown) {
  if (field.type === "checkbox") {
    return Boolean(value);
  }

  if (field.type === "number") {
    return typeof value === "number" ? String(value) : value == null ? "" : String(value);
  }

  if (field.type === "json") {
    return value == null ? "" : JSON.stringify(value, null, 2);
  }

  if (field.type === "stringArray") {
    return Array.isArray(value) ? value.join("\n") : "";
  }

  if (field.type === "datetime" && typeof value === "string") {
    return value ? value.slice(0, 16) : "";
  }

  return value == null ? "" : String(value);
}

function deserializeValue(field: ResourceField, value: unknown) {
  if (field.type === "checkbox") {
    return Boolean(value);
  }

  if (field.type === "number") {
    return value === "" || value == null ? null : Number(value);
  }

  if (field.type === "json") {
    // Backend `optionalJsonRecord` is `z.record(z.any()).optional()` — accepts
    // an object or undefined, but rejects null. Send {} for an empty textarea
    // so the schema sees a valid record.
    if (!value) {
      return {};
    }

    return JSON.parse(String(value));
  }

  if (field.type === "stringArray") {
    if (!value) {
      return [];
    }

    return String(value)
      .split("\n")
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  if (field.type === "datetime") {
    return value ? new Date(String(value)).toISOString() : null;
  }

  // text-like fields (text / textarea / select / email / password / image)
  // serialize empty inputs as "" rather than null. The backend Zod schemas
  // commonly use `z.string()` or `z.string().default("")` which reject null;
  // an empty string is a valid string and matches HTML form semantics.
  return value == null ? "" : value;
}

function buildInitialDraft<T extends { id: string }>(
  fields: ResourceField[],
  item: T | null,
  fallback: Record<string, unknown>
) {
  const source = item ? (item as unknown as Record<string, unknown>) : fallback;
  const draft: Record<string, unknown> = {};

  for (const field of fields) {
    draft[field.name] = serializeValue(field, source[field.name]);
  }

  return draft;
}

export default function ResourceManager<T extends { id: string }>({
  items,
  resourcePath,
  fields,
  titleField,
  subtitleField,
  newItem,
  canDelete = false,
  emptyStateTitle = "Nothing created yet.",
  emptyStateBody = "Create the first record to begin managing this section.",
}: ResourceManagerProps<T>) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id ?? null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (selectedId && items.some((item) => item.id === selectedId)) {
      return;
    }

    setSelectedId(items[0]?.id ?? null);
  }, [items, selectedId]);

  const selectedItem = useMemo(() => items.find((item) => item.id === selectedId) ?? null, [items, selectedId]);
  const [draft, setDraft] = useState<Record<string, unknown>>(() =>
    buildInitialDraft(fields, items[0] ?? null, newItem)
  );

  useEffect(() => {
    setDraft(buildInitialDraft(fields, selectedItem, newItem));
  }, [fields, newItem, selectedItem]);

  const submit = (method: "POST" | "PATCH") => {
    startTransition(async () => {
      setNotice(null);
      setError(null);

      try {
        const payload: Record<string, unknown> = {};

        for (const field of fields) {
          payload[field.name] = deserializeValue(field, draft[field.name]);
        }

        const response = await fetch(
          method === "POST" ? `/api/admin/proxy/${resourcePath}` : `/api/admin/proxy/${resourcePath}/${selectedItem?.id}`,
          {
            method,
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        const data = (await response.json().catch(() => null)) as
          | { error?: string; item?: { id?: string }; issues?: { fieldErrors?: Record<string, string[]>; formErrors?: string[] } }
          | null;

        if (!response.ok) {
          const fieldErrors = data?.issues?.fieldErrors;
          const formErrors = data?.issues?.formErrors;
          const detail = [
            ...(fieldErrors
              ? Object.entries(fieldErrors).map(([k, v]) => `${k}: ${v.join(", ")}`)
              : []),
            ...(formErrors ?? []),
          ].join("; ");
          setError(
            detail
              ? `${data?.error ?? "Unable to save."} — ${detail}`
              : data?.error ?? "Unable to save.",
          );
          return;
        }

        setNotice(method === "POST" ? "Created successfully." : "Saved successfully.");
        if (method === "POST" && data?.item?.id) {
          setSelectedId(data.item.id);
        }
        router.refresh();
      } catch (saveError) {
        setError(saveError instanceof Error ? saveError.message : "Unable to save.");
      }
    });
  };

  const remove = () => {
    if (!selectedItem) {
      return;
    }

    startTransition(async () => {
      setNotice(null);
      setError(null);

      const response = await fetch(`/api/admin/proxy/${resourcePath}/${selectedItem.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "Unable to delete.");
        return;
      }

      setSelectedId(null);
      setNotice("Deleted successfully.");
      router.refresh();
    });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
      <AdminCard className="h-fit">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[22px]">Records</h2>
          <button
            type="button"
            className={adminSecondaryButtonClassName}
            onClick={() => {
              setSelectedId(null);
              setDraft(buildInitialDraft(fields, null, newItem));
              setNotice(null);
              setError(null);
            }}
          >
            New
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#d9cebf] bg-[#fffdfa] px-4 py-5">
              <p className="text-[15px] font-medium text-[#241f1b]">{emptyStateTitle}</p>
              <p className="mt-2 text-[13px] leading-[1.8] text-[#7b7064]">{emptyStateBody}</p>
            </div>
          ) : (
            items.map((item) => {
              const active = item.id === selectedId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={`block w-full rounded-2xl border px-4 py-4 text-left transition ${
                    active ? "border-[#365b3f] bg-[#eff6f1]" : "border-[#e2d7c7] bg-white hover:border-[#cdbda7]"
                  }`}
                >
                  <p className="text-[15px] font-medium text-[#201b18]">{String(item[titleField] ?? "Untitled")}</p>
                  {subtitleField && item[subtitleField] ? (
                    <p className="mt-2 text-[12px] uppercase tracking-[0.18em] text-[#7d7267]">{String(item[subtitleField])}</p>
                  ) : null}
                </button>
              );
            })
          )}
        </div>
      </AdminCard>

      <AdminCard>
        <div className="flex flex-col gap-4 border-b border-[#e2d7c7] pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[22px]">{selectedItem ? `Edit ${String(selectedItem[titleField] ?? "record")}` : "Create a new record"}</h2>
            <p className="mt-2 text-[13px] leading-[1.8] text-[#7b7064]">
              Save updates through the Next proxy so the browser never needs a raw backend bearer token.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" disabled={isPending} onClick={() => submit(selectedItem ? "PATCH" : "POST")} className={adminButtonClassName}>
              {selectedItem ? "Save changes" : "Create record"}
            </button>
            {selectedItem && canDelete ? (
              <button type="button" disabled={isPending} onClick={remove} className={adminDangerButtonClassName}>
                Delete
              </button>
            ) : null}
          </div>
        </div>

        {notice ? <p className="mt-5 rounded-2xl border border-[#cde0d2] bg-[#eef8f0] px-4 py-3 text-[14px] text-[#2c6541]">{notice}</p> : null}
        {error ? <p className="mt-5 rounded-2xl border border-[#e7c1ba] bg-[#fff1ee] px-4 py-3 text-[14px] text-[#9f4332]">{error}</p> : null}

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {fields.map((field) => (
            <AdminField key={field.name} label={field.label} hint={field.hint}>
              {field.type === "textarea" ? (
                <textarea
                  rows={field.rows ?? 5}
                  value={String(draft[field.name] ?? "")}
                  onChange={(event) => setDraft((current) => ({ ...current, [field.name]: event.target.value }))}
                  className={adminTextareaClassName}
                  placeholder={field.placeholder}
                />
              ) : field.type === "checkbox" ? (
                <input
                  type="checkbox"
                  checked={Boolean(draft[field.name])}
                  onChange={(event) => setDraft((current) => ({ ...current, [field.name]: event.target.checked }))}
                  className="h-4 w-4 rounded border-[#cdbfae] text-[#365b3f] focus:ring-[#365b3f]/20"
                />
              ) : field.type === "select" ? (
                <select
                  value={String(draft[field.name] ?? "")}
                  onChange={(event) => setDraft((current) => ({ ...current, [field.name]: event.target.value }))}
                  className={adminInputClassName}
                >
                  <option value="">Select</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "json" || field.type === "stringArray" ? (
                <textarea
                  rows={field.rows ?? 6}
                  value={String(draft[field.name] ?? "")}
                  onChange={(event) => setDraft((current) => ({ ...current, [field.name]: event.target.value }))}
                  className={adminTextareaClassName}
                  placeholder={field.placeholder}
                />
              ) : field.type === "image" ? (
                <ImageField
                  value={String(draft[field.name] ?? "")}
                  onChange={(next) => setDraft((current) => ({ ...current, [field.name]: next }))}
                />
              ) : (
                <input
                  type={field.type}
                  value={String(draft[field.name] ?? "")}
                  onChange={(event) => setDraft((current) => ({ ...current, [field.name]: event.target.value }))}
                  className={adminInputClassName}
                  placeholder={field.placeholder}
                />
              )}
            </AdminField>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}
