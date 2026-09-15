import type { Metadata } from "next";
import { getPackages, getPage, getTaxonomy, labelFor, termsInUse } from "@/lib/content";
import { PackagesListing } from "@/components/listing/Listings";

type Props = { params: Promise<{ type: string }> };

export async function generateStaticParams() {
  const [taxonomy, packages] = await Promise.all([getTaxonomy(), getPackages()]);
  return termsInUse(taxonomy.packageTypes, packages.map((p) => p.type)).map((t) => ({ type: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;
  const [page, taxonomy] = await Promise.all([getPage("packages"), getTaxonomy()]);
  return { title: labelFor(taxonomy.packageTypes, type), description: page.seo.description, alternates: { canonical: `/packages/${type}` } };
}

export default async function PackageTypePage({ params }: Props) {
  const { type } = await params;
  return <PackagesListing type={type} />;
}
