import Link from "next/link";

import AdminPage from "@/src/components/admin/AdminPage";
import ProductTable from "@/src/components/admin/ProductTable";
import SyncRegistryButton from "@/src/components/admin/SyncRegistryButton";
import { adminSecondaryButtonClassName } from "@/src/components/admin/AdminField";
import { adminBackendJson } from "@/src/lib/admin-backend";
import { requireCurrentAdmin } from "@/src/lib/admin-session";
import type { ProductSummary } from "@/src/lib/admin-types";

type WorkflowFilter = "all" | "draft" | "published";

type ProductsPageProps = {
  searchParams: Promise<{
    workflow?: string;
    search?: string;
  }>;
};

type ProductsResponse = {
  items: ProductSummary[];
  counts: { all: number; draft: number; published: number };
};

function normalizeWorkflow(value: string | undefined): WorkflowFilter {
  if (value === "draft" || value === "published") return value;
  return "all";
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { admin } = await requireCurrentAdmin();
  const params = await searchParams;
  const workflow = normalizeWorkflow(params.workflow);
  const search = params.search?.trim() ?? "";

  const query = new URLSearchParams();
  if (workflow !== "all") query.set("workflow", workflow);
  if (search) query.set("search", search);
  const querySuffix = query.toString();

  const data = await adminBackendJson<ProductsResponse>(`/products${querySuffix ? `?${querySuffix}` : ""}`);

  return (
    <AdminPage
      title="Products"
      description="Browse and manage the shop catalog. Filter by publish workflow, search by title or slug, and use bulk actions to publish, unpublish, or delete multiple products at once."
      action={
        <div className="flex flex-wrap items-center gap-3">
          {admin.role === "SUPER_ADMIN" ? <SyncRegistryButton /> : null}
          <Link href="/admin/products/new" className={adminSecondaryButtonClassName}>
            New product
          </Link>
        </div>
      }
    >
      <ProductTable
        items={data.items}
        counts={data.counts}
        canDelete={admin.role === "SUPER_ADMIN"}
        currentWorkflow={workflow}
        currentSearch={search}
      />
    </AdminPage>
  );
}
