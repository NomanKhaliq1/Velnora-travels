import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { z } from "zod";
import { COLLECTION_KEYS, COLLECTION_META, SINGLETON_KEYS, type CollectionKey, type SingletonKey } from "@/lib/admin/meta";
import type { SelectOptions } from "@/lib/admin/template";
import { listUploads } from "@/lib/uploads";
import { articleSchema, destinationSchema, faqsSchema, legalSchema, packageSchema, settingsSchema, taxonomySchema } from "./schemas";
import { shapeErrors } from "./shape";
import { CONTENT_DIR, readJson, updateJson, writeJson } from "./store";
import { PAGE_KEYS, type Article, type Destination, type PageKey, type Taxonomy, type TravelPackage } from "./types";

export type SaveResult = { ok: true; message: string; slug?: string } | { ok: false; message: string; issues: string[] };

type Item = { slug: string } & Record<string, unknown>;

const contentFile = (name: string) => path.join(CONTENT_DIR, name);
const collectionFile = (key: CollectionKey) => contentFile(`${key}.json`);
const failure = (message: string, issues: string[] = []): SaveResult => ({ ok: false, message, issues });

const collectionSchemas = {
  destinations: destinationSchema,
  packages: packageSchema,
  articles: articleSchema,
  legal: legalSchema,
} as const;

const singletonSchemas = { settings: settingsSchema, taxonomy: taxonomySchema, faqs: faqsSchema } as const;

// Top-level paths legal pages can't take, plus "new" which the admin uses for the create screen.
const RESERVED_SLUGS = new Set([
  "new", "about", "contact", "destinations", "packages", "travel-guide", "faqs", "admin",
  "uploads", "destination", "package", "article", "images", "vendor", "api",
]);

export const isCollectionKey = (value: unknown): value is CollectionKey =>
  typeof value === "string" && (COLLECTION_KEYS as readonly string[]).includes(value);
export const isSingletonKey = (value: unknown): value is SingletonKey =>
  typeof value === "string" && (SINGLETON_KEYS as readonly string[]).includes(value);
export const isPageKey = (value: unknown): value is PageKey =>
  typeof value === "string" && PAGE_KEYS.some((page) => page.key === value);

function zodIssues(error: z.ZodError) {
  return error.issues.map((issue) => `${issue.path.length ? `${issue.path.join(" › ")}: ` : ""}${issue.message}`);
}

export function readCollection(key: CollectionKey) {
  return readJson<Item[]>(collectionFile(key));
}

export function readSingleton(key: SingletonKey) {
  return readJson<unknown>(contentFile(`${key}.json`));
}

export function readPageContent(key: PageKey) {
  return readJson<unknown>(contentFile(`pages/${key}.json`));
}

async function referenceIssues(key: CollectionKey, item: Item) {
  const taxonomy = await readJson<Taxonomy>(contentFile("taxonomy.json"));
  const issues: string[] = [];
  if (RESERVED_SLUGS.has(item.slug)) issues.push(`slug: "${item.slug}" is reserved by the site, pick another one`);
  if (key === "destinations" && !taxonomy.regions.some((r) => r.slug === item.region)) {
    issues.push(`region: "${item.region}" isn't a known region. Add it under Regions & categories first.`);
  }
  if (key === "packages") {
    if (!taxonomy.packageTypes.some((t) => t.slug === item.type)) {
      issues.push(`type: "${item.type}" isn't a known package type. Add it under Regions & categories first.`);
    }
    if (item.destinationSlug) {
      const destinations = await readCollection("destinations");
      if (!destinations.some((d) => d.slug === item.destinationSlug)) {
        issues.push(`destinationSlug: there is no destination with the slug "${item.destinationSlug}"`);
      }
    }
  }
  if (key === "articles" && !taxonomy.articleCategories.some((c) => c.slug === item.category)) {
    issues.push(`category: "${item.category}" isn't a known category. Add it under Regions & categories first.`);
  }
  return issues;
}

async function renameDestinationReferences(from: string, to: string) {
  await updateJson<TravelPackage[]>(collectionFile("packages"), [], (packages) =>
    packages.map((p) => (p.destinationSlug === from ? { ...p, destinationSlug: to } : p)),
  );
  await updateJson<{ popularDestinations?: { cards?: { slug: string }[] } }>(contentFile("pages/home.json"), {}, (home) => {
    for (const card of home.popularDestinations?.cards ?? []) {
      if (card.slug === from) card.slug = to;
    }
    return home;
  });
}

export async function saveCollectionItem(key: CollectionKey, originalSlug: string | null, input: unknown): Promise<SaveResult> {
  const parsed = collectionSchemas[key].safeParse(input);
  if (!parsed.success) return failure("Please fix the problems below.", zodIssues(parsed.error));

  const item = parsed.data as Item;
  const issues = await referenceIssues(key, item);
  if (issues.length) return failure("Please fix the problems below.", issues);

  let problem = "";
  await updateJson<Item[]>(collectionFile(key), [], (items) => {
    if (items.some((existing) => existing.slug === item.slug && existing.slug !== originalSlug)) {
      problem = `Another ${COLLECTION_META[key].singular} already uses the slug "${item.slug}".`;
      return items;
    }
    if (originalSlug === null) return [item, ...items];
    const index = items.findIndex((existing) => existing.slug === originalSlug);
    if (index === -1) {
      problem = "This item no longer exists. It may have been deleted in another tab.";
      return items;
    }
    return items.map((existing, i) => (i === index ? item : existing));
  });
  if (problem) return failure(problem);

  if (key === "destinations" && originalSlug && originalSlug !== item.slug) {
    await renameDestinationReferences(originalSlug, item.slug);
  }
  return { ok: true, message: "Saved. The live site is updated.", slug: item.slug };
}

export async function deleteCollectionItem(key: CollectionKey, slug: string): Promise<SaveResult> {
  const items = await readCollection(key);
  if (!items.some((item) => item.slug === slug)) return failure("This item no longer exists.");
  if (items.length === 1) {
    return failure(`Keep at least one ${COLLECTION_META[key].singular}. The editor uses existing entries as the template for new ones.`);
  }

  if (key === "destinations") {
    const packages = await readJson<TravelPackage[]>(collectionFile("packages"));
    const linked = packages.filter((p) => p.destinationSlug === slug).map((p) => p.title);
    const home = await readJson<{ popularDestinations: { cards: { slug: string }[] } }>(contentFile("pages/home.json"));
    const issues = [
      ...linked.map((title) => `The package “${title}” is linked to this destination.`),
      ...(home.popularDestinations.cards.some((c) => c.slug === slug) ? ["The home page's Popular Destinations section shows this destination."] : []),
    ];
    if (issues.length) return failure("This destination is still in use. Change these first:", issues);
  }

  await updateJson<Item[]>(collectionFile(key), [], (current) => current.filter((item) => item.slug !== slug));
  return { ok: true, message: "Deleted." };
}

export async function saveSingleton(key: SingletonKey, input: unknown): Promise<SaveResult> {
  const parsed = singletonSchemas[key].safeParse(input);
  if (!parsed.success) return failure("Please fix the problems below.", zodIssues(parsed.error));

  if (key === "taxonomy") {
    const taxonomy = parsed.data as Taxonomy;
    const [destinations, packages, articles] = await Promise.all([
      readJson<Destination[]>(collectionFile("destinations")),
      readJson<TravelPackage[]>(collectionFile("packages")),
      readJson<Article[]>(collectionFile("articles")),
    ]);
    const missing = (label: string, used: string[], terms: { slug: string }[]) =>
      [...new Set(used)].filter((slug) => !terms.some((t) => t.slug === slug)).map((slug) => `${label} “${slug}” is still used by existing content.`);
    const issues = [
      ...missing("Region", destinations.map((d) => d.region), taxonomy.regions),
      ...missing("Package type", packages.map((p) => p.type), taxonomy.packageTypes),
      ...missing("Article category", articles.map((a) => a.category), taxonomy.articleCategories),
    ];
    if (issues.length) return failure("Some removed or renamed entries are still in use:", issues);
  }

  await writeJson(contentFile(`${key}.json`), parsed.data);
  return { ok: true, message: "Saved. The live site is updated." };
}

export async function savePageContent(key: PageKey, input: unknown): Promise<SaveResult> {
  const current = await readPageContent(key);
  const issues = shapeErrors(current, input);
  if (issues.length) return failure("The page content doesn't match the expected structure.", issues.slice(0, 20));
  await writeJson(contentFile(`pages/${key}.json`), input);
  return { ok: true, message: "Saved. The live site is updated." };
}

export async function listImageChoices() {
  const publicDir = path.join(process.cwd(), "public", "images");
  const builtIn = (await fs.readdir(publicDir)).filter((name) => /\.(png|jpe?g|webp|avif|gif|svg)$/i.test(name)).map((name) => `/images/${name}`);
  const uploads = (await listUploads()).map((upload) => upload.url);
  return [...uploads, ...builtIn];
}

/** True when any content file still references the given image URL. */
export async function isImageInUse(url: string) {
  const files = ["settings.json", "destinations.json", "packages.json", "articles.json", "legal.json", ...PAGE_KEYS.map((p) => `pages/${p.key}.json`)];
  for (const name of files) {
    const text = await fs.readFile(contentFile(name), "utf8").catch(() => "");
    if (text.includes(`"${url}"`)) return true;
  }
  return false;
}

export async function selectOptionsFor(kind: string): Promise<SelectOptions> {
  const [taxonomy, destinations] = await Promise.all([
    readJson<Taxonomy>(contentFile("taxonomy.json")),
    readJson<Destination[]>(collectionFile("destinations")),
  ]);
  const terms = (list: { slug: string; label: string }[]) => list.map((t) => ({ value: t.slug, label: t.label }));
  const destinationOptions = destinations.map((d) => ({ value: d.slug, label: d.title }));

  switch (kind) {
    case "destinations":
      return { region: terms(taxonomy.regions), "styles[]": terms(taxonomy.travelStyles) };
    case "packages":
      return { type: terms(taxonomy.packageTypes), destinationSlug: [{ value: "", label: "No linked destination" }, ...destinationOptions] };
    case "articles":
      return {
        category: terms(taxonomy.articleCategories),
        "content[].type": [
          { value: "paragraph", label: "Paragraph" },
          { value: "heading", label: "Heading" },
        ],
      };
    case "home":
      return { "popularDestinations.cards[].slug": destinationOptions };
    default:
      return {};
  }
}
