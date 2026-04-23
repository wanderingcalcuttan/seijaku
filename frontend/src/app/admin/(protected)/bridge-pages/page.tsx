import AdminPage from "@/src/components/admin/AdminPage";
import ResourceManager, { type ResourceField } from "@/src/components/admin/ResourceManager";
import { adminBackendJson } from "@/src/lib/admin-backend";
import { requireCurrentAdmin } from "@/src/lib/admin-session";
import type { BridgePage } from "@/src/lib/admin-types";

const fields: ResourceField[] = [
  { name: "slug", label: "Slug", type: "text", required: true },
  { name: "navLabel", label: "Navigation label", type: "text", required: true },
  { name: "heroEyebrow", label: "Hero eyebrow", type: "text", required: true },
  { name: "heroTitle", label: "Hero title", type: "text", required: true },
  { name: "heroDescription", label: "Hero description lines", type: "stringArray", rows: 5, hint: "One line per paragraph." },
  { name: "heroImage", label: "Hero image path", type: "text", hint: "e.g. /images/hero-banner.png" },
  { name: "heroImageAlt", label: "Hero image alt text", type: "text" },
  { name: "heroImagePosition", label: "Hero image position (Tailwind class)", type: "text", hint: "Optional, e.g. object-[center_46%]" },
  { name: "heroQuote", label: "Hero quote", type: "textarea", rows: 3, required: true },
  { name: "introEyebrow", label: "Intro eyebrow", type: "text" },
  { name: "introTitle", label: "Intro title", type: "text", required: true },
  { name: "introDescription", label: "Intro description", type: "textarea", rows: 5, required: true },
  { name: "interludeImage", label: "Interlude image path", type: "text", hint: "Optional mid-page image." },
  { name: "interludeImageAlt", label: "Interlude image alt text", type: "text" },
  { name: "productSectionEyebrow", label: "Product section eyebrow", type: "text" },
  { name: "productSectionTitle", label: "Product section title", type: "text" },
  { name: "productSectionDescription", label: "Product section description", type: "textarea", rows: 3 },
  { name: "postCtaTitle", label: "Post CTA title", type: "text" },
  { name: "postCtaDescription", label: "Post CTA description", type: "textarea", rows: 4 },
  { name: "postCtaPrimaryLabel", label: "Primary CTA label", type: "text" },
  { name: "postCtaPrimaryHref", label: "Primary CTA href", type: "text" },
  { name: "postCtaSecondaryLabel", label: "Secondary CTA label", type: "text" },
  { name: "postCtaSecondaryHref", label: "Secondary CTA href", type: "text" },
  { name: "seoTitle", label: "SEO title", type: "text" },
  { name: "seoDescription", label: "SEO description", type: "textarea", rows: 3 },
  { name: "seoFootnote", label: "SEO footnote (body-end paragraph)", type: "textarea", rows: 3 },
  { name: "content", label: "Advanced content JSON", type: "json", rows: 10 },
];

export default async function BridgePagesPage() {
  const { admin } = await requireCurrentAdmin();
  const data = await adminBackendJson<{ items: BridgePage[] }>("/bridge-pages");

  return (
    <AdminPage
      title="Bridge Pages"
      description="Edit the narrative layers and CTA structure that sit between the main catalog and each focused shop pathway."
    >
      <ResourceManager
        items={data.items}
        resourcePath="bridge-pages"
        fields={fields}
        titleField="navLabel"
        subtitleField="slug"
        newItem={{
          slug: "",
          navLabel: "",
          heroEyebrow: "",
          heroTitle: "",
          heroDescription: [],
          heroImage: "",
          heroImageAlt: "",
          heroImagePosition: "",
          heroQuote: "",
          introEyebrow: "",
          introTitle: "",
          introDescription: "",
          interludeImage: "",
          interludeImageAlt: "",
          productSectionEyebrow: "",
          productSectionTitle: "",
          productSectionDescription: "",
          postCtaTitle: "",
          postCtaDescription: "",
          postCtaPrimaryLabel: "",
          postCtaPrimaryHref: "",
          postCtaSecondaryLabel: "",
          postCtaSecondaryHref: "",
          seoTitle: "",
          seoDescription: "",
          seoFootnote: "",
          content: {},
        }}
        canDelete={admin.role === "SUPER_ADMIN"}
      />
    </AdminPage>
  );
}
