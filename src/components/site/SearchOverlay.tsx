"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useRef, useState } from "react";
import type { SearchItem } from "@/lib/content/types-search";

function score(item: SearchItem, query: string) {
  const title = item.title.toLowerCase();
  if (title === query) return 100;
  if (title.includes(query)) return 80;
  if (`${item.meta} ${item.description} ${item.keywords}`.toLowerCase().includes(query)) return 50;
  return 0;
}

function matches(items: SearchItem[], raw: string) {
  const query = raw.trim().toLowerCase();
  if (query.length < 2) return [];
  return items
    .map((item) => ({ item, score: score(item, query) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
    .slice(0, 8)
    .map((entry) => entry.item);
}

export function SearchOverlay({
  open,
  onClose,
  items,
  popular,
}: {
  open: boolean;
  onClose: () => void;
  items: SearchItem[];
  popular: { label: string; href: string }[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const results = matches(items, query);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  function submit(event: FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    onClose();
    router.push(results[0]?.url ?? `/destinations?search=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      className="fixed inset-0 bg-[#051124] z-[999] flex items-center justify-center px-5 py-8"
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <button type="button" onClick={onClose} aria-label="Close search" className="absolute top-6 right-6 sm:top-10 sm:right-10 text-white hover:text-velnora-gold-soft text-3xl">
        <i className="fa-solid fa-xmark" />
      </button>
      <div className="global-search-panel w-full max-w-[760px] flex flex-col gap-5 text-center rounded-[28px] border border-white/10 bg-[#071827] p-5 sm:p-8 shadow-2xl">
        <h2 className="font-serif text-3xl font-normal text-white">Search Velnora Travel</h2>
        <form onSubmit={submit} className="relative flex items-center" role="search">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Where would you like to go?"
            aria-label="Search destinations, packages and guides"
            className="w-full bg-[#0B2032] border border-white/15 rounded-2xl py-4 pl-5 pr-12 text-lg sm:text-xl text-white placeholder-white/65 font-sans outline-none focus:border-velnora-gold-luxury transition shadow-inner"
          />
          <button type="submit" aria-label="Search" className="absolute right-4 text-white hover:text-velnora-gold-luxury text-xl">
            <i className="fa-solid fa-magnifying-glass" />
          </button>
        </form>

        {query.trim().length >= 2 && (
          <div className="max-h-[46vh] overflow-y-auto rounded-[18px] border border-white/10 bg-white/[0.07] p-3 text-left shadow-2xl">
            {results.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="font-serif text-xl text-white">No results found</p>
                <p className="mt-2 text-sm text-white/60">Try a destination, package type, cruise, visa, or guide topic.</p>
              </div>
            ) : (
              results.map((item) => (
                <Link
                  key={item.url}
                  href={item.url}
                  onClick={onClose}
                  className="search-result group grid grid-cols-[72px_1fr] gap-4 rounded-[14px] p-3 transition hover:bg-white/10"
                >
                  <Image src={item.image} alt="" width={72} height={72} className="h-[72px] w-[72px] rounded-[12px] object-cover" />
                  <span className="min-w-0">
                    <span className="mb-1 inline-flex text-[10px] font-bold uppercase tracking-[2px] text-velnora-gold-soft">
                      {item.type} · {item.meta}
                    </span>
                    <span className="block truncate font-serif text-xl text-white group-hover:text-velnora-gold-soft transition">{item.title}</span>
                    <span className="mt-1 block line-clamp-2 text-sm leading-6 text-white/65">{item.description}</span>
                  </span>
                </Link>
              ))
            )}
          </div>
        )}

        {popular.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3 text-[13.5px] mt-2.5">
            <span className="text-white/60">Popular:</span>
            {popular.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={onClose}
                className="text-velnora-gold-soft border-b border-dotted border-velnora-gold-soft hover:text-white hover:border-white transition"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
