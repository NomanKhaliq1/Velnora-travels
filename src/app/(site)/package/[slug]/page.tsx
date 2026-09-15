import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPackage, getPackages, getPage, getSettings, getTaxonomy, labelFor } from "@/lib/content";
import { pad2, telHref } from "@/lib/format";
import { DiamondDivider } from "@/components/ui/Divider";
import { SavePackageButton } from "@/components/site/SavePackageButton";

type Props = { params: Promise<{ slug: string }> };

const DAY_ICONS = ["fa-solid fa-passport", "fa-regular fa-file-lines", "fa-solid fa-sailboat", "fa-solid fa-utensils", "fa-solid fa-spa", "fa-solid fa-plane-departure"];

function perfectForIcon(label: string) {
  const l = label.toLowerCase();
  if (l.includes("honeymoon")) return "fa-solid fa-ring";
  if (l.includes("couple")) return "fa-solid fa-people-group";
  if (l.includes("anniversar")) return "fa-solid fa-gifts";
  if (l.includes("luxury")) return "fa-solid fa-crown";
  if (l.includes("famil")) return "fa-solid fa-children";
  if (l.includes("adventure")) return "fa-solid fa-person-hiking";
  if (l.includes("cruise")) return "fa-solid fa-ship";
  if (l.includes("wellness")) return "fa-solid fa-spa";
  return "fa-regular fa-star";
}

const divider = <DiamondDivider className="flex items-center gap-3 mb-5" lineClassName="w-10 h-[1px] bg-velnora-gold-luxury/40" />;

export async function generateStaticParams() {
  return (await getPackages()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pkg = await getPackage((await params).slug);
  if (!pkg) return {};
  return { title: pkg.title, description: pkg.summary, alternates: { canonical: `/package/${pkg.slug}` }, openGraph: { images: [pkg.image] } };
}

export default async function PackagePage({ params }: Props) {
  const { slug } = await params;
  const [pkg, packages, settings, taxonomy, template] = await Promise.all([
    getPackage(slug),
    getPackages(),
    getSettings(),
    getTaxonomy(),
    getPage("package-detail"),
  ]);
  if (!pkg) notFound();

  const gallery = template.galleryImages.length ? template.galleryImages : [pkg.image];
  const related = packages.filter((p) => p.slug !== pkg.slug).slice(0, 3);
  const inquireHref = `/contact?${new URLSearchParams({ package: pkg.title, destination: pkg.destination })}#trip-inquiry`;
  const facts = [
    ["fa-regular fa-calendar", "DURATION", pkg.duration],
    ["fa-solid fa-location-dot", "DESTINATION", pkg.destination],
    ["fa-solid fa-users", "IDEAL FOR", pkg.idealFor],
    ["fa-solid fa-gem", "STYLE", pkg.styles.join(", ")],
    ["fa-solid fa-sun", "BEST TIME", pkg.bestTime],
    ["fa-solid fa-tag", "PRICE", pkg.priceText],
  ].filter(([, , value]) => value);

  return (
    <>
      <section className="relative min-h-[500px] lg:min-h-[535px] bg-[#051124] text-white overflow-visible rounded-b-[24px]">
        <div className="absolute inset-0 overflow-hidden">
          <Image src={pkg.image} alt={pkg.title} fill preload sizes="100vw" className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#051124]/95 via-[#051124]/75 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#051124]/85 to-transparent" />
        </div>
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 pt-36 sm:pt-32 lg:pt-32 pb-20 lg:pb-28 z-10">
          <div className="max-w-[550px]">
            <div className="destination-region-kicker inline-flex items-center gap-3 text-velnora-gold-luxury mb-4">
              <i className="fa-solid fa-gem text-xs" />
              <span className="text-xs font-bold tracking-[3px] uppercase text-velnora-gold-luxury">{labelFor(taxonomy.packageTypes, pkg.type)}</span>
            </div>
            <h1 className="font-serif text-[44px] sm:text-[56px] lg:text-[68px] leading-[1.05] font-normal mb-5">{pkg.title}</h1>
            {divider}
            <p className="text-[15px] leading-relaxed text-white/90 mb-8 font-light max-w-[460px]">{pkg.summary}</p>
            <div className="package-hero-actions flex flex-wrap gap-4">
              <Link
                href={inquireHref}
                className="bg-[#F2D2A9] hover:bg-[#E9C496] text-[#051124] px-6 py-3 rounded-full text-xs font-bold tracking-[2px] uppercase transition inline-flex items-center gap-3 shadow-md"
              >
                INQUIRE ABOUT THIS PACKAGE <i className="fa-solid fa-arrow-right text-[10px]" />
              </Link>
              {pkg.itinerary.length > 0 && (
                <a
                  href="#itinerary"
                  className="border border-white/40 hover:bg-white/10 hover:border-white text-white px-6 py-3 rounded-full text-xs font-bold tracking-[2px] uppercase transition inline-flex items-center gap-3"
                >
                  VIEW ITINERARY <i className="fa-solid fa-compass text-xs" />
                </a>
              )}
            </div>
          </div>
        </div>
        {facts.length > 0 && (
          <div className="relative z-20 mx-4 sm:mx-6 -mt-12 lg:mx-0 lg:mt-0 lg:absolute lg:left-1/2 lg:bottom-[-46px] lg:-translate-x-1/2 lg:w-[min(1140px,92vw)]">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 bg-[#051124] rounded-[16px] shadow-2xl border border-velnora-gold-luxury/35 overflow-hidden">
              {facts.map(([icon, label, value]) => (
                <div key={label} className="min-h-[106px] flex flex-col items-center justify-center text-center px-4 py-5 border-r border-white/10 last:border-r-0">
                  <i className={`${icon} text-xl text-velnora-gold-luxury mb-2.5`} />
                  <p className="text-[8.5px] font-bold uppercase tracking-[2px] text-velnora-gold-luxury mb-1.5">{label}</p>
                  <p className="text-[10px] leading-4 text-white/80">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="bg-[#FAF9F6] pt-16 pb-16 lg:pt-28 lg:pb-24 text-velnora-charcoal">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.42fr] gap-12 lg:gap-16 items-start">
            <div>
              <h2 className="font-serif text-3xl font-normal text-velnora-navy-deep mb-4">{template.aboutTitle}</h2>
              {divider}
              <p className="text-[14.5px] leading-relaxed text-slate-600 mb-10 max-w-[850px] font-light">{pkg.overview}</p>

              {pkg.highlights.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-16 border-t border-b border-slate-200/60 py-8 bg-white/40 px-6 rounded-2xl">
                  {pkg.highlights.map((h) => (
                    <div key={h.title} className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#FAF5EE] border border-velnora-gold-luxury/20 flex items-center justify-center text-velnora-gold-luxury text-lg shrink-0">
                        <i className={h.icon} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-velnora-navy-deep uppercase tracking-wider">{h.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-1 leading-snug">{h.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {pkg.itinerary.length > 0 && (
                <>
                  <h2 id="itinerary" className="font-serif text-3xl font-normal text-velnora-navy-deep mb-4">
                    {template.itineraryTitle}
                  </h2>
                  <DiamondDivider className="flex items-center gap-3 mb-8" lineClassName="w-10 h-[1px] bg-velnora-gold-luxury/40" />
                  <ol className="relative pl-6 sm:pl-8 space-y-6">
                    <span className="absolute left-1 sm:left-2 top-2 bottom-2 w-[2px] bg-velnora-gold-luxury/35" aria-hidden="true" />
                    {pkg.itinerary.map((day, index) => (
                      <li key={`${day.day}-${day.title}`} className="relative">
                        <span className="absolute -left-[22px] sm:-left-[30px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#FAF9F6] border-2 border-velnora-gold-luxury/80 z-10" aria-hidden="true" />
                        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-[0_5px_15px_rgba(0,0,0,0.01)] overflow-hidden grid grid-cols-1 sm:grid-cols-[130px_1fr_180px] items-stretch min-h-[110px] group transition duration-300 hover:border-velnora-gold-luxury/30">
                          <div className="bg-[#FAF5EE]/40 px-5 py-4 flex sm:flex-col items-center justify-between sm:justify-center gap-3 border-r border-slate-200/40 shrink-0">
                            <span className="text-xs font-bold text-velnora-gold-luxury uppercase tracking-wider">DAY {pad2(day.day)}</span>
                            <div className="w-9 h-9 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                              <i className={`${DAY_ICONS[Math.min(index, DAY_ICONS.length - 1)]} text-sm text-velnora-navy-deep`} />
                            </div>
                          </div>
                          <div className="p-6 flex flex-col justify-center">
                            <h3 className="font-serif text-lg font-bold text-velnora-navy-deep mb-1.5 capitalize">{day.title}</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">{day.description}</p>
                          </div>
                          <div className="relative hidden sm:block overflow-hidden">
                            <Image src={gallery[index % gallery.length]} alt="" fill sizes="180px" className="object-cover transition duration-700 group-hover:scale-105" />
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </>
              )}

              {pkg.experiences.length > 0 && (
                <div className="mt-16">
                  <h3 className="font-serif text-3xl font-normal text-velnora-navy-deep mb-4">{template.experiencesTitle}</h3>
                  <DiamondDivider className="flex items-center gap-3 mb-8" lineClassName="w-10 h-[1px] bg-velnora-gold-luxury/40" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    {pkg.experiences.map((experience) => (
                      <div key={experience.title} className="bg-white rounded-3xl border border-slate-200/60 shadow-[0_5px_15px_rgba(0,0,0,0.01)] overflow-hidden flex flex-col group">
                        <div className="relative h-[130px] overflow-hidden">
                          {experience.image && <Image src={experience.image} alt="" fill sizes="(min-width: 768px) 20vw, 50vw" className="object-cover transition duration-700 group-hover:scale-110" />}
                        </div>
                        <div className="relative flex justify-center z-10 -mt-5">
                          <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-velnora-gold-luxury shadow-md">
                            <i className={`${experience.icon} text-sm`} />
                          </div>
                        </div>
                        <div className="p-4 text-center flex-grow">
                          <h4 className="font-serif text-sm font-bold text-velnora-navy-deep mb-1">{experience.title}</h4>
                          <p className="text-[10px] text-slate-500 leading-normal">{experience.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(pkg.included.length > 0 || pkg.notIncluded.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                  <div className="bg-white rounded-3xl border border-slate-200/60 p-8 shadow-[0_5px_15px_rgba(0,0,0,0.02)]">
                    <h3 className="font-serif text-xl font-bold text-velnora-navy-deep mb-5">What’s Included</h3>
                    <ul className="space-y-3.5 text-xs text-[#4A5568]">
                      {pkg.included.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <i className="fa-solid fa-check text-velnora-gold-luxury mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white rounded-3xl border border-slate-200/60 p-8 shadow-[0_5px_15px_rgba(0,0,0,0.02)]">
                    <h3 className="font-serif text-xl font-bold text-velnora-navy-deep mb-5">What’s Not Included</h3>
                    <ul className="space-y-3.5 text-xs text-[#4A5568]">
                      {pkg.notIncluded.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <i className="fa-solid fa-minus text-slate-400 mt-1" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {pkg.faq.length > 0 && (
                <div className="mt-12 bg-white rounded-3xl border border-slate-200/60 p-8">
                  <h3 className="font-serif text-xl font-bold text-velnora-navy-deep mb-5">Good to Know</h3>
                  <dl className="space-y-5">
                    {pkg.faq.map((f) => (
                      <div key={f.question}>
                        <dt className="text-sm font-semibold text-velnora-navy-deep">{f.question}</dt>
                        <dd className="text-xs text-slate-500 leading-relaxed mt-1">{f.answer}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>

            <aside className="lg:sticky lg:top-28">
              <div className="bg-[#051124] text-white border border-[#eae9e6]/10 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.25)] overflow-hidden">
                <h3 className="font-serif text-2xl font-normal text-white mb-2">{template.planTitle}</h3>
                <DiamondDivider className="flex items-center gap-3 mb-6" lineClassName="w-10 h-[1px] bg-velnora-gold-luxury/40" />
                <div className="mb-6">
                  <p className="text-[9px] font-bold uppercase tracking-[2.5px] text-velnora-gold-luxury">PRICING</p>
                  <p className="text-3xl font-light text-white mt-1">{pkg.priceText}</p>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">{template.pricingNote}</p>
                </div>
                <div className="space-y-3.5 border-t border-b border-white/10 py-6 mb-8 text-[12.5px]">
                  <div className="flex items-center gap-4 text-white/80">
                    <i className="fa-regular fa-calendar text-velnora-gold-luxury text-base w-5" />
                    <span>{pkg.duration}</span>
                  </div>
                  {template.planFeatures.map((feature) => (
                    <div key={feature.text} className="flex items-center gap-4 text-white/80">
                      <i className={`${feature.icon} text-velnora-gold-luxury text-base w-5`} />
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-3.5 mb-8">
                  <Link
                    href={inquireHref}
                    className="bg-[#F2D2A9] hover:bg-[#E9C496] text-[#051124] rounded-xl font-bold py-3.5 text-center text-xs tracking-widest uppercase transition duration-300 w-full block shadow-md"
                  >
                    INQUIRE ABOUT THIS PACKAGE
                  </Link>
                  <SavePackageButton slug={pkg.slug} />
                </div>
                <div className="bg-white rounded-b-3xl p-6 -mx-8 -mb-8 border-t border-slate-100 flex flex-col text-slate-700">
                  <h4 className="font-serif text-lg font-bold text-velnora-navy-deep">{template.helpTitle}</h4>
                  <p className="text-[11.5px] text-slate-500 mt-0.5 mb-4 leading-snug">{template.helpText}</p>
                  <div className="space-y-2.5 text-xs">
                    <a href={telHref(settings.phone)} className="flex items-center gap-3 text-slate-600 hover:text-velnora-gold-luxury transition">
                      <i className="fa-solid fa-phone text-velnora-gold-luxury text-sm" />
                      <span>
                        {settings.phone}
                        {settings.phoneAlt && ` (${settings.phoneAlt})`}
                      </span>
                    </a>
                    <a href={`mailto:${settings.email}`} className="flex items-center gap-3 text-slate-600 hover:text-velnora-gold-luxury transition">
                      <i className="fa-regular fa-envelope text-velnora-gold-luxury text-sm" />
                      <span>{settings.email}</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="font-serif text-xl font-normal text-velnora-navy-deep mb-2">{template.whyTitle}</h3>
                <DiamondDivider className="flex items-center gap-3 mb-6" lineClassName="w-10 h-[1px] bg-velnora-gold-luxury/40" />
                <div className="space-y-5 text-xs text-slate-600">
                  {template.whyItems.map((item) => (
                    <div key={item.text} className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-full bg-white border border-slate-200/60 flex items-center justify-center text-velnora-gold-luxury text-sm shrink-0 shadow-sm">
                        <i className={item.icon} />
                      </div>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {pkg.perfectFor.length > 0 && (
                <div className="bg-[#FAF5EE]/40 border border-velnora-gold-luxury/25 rounded-2xl p-6 text-center mt-8 shadow-sm">
                  <h4 className="font-serif text-sm font-bold text-velnora-navy-deep mb-5">{template.perfectForTitle}</h4>
                  <div className="grid grid-cols-4 gap-2 items-start">
                    {pkg.perfectFor.slice(0, 4).map((label) => (
                      <div key={label} className="flex flex-col items-center">
                        <i className={`${perfectForIcon(label)} text-velnora-gold-luxury text-lg`} />
                        <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mt-2.5">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-16 bg-[#FAF9F6] border-t border-slate-200/50 text-velnora-charcoal">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="font-serif text-2xl lg:text-3xl font-normal text-velnora-navy-deep whitespace-nowrap">{template.relatedTitle}</h2>
              <div className="flex-grow h-[1px] bg-velnora-gold-luxury/30" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {related.map((rel) => (
                <div key={rel.slug} className="bg-white rounded-3xl border border-slate-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.01)] p-4 flex gap-4 items-center group transition duration-300 hover:border-velnora-gold-luxury/35 hover:-translate-y-0.5">
                  <div className="relative w-[120px] h-[100px] sm:w-[130px] sm:h-[105px] rounded-2xl overflow-hidden shrink-0">
                    <Image src={rel.image} alt="" fill sizes="130px" className="object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                  <div className="flex flex-col justify-between h-full py-1 flex-grow">
                    <div>
                      <span className="text-[8.5px] font-bold text-slate-400 tracking-wider uppercase">{rel.duration}</span>
                      <h3 className="font-serif text-sm font-bold text-velnora-navy-deep leading-tight mt-1 mb-1.5 line-clamp-1 group-hover:text-velnora-gold-luxury transition">{rel.title}</h3>
                      <p className="text-[10.5px] text-slate-500 line-clamp-2 leading-relaxed font-light">{rel.summary}</p>
                    </div>
                    <Link
                      href={`/package/${rel.slug}`}
                      className="text-[9px] font-bold text-[#051124] hover:text-velnora-gold-luxury tracking-wider mt-2.5 flex items-center gap-1.5 uppercase border-b border-[#051124] hover:border-velnora-gold-luxury pb-0.5 self-start transition-all"
                    >
                      VIEW PACKAGE DETAILS <i className="fa-solid fa-arrow-right text-[8px] transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
