import type { SingletonKey } from "@/lib/admin/meta";
import { mergeTemplate, type Json } from "@/lib/admin/template";
import { requireAdmin } from "@/lib/auth/session";
import { listImageChoices, readSingleton, selectOptionsFor } from "@/lib/content/mutations";
import { ContentEditor } from "./ContentEditor";

export async function SingletonEditorPage({ entry, title, hint }: { entry: SingletonKey; title: string; hint: string }) {
  await requireAdmin();
  const [value, images, selects] = await Promise.all([readSingleton(entry), listImageChoices(), selectOptionsFor(entry)]);

  return (
    <ContentEditor
      title={title}
      hint={hint}
      target={{ kind: "singleton", key: entry }}
      initialValue={value as Json}
      template={mergeTemplate([value])}
      images={images}
      selects={selects}
    />
  );
}
