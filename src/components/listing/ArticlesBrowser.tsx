"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import type { Article, Taxonomy } from "@/lib/content/types";
import { formatDate, labelFor } from "@/lib/format";

type Props = { articles: Article[]; categories: Taxonomy["articleCategories"]; initialCategory: string };

export function ArticlesBrowser(props: Props) {
  return (
    <Suspense fallback={<Browser {...props} initialSearch="" />}>
      <WithSearchParam {...props} />
    </Suspense>
  );
}

function WithSearchParam(props: Props) {
  return <Browser {...props} initialSearch={useSearchParams().get("search") ?? ""} />;
}

function Browser({ articles, categories, initialCategory, initialSearch }: Props & { initialSearch: string }) {
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory || "all");

  const featured = articles.find((a) => a.featured);
  const query = search.trim().toLowerCase();
  const items = articles.filter(
    (a) =>
      (category === "all" || a.category === category) &&
      (!query || [a.title, a.excerpt, a.category].some((field) => field.toLowerCase().includes(query))),
  );

  const pill = (active: boolean) =>
    `topic-pill flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs transition duration-300 ${
      active ? "bg-[#FDF9F3] border-velnora-gold-luxury text-velnora-navy-deep shadow-sm font-semibold" : "bg-white border-slate-200 text-slate-600 font-medium"
    }`;

  return (
    <section className="py-16 bg-[#FAF9F6] text-velnora-charcoal">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6 mb-12">
          <div className="relative w-full">
            <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search articles, destinations, or topics"
              aria-label="Search articles"
              className="w-full bg-white border border-slate-200 shadow-sm rounded-2xl pl-12 pr-6 py-4 text-sm text-[#0A1931] placeholder-slate-400 outline-none focus:border-velnora-gold-luxury/60"
            />
          </div>
          <div className="relative w-full">
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              aria-label="Category"
              className="w-full bg-white border border-slate-200 shadow-sm rounded-2xl px-5 py-4 text-sm text-[#0A1931] outline-none focus:border-velnora-gold-luxury/60 cursor-pointer appearance-none"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
            <i className="fa-solid fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-[11px] pointer-events-none" />
          </div>
        </div>

        {featured && (
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/60 shadow-md mb-16 grid grid-cols-1 lg:grid-cols-2 lg:h-[380px]">
            <div className="relative h-[260px] lg:h-full overflow-hidden">
              <Image src={featured.image} alt={featured.title} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
            <div className="p-8 lg:p-10 flex flex-col justify-center">
              <span className="text-[10px] uppercase tracking-[2.5px] text-velnora-gold-luxury font-bold mb-2.5">{labelFor(categories, featured.category)}</span>
              <h2 className="font-serif text-2xl lg:text-3xl text-velnora-navy-deep leading-tight font-normal mb-3">
                <Link href={`/article/${featured.slug}`} className="hover:text-velnora-gold-soft transition duration-300">
                  {featured.title}
                </Link>
              </h2>
              <p className="text-slate-500 leading-relaxed text-sm mb-5 line-clamp-2">{featured.excerpt}</p>
              <div className="flex items-center gap-5 text-xs text-slate-400 mb-6 font-light">
                <span className="flex items-center gap-2">
                  <i className="fa-regular fa-calendar text-[13px] text-velnora-gold-luxury/70" /> {formatDate(featured.date)}
                </span>
                <span className="w-[1px] h-3.5 bg-slate-200" />
                <span className="flex items-center gap-2">
                  <i className="fa-regular fa-clock text-[13px] text-velnora-gold-luxury/70" /> {featured.readTime}
                </span>
              </div>
              <div>
                <Link
                  href={`/article/${featured.slug}`}
                  className="inline-flex items-center gap-3 bg-[#051124] hover:bg-velnora-gold-luxury text-white hover:text-velnora-navy-deep px-6 py-3 rounded-xl text-xs font-bold tracking-[1.5px] uppercase transition shadow-md"
                >
                  READ ARTICLE <i className="fa-solid fa-arrow-right text-[10px]" />
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="article-filter-bar flex flex-col md:flex-row md:items-center justify-between gap-5 mb-10 border-b border-slate-200/50 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
            <span className="article-filter-label text-xs font-bold uppercase tracking-[2px] text-[#0A1931] shrink-0">BROWSE BY TOPIC</span>
            <div className="article-topic-pills flex flex-wrap items-center gap-3 py-1 w-full">
              <button type="button" onClick={() => setCategory("all")} aria-pressed={category === "all"} className={pill(category === "all")}>
                View All
              </button>
              {categories.map((c) => (
                <button key={c.slug} type="button" onClick={() => setCategory(c.slug)} aria-pressed={category === c.slug} className={pill(category === c.slug)}>
                  <i className={`${c.icon} text-[10px]`} /> {c.label}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setCategory("all");
            }}
            className="article-clear-filter text-xs font-semibold text-velnora-gold-luxury hover:underline whitespace-nowrap flex items-center gap-1.5 self-end md:self-auto"
          >
            Clear Filters <i className="fa-solid fa-chevron-right text-[9px]" />
          </button>
        </div>

        <div className="listing-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.length === 0 && (
            <div className="col-span-full rounded-2xl border border-velnora-border bg-white p-10 text-center text-velnora-muted">No articles match your search.</div>
          )}
          {items.map((item) => (
            <ArticleCard key={item.slug} article={item} categoryLabel={labelFor(categories, item.category)} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function ArticleCard({ article, categoryLabel }: { article: Article; categoryLabel: string }) {
  return (
    <article className="flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group">
      <div className="relative h-[180px] overflow-hidden">
        <Image src={article.image} alt="" fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover group-hover:scale-105 transition duration-700" />
      </div>
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-[2px] text-velnora-gold-luxury font-bold block mb-2">{categoryLabel}</span>
          <h3 className="font-serif text-lg leading-snug text-velnora-navy-deep mb-2 line-clamp-2 hover:text-velnora-gold-soft transition duration-300">
            <Link href={`/article/${article.slug}`}>{article.title}</Link>
          </h3>
          <p className="text-[12px] text-slate-500 leading-relaxed line-clamp-3 mb-4 font-light">{article.excerpt}</p>
        </div>
        <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col gap-3">
          <div className="flex items-center gap-3 text-[10px] text-slate-400 font-light">
            <span>{formatDate(article.date)}</span>
            <span className="w-[3px] h-[3px] bg-slate-300 rounded-full" />
            <span>{article.readTime}</span>
          </div>
          <Link
            href={`/article/${article.slug}`}
            className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[1.5px] uppercase text-[#051124] hover:text-velnora-gold-luxury transition mt-1"
          >
            READ ARTICLE <i className="fa-solid fa-arrow-right text-[8px] transition duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}
