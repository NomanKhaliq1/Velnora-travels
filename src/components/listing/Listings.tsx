import { notFound } from "next/navigation";
import { getArticles, getDestinations, getPackages, getPage, getTaxonomy, termsInUse } from "@/lib/content";
import { CenteredHero } from "@/components/site/CenteredHero";
import { NewsletterBanner } from "@/components/site/NewsletterBanner";
import { PlanningCta } from "@/components/site/PlanningCta";
import { RegionCards } from "@/components/site/RegionCards";
import { ArticlesBrowser } from "./ArticlesBrowser";
import { DestinationsBrowser } from "./DestinationsBrowser";
import { PackagesBrowser } from "./PackagesBrowser";

// Shared by /destinations and /destinations/[region] (and the same for packages and the guide).

export async function DestinationsListing({ region = "" }: { region?: string }) {
  const [page, taxonomy, destinations] = await Promise.all([getPage("destinations"), getTaxonomy(), getDestinations()]);
  if (region && !taxonomy.regions.some((r) => r.slug === region)) notFound();
  const regions = termsInUse(taxonomy.regions, destinations.map((d) => d.region));

  return (
    <>
      <DestinationsBrowser
        hero={{ ...page.hero, cta: { label: page.hero.ctaLabel, href: "/contact#trip-inquiry" } }}
        destinations={destinations}
        regions={regions}
        styles={termsInUse(taxonomy.travelStyles, destinations.flatMap((d) => d.styles.map((s) => s.toLowerCase())))}
        initialRegion={region}
      />
      <RegionCards title={page.regionsTitle} regions={regions} />
      <PlanningCta cta={page.cta} />
    </>
  );
}

export async function PackagesListing({ type = "" }: { type?: string }) {
  const [page, taxonomy, packages, destinations] = await Promise.all([getPage("packages"), getTaxonomy(), getPackages(), getDestinations()]);
  if (type && !taxonomy.packageTypes.some((t) => t.slug === type)) notFound();

  return (
    <>
      <PackagesBrowser
        hero={{ ...page.hero, cta: { label: page.hero.ctaLabel, href: "/contact#trip-inquiry" } }}
        packages={packages}
        types={termsInUse(taxonomy.packageTypes, packages.map((p) => p.type))}
        initialType={type}
      />
      <RegionCards title={page.regionsTitle} regions={termsInUse(taxonomy.regions, destinations.map((d) => d.region))} />
      <PlanningCta cta={page.cta} />
    </>
  );
}

export async function TravelGuideListing({ category = "" }: { category?: string }) {
  const [page, taxonomy, articles] = await Promise.all([getPage("travel-guide"), getTaxonomy(), getArticles()]);
  if (category && !taxonomy.articleCategories.some((c) => c.slug === category)) notFound();

  return (
    <>
      <CenteredHero
        hero={page.hero}
        sectionClassName="relative min-h-[440px] lg:min-h-[480px] bg-[#051124] text-white overflow-hidden rounded-b-[24px]"
        gradientClassName="bg-gradient-to-r from-[#051124]/95 via-[#051124]/75 to-transparent"
        contentClassName="relative max-w-[1400px] mx-auto px-6 lg:px-10 pt-32 lg:pt-36 pb-20 z-10 text-center"
        titleClassName="font-serif text-[42px] sm:text-[54px] lg:text-[66px] leading-[1.1] font-normal text-white mt-4 mb-2"
        dividerClassName="flex items-center justify-center gap-3 mt-4 mb-5"
        textClassName="text-white/80 max-w-[550px] mx-auto text-sm leading-relaxed font-light"
      />
      <ArticlesBrowser articles={articles} categories={taxonomy.articleCategories} initialCategory={category} />
      <NewsletterBanner title={page.newsletter.title} text={page.newsletter.text} sectionClassName="py-16 bg-[#FAF9F6] text-white" />
    </>
  );
}
