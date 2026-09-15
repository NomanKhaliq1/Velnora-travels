import type { Metadata } from "next";
import Link from "next/link";
import { deleteSubmissionAction, setSubmissionReadAction } from "@/lib/actions/admin";
import { requireAdmin } from "@/lib/auth/session";
import { listSubmissions, type SubmissionType } from "@/lib/submissions";

export const metadata: Metadata = { title: "Inbox" };

const TYPES: { value: SubmissionType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "inquiry", label: "Trip inquiries" },
  { value: "contact", label: "Contact messages" },
  { value: "newsletter", label: "Newsletter" },
];

const FIELD_LABELS: Record<string, string> = { trip_type: "Travel type", referral: "Heard about us via" };
const label = (key: string) => FIELD_LABELS[key] ?? key.charAt(0).toUpperCase() + key.slice(1);

type Props = { searchParams: Promise<{ type?: string }> };

export default async function SubmissionsPage({ searchParams }: Props) {
  await requireAdmin();
  const { type = "all" } = await searchParams;
  const all = await listSubmissions();
  const submissions = type === "all" ? all : all.filter((s) => s.type === type);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-3xl text-velnora-navy-deep">Inbox</h1>
          <p className="text-sm text-slate-500 mt-1">Every form submitted on the site is stored here.</p>
        </div>
        {all.length > 0 && (
          // A file download, so a plain link rather than client-side navigation.
          // eslint-disable-next-line @next/next/no-html-link-for-pages
          <a
            href="/admin/submissions/export"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:border-velnora-gold-luxury"
          >
            <i className="fa-solid fa-file-csv" /> Export CSV
          </a>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {TYPES.map((t) => {
          const count = t.value === "all" ? all.length : all.filter((s) => s.type === t.value).length;
          const active = type === t.value;
          return (
            <Link
              key={t.value}
              href={t.value === "all" ? "/admin/submissions" : `/admin/submissions?type=${t.value}`}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold border ${
                active ? "bg-velnora-navy-deep text-white border-velnora-navy-deep" : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"
              }`}
            >
              {t.label} <span className="opacity-60">{count}</span>
            </Link>
          );
        })}
      </div>

      {submissions.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white px-5 py-12 text-center text-sm text-slate-500">No submissions here yet.</p>
      ) : (
        <ul className="space-y-3">
          {submissions.map((s) => (
            <li key={s.id} className={`rounded-xl border bg-white ${s.read ? "border-slate-200" : "border-velnora-gold-luxury/50 shadow-sm"}`}>
              <details className="group">
                <summary className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  {!s.read && <span className="w-2 h-2 rounded-full bg-velnora-gold-luxury" aria-label="Unread" />}
                  <span className="font-medium text-slate-800">{s.fields.name ?? s.fields.email}</span>
                  <span className="text-xs text-slate-500">{TYPES.find((t) => t.value === s.type)?.label}</span>
                  {s.fields.destination && <span className="text-xs text-slate-500">· {s.fields.destination}</span>}
                  <span className="ml-auto text-xs text-slate-400">{new Date(s.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</span>
                  <i className="fa-solid fa-chevron-down text-[10px] text-slate-400 transition group-open:rotate-180" />
                </summary>
                <div className="border-t border-slate-100 px-5 py-4">
                  <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2 text-sm">
                    {Object.entries(s.fields).map(([key, value]) => (
                      <div key={key} className={key === "message" ? "sm:col-span-2" : ""}>
                        <dt className="text-xs font-semibold text-slate-500">{label(key)}</dt>
                        <dd className="text-slate-800 whitespace-pre-wrap break-words">
                          {key === "email" ? (
                            <a href={`mailto:${value}`} className="text-velnora-navy-deep underline">
                              {value}
                            </a>
                          ) : (
                            value
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-4 flex items-center gap-4">
                    <form action={setSubmissionReadAction.bind(null, s.id, !s.read)}>
                      <button type="submit" className="text-xs font-semibold text-velnora-navy-deep hover:text-velnora-gold-luxury">
                        Mark as {s.read ? "unread" : "read"}
                      </button>
                    </form>
                    <form action={deleteSubmissionAction.bind(null, s.id)}>
                      <button type="submit" className="text-xs text-red-600 hover:text-red-800">
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
