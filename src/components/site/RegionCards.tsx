import Link from "next/link";
import type { Taxonomy } from "@/lib/content/types";

export function RegionCards({ title, regions }: { title: string; regions: Taxonomy["regions"] }) {
  if (regions.length === 0) return null;

  return (
    <section className="py-20 bg-white border-t border-slate-200/40 text-velnora-charcoal">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className="w-12 h-[1px] bg-velnora-gold-luxury/35" />
          <span className="text-xs font-bold uppercase tracking-[2.5px] text-[#0A1931]">{title}</span>
          <span className="w-12 h-[1px] bg-velnora-gold-luxury/35" />
        </div>
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${regions.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {regions.map((region) => (
            <Link
              key={region.slug}
              href={`/destinations/${region.slug}`}
              className="group bg-[#FAF9F6] hover:bg-white rounded-3xl border border-slate-200/50 hover:border-velnora-gold-luxury/35 p-6 flex items-center justify-between gap-4 transition duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-4">
                <div className="text-velnora-gold-luxury text-3xl group-hover:scale-110 transition duration-300 shrink-0">
                  <i className={region.icon} />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-velnora-navy-deep group-hover:text-velnora-gold-luxury transition duration-300">
                    {region.label}
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{region.description}</p>
                </div>
              </div>
              <i className="fa-solid fa-chevron-right text-slate-300 group-hover:text-velnora-gold-luxury text-xs transition duration-300 shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
