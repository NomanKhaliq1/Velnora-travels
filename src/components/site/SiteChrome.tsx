import { getDestinations, getPackages, getSearchIndex, getSettings, getTaxonomy, termsInUse } from "@/lib/content";
import { Footer } from "./Footer";
import { Header } from "./Header";

/** Header + footer with menus built from the content, so empty regions/types never show up. */
export async function SiteChrome({ children }: { children: React.ReactNode }) {
  const [settings, taxonomy, destinations, packages, searchItems] = await Promise.all([
    getSettings(),
    getTaxonomy(),
    getDestinations(),
    getPackages(),
    getSearchIndex(),
  ]);

  const regionLinks = termsInUse(taxonomy.regions, destinations.map((d) => d.region)).map((r) => ({
    label: r.label,
    href: `/destinations/${r.slug}`,
  }));
  const packageLinks = termsInUse(taxonomy.packageTypes, packages.map((p) => p.type)).map((t) => ({
    label: t.label,
    href: `/packages/${t.slug}`,
  }));

  return (
    <>
      <Header
        siteName={settings.siteName}
        regionLinks={regionLinks}
        packageLinks={packageLinks}
        searchItems={searchItems}
        popularSearches={settings.searchPopular}
      />
      {children}
      <Footer settings={settings} regionLinks={regionLinks} packageLinks={packageLinks} />
    </>
  );
}
