import type { Metadata } from "next";
import { SingletonEditorPage } from "@/components/admin/SingletonEditorPage";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <SingletonEditorPage
      entry="settings"
      title="Settings"
      hint="Site name, contact details, social links, footer text and the home page video. Leave a social link or the video URL empty to hide it."
    />
  );
}
