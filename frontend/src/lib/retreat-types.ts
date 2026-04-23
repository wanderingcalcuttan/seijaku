import { publicBackendJson } from "@/src/lib/backend";
import { cacheTags } from "@/src/lib/cache-tags";

export type RetreatStatus = "DRAFT" | "UPCOMING" | "INQUIRY_OPEN" | "CLOSED";

export type RetreatView = {
  slug: string;
  name: string;
  shortDescription: string;
  detailDescription: string;
  location: string;
  season: string;
  format: string;
  groupSize: string;
  image?: string;
  imageAlt?: string;
  status: RetreatStatus;
};

type BackendRetreat = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  detailDescription: string;
  location: string;
  season: string;
  format: string;
  groupSize: string;
  status: RetreatStatus;
  primaryImage: { id: string; url: string; altText: string | null } | null;
  createdAt: string;
  updatedAt: string;
};

function toViewModel(retreat: BackendRetreat): RetreatView {
  return {
    slug: retreat.slug,
    name: retreat.name,
    shortDescription: retreat.shortDescription,
    detailDescription: retreat.detailDescription,
    location: retreat.location,
    season: retreat.season,
    format: retreat.format,
    groupSize: retreat.groupSize,
    status: retreat.status,
    image: retreat.primaryImage?.url ?? undefined,
    imageAlt: retreat.primaryImage?.altText ?? undefined,
  };
}

export async function fetchRetreats(): Promise<RetreatView[]> {
  const { items } = await publicBackendJson<{ items: BackendRetreat[] }>(
    "/content/retreats",
    { tags: [cacheTags.retreats] },
  );
  return items.map(toViewModel);
}

export async function fetchRetreat(slug: string): Promise<RetreatView | null> {
  try {
    const { item } = await publicBackendJson<{ item: BackendRetreat }>(
      `/content/retreats/${encodeURIComponent(slug)}`,
      { tags: [cacheTags.retreats] },
    );
    return toViewModel(item);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.toLowerCase().includes("retreat not found")) {
      return null;
    }
    throw err;
  }
}
