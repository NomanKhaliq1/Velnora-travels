"use client";

import { useId, useState } from "react";
import { pad2 } from "@/lib/format";

type Variant = "home" | "contact" | "page";

export function FaqAccordion({ items, variant }: { items: { question: string; answer: string }[]; variant: Variant }) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className={variant === "home" ? "flex flex-col gap-4" : "space-y-4"}>
      {items.map((item, index) => {
        const isOpen = open === index;
        const panelId = `${baseId}-${index}`;

        const itemClass = {
          home: "bg-white border border-[#eae9e6] rounded-[20px] shadow-sm",
          contact: "bg-white rounded-2xl border border-slate-200/50 shadow-sm",
          page: isOpen
            ? "bg-[#FDF9F3] rounded-2xl border border-[rgba(212,175,55,0.3)] shadow-[0_10px_30px_-5px_rgba(5,17,36,0.05)]"
            : "bg-white rounded-2xl border border-slate-200/50 shadow-sm",
        }[variant];

        return (
          <div key={item.question} className={`overflow-hidden transition-all duration-300 ${itemClass}`}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpen(isOpen ? null : index)}
              className="w-full flex items-center justify-between p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-velnora-gold-luxury/40"
            >
              {variant === "home" && (
                <span className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-[#FAF5EE] text-velnora-gold-luxury text-xs font-bold flex items-center justify-center shrink-0">
                    {pad2(index + 1)}
                  </span>
                  <span className="font-serif text-base font-bold text-velnora-navy-deep">{item.question}</span>
                </span>
              )}
              {variant === "contact" && (
                <span className="font-serif text-base sm:text-lg text-velnora-navy-deep font-normal transition duration-200">{item.question}</span>
              )}
              {variant === "page" && (
                <span className="flex items-center">
                  <span className="font-serif font-bold text-sm text-velnora-gold-luxury mr-4">{pad2(index + 1)}</span>
                  <span className="font-serif text-base sm:text-lg text-velnora-navy-deep font-normal leading-snug">{item.question}</span>
                </span>
              )}
              <span
                aria-hidden="true"
                className={`text-velnora-gold-luxury font-light shrink-0 ml-4 transition duration-300 ${variant === "home" ? "text-2xl" : "text-xl"}`}
              >
                {isOpen ? "—" : "+"}
              </span>
            </button>

            <div
              id={panelId}
              role="region"
              className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                {variant === "home" && (
                  <div className="px-6 pb-6 pl-[64px] text-[13.5px] text-slate-500 leading-relaxed max-w-[650px]">{item.answer}</div>
                )}
                {variant === "contact" && (
                  <p className="px-6 pb-6 text-xs text-slate-500 leading-relaxed font-light border-t border-slate-50/50 pt-4">{item.answer}</p>
                )}
                {variant === "page" && (
                  <p className="px-6 sm:px-[56px] pb-6 text-xs sm:text-sm text-slate-700 leading-relaxed font-light border-t border-slate-50/50 pt-4">
                    {item.answer}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
