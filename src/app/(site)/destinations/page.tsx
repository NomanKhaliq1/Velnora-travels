import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import { DestinationsListing } from "@/components/listing/Listings";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPage("destinations");
  return { title: seo.title, description: seo.description, alternates: { canonical: "/destinations" } };
}

export default function DestinationsPage() {
  return <DestinationsListing />;
}
