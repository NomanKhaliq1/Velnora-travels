import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COLLECTION_META } from "@/lib/admin/meta";
import { blank, mergeTemplate, type Json } from "@/lib/admin/template";
import { requireAdmin } from "@/lib/auth/session";
import { isCollectionKey, listImageChoices, readCollection, selectOptionsFor } from "@/lib/content/mutations";
import { ContentEditor } from "@/components/admin/ContentEditor";

type Props = { params: Promise<{ collection: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collection, slug } = await params;
  if (!isCollectionKey(collection)) return { title: "Not found" };
  return { title: slug === "new" ? `New ${COLLECTION_META[collection].singular}` : slug };
}

export default async function EditCollectionItemPage({ params }: Props) {
  await requireAdmin();
  const { collection, slug } = await params;
  if (!isCollectionKey(collection)) notFound();

  const [items, images, selects] = await Promise.all([readCollection(collection), listImageChoices(), selectOptionsFor(collection)]);
  const template = mergeTemplate(items);
  const isNew = slug === "new";
  const item = isNew ? blank(template) : (items.find((i) => i.slug === slug) as Json | undefined);
  if (item === undefined) notFound();

  const meta = COLLECTION_META[collection];

  return (
    <ContentEditor
      key={slug}
      title={isNew ? `New ${meta.singular}` : `Edit ${meta.singular}`}
      hint={meta.hint}
      target={{ kind: "collection", collection, originalSlug: isNew ? null : slug }}
      initialValue={item}
      template={template}
      images={images}
      selects={selects}
      viewHref={isNew ? undefined : meta.publicPath(slug)}
    />
  );
}
