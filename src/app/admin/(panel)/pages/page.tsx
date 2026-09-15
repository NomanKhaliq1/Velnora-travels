import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import { PAGE_KEYS } from "@/lib/content/types";

export const metadata: Metadata = { title: "Page copy" };

export default async function PagesListPage() {
  await requireAdmin();

  return (
    <div>
      <h1 className="font-serif text-3xl text-velnora-navy-deep">Page copy</h1>
      <p className="text-sm text-slate-500 mt-1 mb-6 max-w-2xl">
        Headings, text, images and buttons for each page. The “template” entries hold the shared wording used on every destination, package or article page.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {PAGE_KEYS.map((page) => (
          <Link
            key={page.key}
            href={`/admin/pages/${page.key}`}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 hover:border-velnora-gold-luxury transition"
          >
            <span>
              <span className="block font-medium text-velnora-navy-deep">{page.label}</span>
              <span className="text-xs text-slate-400 font-mono">{page.path}</span>
            </span>
            <i className="fa-solid fa-chevron-right text-xs text-slate-300" />
          </Link>
        ))}
      </div>
    </div>
  );
}
