"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { adminDangerButtonClassName } from "./AdminField";
import type { StorySummary } from "@/src/lib/admin-types";

type StoryTableProps = {
  items: StorySummary[];
  canDelete: boolean;
};

export default function StoryTable({ items, canDelete }: StoryTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this story? This cannot be undone.")) return;
    startTransition(async () => {
      const res = await fetch(`/api/admin/proxy/stories/${id}`, { method: "DELETE" });
      if (res.ok) router.refresh();
    });
  };

  if (items.length === 0) {
    return (
      <div className="rounded-[20px] border border-[#d8cec1] bg-[#faf7f1] px-8 py-12 text-center">
        <p className="font-serif text-[26px] leading-[1.18] tracking-[-0.02em] text-[#1f1a16]">No stories yet.</p>
        <p className="mx-auto mt-3 max-w-[44ch] text-[14px] leading-[1.85] text-[#625b53]">
          Create the first homepage story. Until one exists with status ACTIVE and a launch date in the past, the &ldquo;How Seijaku Works&rdquo; section is hidden on the public site.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-[20px] border border-[#d8cec1] bg-[#faf7f1]">
      <table className="w-full text-left text-[14px]">
        <thead className="bg-[#f2eadf] text-[11px] uppercase tracking-[0.18em] text-[#7c7066]">
          <tr>
            <th className="px-5 py-3">Launch</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3">Perfumes</th>
            <th className="px-5 py-3">Artifacts</th>
            <th className="px-5 py-3">Updated</th>
            <th className="px-5 py-3" />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const launch = new Date(item.launchDate);
            const isLive = item.status === "ACTIVE" && launch.getTime() <= Date.now();
            return (
              <tr key={item.id} className="border-t border-[rgba(120,110,94,0.12)]">
                <td className="px-5 py-3 text-[#2d2924]">
                  {launch.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] uppercase tracking-[0.16em] ${
                      isLive
                        ? "bg-[#dceadb] text-[#2c5040]"
                        : item.status === "ACTIVE"
                          ? "bg-[#f0e3c8] text-[#6f5a36]"
                          : "bg-[#e7dfd5] text-[#5a5048]"
                    }`}
                  >
                    {isLive ? "Live" : item.status === "ACTIVE" ? "Scheduled" : "Inactive"}
                  </span>
                </td>
                <td className="px-5 py-3 text-[13px] text-[#5a544c]">
                  {item.perfumeTitles.join(", ") || "—"}
                </td>
                <td className="px-5 py-3 text-[13px] text-[#5a544c]">
                  {item.artifactTitles.join(", ") || "—"}
                </td>
                <td className="px-5 py-3 text-[12px] text-[#7c7066]">
                  {new Date(item.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-5 py-3 text-right">
                  <Link
                    href={`/admin/stories/${item.id}`}
                    className="text-[12px] uppercase tracking-[0.18em] text-[#2d4535] underline decoration-black/10 underline-offset-4 hover:opacity-70"
                  >
                    Edit
                  </Link>
                  {canDelete ? (
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      disabled={isPending}
                      className={`${adminDangerButtonClassName} ml-3`}
                    >
                      Delete
                    </button>
                  ) : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
