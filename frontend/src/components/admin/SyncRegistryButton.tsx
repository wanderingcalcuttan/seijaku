"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  adminButtonClassName,
  adminSecondaryButtonClassName,
} from "@/src/components/admin/AdminField";
import { shopProducts } from "@/src/lib/shopAllItems";

type SyncResult = {
  created: string[];
  skipped: string[];
  totals: { created: number; skipped: number };
};

// The frontend registry already has this data client-side, so we serialize
// only the fields the backend's sync-new endpoint expects — avoids sending
// fields it would ignore and keeps payload sizes small.
function buildPayload() {
  return {
    products: shopProducts.map((product) => ({
      slug: product.slug,
      title: product.title,
      shortDescription: product.shortDescription ?? null,
      longDescription: product.longDescription ?? null,
      type: product.type,
      material: product.material,
      useCase: product.useCase ?? null,
      priceAmount: product.price,
      image: product.image,
      imageAlt: product.imageAlt ?? null,
      status: product.status ?? null,
      bridgeCategory: product.bridgeCategory ?? null,
    })),
  };
}

export default function SyncRegistryButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [result, setResult] = useState<SyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const totalInRegistry = shopProducts.length;

  const runSync = () => {
    setError(null);
    setResult(null);
    startTransition(async () => {
      const response = await fetch("/api/admin/proxy/products/sync-new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });

      const data = (await response.json().catch(() => null)) as
        | (SyncResult & { error?: string })
        | { error?: string }
        | null;

      if (!response.ok) {
        setError((data as { error?: string })?.error ?? "Sync failed.");
        setIsConfirmOpen(false);
        return;
      }

      const typed = data as SyncResult;
      setResult(typed);
      setIsConfirmOpen(false);

      if (typed.created.length > 0) {
        router.refresh();
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError(null);
          setResult(null);
          setIsConfirmOpen(true);
        }}
        className={adminSecondaryButtonClassName}
      >
        Sync new from registry
      </button>

      {isConfirmOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="sync-registry-title"
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(21,18,15,0.42)] p-4"
        >
          <div className="w-full max-w-[520px] rounded-[24px] bg-[#fbf8f3] p-7 shadow-[0_24px_60px_rgba(21,18,15,0.22)] sm:p-8">
            <h2 id="sync-registry-title" className="font-serif text-[22px] leading-[1.2] text-[#1d1916]">
              Sync new products from registry
            </h2>
            <p className="mt-4 text-[14px] leading-[1.8] text-[#62574c]">
              This creates any product in <code className="rounded bg-[#efe6d4] px-1 py-0.5">shopAllItems.ts</code> whose slug
              does not already exist in the admin DB. Hand-edited products are <strong>not</strong> touched.
            </p>
            <p className="mt-3 text-[14px] leading-[1.8] text-[#62574c]">
              The frontend registry currently carries <strong>{totalInRegistry}</strong> products. The server will skip any
              slug that is already present and return the exact list of new creations.
            </p>
            <div className="mt-7 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsConfirmOpen(false)}
                disabled={isPending}
                className={adminSecondaryButtonClassName}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={runSync}
                disabled={isPending}
                className={adminButtonClassName}
              >
                {isPending ? "Syncing…" : "Run sync"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {result ? (
        <div
          role="status"
          className="mt-6 rounded-2xl border border-[#cde0d2] bg-[#eef8f0] px-4 py-4 text-[14px] leading-[1.8] text-[#2c6541]"
        >
          <p>
            Created <strong>{result.totals.created}</strong> new product{result.totals.created === 1 ? "" : "s"}.{" "}
            Skipped <strong>{result.totals.skipped}</strong> existing.
          </p>
          {result.created.length > 0 ? (
            <p className="mt-2 break-words text-[12px] text-[#3f6b52]">
              New: {result.created.join(", ")}
            </p>
          ) : null}
        </div>
      ) : null}

      {error ? (
        <div
          role="alert"
          className="mt-6 rounded-2xl border border-[#e7c1ba] bg-[#fff1ee] px-4 py-4 text-[14px] leading-[1.8] text-[#9f4332]"
        >
          {error}
        </div>
      ) : null}
    </>
  );
}
