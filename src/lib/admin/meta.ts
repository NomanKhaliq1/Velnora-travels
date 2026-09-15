export const COLLECTION_KEYS = ["destinations", "packages", "articles", "legal"] as const;
export type CollectionKey = (typeof COLLECTION_KEYS)[number];

export const SINGLETON_KEYS = ["settings", "taxonomy", "faqs"] as const;
export type SingletonKey = (typeof SINGLETON_KEYS)[number];

export const COLLECTION_META: Record<
  CollectionKey,
  { label: string; singular: string; detailKey: string; detailLabel: string; publicPath: (slug: string) => string; hint: string }
> = {
  destinations: {
    label: "Destinations",
    singular: "destination",
    detailKey: "region",
    detailLabel: "Region",
    publicPath: (slug) => `/destination/${slug}`,
    hint: "Shown on /destinations, in search, and linked from packages. The region must exist under Regions & categories.",
  },
  packages: {
    label: "Packages",
    singular: "package",
    detailKey: "type",
    detailLabel: "Type",
    publicPath: (slug) => `/package/${slug}`,
    hint: "Shown on /packages and on the linked destination's page.",
  },
  articles: {
    label: "Travel guide",
    singular: "article",
    detailKey: "date",
    detailLabel: "Date",
    publicPath: (slug) => `/article/${slug}`,
    hint: "Articles are listed newest-first in the order below. Mark one as featured to pin it on the guide and home page.",
  },
  legal: {
    label: "Legal pages",
    singular: "legal page",
    detailKey: "lastUpdated",
    detailLabel: "Last updated",
    publicPath: (slug) => `/${slug}`,
    hint: "Each legal page lives at /its-slug. Remember to update the “last updated” date when the wording changes.",
  },
};
