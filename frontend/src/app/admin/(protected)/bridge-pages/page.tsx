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
  { name: "heroImage", label: "Hero image", type: "image", hint: "Upload a file or paste an existing URL / path." },
  { name: "heroImageAlt", label: "Hero image alt text", type: "text" },
  { name: "heroImagePosition", label: "Hero image position (Tailwind class)", type: "text", hint: "Optional, e.g. object-[center_46%]" },
  { name: "heroQuote", label: "Hero quote", type: "textarea", rows: 3, required: true },
  { name: "introEyebrow", label: "Intro eyebrow", type: "text" },
  { name: "introTitle", label: "Intro title", type: "text", required: true },
  { name: "introDescription", label: "Intro description", type: "textarea", rows: 5, required: true },
  { name: "interludeImage", label: "Interlude image", type: "image", hint: "Optional mid-page image. Upload a file or paste an existing URL / path." },
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
  // Editorial-page slots (Decision #31). Field labels are prefixed with the
  // slug they apply to so admins can scan past the ones that don't matter
  // for the bridge they're editing.
  { name: "homeCard1Image", label: "Home / Card 1 image", type: "image", hint: 'Editing slug "home" — Skin card.' },
  { name: "homeCard1Alt", label: "Home / Card 1 alt text", type: "text" },
  { name: "homeCard2Image", label: "Home / Card 2 image", type: "image", hint: 'Editing slug "home" — Textiles card.' },
  { name: "homeCard2Alt", label: "Home / Card 2 alt text", type: "text" },
  { name: "homeCard3Image", label: "Home / Card 3 image", type: "image", hint: 'Editing slug "home" — Home card.' },
  { name: "homeCard3Alt", label: "Home / Card 3 alt text", type: "text" },
  { name: "homeCard4Image", label: "Home / Card 4 image", type: "image", hint: 'Editing slug "home" — Objects card.' },
  { name: "homeCard4Alt", label: "Home / Card 4 alt text", type: "text" },
  { name: "ritualVideo1Url", label: "Our Story / Ritual video 1 URL", type: "text", hint: 'Editing slug "our-story" — left video loop.' },
  { name: "ritualVideo1Poster", label: "Our Story / Ritual video 1 poster", type: "image" },
  { name: "ritualVideo2Url", label: "Our Story / Ritual video 2 URL", type: "text", hint: 'Editing slug "our-story" — right video loop.' },
  { name: "ritualVideo2Poster", label: "Our Story / Ritual video 2 poster", type: "image" },
  { name: "formCard1Image", label: "Hemanta / Form card 1 image", type: "image", hint: 'Editing slug "seasonaldrops-hemanta" — Nandini.' },
  { name: "formCard1Alt", label: "Hemanta / Form card 1 alt text", type: "text" },
  { name: "formCard2Image", label: "Hemanta / Form card 2 image", type: "image", hint: 'Editing slug "seasonaldrops-hemanta" — Raja.' },
  { name: "formCard2Alt", label: "Hemanta / Form card 2 alt text", type: "text" },
  { name: "formCard3Image", label: "Hemanta / Form card 3 image", type: "image", hint: 'Editing slug "seasonaldrops-hemanta" — Ispani.' },
  { name: "formCard3Alt", label: "Hemanta / Form card 3 alt text", type: "text" },
  { name: "formCard4Image", label: "Hemanta / Form card 4 image", type: "image", hint: 'Editing slug "seasonaldrops-hemanta" — Rishi.' },
  { name: "formCard4Alt", label: "Hemanta / Form card 4 alt text", type: "text" },
  { name: "imageBreak1Image", label: "Hemanta / Image break 1", type: "image", hint: 'Editing slug "seasonaldrops-hemanta" — first inline break.' },
  { name: "imageBreak1Alt", label: "Hemanta / Image break 1 alt text", type: "text" },
  { name: "imageBreak2Image", label: "Hemanta / Image break 2", type: "image", hint: 'Editing slug "seasonaldrops-hemanta" — middle inline break.' },
  { name: "imageBreak2Alt", label: "Hemanta / Image break 2 alt text", type: "text" },
  { name: "imageBreak3Image", label: "Hemanta / Image break 3", type: "image", hint: 'Editing slug "seasonaldrops-hemanta" — final inline break.' },
  { name: "imageBreak3Alt", label: "Hemanta / Image break 3 alt text", type: "text" },
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
          homeCard1Image: "", homeCard1Alt: "",
          homeCard2Image: "", homeCard2Alt: "",
          homeCard3Image: "", homeCard3Alt: "",
          homeCard4Image: "", homeCard4Alt: "",
          ritualVideo1Url: "", ritualVideo1Poster: "",
          ritualVideo2Url: "", ritualVideo2Poster: "",
          formCard1Image: "", formCard1Alt: "",
          formCard2Image: "", formCard2Alt: "",
          formCard3Image: "", formCard3Alt: "",
          formCard4Image: "", formCard4Alt: "",
          imageBreak1Image: "", imageBreak1Alt: "",
          imageBreak2Image: "", imageBreak2Alt: "",
          imageBreak3Image: "", imageBreak3Alt: "",
        }}
        canDelete={admin.role === "SUPER_ADMIN"}
      />
    </AdminPage>
  );
}
