import "server-only";
import path from "node:path";
import { cache } from "react";
import { labelFor } from "@/lib/format";
import { CONTENT_DIR, readJson } from "./store";
import type {
  Article,
  Destination,
  Faq,
  LegalPage,
  PageContent,
  PageKey,
  Settings,
  Taxonomy,
  TravelPackage,
} from "./types";

export * from "./types";
export { labelFor };

const contentFile = (name: string) => path.join(CONTENT_DIR, name);

export const getSettings = cache(() => readJson<Settings>(contentFile("settings.json")));
export const getTaxonomy = cache(() => readJson<Taxonomy>(contentFile("taxonomy.json")));
export const getDestinations = cache(() => readJson<Destination[]>(contentFile("destinations.json")));
export const getPackages = cache(() => readJson<TravelPackage[]>(contentFile("packages.json")));
export const getArticles = cache(() => readJson<Article[]>(contentFile("articles.json")));
export const getFaqs = cache(() => readJson<Faq[]>(contentFile("faqs.json")));
export const getLegalPages = cache(() => readJson<LegalPage[]>(contentFile("legal.json")));

export const getPage = cache(<K extends PageKey>(key: K) =>
  readJson<PageContent[K]>(contentFile(`pages/${key}.json`)),
);

export async function getDestination(slug: string) {
  return (await getDestinations()).find((item) => item.slug === slug) ?? null;
}

export async function getPackage(slug: string) {
  return (await getPackages()).find((item) => item.slug === slug) ?? null;
}

export async function getArticle(slug: string) {
  return (await getArticles()).find((item) => item.slug === slug) ?? null;
}

export async function getLegalPage(slug: string) {
  return (await getLegalPages()).find((item) => item.slug === slug) ?? null;
}

/** Terms that actually have content, so filters and menus never lead to empty pages. */
export function termsInUse<T extends { slug: string }>(terms: T[], used: string[]) {
  return terms.filter((term) => used.includes(term.slug));
}

/** Related packages: same destination first, then shared styles, then anything else. */
export function relatedPackagesFor(destination: Destination, packages: TravelPackage[], limit = 3) {
  const picked = packages.filter((p) => p.destinationSlug === destination.slug);
  const styles = destination.styles.map((s) => s.toLowerCase());
  for (const p of packages) {
    if (picked.length >= limit) break;
    if (picked.includes(p)) continue;
    if (p.styles.some((s) => styles.includes(s.toLowerCase())) || p.type === styles[0]) picked.push(p);
  }
  for (const p of packages) {
    if (picked.length >= limit) break;
    if (!picked.includes(p)) picked.push(p);
  }
  return picked.slice(0, limit);
}

export async function getSearchIndex() {
  const [destinations, packages, articles, taxonomy] = await Promise.all([
    getDestinations(),
    getPackages(),
    getArticles(),
    getTaxonomy(),
  ]);
  return [
    ...destinations.map((d) => ({
      type: "Destination",
      title: d.title,
      description: d.description,
      meta: `${labelFor(taxonomy.regions, d.region)} destination`,
      image: d.image,
      url: `/destination/${d.slug}`,
      keywords: [d.name, d.country, d.region, d.bestTime, ...d.styles].join(" "),
    })),
    ...packages.map((p) => ({
      type: "Package",
      title: p.title,
      description: p.summary,
      meta: labelFor(taxonomy.packageTypes, p.type),
      image: p.image,
      url: `/package/${p.slug}`,
      keywords: [p.destination, p.type, p.duration, ...p.styles].join(" "),
    })),
    ...articles.map((a) => ({
      type: "Guide",
      title: a.title,
      description: a.excerpt,
      meta: labelFor(taxonomy.articleCategories, a.category),
      image: a.image,
      url: `/article/${a.slug}`,
      keywords: a.category,
    })),
  ];
}

export type SearchItem = Awaited<ReturnType<typeof getSearchIndex>>[number];
