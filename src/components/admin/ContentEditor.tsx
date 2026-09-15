"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  deleteCollectionItemAction,
  savePageAction,
  saveCollectionItemAction,
  saveSingletonAction,
  uploadImageAction,
} from "@/lib/actions/admin";
import type { Json, SelectOptions } from "@/lib/admin/template";
import type { SaveResult } from "@/lib/content/mutations";
import { AutoForm } from "./AutoForm";

type Target =
  | { kind: "collection"; collection: string; originalSlug: string | null }
  | { kind: "singleton"; key: string }
  | { kind: "page"; key: string };

export function ContentEditor({
  title,
  hint,
  target,
  initialValue,
  template,
  images: initialImages,
  selects,
  viewHref,
}: {
  title: string;
  hint?: string;
  target: Target;
  initialValue: Json;
  template: Json;
  images: string[];
  selects: SelectOptions;
  viewHref?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState<Json>(initialValue);
  const [saved, setSaved] = useState(() => JSON.stringify(initialValue));
  const [images, setImages] = useState(initialImages);
  const [result, setResult] = useState<SaveResult | null>(null);
  const [pending, startTransition] = useTransition();
  const dirty = JSON.stringify(value) !== saved;

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function upload(file: File) {
    const data = new FormData();
    data.append("file", file);
    const res = await uploadImageAction(data);
    if (!res.ok) throw new Error(res.message);
    setImages((list) => [res.url, ...list]);
    return res.url;
  }

  function showResult(res: SaveResult) {
    setResult(res);
    if (!res.ok) window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function save() {
    const snapshot = JSON.stringify(value);
    startTransition(async () => {
      const res =
        target.kind === "collection"
          ? await saveCollectionItemAction(target.collection, target.originalSlug, value)
          : target.kind === "singleton"
            ? await saveSingletonAction(target.key, value)
            : await savePageAction(target.key, value);
      showResult(res);
      if (!res.ok) return;
      setSaved(snapshot);
      if (target.kind === "collection" && res.slug && res.slug !== target.originalSlug) {
        router.replace(`/admin/${target.collection}/${res.slug}`);
      }
      router.refresh();
    });
  }

  function remove() {
    if (target.kind !== "collection" || !target.originalSlug) return;
    if (!window.confirm("Delete this item? This can't be undone.")) return;
    const { collection, originalSlug } = target;
    startTransition(async () => {
      const res = await deleteCollectionItemAction(collection, originalSlug);
      showResult(res);
      if (res.ok) {
        setSaved(JSON.stringify(value));
        router.push(`/admin/${collection}`);
        router.refresh();
      }
    });
  }

  return (
    <div className="pb-28">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-3xl text-velnora-navy-deep">{title}</h1>
          {hint && <p className="text-sm text-slate-500 mt-1 max-w-2xl">{hint}</p>}
        </div>
        {viewHref && (
          <Link
            href={viewHref}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:border-velnora-gold-luxury"
          >
            View on site <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
          </Link>
        )}
      </div>

      {result && !result.ok && (
        <div role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <p className="font-semibold">{result.message}</p>
          {result.issues.length > 0 && (
            <ul className="mt-2 list-disc pl-5 space-y-1 text-xs">
              {result.issues.map((issue) => (
                <li key={issue}>{issue}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <p className="mb-6 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-900">
        Formatting tip: in titles, wrap words in <code>*asterisks*</code> to use the gold accent style, and start a new line for a line break.
      </p>

      <AutoForm value={value} template={template} onChange={setValue} ctx={{ images, selects, upload }} />

      <div className="fixed bottom-0 right-0 left-0 lg:left-[240px] z-40 border-t border-slate-200 bg-white/95 backdrop-blur px-5 sm:px-8 lg:px-10 py-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={pending || !dirty}
          className="rounded-lg bg-velnora-navy-deep px-5 py-2.5 text-sm font-semibold text-white hover:bg-velnora-gold-luxury disabled:opacity-40"
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
        {dirty && !pending && (
          <button
            type="button"
            onClick={() => {
              setValue(JSON.parse(saved));
              setResult(null);
            }}
            className="text-sm text-slate-500 hover:text-slate-800"
          >
            Discard
          </button>
        )}
        <span className="text-xs text-slate-500" role="status">
          {dirty ? "Unsaved changes" : result?.ok ? result.message : ""}
        </span>
        {target.kind === "collection" && target.originalSlug && (
          <button type="button" onClick={remove} disabled={pending} className="ml-auto text-sm text-red-600 hover:text-red-800 disabled:opacity-40">
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
