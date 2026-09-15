"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import type { TravelPackage } from "@/lib/content/types";
import { labelFor } from "@/lib/format";
import { CenteredHero, type HeroContent } from "@/components/site/CenteredHero";

type Term = { slug: string; label: string };
type Props = { hero: HeroContent; packages: TravelPackage[]; types: Term[]; initialType: string };

export function PackagesBrowser(props: Props) {
  return (
    <Suspense fallback={<Browser {...props} initialSearch="" />}>
      <WithSearchParam {...props} />
    </Suspense>
  );
}

function WithSearchParam(props: Props) {
  return <Browser {...props} initialSearch={useSearchParams().get("search") ?? ""} />;
}

function Browser({ hero, packages, types, initialType, initialSearch }: Props & { initialSearch: string }) {
  const [search, setSearch] = useState(initialSearch);
  const [type, setType] = useState(initialType || "all");

  const query = search.trim().toLowerCase();
  const items = packages.filter(
    (p) =>
      (type === "all" || p.type === type) &&
      (!query ||
        [p.title, p.destination, p.duration, p.summary, ...p.styles].some((field) => field.toLowerCase().includes(query))),
  );

  return (
    <>
      <CenteredHero hero={{ ...hero, cta: { label: hero.cta?.label ?? "START PLANNING", href: "/contact#trip-inquiry" } }}>
        <div className="relative z-20 mx-4 -mt-10 md:mx-0 md:mt-0 md:absolute md:left-1/2 md:bottom-[-36px] md:-translate-x-1/2 md:w-[min(1200px,92vw)]">
          <div className="bg-[#051124]/95 border border-velnora-gold-luxury/35 shadow-2xl rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow w-full">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search packages"
                aria-label="Search packages"
                className="w-full bg-[#071827] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-xs text-white placeholder-slate-400 outline-none focus:border-velnora-gold-luxury/60"
              />
            </div>
            <div className="relative w-full md:w-[240px]">
              <select
                value={type}
                onChange={(event) => setType(event.target.value)}
                aria-label="Package type"
                className="w-full bg-[#071827] border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white outline-none focus:border-velnora-gold-luxury/60 cursor-pointer appearance-none"
              >
                <option value="all">All Types</option>
                {types.map((t) => (
                  <option key={t.slug} value={t.slug}>
                    {t.label}
                  </option>
                ))}
              </select>
              <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />
            </div>
          </div>
        </div>
      </CenteredHero>

      <section className="py-24 bg-velnora-ivory-warm text-velnora-charcoal pt-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="listing-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.length === 0 && (
              <div className="col-span-full rounded-2xl border border-velnora-border bg-white p-10 text-center text-velnora-muted">
                No packages match your search.
              </div>
            )}
            {items.map((item) => (
              <article
                key={item.slug}
                className="bg-white rounded-2xl overflow-hidden border border-velnora-border shadow-lg group hover:shadow-2xl transition duration-300"
              >
                <div className="relative h-[240px] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover group-hover:scale-105 transition duration-700"
                  />
                </div>
                <div className="p-7">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <span className="text-[11px] uppercase tracking-[2px] text-velnora-gold-luxury font-bold">{labelFor(types, item.type)}</span>
                    <span className="text-xs text-velnora-muted">{item.duration}</span>
                  </div>
                  <h3 className="font-serif text-2xl font-normal text-velnora-navy-deep mb-3">{item.title}</h3>
                  <p className="text-sm text-velnora-charcoal/70 mb-2">{item.destination}</p>
                  <p className="text-[14px] text-velnora-muted leading-relaxed mb-5">{item.summary}</p>
                  <p className="font-bold text-velnora-navy-deep mb-6">{item.priceText}</p>
                  <Link
                    href={`/package/${item.slug}`}
                    className="inline-flex items-center gap-3 text-xs font-bold tracking-[2px] uppercase text-velnora-navy-deep hover:text-velnora-gold-luxury transition"
                  >
                    View Details <i className="fa-solid fa-arrow-right" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
