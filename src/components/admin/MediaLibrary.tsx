"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteUploadAction, uploadImageAction } from "@/lib/actions/admin";

type Upload = { name: string; url: string; size: number; uploadedAt: string };

function Thumb({ src }: { src: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" loading="lazy" className="w-full h-32 object-cover rounded-t-lg bg-slate-100" />;
}

export function MediaLibrary({ uploads, builtIn }: { uploads: Upload[]; builtIn: string[] }) {
  const router = useRouter();
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [pending, startTransition] = useTransition();

  function upload(files: FileList | null) {
    if (!files?.length) return;
    startTransition(async () => {
      for (const file of Array.from(files)) {
        const data = new FormData();
        data.append("file", file);
        const res = await uploadImageAction(data);
        if (!res.ok) {
          setMessage({ text: `${file.name}: ${res.message}`, ok: false });
          return;
        }
      }
      setMessage({ text: files.length === 1 ? "Image uploaded." : `${files.length} images uploaded.`, ok: true });
      router.refresh();
    });
  }

  function remove(name: string) {
    if (!window.confirm("Delete this image?")) return;
    startTransition(async () => {
      const res = await deleteUploadAction(name);
      setMessage({ text: res.message, ok: res.ok });
      if (res.ok) router.refresh();
    });
  }

  async function copy(url: string) {
    await navigator.clipboard.writeText(url);
    setMessage({ text: `Copied ${url}`, ok: true });
  }

  return (
    <div className="space-y-10">
      <div>
        <label
          className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white px-6 py-10 text-center cursor-pointer hover:border-velnora-gold-luxury ${pending ? "opacity-60 pointer-events-none" : ""}`}
        >
          <i className="fa-solid fa-cloud-arrow-up text-2xl text-velnora-gold-luxury" />
          <span className="text-sm font-semibold text-velnora-navy-deep">{pending ? "Working…" : "Click to upload images"}</span>
          <span className="text-xs text-slate-500">JPG, PNG, WebP, AVIF or GIF</span>
          <input
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
            className="sr-only"
            onChange={(e) => {
              upload(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
        {message && (
          <p role="status" className={`mt-3 text-sm ${message.ok ? "text-green-700" : "text-red-600"}`}>
            {message.text}
          </p>
        )}
      </div>

      <section>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Uploaded ({uploads.length})</h2>
        {uploads.length === 0 ? (
          <p className="text-sm text-slate-500">Nothing uploaded yet.</p>
        ) : (
          <ul className="grid gap-4 grid-cols-2 sm:grid-cols-3 xl:grid-cols-5">
            {uploads.map((file) => (
              <li key={file.name} className="rounded-lg border border-slate-200 bg-white">
                <Thumb src={file.url} />
                <div className="p-2.5">
                  <p className="truncate text-xs text-slate-700" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-[11px] text-slate-400">{(file.size / 1024).toFixed(0)} KB</p>
                  <div className="mt-2 flex justify-between text-xs">
                    <button type="button" onClick={() => copy(file.url)} className="text-velnora-navy-deep hover:text-velnora-gold-luxury">
                      Copy path
                    </button>
                    <button type="button" onClick={() => remove(file.name)} className="text-red-600 hover:text-red-800">
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Built-in images ({builtIn.length})</h2>
        <ul className="grid gap-4 grid-cols-2 sm:grid-cols-3 xl:grid-cols-5">
          {builtIn.map((src) => (
            <li key={src} className="rounded-lg border border-slate-200 bg-white">
              <Thumb src={src} />
              <div className="p-2.5 flex items-center justify-between gap-2">
                <p className="truncate text-xs text-slate-700">{src.replace("/images/", "")}</p>
                <button type="button" onClick={() => copy(src)} className="text-xs text-velnora-navy-deep hover:text-velnora-gold-luxury shrink-0">
                  Copy
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
