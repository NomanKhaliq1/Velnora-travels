import type { Metadata } from "next";
import { SingletonEditorPage } from "@/components/admin/SingletonEditorPage";

export const metadata: Metadata = { title: "Regions & categories" };

export default function TaxonomyPage() {
  return (
    <SingletonEditorPage
      entry="taxonomy"
      title="Regions & categories"
      hint="Regions, travel styles, package types and article categories. Menus and filters only show entries that have content, so adding one here won't create an empty page."
    />
  );
}
