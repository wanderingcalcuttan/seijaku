export const cacheTags = {
  articles: "articles",
  retreats: "retreats",
  programs: "programs",
  programSessions: "program-sessions",
  products: "products",
  bridgePages: "bridge-pages",
  collections: "collections",
  siteSettings: "site-settings",
  home: "home",
  ourStory: "our-story",
  ritual: "ritual",
  navigation: "navigation",
} as const;

export type CacheTag = (typeof cacheTags)[keyof typeof cacheTags];

const allTags = new Set<string>(Object.values(cacheTags));

export function isCacheTag(value: string): value is CacheTag {
  return allTags.has(value);
}

export function listCacheTags(): CacheTag[] {
  return Object.values(cacheTags);
}

// Given an admin proxy upstream path (e.g. "articles/cln123", "bridge-pages",
// "products/sync-new"), return the set of cache tags whose data may have
// changed. An unknown path returns [] so we fail safe (stale page for up to
// one ISR window) rather than blow the wrong cache.
export function tagsForAdminWrite(upstreamPath: string): CacheTag[] {
  const segment = upstreamPath.split("/")[0] ?? "";

  switch (segment) {
    case "articles":
      return [cacheTags.articles];
    case "retreats":
      return [cacheTags.retreats];
    case "programs":
      return [cacheTags.programs, cacheTags.programSessions];
    case "program-sessions":
      return [cacheTags.programSessions, cacheTags.programs];
    case "products":
      return [cacheTags.products, cacheTags.bridgePages, cacheTags.collections];
    case "bridge-pages":
      return [cacheTags.bridgePages, cacheTags.products];
    case "collections":
      return [cacheTags.collections, cacheTags.products];
    case "media":
      return [
        cacheTags.products,
        cacheTags.bridgePages,
        cacheTags.articles,
        cacheTags.retreats,
        cacheTags.siteSettings,
      ];
    case "site-settings":
      return [cacheTags.siteSettings];
    case "categories":
      return [cacheTags.products, cacheTags.bridgePages];
    default:
      return [];
  }
}
