import { publicBackendJson } from "@/src/lib/backend";
import { cacheTags } from "@/src/lib/cache-tags";
import {
  normalizeBackendProduct,
  type BackendProduct,
  type ProductView,
} from "@/src/lib/product-types";

export type StoryStatus = "ACTIVE" | "INACTIVE";

export type BackendStory = {
  id: string;
  launchDate: string;
  videoUrl: string;
  status: StoryStatus;
  perfumes: BackendProduct[];
  artifacts: BackendProduct[];
  createdAt: string;
  updatedAt: string;
};

export type StoryView = {
  id: string;
  launchDate: string;
  videoUrl: string;
  status: StoryStatus;
  perfumes: ProductView[];
  artifacts: ProductView[];
};

// Filter null normalizations (DRAFT) defensively, even though stories should
// never reference DRAFT products in practice.
function normalizeProducts(items: BackendProduct[]): ProductView[] {
  return items
    .map(normalizeBackendProduct)
    .filter((p): p is ProductView => p !== null);
}

export function normalizeBackendStory(s: BackendStory): StoryView {
  return {
    id: s.id,
    launchDate: s.launchDate,
    videoUrl: s.videoUrl,
    status: s.status,
    perfumes: normalizeProducts(s.perfumes),
    artifacts: normalizeProducts(s.artifacts),
  };
}

// Server-side fetch. Returns null when no active+launched story exists; the
// homepage hides the "How Seijaku Works" section in that case
// (Decision #29).
export async function fetchCurrentStory(): Promise<StoryView | null> {
  try {
    const { item } = await publicBackendJson<{ item: BackendStory }>(
      "/content/story/current",
      { tags: [cacheTags.stories, cacheTags.products] },
    );
    return normalizeBackendStory(item);
  } catch {
    return null;
  }
}
