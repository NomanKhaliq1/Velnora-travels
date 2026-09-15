import Link from "next/link";
import { COLLECTION_META } from "@/lib/admin/meta";
import { requireAdmin } from "@/lib/auth/session";
import { getArticles, getDestinations, getFaqs, getLegalPages, getPackages } from "@/lib/content";
import { listSubmissions } from "@/lib/submissions";

const TYPE_LABELS = { inquiry: "Trip inquiry", contact: "Contact message", newsletter: "Newsletter signup" };

export default async function AdminDashboard() {
  await requireAdmin();
  const [destinations, packages, articles, faqs, legal, submissions] = await Promise.all([
    getDestinations(),
    getPackages(),
    getArticles(),
    getFaqs(),
    getLegalPages(),
    listSubmissions(),
  ]);

  const cards = [
    { href: "/admin/submissions", label: "Unread in inbox", value: submissions.filter((s) => !s.read).length, icon: "fa-regular fa-envelope" },
    { href: "/admin/destinations", label: COLLECTION_META.destinations.label, value: destinations.length, icon: "fa-solid fa-earth-americas" },
    { href: "/admin/packages", label: COLLECTION_META.packages.label, value: packages.length, icon: "fa-solid fa-suitcase" },
    { href: "/admin/articles", label: "Articles", value: articles.length, icon: "fa-regular fa-newspaper" },
    { href: "/admin/faqs", label: "FAQs", value: faqs.length, icon: "fa-regular fa-circle-question" },
    { href: "/admin/legal", label: COLLECTION_META.legal.label, value: legal.length, icon: "fa-solid fa-scale-balanced" },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl text-velnora-navy-deep mb-1">Dashboard</h1>
      <p className="text-sm text-slate-500 mb-8">Everything on the public site comes from the content managed here.</p>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 mb-10">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 hover:border-velnora-gold-luxury transition">
            <span className="w-11 h-11 rounded-full bg-velnora-gold-luxury/10 text-velnora-gold-luxury flex items-center justify-center">
              <i className={card.icon} />
            </span>
            <span>
              <span className="block text-2xl font-semibold text-velnora-navy-deep">{card.value}</span>
              <span className="text-xs text-slate-500">{card.label}</span>
            </span>
          </Link>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-velnora-navy-deep">Latest submissions</h2>
          <Link href="/admin/submissions" className="text-xs text-velnora-gold-luxury hover:underline">
            Open inbox
          </Link>
        </div>
        {submissions.length === 0 ? (
          <p className="px-5 py-8 text-sm text-slate-500 text-center">Nothing yet. Inquiries, contact messages and newsletter signups will show up here.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {submissions.slice(0, 6).map((s) => (
              <li key={s.id} className="px-5 py-3 flex items-center gap-4 text-sm">
                {!s.read && <span className="w-2 h-2 rounded-full bg-velnora-gold-luxury shrink-0" aria-label="Unread" />}
                <span className="font-medium text-slate-800 truncate">{s.fields.name ?? s.fields.email}</span>
                <span className="text-xs text-slate-400 hidden sm:inline">{TYPE_LABELS[s.type]}</span>
                <span className="ml-auto text-xs text-slate-400 whitespace-nowrap">{new Date(s.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
