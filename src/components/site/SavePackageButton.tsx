"use client";

import { useSyncExternalStore } from "react";

const KEY = "velnora:saved-packages";
const EVENT = "velnora:saved-packages-changed";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

function readSaved(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function SavePackageButton({ slug }: { slug: string }) {
  const raw = useSyncExternalStore(subscribe, () => localStorage.getItem(KEY) ?? "[]", () => "[]");
  const saved = readSaved(raw);
  const isSaved = saved.includes(slug);

  function toggle() {
    const next = isSaved ? saved.filter((s) => s !== slug) : [...saved, slug];
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVENT));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isSaved}
      className="border border-white/35 hover:bg-white/10 hover:border-white text-white rounded-xl font-bold py-3.5 text-center text-xs tracking-widest uppercase transition duration-300 w-full flex items-center justify-center gap-2"
    >
      <i className={isSaved ? "fa-solid fa-heart text-velnora-gold-luxury" : "fa-regular fa-heart"} />
      {isSaved ? "SAVED" : "SAVE THIS PACKAGE"}
    </button>
  );
}
