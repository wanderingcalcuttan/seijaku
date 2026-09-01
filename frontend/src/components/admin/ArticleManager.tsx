"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import AdminCard from "@/src/components/admin/AdminCard";
import { AdminField, adminButtonClassName, adminDangerButtonClassName, adminInputClassName, adminSecondaryButtonClassName, adminTextareaClassName } from "@/src/components/admin/AdminField";
import MarkdownPreview from "@/src/components/admin/MarkdownPreview";
import type { Article, MediaAsset } from "@/src/lib/admin-types";
import RichTextarea from "./RichTextarea";

type ArticleManagerProps = {
  items: Article[];
  media: MediaAsset[];
  canDelete: boolean;
};

type UploadedAsset = { id: string; url: string; altText?: string | null };

function buildState(article: Article | null) {
  return {
    slug: article?.slug ?? "",
    title: article?.title ?? "",
    category: article?.category ?? "",
    excerpt: article?.excerpt ?? "",
    bodyMarkdown: article?.bodyMarkdown ?? "",
    featured: article?.featured ?? false,
    status: article?.status ?? "DRAFT",
    publishedAt: article?.publishedAt ? article.publishedAt.slice(0, 16) : "",
    primaryImageId: article?.primaryImage?.id ?? "",
    primaryImageUrl: article?.primaryImage?.url ?? "",
    seoTitle: article?.seoTitle ?? "",
    seoDescription: article?.seoDescription ?? "",
  };
}

export default function ArticleManager({ items, media, canDelete }: ArticleManagerProps) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id ?? null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const selectedItem = items.find((item) => item.id === selectedId) ?? null;
  const [draft, setDraft] = useState(() => buildState(selectedItem));
  // Locally-uploaded assets that haven't yet appeared in the prop-supplied
  // `media` list (the parent server component is the source of truth post-
  // refresh, but until refresh fires we need to render a thumbnail for the
  // just-uploaded id). Keyed by media-asset id.
  const [recentlyUploaded, setRecentlyUploaded] = useState<Record<string, UploadedAsset>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(buildState(selectedItem));
    setUploadError(null);
  }, [selectedItem]);

  const handleFileUpload = async (file: File) => {
    setUploadError(null);
    setIsUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("kind", "IMAGE");
      const res = await fetch("/api/admin/proxy/media/upload", {
        method: "POST",
        body: form,
      });
      const data = (await res.json().catch(() => null)) as { item?: UploadedAsset; error?: string } | null;
      if (!res.ok || !data?.item) {
        setUploadError(data?.error ?? "Upload failed. Try again.");
        return;
      }
      setRecentlyUploaded((current) => ({ ...current, [data.item!.id]: data.item! }));
      setDraft((current) => ({ ...current, primaryImageId: data.item!.id, primaryImageUrl: data.item!.url }));
    } catch {
      setUploadError("Couldn't reach the server. Try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Resolve the URL for the currently-selected primaryImageId so we can
  // render a thumbnail. Looks first at recently-uploaded (this session),
  // then falls back to the media library list passed from the server.
  const currentImageAsset: { url: string; altText?: string | null } | null = (() => {
    if (draft.primaryImageUrl) {
      const matchingAsset =
        media.find((asset) => asset.url === draft.primaryImageUrl) ||
        Object.values(recentlyUploaded).find((asset) => asset.url === draft.primaryImageUrl);
      return {
        url: draft.primaryImageUrl,
        altText: matchingAsset?.altText ?? null,
      };
    }
    if (!draft.primaryImageId) return null;
    if (recentlyUploaded[draft.primaryImageId]) return recentlyUploaded[draft.primaryImageId];
    const fromLibrary = media.find((asset) => asset.id === draft.primaryImageId);
    return fromLibrary ?? null;
  })();

  const save = (method: "POST" | "PATCH") => {
    startTransition(async () => {
      setNotice(null);
      setError(null);

      let finalImageId = draft.primaryImageId;
      if (!finalImageId && draft.primaryImageUrl) {
        const existing = media.find((m) => m.url === draft.primaryImageUrl);
        if (existing) {
          finalImageId = existing.id;
        } else {
          try {
            const mediaRes = await fetch("/api/admin/proxy/media", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                url: draft.primaryImageUrl,
                kind: "IMAGE",
              }),
            });
            const mediaData = (await mediaRes.json().catch(() => null)) as { item?: UploadedAsset; error?: string } | null;
            if (mediaRes.ok && mediaData?.item?.id) {
              finalImageId = mediaData.item.id;
              setRecentlyUploaded((current) => ({ ...current, [mediaData.item!.id]: mediaData.item! }));
              setDraft((current) => ({ ...current, primaryImageId: mediaData.item!.id }));
            } else {
              setError(mediaData?.error ?? "Failed to save the primary image URL as a media asset.");
              return;
            }
          } catch {
            setError("Failed to reach server to save the primary image URL.");
            return;
          }
        }
      }

      const { primaryImageUrl: _, ...articleData } = draft;
      const response = await fetch(method === "POST" ? "/api/admin/proxy/articles" : `/api/admin/proxy/articles/${selectedItem?.id}`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...articleData,
          publishedAt: draft.publishedAt ? new Date(draft.publishedAt).toISOString() : null,
          primaryImageId: finalImageId || null,
        }),
      });

      const data = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        setError(data?.error ?? "Unable to save article.");
        return;
      }

      setNotice(method === "POST" ? "Article created." : "Article updated.");
      router.refresh();
    });
  };

  const remove = () => {
    if (!selectedItem) {
      return;
    }

    startTransition(async () => {
      setNotice(null);
      setError(null);

      const response = await fetch(`/api/admin/proxy/articles/${selectedItem.id}`, {
        method: "DELETE",
      });

      // if (!response.ok) {
      //   const data = (await response.json().catch(() => null)) as { error?: string } | null;
      //   setError(data?.error ?? "Unable to delete article.");
      //   return;
      // }

      setSelectedId(null);
      setNotice("Article deleted.");
      router.refresh();
    });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
      <AdminCard className="h-fit">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[22px]">Articles</h2>
          <button
            type="button"
            className={adminSecondaryButtonClassName}
            onClick={() => {
              setSelectedId(null);
              setDraft(buildState(null));
            }}
          >
            New
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              className={`block w-full rounded-2xl border px-4 py-4 text-left transition ${
                selectedId === item.id ? "border-[#365b3f] bg-[#eff6f1]" : "border-[#e2d7c7] bg-white hover:border-[#cdbda7]"
              }`}
            >
              <p className="text-[15px] font-medium text-[#201b18]">{item.title}</p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-[#7d7267]">{item.category}</p>
            </button>
          ))}
        </div>
      </AdminCard>

      <div className="space-y-6">
        <AdminCard>
          <div className="flex flex-col gap-4 border-b border-[#e2d7c7] pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-[24px]">{selectedItem ? "Edit Article" : "Create Article"}</h2>
              <p className="mt-2 text-[13px] leading-[1.8] text-[#7b7064]">Markdown remains the canonical article body format in this first admin release.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" disabled={isPending} onClick={() => save(selectedItem ? "PATCH" : "POST")} className={adminButtonClassName}>
                {selectedItem ? "Save article" : "Create article"}
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
            <AdminField label="Slug">
              <input value={draft.slug} onChange={(event) => setDraft((current) => ({ ...current, slug: event.target.value }))} className={adminInputClassName} />
            </AdminField>
            <AdminField label="Title">
              <input value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} className={adminInputClassName} />
            </AdminField>
            <AdminField label="Category">
              <input value={draft.category} onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))} className={adminInputClassName} />
            </AdminField>
            <AdminField label="Status">
              <select value={draft.status} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value as "DRAFT" | "PUBLISHED" }))} className={adminInputClassName}>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </AdminField>
            <AdminField label="Published at">
              <input type="datetime-local" value={draft.publishedAt} onChange={(event) => setDraft((current) => ({ ...current, publishedAt: event.target.value }))} className={adminInputClassName} />
            </AdminField>
            <AdminField label="Primary image">
              <div className="flex flex-col gap-3">
                {currentImageAsset ? (
                  <div className="relative h-28 w-40 overflow-hidden rounded-[10px] border border-[#e2d7c7] bg-[#faf6ee]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={currentImageAsset.url}
                      alt={currentImageAsset.altText ?? "Primary image preview"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : null}
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                  <label className={`${adminSecondaryButtonClassName} cursor-pointer`}>
                    {isUploading ? "Uploading…" : "Upload image"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={isUploading}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          handleFileUpload(file);
                          // Reset the input so the same file can be re-picked.
                          event.target.value = "";
                        }
                      }}
                    />
                  </label>
                  <textarea
                    rows={2}
                    value={draft.primaryImageUrl}
                    onChange={(event) => {
                      const url = event.target.value;
                      const matchingAsset =
                        media.find((asset) => asset.url === url) ||
                        Object.values(recentlyUploaded).find((asset) => asset.url === url);
                      setDraft((current) => ({
                        ...current,
                        primaryImageUrl: url,
                        primaryImageId: matchingAsset ? matchingAsset.id : "",
                      }));
                    }}
                    placeholder="Enter image URL..."
                    className={adminTextareaClassName}
                  />
                  {draft.primaryImageUrl || draft.primaryImageId ? (
                    <button
                      type="button"
                      onClick={() => setDraft((current) => ({ ...current, primaryImageId: "", primaryImageUrl: "" }))}
                      className={adminSecondaryButtonClassName}
                    >
                      Clear
                    </button>
                  ) : null}
                </div>
                {uploadError ? (
                  <p className="rounded-2xl border border-[#e7c1ba] bg-[#fff1ee] px-3 py-2 text-[12px] text-[#9f4332]">
                    {uploadError}
                  </p>
                ) : null}
              </div>
            </AdminField>
          </div>

          <div className="mt-5 grid gap-5">
            <AdminField label="Excerpt">
              {/* <textarea rows={4} value={draft.excerpt} onChange={(event) => setDraft((current) => ({ ...current, excerpt: event.target.value }))} className={adminTextareaClassName} /> */}
              <RichTextarea
                value={draft.excerpt}
                onChange={(val) => setDraft((c) => ({ ...c, excerpt: val }))}
              />
            </AdminField>
            <AdminField label="Body markdown">
              {/* <textarea rows={14} value={draft.bodyMarkdown} onChange={(event) => setDraft((current) => ({ ...current, bodyMarkdown: event.target.value }))} className={adminTextareaClassName} /> */}
              <RichTextarea
                value={draft.bodyMarkdown}
                onChange={(val) => setDraft((c) => ({ ...c, bodyMarkdown: val }))}
              />
            </AdminField>
            <div className="grid gap-5 md:grid-cols-2">
              <AdminField label="SEO title">
                <input value={draft.seoTitle} onChange={(event) => setDraft((current) => ({ ...current, seoTitle: event.target.value }))} className={adminInputClassName} />
              </AdminField>
              <AdminField label="SEO description">
                <textarea rows={3} value={draft.seoDescription} onChange={(event) => setDraft((current) => ({ ...current, seoDescription: event.target.value }))} className={adminTextareaClassName} />
              </AdminField>
            </div>
            <label className="flex items-center gap-3 text-[14px] text-[#62574c]">
              <input type="checkbox" checked={draft.featured} onChange={(event) => setDraft((current) => ({ ...current, featured: event.target.checked }))} />
              Featured article
            </label>
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="text-[24px]">Markdown Preview</h2>
          <div className="mt-5 rounded-[24px] border border-[#e2d7c7] bg-white p-6">
            <MarkdownPreview value={draft.bodyMarkdown || draft.excerpt} />
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
