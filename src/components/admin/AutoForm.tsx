"use client";

import { useState } from "react";
import { blank, isRecord, pathPattern, type Json, type SelectOptions } from "@/lib/admin/template";

type Path = (string | number)[];
type Ctx = { images: string[]; selects: SelectOptions; upload: (file: File) => Promise<string> };
type FieldProps = { path: Path; label: string; value: Json; template: Json; onChange: (value: Json) => void; ctx: Ctx };

const LONG_KEYS = new Set([
  "text", "description", "overview", "answer", "excerpt", "summary", "body", "quote", "pullQuote", "bio",
  "intro", "notice", "helpText", "showcaseText", "defaultDescription", "about", "signatureText", "ctaText",
  "pricingNote", "paragraphs", "summaryText",
]);

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-velnora-gold-luxury focus:ring-2 focus:ring-velnora-gold-luxury/20";
const labelClass = "block text-xs font-semibold text-slate-600 mb-1.5";
const iconButton =
  "inline-flex items-center justify-center w-8 h-8 rounded-md border border-slate-300 bg-white text-slate-500 hover:text-slate-900 hover:border-slate-400 disabled:opacity-30 disabled:pointer-events-none";

export function humanize(key: string) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());
}

function lastKey(path: Path) {
  for (let i = path.length - 1; i >= 0; i--) if (typeof path[i] === "string") return path[i] as string;
  return "";
}

const isImageKey = (key: string) => /image|avatar/i.test(key);
const isLong = (key: string, value: Json) => LONG_KEYS.has(key) || (typeof value === "string" && (value.length > 90 || value.includes("\n")));

function itemTitle(item: Json) {
  if (!isRecord(item)) return "";
  if (typeof item.day === "number") return `Day ${item.day}${typeof item.title === "string" && item.title ? ` — ${item.title}` : ""}`;
  for (const key of ["title", "name", "label", "question", "text"]) {
    const value = item[key];
    if (typeof value === "string" && value.trim()) return value.length > 70 ? `${value.slice(0, 70)}…` : value;
  }
  return "";
}

export function AutoForm({ value, template, onChange, ctx }: { value: Json; template: Json; onChange: (value: Json) => void; ctx: Ctx }) {
  return <Field path={[]} label="" value={value} template={template} onChange={onChange} ctx={ctx} />;
}

function Field(props: FieldProps) {
  const { path, label, value, template, onChange, ctx } = props;
  if (Array.isArray(template) || Array.isArray(value)) return <ListField {...props} />;
  if (isRecord(template) || isRecord(value)) return <GroupField {...props} />;

  const key = lastKey(path);
  const kind = typeof (value ?? template);

  if (kind === "boolean") {
    return (
      <label className="flex items-center gap-2 text-sm text-slate-700 pt-6">
        <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4 accent-[#c79a43]" />
        {label}
      </label>
    );
  }

  if (kind === "number") {
    return (
      <label className="block">
        {label && <span className={labelClass}>{label}</span>}
        <input type="number" value={Number(value ?? 0)} onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))} className={inputClass} />
      </label>
    );
  }

  const text = typeof value === "string" ? value : "";
  const options = ctx.selects[pathPattern(path)];

  if (options) {
    const known = options.some((o) => o.value === text);
    return (
      <label className="block">
        {label && <span className={labelClass}>{label}</span>}
        <select value={text} onChange={(e) => onChange(e.target.value)} className={inputClass}>
          {!known && <option value={text}>{text ? `${text} (unknown)` : "Choose…"}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (isImageKey(key)) return <ImageField label={label} value={text} onChange={onChange} ctx={ctx} />;

  if (key === "date" || key === "lastUpdated") {
    return (
      <label className="block">
        {label && <span className={labelClass}>{label}</span>}
        <input type="date" value={text} onChange={(e) => onChange(e.target.value)} className={inputClass} />
      </label>
    );
  }

  if (key === "icon") {
    return (
      <label className="block">
        {label && <span className={labelClass}>{label}</span>}
        <span className="flex items-center gap-2">
          <span className="w-9 h-9 shrink-0 rounded-md border border-slate-200 bg-slate-50 flex items-center justify-center text-velnora-gold-luxury">
            <i className={text} />
          </span>
          <input value={text} onChange={(e) => onChange(e.target.value)} placeholder="fa-solid fa-star" className={`${inputClass} font-mono text-xs`} />
        </span>
      </label>
    );
  }

  if (isLong(key, text)) {
    const rows = Math.min(14, Math.max(3, Math.ceil(text.length / 95) + text.split("\n").length - 1));
    return (
      <label className="block">
        {label && <span className={labelClass}>{label}</span>}
        <textarea value={text} rows={rows} onChange={(e) => onChange(e.target.value)} className={`${inputClass} leading-relaxed`} />
      </label>
    );
  }

  return (
    <label className="block">
      {label && <span className={labelClass}>{label}</span>}
      <input value={text} onChange={(e) => onChange(e.target.value)} className={`${inputClass} ${key === "slug" ? "font-mono text-xs" : ""}`} />
      {key === "slug" && <span className="mt-1 block text-[11px] text-slate-400">Used in the page address. Lowercase letters, numbers and dashes.</span>}
    </label>
  );
}

function GroupField({ path, label, value, template, onChange, ctx }: FieldProps) {
  const record = isRecord(value) ? value : {};
  const shape = isRecord(template) ? template : record;
  const keys = [...new Set([...Object.keys(shape), ...Object.keys(record)])];

  const body = (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {keys.map((key) => {
        const childTemplate = shape[key] ?? record[key] ?? "";
        const child = record[key] ?? blank(childTemplate);
        const wide = Array.isArray(childTemplate) || isRecord(childTemplate) || isLong(key, child) || isImageKey(key);
        return (
          <div key={key} className={`min-w-0 ${wide ? "sm:col-span-2" : ""}`}>
            <Field
              path={[...path, key]}
              label={humanize(key)}
              value={child}
              template={childTemplate}
              onChange={(next) => onChange({ ...record, [key]: next })}
              ctx={ctx}
            />
          </div>
        );
      })}
    </div>
  );

  if (path.length === 0 || typeof path[path.length - 1] === "number") return body;

  return (
    <fieldset className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
      <legend className="px-2 text-xs font-bold uppercase tracking-wider text-slate-500">{label}</legend>
      {body}
    </fieldset>
  );
}

function ListField({ path, label, value, template, onChange, ctx }: FieldProps) {
  const items = Array.isArray(value) ? value : [];
  const itemTemplate: Json = Array.isArray(template) && template.length ? template[0] : items.length ? items[0] : "";
  const objectItems = isRecord(itemTemplate);
  const singular = (humanize(lastKey(path)) || "Item").replace(/ies$/, "y").replace(/s$/, "");

  const update = (index: number, next: Json) => onChange(items.map((item, i) => (i === index ? next : item)));
  const remove = (index: number) => onChange(items.filter((_, i) => i !== index));
  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };
  const add = () => {
    let item = blank(itemTemplate);
    if (isRecord(item) && "day" in item) item = { ...item, day: items.length + 1 };
    onChange([...items, item]);
  };

  const controls = (index: number) => (
    <span className="flex items-center gap-1 shrink-0">
      <button type="button" aria-label="Move up" disabled={index === 0} className={iconButton} onClick={(e) => (e.preventDefault(), move(index, -1))}>
        <i className="fa-solid fa-arrow-up text-xs" />
      </button>
      <button type="button" aria-label="Move down" disabled={index === items.length - 1} className={iconButton} onClick={(e) => (e.preventDefault(), move(index, 1))}>
        <i className="fa-solid fa-arrow-down text-xs" />
      </button>
      <button type="button" aria-label="Remove" className={`${iconButton} hover:!text-red-600 hover:!border-red-300`} onClick={(e) => (e.preventDefault(), remove(index))}>
        <i className="fa-solid fa-trash-can text-xs" />
      </button>
    </span>
  );

  return (
    <div className={path.length === 0 ? "" : "rounded-xl border border-slate-200 bg-white p-4"}>
      {label && (
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
          {label} <span className="font-normal text-slate-400">({items.length})</span>
        </p>
      )}
      <div className="space-y-3">
        {items.map((item, index) =>
          objectItems ? (
            <details key={index} open={items.length <= 4} className="group rounded-lg border border-slate-200 bg-slate-50/50">
              <summary className="flex items-center justify-between gap-3 cursor-pointer px-4 py-2.5 text-sm font-medium text-slate-700 list-none [&::-webkit-details-marker]:hidden">
                <span className="truncate">
                  <i className="fa-solid fa-chevron-right text-[10px] mr-2 transition group-open:rotate-90" />
                  {itemTitle(item) || `${singular} ${index + 1}`}
                </span>
                {controls(index)}
              </summary>
              <div className="p-4 pt-2">
                <Field path={[...path, index]} label="" value={item} template={itemTemplate} onChange={(next) => update(index, next)} ctx={ctx} />
              </div>
            </details>
          ) : (
            <div key={index} className="flex items-start gap-2">
              <div className="flex-1 min-w-0">
                <Field path={[...path, index]} label="" value={item} template={itemTemplate} onChange={(next) => update(index, next)} ctx={ctx} />
              </div>
              {controls(index)}
            </div>
          ),
        )}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-3 inline-flex items-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-velnora-gold-luxury hover:text-velnora-navy-deep"
      >
        <i className="fa-solid fa-plus" /> Add {singular.toLowerCase()}
      </button>
    </div>
  );
}

function ImageField({ label, value, onChange, ctx }: { label: string; value: string; onChange: (value: Json) => void; ctx: Ctx }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inLibrary = ctx.images.includes(value);

  return (
    <div>
      {label && <span className={labelClass}>{label}</span>}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="w-full h-40 sm:w-24 sm:h-16 shrink-0 rounded-md border border-slate-200 bg-slate-100 overflow-hidden flex items-center justify-center">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="w-full h-full object-cover" />
          ) : (
            <i className="fa-regular fa-image text-slate-300" />
          )}
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <select value={inLibrary ? value : ""} onChange={(e) => e.target.value && onChange(e.target.value)} className={inputClass} aria-label={`${label || "Image"}: choose from library`}>
            <option value="">{value && !inLibrary ? "Custom path (see below)" : "Choose from library…"}</option>
            {ctx.images.map((src) => (
              <option key={src} value={src}>
                {src.replace(/^\/(images|uploads)\//, "")}
                {src.startsWith("/uploads/") ? " (uploaded)" : ""}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="/images/photo.png" className={`${inputClass} font-mono text-xs`} aria-label={`${label || "Image"} path`} />
            <label
              className={`shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-600 hover:border-velnora-gold-luxury cursor-pointer ${busy ? "opacity-50 pointer-events-none" : ""}`}
            >
              <i className="fa-solid fa-upload" /> {busy ? "Uploading…" : "Upload"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
                className="sr-only"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (!file) return;
                  setBusy(true);
                  setError("");
                  try {
                    onChange(await ctx.upload(file));
                  } catch (err) {
                    setError(err instanceof Error ? err.message : "Upload failed.");
                  } finally {
                    setBusy(false);
                  }
                }}
              />
            </label>
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
