import type { Metadata } from "next";
import { getDestinations, getPage, getTaxonomy, labelFor, termsInUse } from "@/lib/content";
import { DestinationsListing } from "@/components/listing/Listings";

type Props = { params: Promise<{ region: string }> };

export async function generateStaticParams() {
  const [taxonomy, destinations] = await Promise.all([getTaxonomy(), getDestinations()]);
  return termsInUse(taxonomy.regions, destinations.map((d) => d.region)).map((r) => ({ region: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { region } = await params;
  const [page, taxonomy] = await Promise.all([getPage("destinations"), getTaxonomy()]);
  const label = labelFor(taxonomy.regions, region);
  return { title: `${label} Destinations`, description: page.seo.description, alternates: { canonical: `/destinations/${region}` } };
}

export default async function RegionPage({ params }: Props) {
  const { region } = await params;
  return <DestinationsListing region={region} />;
}
