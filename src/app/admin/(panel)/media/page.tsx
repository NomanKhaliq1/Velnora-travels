import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/session";
import { listImageChoices } from "@/lib/content/mutations";
import { listUploads } from "@/lib/uploads";
import { MediaLibrary } from "@/components/admin/MediaLibrary";

export const metadata: Metadata = { title: "Media" };

export default async function MediaPage() {
  await requireAdmin();
  const [uploads, all] = await Promise.all([listUploads(), listImageChoices()]);
  const builtIn = all.filter((src) => src.startsWith("/images/"));

  return (
    <div>
      <h1 className="font-serif text-3xl text-velnora-navy-deep">Media</h1>
      <p className="text-sm text-slate-500 mt-1 mb-6 max-w-2xl">
        Upload photos here or straight from any image field. Images are resized and converted automatically for visitors, so upload the best quality you have (up to 8 MB).
      </p>
      <MediaLibrary uploads={uploads} builtIn={builtIn} />
    </div>
  );
}
