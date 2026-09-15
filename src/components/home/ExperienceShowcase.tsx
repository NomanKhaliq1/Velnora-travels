"use client";

import Image from "next/image";
import { useState } from "react";
import { pad2 } from "@/lib/format";

type Step = {
  icon: string;
  label: string;
  summary: string;
  showcaseTitle: string;
  showcaseText: string;
  image: string;
};

export function ExperienceShowcase({ steps }: { steps: Step[] }) {
  const [active, setActive] = useState(0);
  const current = steps[active];
  if (!current) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center">
      <div className="relative w-full h-[450px] lg:h-[500px] rounded-[32px] overflow-hidden border-4 border-white shadow-2xl shrink-0">
        {steps.map((step, index) => (
          <Image
            key={step.image + index}
            src={step.image}
            alt={step.label}
            fill
            sizes="(min-width: 1024px) 55vw, 100vw"
            className={`object-cover transition-opacity duration-700 z-10 ${index === active ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-velnora-navy-deep via-velnora-navy-deep/20 to-transparent z-20" />
        <div key={active} className="absolute bottom-8 left-8 right-8 z-30 animate-[showcaseFade_300ms_ease-out]" aria-live="polite">
          <span className="text-[11px] font-bold text-velnora-gold-luxury uppercase tracking-[3px] mb-2 block">STEP {pad2(active + 1)}</span>
          <h3 className="font-serif text-2xl lg:text-3xl text-white font-normal mb-3">{current.showcaseTitle}</h3>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-[90%] font-light">{current.showcaseText}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {steps.map((step, index) => {
          const isActive = index === active;
          return (
            <button
              key={step.label + index}
              type="button"
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              onClick={() => setActive(index)}
              aria-pressed={isActive}
              className={`text-left w-full rounded-[20px] p-5 transition-all duration-300 border border-l-4 ${
                isActive
                  ? "bg-white border-[#eae9e6] border-l-velnora-gold-luxury shadow-md"
                  : "bg-black/5 border-transparent border-l-transparent"
              }`}
            >
              <span className="flex items-center gap-4">
                <span
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-lg shrink-0 transition duration-300 ${
                    isActive ? "bg-velnora-gold-luxury text-white" : "bg-white border border-black/5 text-slate-600"
                  }`}
                >
                  <i className={step.icon} />
                </span>
                <span className="flex-grow">
                  <span className="flex items-center justify-between">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider transition-colors duration-300 ${
                        isActive ? "text-velnora-gold-luxury" : "text-slate-400"
                      }`}
                    >
                      Step {pad2(index + 1)}
                    </span>
                    <span className={`w-2 h-2 rounded-full transition-all duration-300 ${isActive ? "bg-velnora-gold-luxury" : "bg-transparent"}`} />
                  </span>
                  <span
                    className={`block font-serif text-lg text-velnora-navy-deep mt-0.5 transition-all duration-300 ${isActive ? "font-bold" : "font-semibold"}`}
                  >
                    {step.label}
                  </span>
                </span>
              </span>
              <span
                className={`block pl-16 text-[13px] text-slate-600 leading-relaxed transition-all duration-500 overflow-hidden ${
                  isActive ? "mt-3 max-h-20 opacity-100" : "mt-0 max-h-0 opacity-0"
                }`}
              >
                {step.summary}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
