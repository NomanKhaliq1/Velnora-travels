"use client";

import { useEffect, useState } from "react";

function embedUrl(url: string) {
  try {
    const parsed = new URL(url);
    const youtubeId = parsed.hostname.includes("youtube.com")
      ? parsed.searchParams.get("v")
      : parsed.hostname === "youtu.be"
        ? parsed.pathname.slice(1)
        : null;
    if (youtubeId) return `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;
    if (parsed.hostname === "vimeo.com") return `https://player.vimeo.com/video${parsed.pathname}?autoplay=1`;
    return url;
  } catch {
    return url;
  }
}

export function VideoButton({ label, url }: { label: string; url: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="border border-white/15 bg-white/5 backdrop-blur-md text-white px-8 h-[52px] rounded font-bold text-xs tracking-wider transition duration-300 hover:bg-white/10 hover:border-white hover:-translate-y-0.5 flex items-center justify-center gap-2"
      >
        <span className="w-[22px] h-[22px] rounded-full border border-white/60 flex items-center justify-center text-[8px] pl-0.5">
          <i className="fa-solid fa-play" />
        </span>
        {label}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={label}
          className="fixed inset-0 bg-velnora-navy-deep/95 backdrop-blur-lg z-[1000] flex items-center justify-center"
          onClick={(event) => event.target === event.currentTarget && setOpen(false)}
        >
          <div className="relative w-[90%] max-w-[900px] aspect-video bg-black rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close video"
              className="absolute top-4 right-4 text-white text-2xl w-9 h-9 rounded-full bg-black/50 flex items-center justify-center hover:bg-velnora-gold-luxury transition duration-300 z-[1010]"
            >
              <i className="fa-solid fa-xmark" />
            </button>
            <iframe
              src={embedUrl(url)}
              title={label}
              className="w-full h-full border-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}
