import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLegalPage, getLegalPages, getSettings } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { NewsletterBanner } from "@/components/site/NewsletterBanner";
import { ScrollSpyToc } from "@/components/site/ScrollSpyToc";
import { DiamondDivider } from "@/components/ui/Divider";

type Props = { params: Promise<{ legal: string }> };

export async function generateStaticParams() {
  return (await getLegalPages()).map((page) => ({ legal: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getLegalPage((await params).legal);
  if (!page) return {};
  return { title: page.title, description: page.seoDescription || page.intro, alternates: { canonical: `/${page.slug}` } };
}

export default async function LegalPage({ params }: Props) {
  const { legal } = await params;
  const [page, settings] = await Promise.all([getLegalPage(legal), getSettings()]);
  if (!page) notFound();

  return (
    <>
      <section className="relative pt-40 pb-20 w-full overflow-hidden">
        <Image src="/images/santorini_sunset.png" alt="" fill preload sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(5,17,36,0.92)_20%,rgba(5,17,36,0.65)_100%)]" />
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 z-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[10px] text-slate-400 font-light mb-8 uppercase tracking-[1.5px]">
            <Link href="/" className="hover:text-velnora-gold-soft transition">
              Home
            </Link>
            <i className="fa-solid fa-chevron-right text-[7px] text-slate-500" />
            <span className="text-slate-400">Legal</span>
            <i className="fa-solid fa-chevron-right text-[7px] text-slate-500" />
            <span className="text-white">{page.title}</span>
          </nav>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-velnora-gold-luxury/60" />
            <i className="fa-solid fa-diamond text-[5px] text-velnora-gold-soft" />
            <span className="text-xs font-bold tracking-[2.5px] uppercase text-velnora-gold-soft">LEGAL INFORMATION</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-white font-normal leading-tight">{page.title}</h1>
          <DiamondDivider className="flex items-center gap-3 my-6 max-w-xs" lineClassName="flex-1 h-[1px] bg-velnora-gold-luxury/45" iconClassName="text-[5px] text-velnora-gold-soft" />
          <p className="text-slate-300 text-sm sm:text-[15px] leading-relaxed max-w-2xl font-light">{page.intro}</p>
        </div>
      </section>

      <section className="py-16 bg-[#FAF9F6] text-velnora-charcoal">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 items-start">
            <aside className="space-y-8 lg:sticky lg:top-28 z-20">
              <ScrollSpyToc title={page.tocLabel} items={page.sections.map((s, i) => ({ id: `section-${i + 1}`, label: s.title, icon: s.icon }))} />
              <div className="bg-[#FDF9F3] border border-velnora-gold-luxury/10 rounded-3xl p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-velnora-gold-luxury/10 flex items-center justify-center text-velnora-gold-luxury mx-auto mb-4">
                  <i className="fa-solid fa-headset text-lg" />
                </div>
                <h4 className="font-serif text-lg text-velnora-navy-deep font-normal mb-2">Have Questions?</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-light mb-5">{page.helpText}</p>
                <Link
                  href="/contact"
                  className="inline-block w-full border border-velnora-gold-luxury/30 hover:border-velnora-gold-luxury text-velnora-navy-deep font-bold text-[10px] tracking-[1.5px] uppercase py-3 rounded-xl transition duration-300"
                >
                  CONTACT OUR TEAM <i className="fa-solid fa-arrow-right text-[8px] ml-1" />
                </Link>
              </div>
            </aside>

            <div className="bg-white border border-slate-200/50 rounded-3xl p-8 sm:p-12 shadow-sm space-y-12">
              {page.sections.map((section, index) => (
                <div key={section.title} id={`section-${index + 1}`} className={`scroll-mt-28 ${index > 0 ? "border-t border-slate-100 pt-10" : ""}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-velnora-gold-luxury/20 flex items-center justify-center text-velnora-gold-luxury shrink-0">
                      <i className={`${section.icon} text-sm`} />
                    </div>
                    <h2 className="font-serif text-xl sm:text-2xl text-velnora-navy-deep font-normal leading-tight">{section.title}</h2>
                  </div>
                  <div className="sm:pl-14 text-slate-600 leading-relaxed text-[14px] font-light space-y-4">
                    {section.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>
              ))}

              <div className="border-t border-slate-100 pt-8 mt-12">
                <div className="bg-[#FDF9F3] border border-velnora-gold-luxury/10 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-light">
                  <div className="flex items-center gap-2 text-left">
                    <i className="fa-solid fa-shield-halved text-velnora-gold-luxury text-sm" />
                    <span>{page.notice}</span>
                  </div>
                  <span className="whitespace-nowrap font-medium text-slate-600">
                    Last updated: <time dateTime={page.lastUpdated}>{formatDate(page.lastUpdated)}</time>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <NewsletterBanner title={settings.newsletter.title} text={settings.newsletter.text} />
    </>
  );
}
