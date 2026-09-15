import type { Metadata } from "next";
import { getPage, getTaxonomy, labelFor } from "@/lib/content";
import { TravelGuideListing } from "@/components/listing/Listings";

type Props = { params: Promise<{ category: string }> };

export async function generateStaticParams() {
  const taxonomy = await getTaxonomy();
  return taxonomy.articleCategories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const [page, taxonomy] = await Promise.all([getPage("travel-guide"), getTaxonomy()]);
  return {
    title: `${labelFor(taxonomy.articleCategories, category)} | Travel Guide`,
    description: page.seo.description,
    alternates: { canonical: `/travel-guide/category/${category}` },
  };
}

export default async function TravelGuideCategoryPage({ params }: Props) {
  const { category } = await params;
  return <TravelGuideListing category={category} />;
}
