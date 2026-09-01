import MediaManager from "@/src/components/admin/MediaManager";
import AdminPage from "@/src/components/admin/AdminPage";
import { adminBackendJson } from "@/src/lib/admin-backend";
import { requireCurrentAdmin } from "@/src/lib/admin-session";
import type { MediaAsset } from "@/src/lib/admin-types";

type MediaPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function MediaPage({ searchParams }: MediaPageProps) {
  const { admin } = await requireCurrentAdmin();
  const params = await searchParams;
  const page = typeof params.page === "string" ? parseInt(params.page, 10) : 1;
  const limit = 12;

  const data = await adminBackendJson<{
    items: MediaAsset[];
    totalCount?: number;
    totalPages?: number;
    currentPage?: number;
  }>(`/media?page=${isNaN(page) ? 1 : Math.max(1, page)}&limit=${limit}`);

  return (
    <AdminPage
      title="Media Library"
      description="Upload and manage the assets used across products, articles, retreats, and site settings."
    >
      <MediaManager
        items={data.items}
        totalPages={data.totalPages ?? 1}
        currentPage={data.currentPage ?? 1}
        canDelete={admin.role === "SUPER_ADMIN"}
      />
    </AdminPage>
  );
}
