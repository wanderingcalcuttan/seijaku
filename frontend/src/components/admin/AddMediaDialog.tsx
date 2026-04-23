"use client";

import Image from "next/image";
import { useMemo, useRef, useState, useTransition } from "react";

import {
  adminButtonClassName,
  adminInputClassName,
  adminSecondaryButtonClassName,
} from "@/src/components/admin/AdminField";
import type { MediaAsset } from "@/src/lib/admin-types";

type AddMediaDialogProps = {
  open: boolean;
  onClose: () => void;
  library: MediaAsset[];
  alreadySelectedIds: Set<string>;
  /** Called with the chosen MediaAsset id after a successful upload/create/library pick. */
  onSelect: (mediaAssetId: string) => void;
};

type Tab = "upload" | "url" | "library";

function detectKindFromUrl(url: string): "IMAGE" | "VIDEO" {
  if (/\.(mp4|webm|mov|m4v)(\?|$)/i.test(url)) return "VIDEO";
  if (/(youtube\.com|youtu\.be|vimeo\.com)/i.test(url)) return "VIDEO";
  return "IMAGE";
}

function youtubeId(url: string) {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

function vimeoId(url: string) {
  const m = url.match(/vimeo\.com\/(\d+)/);
  return m ? m[1] : null;
}

function UrlPreview({ url }: { url: string }) {
  const yt = youtubeId(url);
  const vm = vimeoId(url);

  if (yt) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${yt}`}
        className="aspect-video w-full rounded-xl"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (vm) {
    return (
      <iframe
        src={`https://player.vimeo.com/video/${vm}`}
        className="aspect-video w-full rounded-xl"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (/\.(mp4|webm|mov|m4v)(\?|$)/i.test(url)) {
    return <video src={url} controls className="aspect-video w-full rounded-xl bg-black" />;
  }

  if (/\.(jpg|jpeg|png|webp|gif|avif)(\?|$)/i.test(url) || /supabase\.co\/storage/.test(url)) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#efe6d4]">
        <Image src={url} alt="preview" fill sizes="400px" className="object-contain" unoptimized />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-dashed border-[#d7cec1] bg-[#fbf8f3] px-4 py-6 text-center text-[12px] text-[#8a8075]">
      URL accepted, but type is not recognized for inline preview. It will still be saved as a media asset.
    </div>
  );
}

export default function AddMediaDialog({ open, onClose, library, alreadySelectedIds, onSelect }: AddMediaDialogProps) {
  const [tab, setTab] = useState<Tab>("upload");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadAlt, setUploadAlt] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [urlAlt, setUrlAlt] = useState("");
  const [librarySearch, setLibrarySearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredLibrary = useMemo(() => {
    if (!librarySearch.trim()) return library;
    const q = librarySearch.toLowerCase();
    return library.filter(
      (asset) => (asset.altText?.toLowerCase().includes(q)) || asset.url.toLowerCase().includes(q)
    );
  }, [library, librarySearch]);

  if (!open) return null;

  const reset = () => {
    setSelectedFile(null);
    setUploadAlt("");
    setUrlInput("");
    setUrlAlt("");
    setLibrarySearch("");
    setError(null);
    setTab("upload");
  };

  const closeAndReset = () => {
    reset();
    onClose();
  };

  const doUpload = () => {
    if (!selectedFile) {
      setError("Pick a file first.");
      return;
    }
    startTransition(async () => {
      setError(null);
      const form = new FormData();
      form.append("file", selectedFile);
      form.append("altText", uploadAlt);
      form.append("kind", selectedFile.type.startsWith("video/") ? "VIDEO" : "IMAGE");

      const res = await fetch("/api/admin/proxy/media/upload", { method: "POST", body: form });
      const data = (await res.json().catch(() => null)) as { error?: string; item?: { id: string } } | null;

      if (!res.ok || !data?.item?.id) {
        setError(data?.error ?? "Upload failed.");
        return;
      }

      onSelect(data.item.id);
      closeAndReset();
    });
  };

  const doUrl = () => {
    const url = urlInput.trim();
    if (!url) {
      setError("Paste a URL.");
      return;
    }
    try {
      new URL(url);
    } catch {
      setError("That does not look like a valid URL.");
      return;
    }

    startTransition(async () => {
      setError(null);
      const res = await fetch("/api/admin/proxy/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          altText: urlAlt || null,
          kind: detectKindFromUrl(url),
        }),
      });
      const data = (await res.json().catch(() => null)) as { error?: string; item?: { id: string } } | null;

      if (!res.ok || !data?.item?.id) {
        setError(data?.error ?? "Unable to save URL as a media asset.");
        return;
      }

      onSelect(data.item.id);
      closeAndReset();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1d1916]/50 p-4" onClick={closeAndReset}>
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[24px] border border-[#d7cec1] bg-[#fbf8f3] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[20px] text-[#1d1916]">Add media</h3>
          <button
            type="button"
            onClick={closeAndReset}
            className="rounded-full p-1 text-[#62574c] hover:bg-[#efe6d4]"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="mb-5 flex gap-2 border-b border-[#d7cec1]">
          {(["upload", "url", "library"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`-mb-px border-b-2 px-3 py-2 text-[12px] font-medium uppercase tracking-[0.14em] transition ${
                tab === t
                  ? "border-[#2e4a36] text-[#2e4a36]"
                  : "border-transparent text-[#62574c] hover:text-[#2e4a36]"
              }`}
            >
              {t === "upload" ? "Upload" : t === "url" ? "Paste URL" : `Library (${library.length})`}
            </button>
          ))}
        </div>

        {error ? (
          <p className="mb-4 rounded-lg border border-[#e7c1ba] bg-[#fff1ee] px-3 py-2 text-[13px] text-[#9f4332]">{error}</p>
        ) : null}

        {tab === "upload" ? (
          <div className="space-y-4">
            <div
              className="cursor-pointer rounded-xl border border-dashed border-[#d7cec1] bg-white px-6 py-10 text-center"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
              />
              {selectedFile ? (
                <div className="text-[14px] text-[#3a3129]">
                  <div className="font-medium">{selectedFile.name}</div>
                  <div className="mt-1 text-[12px] text-[#8a8075]">
                    {(selectedFile.size / 1024).toFixed(1)} KB · {selectedFile.type}
                  </div>
                </div>
              ) : (
                <div className="text-[13px] text-[#62574c]">
                  Click to pick an image or a short video clip. Max 50 MB.
                </div>
              )}
            </div>
            <label className="block">
              <span className="mb-1 block text-[11px] font-medium uppercase tracking-[0.18em] text-[#6a5d50]">Alt text</span>
              <input
                value={uploadAlt}
                onChange={(e) => setUploadAlt(e.target.value)}
                placeholder="Describe the image for accessibility"
                className={adminInputClassName}
              />
            </label>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={closeAndReset} className={adminSecondaryButtonClassName}>
                Cancel
              </button>
              <button type="button" onClick={doUpload} disabled={isPending || !selectedFile} className={adminButtonClassName}>
                Upload &amp; attach
              </button>
            </div>
          </div>
        ) : null}

        {tab === "url" ? (
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-[11px] font-medium uppercase tracking-[0.18em] text-[#6a5d50]">Media URL</span>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://… (YouTube, Vimeo, or direct image/video URL)"
                className={adminInputClassName}
              />
            </label>
            {urlInput.trim() ? <UrlPreview url={urlInput.trim()} /> : null}
            <label className="block">
              <span className="mb-1 block text-[11px] font-medium uppercase tracking-[0.18em] text-[#6a5d50]">Alt text</span>
              <input
                value={urlAlt}
                onChange={(e) => setUrlAlt(e.target.value)}
                placeholder="Describe the media for accessibility"
                className={adminInputClassName}
              />
            </label>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={closeAndReset} className={adminSecondaryButtonClassName}>
                Cancel
              </button>
              <button type="button" onClick={doUrl} disabled={isPending || !urlInput.trim()} className={adminButtonClassName}>
                Save &amp; attach
              </button>
            </div>
          </div>
        ) : null}

        {tab === "library" ? (
          <div className="space-y-4">
            <input
              value={librarySearch}
              onChange={(e) => setLibrarySearch(e.target.value)}
              placeholder="Search library by URL or alt text…"
              className={adminInputClassName}
            />
            {filteredLibrary.length === 0 ? (
              <p className="rounded-lg border border-dashed border-[#d7cec1] bg-white px-4 py-6 text-center text-[13px] text-[#8a8075]">
                No assets match.
              </p>
            ) : (
              <div className="grid max-h-[50vh] grid-cols-3 gap-3 overflow-y-auto">
                {filteredLibrary.map((asset) => {
                  const already = alreadySelectedIds.has(asset.id);
                  return (
                    <button
                      key={asset.id}
                      type="button"
                      disabled={already}
                      onClick={() => {
                        onSelect(asset.id);
                        closeAndReset();
                      }}
                      className={`group relative aspect-square overflow-hidden rounded-xl border transition ${
                        already
                          ? "cursor-not-allowed border-[#d7cec1] opacity-40"
                          : "border-[#d7cec1] hover:border-[#2e4a36] hover:shadow-lg"
                      }`}
                      title={asset.altText ?? asset.url}
                    >
                      {asset.kind === "VIDEO" ? (
                        <div className="flex h-full w-full items-center justify-center bg-[#1d1916] text-[11px] uppercase tracking-[0.2em] text-white">
                          ▶ video
                        </div>
                      ) : (
                        <Image
                          src={asset.url}
                          alt={asset.altText ?? ""}
                          fill
                          sizes="160px"
                          className="object-cover"
                          unoptimized
                        />
                      )}
                      {already ? (
                        <span className="absolute inset-x-0 bottom-0 bg-[#1d1916]/70 py-1 text-[9px] uppercase tracking-[0.18em] text-white">
                          attached
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
