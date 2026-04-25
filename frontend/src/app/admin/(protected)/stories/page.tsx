import Link from "next/link";

import AdminPage from "@/src/components/admin/AdminPage";
import { adminSecondaryButtonClassName } from "@/src/components/admin/AdminField";
import StoryTable from "@/src/components/admin/StoryTable";
import { adminBackendJson } from "@/src/lib/admin-backend";
import { requireCurrentAdmin } from "@/src/lib/admin-session";
import type { StorySummary } from "@/src/lib/admin-types";

export default async function StoriesPage() {
  const { admin } = await requireCurrentAdmin();
  const data = await adminBackendJson<{ items: StorySummary[] }>("/stories");

  return (
    <AdminPage
      title="Stories"
      description="Curate the monthly homepage 'How Seijaku Works' section. Pick three perfumes, three artifacts, a launch date, and a ritual video. The latest active story whose launch date has passed drives the live homepage."
      action={
        <Link href="/admin/stories/new" className={adminSecondaryButtonClassName}>
          New story
        </Link>
      }
    >
      <StoryTable items={data.items} canDelete={admin.role === "SUPER_ADMIN"} />
    </AdminPage>
  );
}
