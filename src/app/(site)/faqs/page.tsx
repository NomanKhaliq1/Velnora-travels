import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getFaqs, getPage, getSettings } from "@/lib/content";
import { telHref } from "@/lib/format";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { DiamondDivider } from "@/components/ui/Divider";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPage("faqs");
  return { title: seo.title, description: seo.description, alternates: { canonical: "/faqs" } };
}

export default async function FaqsPage() {
  const [page, faqs, settings] = await Promise.all([getPage("faqs"), getFaqs(), getSettings()]);

  // Structured data so search engines can show these answers directly.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <section className="relative pt-40 pb-20 w-full overflow-hidden text-center mt-20">
        <Image src={page.hero.image} alt="" fill preload sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(5,17,36,0.95)_20%,rgba(5,17,36,0.65)_100%)]" />
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 z-10">
          <span className="text-[10px] font-bold tracking-[2.5px] uppercase text-velnora-gold-soft block mb-3">{page.hero.eyebrow}</span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-[56px] text-white font-normal leading-tight">{page.hero.title}</h1>
          <DiamondDivider className="flex items-center justify-center gap-3 my-6 max-w-xs mx-auto" lineClassName="flex-1 h-[1px] bg-velnora-gold-luxury/45" iconClassName="text-[5px] text-velnora-gold-soft" />
          <p className="text-slate-300 text-sm sm:text-[15px] leading-relaxed max-w-xl mx-auto font-light">{page.hero.text}</p>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-[#FAF9F6] text-velnora-charcoal">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-12 items-start">
            <aside className="space-y-8 lg:sticky lg:top-28 lg:border-r lg:border-slate-200/50 lg:pr-10">
              <div>
                <div className="text-velnora-gold-soft text-base mb-3">
                  <i className="fa-solid fa-star text-sm" />
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-velnora-navy-deep font-normal leading-tight mb-4">{page.sidebar.title}</h2>
                <p className="text-xs text-slate-700 leading-relaxed font-light">{page.sidebar.text}</p>
              </div>
              <div className="space-y-6 pt-6 border-t border-slate-200/40">
                {page.sidebar.points.map((point) => (
                  <div key={point.title} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full border border-velnora-gold-luxury/30 flex items-center justify-center text-velnora-gold-luxury shrink-0 mt-0.5">
                      <i className={`${point.icon} text-xs`} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-velnora-navy-deep uppercase tracking-wide mb-1">{point.title}</h4>
                      <p className="text-[11px] text-slate-700 leading-relaxed font-light">{point.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-[#FDF9F3] border border-velnora-gold-luxury/10 rounded-2xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-velnora-gold-luxury/10 flex items-center justify-center text-velnora-gold-luxury shrink-0">
                  <i className="fa-solid fa-phone text-xs" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-velnora-navy-deep mb-1">{page.sidebar.callTitle}</h4>
                  <a href={telHref(settings.phone)} className="text-xs font-medium text-slate-600 block mb-0.5 hover:text-velnora-gold-luxury">
                    {settings.phone}
                    {settings.phoneAlt && ` (${settings.phoneAlt})`}
                  </a>
                  <a href={`mailto:${settings.email}`} className="text-[10px] text-slate-400 font-light hover:text-velnora-gold-luxury">
                    {settings.email}
                  </a>
                </div>
              </div>
            </aside>

            <FaqAccordion items={faqs} variant="page" />
          </div>

          <div className="bg-[#FDF9F3] border border-velnora-gold-luxury/10 rounded-[32px] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm mt-16 max-w-5xl mx-auto overflow-hidden relative">
            <div className="absolute -top-12 -left-12 w-24 h-24 bg-velnora-gold-luxury/5 rounded-full blur-2xl" />
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left z-10">
              <div className="relative w-32 h-20 rounded-2xl overflow-hidden shrink-0 shadow-sm hidden sm:block">
                <Image src={page.banner.image} alt="" fill sizes="128px" className="object-cover" />
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-velnora-gold-luxury/10 flex items-center justify-center text-velnora-gold-luxury shrink-0">
                  <i className="fa-solid fa-headset text-lg" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-velnora-navy-deep font-normal mb-1">{page.banner.title}</h3>
                  <p className="text-xs text-slate-700 font-light leading-relaxed">{page.banner.text}</p>
                </div>
              </div>
            </div>
            <div className="shrink-0 z-10 w-full md:w-auto">
              <Link
                href="/contact#trip-inquiry"
                className="inline-flex w-full md:w-auto items-center justify-center gap-2 bg-[#051124] text-white hover:bg-velnora-gold-luxury hover:text-[#051124] px-6 py-3.5 rounded-xl text-[10px] font-bold tracking-[1.5px] uppercase transition duration-300 shadow-md"
              >
                {page.banner.ctaLabel} <i className="fa-solid fa-arrow-right text-[8px]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 bg-white text-velnora-charcoal border-t border-slate-200/60">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4 lg:divide-x lg:divide-slate-200/50">
            {page.trust.map((item) => (
              <div key={item.title} className="flex items-center gap-4 lg:px-6">
                <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-velnora-gold-luxury shrink-0">
                  <i className={`${item.icon} text-sm`} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-velnora-navy-deep uppercase tracking-wide mb-0.5">{item.title}</h4>
                  <p className="text-[11px] text-slate-455 font-light">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
