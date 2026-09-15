import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { mergeTemplate, type Json } from "@/lib/admin/template";
import { requireAdmin } from "@/lib/auth/session";
import { isPageKey, listImageChoices, readPageContent, selectOptionsFor } from "@/lib/content/mutations";
import { PAGE_KEYS } from "@/lib/content/types";
import { ContentEditor } from "@/components/admin/ContentEditor";

type Props = { params: Promise<{ key: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { key } = await params;
  return { title: PAGE_KEYS.find((p) => p.key === key)?.label ?? "Not found" };
}

export default async function EditPageCopy({ params }: Props) {
  await requireAdmin();
  const { key } = await params;
  if (!isPageKey(key)) notFound();

  const [value, images, selects] = await Promise.all([readPageContent(key), listImageChoices(), selectOptionsFor(key)]);
  const page = PAGE_KEYS.find((p) => p.key === key)!;

  return (
    <ContentEditor
      key={key}
      title={page.label}
      hint="Lists can be reordered, extended or trimmed, but every entry keeps the same fields."
      target={{ kind: "page", key }}
      initialValue={value as Json}
      template={mergeTemplate([value])}
      images={images}
      selects={selects}
      viewHref={page.path}
    />
  );
}
