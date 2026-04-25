import AdminPage from "@/src/components/admin/AdminPage";
import StoryEditor from "@/src/components/admin/StoryEditor";
import { adminBackendJson } from "@/src/lib/admin-backend";
import { requireCurrentAdmin } from "@/src/lib/admin-session";
import type { ProductSummary, StoryDetail } from "@/src/lib/admin-types";

type StoryEditorPageProps = {
  params: Promise<{ id: string }>;
};

export default async function StoryEditorPage({ params }: StoryEditorPageProps) {
  const { admin } = await requireCurrentAdmin();
  const { id } = await params;

  // The product picker needs a list of all products. The /admin/products
  // endpoint already supports filtering by workflowStatus; we ask for
  // PUBLISHED only here so admins can't pick a draft. Both perfume and
  // artifact slots come from the same product list — the StoryEditor
  // partitions client-side by bridgePages.slug.
  const [productsData, storyData] = await Promise.all([
    adminBackendJson<{ items: ProductSummary[] }>("/products?workflow=published"),
    id === "new"
      ? Promise.resolve<{ item: StoryDetail | null }>({ item: null })
      : adminBackendJson<{ item: StoryDetail }>(`/stories/${id}`),
  ]);

  return (
    <AdminPage
      title={id === "new" ? "New Story" : "Edit Story"}
      description="Configure the homepage curation: three perfumes, three artifacts, launch date, ritual video, and active toggle."
    >
      <StoryEditor
        story={storyData.item}
        products={productsData.items}
        canDelete={admin.role === "SUPER_ADMIN"}
      />
    </AdminPage>
  );
}
