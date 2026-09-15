"use client";

import { useEffect, useState } from "react";

type TocItem = { id: string; label: string; icon?: string };

export function ScrollSpyToc({ title, items }: { title: string; items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const ids = items.map((item) => item.id).join("|");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-15% 0px -75% 0px" },
    );
    for (const id of ids.split("|")) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [ids]);

  return (
    <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-sm">
      <h3 className="text-xs font-bold uppercase tracking-[1.5px] text-velnora-navy-deep mb-5 border-b border-slate-100 pb-3">{title}</h3>
      <ul className="space-y-4 text-xs font-medium">
        {items.map((item) => {
          const isActive = item.id === active;
          return (
            <li key={item.id} className="flex items-center gap-3">
              {item.icon ? (
                <i className={`${item.icon} text-sm w-4 text-center ${isActive ? "text-velnora-gold-luxury" : "text-slate-455"}`} />
              ) : (
                <span className={`w-[5px] h-[5px] rounded-full ${isActive ? "bg-velnora-gold-luxury" : "bg-transparent"}`} />
              )}
              <a
                href={`#${item.id}`}
                className={`hover:text-velnora-gold-luxury transition duration-200 ${isActive ? "text-velnora-navy-deep font-semibold" : "text-slate-500"}`}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
