import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COLLECTION_META } from "@/lib/admin/meta";
import { requireAdmin } from "@/lib/auth/session";
import { isCollectionKey, readCollection } from "@/lib/content/mutations";

type Props = { params: Promise<{ collection: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collection } = await params;
  return { title: isCollectionKey(collection) ? COLLECTION_META[collection].label : "Not found" };
}

export default async function CollectionListPage({ params }: Props) {
  await requireAdmin();
  const { collection } = await params;
  if (!isCollectionKey(collection)) notFound();

  const meta = COLLECTION_META[collection];
  const items = await readCollection(collection);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-3xl text-velnora-navy-deep">{meta.label}</h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">{meta.hint}</p>
        </div>
        <Link
          href={`/admin/${collection}/new`}
          className="inline-flex items-center gap-2 rounded-lg bg-velnora-navy-deep px-4 py-2.5 text-sm font-semibold text-white hover:bg-velnora-gold-luxury"
        >
          <i className="fa-solid fa-plus text-xs" /> New {meta.singular}
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold hidden md:table-cell">{meta.detailLabel}</th>
              <th className="px-4 py-3 font-semibold hidden sm:table-cell">Slug</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.slug} className="border-t border-slate-100 hover:bg-slate-50/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {typeof item.image === "string" && item.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt="" className="w-12 h-9 rounded object-cover shrink-0" />
                    )}
                    <Link href={`/admin/${collection}/${item.slug}`} className="font-medium text-velnora-navy-deep hover:text-velnora-gold-luxury">
                      {String(item.title ?? item.slug)}
                    </Link>
                    {item.featured === true && <span className="rounded-full bg-velnora-gold-luxury/15 px-2 py-0.5 text-[10px] font-semibold text-velnora-gold-luxury">Featured</span>}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500 hidden md:table-cell">{String(item[meta.detailKey] ?? "")}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-400 hidden sm:table-cell">{item.slug}</td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <Link href={`/admin/${collection}/${item.slug}`} className="text-xs font-semibold text-velnora-navy-deep hover:text-velnora-gold-luxury mr-4">
                    Edit
                  </Link>
                  <Link href={meta.publicPath(item.slug)} target="_blank" className="text-xs text-slate-400 hover:text-slate-700">
                    View <i className="fa-solid fa-arrow-up-right-from-square text-[9px]" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
