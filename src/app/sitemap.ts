import type { MetadataRoute } from "next";
import { getArticles, getDestinations, getLegalPages, getPackages } from "@/lib/content";
import { siteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [destinations, packages, articles, legal] = await Promise.all([getDestinations(), getPackages(), getArticles(), getLegalPages()]);

  const staticPages = ["/", "/about", "/contact", "/destinations", "/packages", "/travel-guide", "/faqs"];

  return [
    ...staticPages.map((path) => ({ url: siteUrl(path), changeFrequency: "weekly" as const, priority: path === "/" ? 1 : 0.8 })),
    ...destinations.map((d) => ({ url: siteUrl(`/destination/${d.slug}`), changeFrequency: "monthly" as const, priority: 0.7 })),
    ...packages.map((p) => ({ url: siteUrl(`/package/${p.slug}`), changeFrequency: "monthly" as const, priority: 0.7 })),
    ...articles.map((a) => ({ url: siteUrl(`/article/${a.slug}`), lastModified: a.date, changeFrequency: "yearly" as const, priority: 0.6 })),
    ...legal.map((l) => ({ url: siteUrl(`/${l.slug}`), lastModified: l.lastUpdated, changeFrequency: "yearly" as const, priority: 0.3 })),
  ];
}
