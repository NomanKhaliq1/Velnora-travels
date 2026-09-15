import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import { TravelGuideListing } from "@/components/listing/Listings";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPage("travel-guide");
  return { title: seo.title, description: seo.description, alternates: { canonical: "/travel-guide" } };
}

export default function TravelGuidePage() {
  return <TravelGuideListing />;
}
