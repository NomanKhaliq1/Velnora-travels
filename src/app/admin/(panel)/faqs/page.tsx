import type { Metadata } from "next";
import { SingletonEditorPage } from "@/components/admin/SingletonEditorPage";

export const metadata: Metadata = { title: "FAQs" };

export default function FaqsAdminPage() {
  return (
    <SingletonEditorPage
      entry="faqs"
      title="FAQs"
      hint="Shown on /faqs and /contact. The home page shows the first few, so keep the most useful questions at the top."
    />
  );
}
