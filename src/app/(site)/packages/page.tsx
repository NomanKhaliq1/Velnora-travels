import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import { PackagesListing } from "@/components/listing/Listings";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPage("packages");
  return { title: seo.title, description: seo.description, alternates: { canonical: "/packages" } };
}

export default function PackagesPage() {
  return <PackagesListing />;
}
