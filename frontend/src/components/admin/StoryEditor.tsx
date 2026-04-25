"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import AdminCard from "@/src/components/admin/AdminCard";
import {
  AdminField,
  adminButtonClassName,
  adminInputClassName,
  adminSecondaryButtonClassName,
} from "@/src/components/admin/AdminField";
import type {
  ProductSummary,
  StoryDetail,
  StoryStatusAdmin,
} from "@/src/lib/admin-types";

type StoryEditorProps = {
  story: StoryDetail | null;
  products: ProductSummary[];
  canDelete: boolean;
};

type CoreState = {
  perfumeIds: [string, string, string];
  artifactIds: [string, string, string];
  launchDate: string;
  videoUrl: string;
  status: StoryStatusAdmin;
};

function buildInitial(story: StoryDetail | null): CoreState {
  return {
    perfumeIds: [
      story?.perfumes[0]?.id ?? "",
      story?.perfumes[1]?.id ?? "",
      story?.perfumes[2]?.id ?? "",
    ],
    artifactIds: [
      story?.artifacts[0]?.id ?? "",
      story?.artifacts[1]?.id ?? "",
      story?.artifacts[2]?.id ?? "",
    ],
    launchDate: story?.launchDate ? story.launchDate.slice(0, 16) : "",
    videoUrl: story?.videoUrl ?? "",
    status: story?.status ?? "INACTIVE",
  };
}

export default function StoryEditor({ story, products, canDelete }: StoryEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [core, setCore] = useState<CoreState>(buildInitial(story));
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isExisting = Boolean(story?.id);

  // Partition the product list by bridge-page membership.
  // Perfume slots can only pick products in /shop/perfumes.
  // Artifact slots can only pick products NOT in /shop/perfumes.
  const perfumeOptions = useMemo(
    () => products.filter((p) => p.bridgePages.some((bp) => bp.slug === "perfumes")),
    [products],
  );
  const artifactOptions = useMemo(
    () => products.filter((p) => !p.bridgePages.some((bp) => bp.slug === "perfumes")),
    [products],
  );

  const setPerfumeSlot = (index: 0 | 1 | 2, id: string) => {
    setCore((c) => {
      const next = [...c.perfumeIds] as [string, string, string];
      next[index] = id;
      return { ...c, perfumeIds: next };
    });
  };

  const setArtifactSlot = (index: 0 | 1 | 2, id: string) => {
    setCore((c) => {
      const next = [...c.artifactIds] as [string, string, string];
      next[index] = id;
      return { ...c, artifactIds: next };
    });
  };

  const validateClient = (): string | null => {
    if (core.perfumeIds.some((id) => !id)) return "All three perfume slots must be filled.";
    if (core.artifactIds.some((id) => !id)) return "All three artifact slots must be filled.";
    if (new Set(core.perfumeIds).size !== 3) return "Perfume slots must reference three distinct products.";
    if (new Set(core.artifactIds).size !== 3) return "Artifact slots must reference three distinct products.";
    if (!core.launchDate) return "Launch date is required.";
    if (!core.videoUrl) return "Video URL is required.";
    try {
      new URL(core.videoUrl);
    } catch {
      return "Video URL must be a valid URL.";
    }
    return null;
  };

  const handleSave = () => {
    setError(null);
    setNotice(null);

    const clientError = validateClient();
    if (clientError) {
      setError(clientError);
      return;
    }

    startTransition(async () => {
      const payload = {
        perfume1Id: core.perfumeIds[0],
        perfume2Id: core.perfumeIds[1],
        perfume3Id: core.perfumeIds[2],
        artifact1Id: core.artifactIds[0],
        artifact2Id: core.artifactIds[1],
        artifact3Id: core.artifactIds[2],
        launchDate: new Date(core.launchDate).toISOString(),
        videoUrl: core.videoUrl,
        status: core.status,
      };

      const url = isExisting
        ? `/api/admin/proxy/stories/${story!.id}`
        : "/api/admin/proxy/stories";
      const method = isExisting ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => null)) as { item?: { id: string }; error?: string } | null;

      if (!res.ok) {
        setError(data?.error ?? "Unable to save story.");
        return;
      }

      setNotice(isExisting ? "Saved." : "Story created.");

      if (!isExisting && data?.item?.id) {
        router.push(`/admin/stories/${data.item.id}`);
      }

      router.refresh();
    });
  };

  const handleDelete = () => {
    if (!story?.id) return;
    if (!window.confirm("Delete this story? This cannot be undone.")) return;
    startTransition(async () => {
      const res = await fetch(`/api/admin/proxy/stories/${story.id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/admin/stories");
      } else {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "Unable to delete story.");
      }
    });
  };

  const renderProductOptions = (options: ProductSummary[]) =>
    options.map((p) => (
      <option key={p.id} value={p.id}>
        {p.title}
      </option>
    ));

  return (
    <div className="space-y-6">
      <AdminCard>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[18px] font-medium text-[#1d1916]">Curation</h2>
            <p className="mt-2 text-[13px] leading-[1.7] text-[#6b6259]">
              Pick three perfumes and three non-perfume artifacts. The homepage section pulls product titles, images, and slugs directly from these references and rotates step background images deterministically per story.
            </p>
          </div>
          <div className="text-right">
            <Link href="/admin/stories" className={adminSecondaryButtonClassName}>
              Back to stories
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#7c7066]">Perfumes (Step 1)</p>
            {[0, 1, 2].map((index) => (
              <AdminField key={`perfume-${index}`} label={`Perfume ${index + 1}`}>
                <select
                  value={core.perfumeIds[index]}
                  onChange={(e) => setPerfumeSlot(index as 0 | 1 | 2, e.target.value)}
                  className={adminInputClassName}
                >
                  <option value="">Select a perfume…</option>
                  {renderProductOptions(perfumeOptions)}
                </select>
              </AdminField>
            ))}
            {perfumeOptions.length === 0 ? (
              <p className="mt-2 text-[12px] text-[#9a4f3f]">
                No products are assigned to /shop/perfumes yet. Create perfumes via /admin/products first.
              </p>
            ) : null}
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#7c7066]">Artifacts (Step 2)</p>
            {[0, 1, 2].map((index) => (
              <AdminField key={`artifact-${index}`} label={`Artifact ${index + 1}`}>
                <select
                  value={core.artifactIds[index]}
                  onChange={(e) => setArtifactSlot(index as 0 | 1 | 2, e.target.value)}
                  className={adminInputClassName}
                >
                  <option value="">Select an artifact…</option>
                  {renderProductOptions(artifactOptions)}
                </select>
              </AdminField>
            ))}
            {artifactOptions.length === 0 ? (
              <p className="mt-2 text-[12px] text-[#9a4f3f]">
                No non-perfume products are assigned to other bridge pages yet.
              </p>
            ) : null}
          </div>
        </div>
      </AdminCard>

      <AdminCard>
        <h2 className="text-[18px] font-medium text-[#1d1916]">Schedule &amp; Ritual</h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <AdminField label="Launch date">
            <input
              type="datetime-local"
              value={core.launchDate}
              onChange={(e) => setCore((c) => ({ ...c, launchDate: e.target.value }))}
              className={adminInputClassName}
            />
          </AdminField>

          <AdminField label="Video URL (Step 3 ritual)">
            <input
              type="url"
              placeholder="https://www.youtube.com/..."
              value={core.videoUrl}
              onChange={(e) => setCore((c) => ({ ...c, videoUrl: e.target.value }))}
              className={adminInputClassName}
            />
          </AdminField>

          <AdminField label="Status">
            <div className="flex gap-3">
              <label className="inline-flex items-center gap-2 text-[14px] text-[#3a3a3a]">
                <input
                  type="radio"
                  name="status"
                  value="ACTIVE"
                  checked={core.status === "ACTIVE"}
                  onChange={() => setCore((c) => ({ ...c, status: "ACTIVE" }))}
                />
                Active
              </label>
              <label className="inline-flex items-center gap-2 text-[14px] text-[#3a3a3a]">
                <input
                  type="radio"
                  name="status"
                  value="INACTIVE"
                  checked={core.status === "INACTIVE"}
                  onChange={() => setCore((c) => ({ ...c, status: "INACTIVE" }))}
                />
                Inactive
              </label>
            </div>
          </AdminField>
        </div>

        <p className="mt-3 text-[12px] leading-[1.7] text-[#6b6259]">
          Active stories with a launch date in the past compete for the homepage; the latest launch date wins. Schedule a future story by setting an active status with a launch date that hasn&rsquo;t arrived — it goes live automatically once the date passes.
        </p>
      </AdminCard>

      {notice ? <p className="rounded-[18px] border border-[#cde0d2] bg-[#eef8f0] px-4 py-3 text-[13px] text-[#2c6541]">{notice}</p> : null}
      {error ? <p className="rounded-[18px] border border-[#e7c1ba] bg-[#fff1ee] px-4 py-3 text-[13px] text-[#9f4332]">{error}</p> : null}

      <div className="flex items-center justify-between">
        <div>
          {isExisting && canDelete ? (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="text-[12px] uppercase tracking-[0.18em] text-[#9f4332] underline decoration-black/10 underline-offset-4 hover:opacity-70"
            >
              Delete story
            </button>
          ) : null}
        </div>
        <button type="button" onClick={handleSave} disabled={isPending} className={adminButtonClassName}>
          {isPending ? "Saving…" : isExisting ? "Save changes" : "Create story"}
        </button>
      </div>
    </div>
  );
}
