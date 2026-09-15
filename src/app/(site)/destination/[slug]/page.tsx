import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDestination, getDestinations, getPackages, getPage, getTaxonomy, labelFor, relatedPackagesFor } from "@/lib/content";
import { DiamondDivider } from "@/components/ui/Divider";

type Props = { params: Promise<{ slug: string }> };

const THING_ICONS = ["fa-solid fa-sun", "fa-solid fa-sailboat", "fa-solid fa-wine-glass", "fa-solid fa-bed", "fa-regular fa-map"];

export async function generateStaticParams() {
  return (await getDestinations()).map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const destination = await getDestination((await params).slug);
  if (!destination) return {};
  return {
    title: destination.title,
    description: destination.description,
    alternates: { canonical: `/destination/${destination.slug}` },
    openGraph: { images: [destination.heroImage || destination.image] },
  };
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;
  const [destination, packages, taxonomy, template] = await Promise.all([
    getDestination(slug),
    getPackages(),
    getTaxonomy(),
    getPage("destination-detail"),
  ]);
  if (!destination) notFound();

  const related = relatedPackagesFor(destination, packages);
  const gallery = template.galleryImages.length ? template.galleryImages : [destination.image];
  const facts = [
    ["fa-regular fa-calendar", "Best Time", destination.bestTime],
    ["fa-regular fa-clock", "Duration", destination.idealDuration],
    ["fa-regular fa-star", "Style", destination.styles.map((s) => labelFor(taxonomy.travelStyles, s)).join(", ")],
    ["fa-solid fa-globe", "Region", labelFor(taxonomy.regions, destination.region)],
    ["fa-regular fa-credit-card", "Currency", destination.currency],
    ["fa-regular fa-comments", "Language", destination.language],
  ].filter(([, , value]) => value);

  return (
    <>
      <section className="relative min-h-[500px] lg:min-h-[535px] bg-velnora-navy-deep text-white overflow-visible rounded-b-[24px]">
        <div className="absolute inset-0 overflow-hidden">
          <Image src={destination.heroImage || destination.image} alt={destination.title} fill preload sizes="100vw" className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-velnora-navy-deep/95 via-velnora-navy-deep/58 to-velnora-navy-deep/18" />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-velnora-navy-deep/85 to-transparent" />
        </div>
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 pt-36 sm:pt-32 lg:pt-32 pb-20 lg:pb-28">
          <div className="max-w-[470px]">
            <div className="destination-region-kicker inline-flex items-center gap-3 text-velnora-gold-soft mb-4">
              <i className="fa-solid fa-location-dot text-[13px]" />
              <span className="text-[11px] font-bold uppercase tracking-[4px]">{labelFor(taxonomy.regions, destination.region)}</span>
            </div>
            <h1 className="font-serif text-[48px] sm:text-[62px] lg:text-[70px] leading-[0.94] font-normal mb-4">{destination.title}</h1>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-16 h-[1px] bg-velnora-gold-luxury" />
              <i className="fa-regular fa-eye text-[12px] text-velnora-gold-soft" />
            </div>
            <p className="text-[15px] leading-6 text-white/88 max-w-[410px] mb-6">{destination.description}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/contact?destination=${encodeURIComponent(destination.title)}#trip-inquiry`}
                className="inline-flex items-center gap-3 bg-velnora-gold-luxury text-velnora-navy-deep rounded-[5px] px-6 py-3 text-[10px] font-extrabold tracking-[1.8px] uppercase hover:bg-velnora-gold-soft transition"
              >
                Plan a Trip to {destination.name} <i className="fa-solid fa-arrow-right" />
              </Link>
              <Link
                href={`/travel-guide?search=${encodeURIComponent(destination.name)}`}
                className="inline-flex items-center gap-3 border border-white/35 text-white rounded-[5px] px-6 py-3 text-[10px] font-extrabold tracking-[1.8px] uppercase hover:bg-white hover:text-velnora-navy-deep transition"
              >
                View Travel Guide
              </Link>
            </div>
          </div>
        </div>

        {facts.length > 0 && (
          <div className="relative z-20 mx-4 sm:mx-6 -mt-12 lg:mx-0 lg:mt-0 lg:absolute lg:left-1/2 lg:bottom-[-46px] lg:-translate-x-1/2 lg:w-[min(1030px,86vw)]">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 bg-velnora-navy-deep rounded-[8px] shadow-2xl border border-velnora-gold-luxury/25 overflow-hidden">
              {facts.map(([icon, label, value]) => (
                <div key={label} className="min-h-[96px] flex flex-col items-center justify-center text-center px-3 border-r border-white/10 last:border-r-0">
                  <i className={`${icon} text-xl text-velnora-gold-luxury mb-2`} />
                  <p className="text-[8.5px] font-bold uppercase tracking-[2px] text-velnora-gold-luxury mb-1">{label}</p>
                  <p className="text-[10px] leading-4 text-white/80">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="bg-[#FAF9F6] pt-16 lg:pt-28 pb-20 text-velnora-charcoal">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[0.38fr_0.62fr] gap-12 lg:gap-16 items-start">
            <aside className="lg:sticky lg:top-28">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-10 h-[1px] bg-velnora-gold-luxury" />
                <span className="text-[11px] font-bold tracking-[3px] uppercase text-velnora-gold-luxury">{template.whyVisitLabel}</span>
              </div>
              <h2 className="font-serif text-5xl lg:text-6xl text-velnora-navy-deep leading-tight mb-5">{destination.name}?</h2>
              <DiamondDivider className="flex items-center gap-3 mb-7" lineClassName="w-8 h-[1px] bg-velnora-gold-luxury/40" iconClassName="text-[6px] text-velnora-gold-luxury/40" />
              <p className="text-[15px] leading-8 text-slate-600 max-w-[360px] mb-8">{destination.overview}</p>
              {destination.highlights.length > 0 && (
                <ul className="flex flex-wrap gap-2 mb-10 max-w-[360px]">
                  {destination.highlights.map((h) => (
                    <li key={h} className="text-[10px] uppercase tracking-[1.5px] bg-velnora-cream-soft text-velnora-navy-deep px-3 py-1.5 rounded-full">
                      {h}
                    </li>
                  ))}
                </ul>
              )}
              <div className="max-w-[300px] flex flex-col items-start gap-4">
                <div className="text-velnora-gold-luxury text-2xl shrink-0">
                  <i className="fa-solid fa-award" />
                </div>
                <p className="text-xs font-semibold text-velnora-navy-deep leading-relaxed">{template.tagline}</p>
              </div>
            </aside>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-6">
              {destination.thingsToDo.map((thing, index) => (
                <article
                  key={thing.title}
                  className={`${index < 3 ? "xl:col-span-2" : "xl:col-span-3"} bg-white rounded-3xl border border-slate-200/60 shadow-[0_10px_30px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col group`}
                >
                  <div className="relative h-[190px] overflow-hidden">
                    <Image
                      src={gallery[index % gallery.length]}
                      alt=""
                      fill
                      sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="relative flex justify-center z-10 -mt-6">
                    <div className="w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center text-velnora-gold-luxury shadow-md">
                      <i className={`${THING_ICONS[index % THING_ICONS.length]} text-base`} />
                    </div>
                  </div>
                  <div className="p-6 pt-7 text-center flex-grow">
                    <h3 className="font-serif text-lg font-bold text-[#0A1931] mb-2 capitalize">{thing.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{thing.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {destination.signatureExperiences.length > 0 && (
            <div className="mt-16 border border-velnora-gold-luxury/35 rounded-[10px] bg-white/60 p-6 lg:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-[0.25fr_0.75fr] gap-8">
                <div className="border-b lg:border-b-0 lg:border-r border-velnora-gold-luxury/25 pb-6 lg:pb-0 lg:pr-8">
                  <p className="text-[10px] font-bold uppercase tracking-[3px] text-velnora-gold-luxury mb-4">{template.signatureKicker}</p>
                  <h2 className="font-serif text-4xl text-velnora-navy-deep leading-tight mb-6">{template.signatureTitle}</h2>
                  <p className="text-sm leading-7 text-slate-600 mb-7">{template.signatureText.replace("{name}", destination.name)}</p>
                  <Link
                    href={`/packages/${destination.styles[0] ?? "luxury"}`}
                    className="inline-flex items-center gap-3 text-[11px] font-bold tracking-[2px] uppercase text-velnora-navy-deep hover:text-velnora-gold-luxury transition"
                  >
                    {template.signatureCtaLabel} <i className="fa-solid fa-arrow-right" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {destination.signatureExperiences.map((experience) => (
                    <article key={experience.title}>
                      <div className="flex items-start gap-4 mb-5">
                        <i className={`${experience.icon} text-3xl text-velnora-gold-luxury mt-1`} />
                        <div>
                          <h3 className="font-serif text-xl text-velnora-navy-deep leading-snug mb-2">{experience.title}</h3>
                          <p className="text-[12px] leading-6 text-slate-600">{experience.text}</p>
                        </div>
                      </div>
                      {experience.image && (
                        <div className="relative h-[150px] w-full rounded-[8px] overflow-hidden shadow-md">
                          <Image src={experience.image} alt="" fill sizes="(min-width: 768px) 25vw, 100vw" className="object-cover" />
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            </div>
          )}

          {related.length > 0 && (
            <div className="mt-16">
              <div className="flex items-end justify-between gap-6 mb-7">
                <h2 className="font-serif text-4xl text-velnora-navy-deep">{template.relatedTitle}</h2>
                <Link href="/packages" className="hidden sm:inline-flex items-center gap-3 text-[11px] font-bold tracking-[2px] uppercase text-velnora-navy-deep hover:text-velnora-gold-luxury transition">
                  View All Packages <i className="fa-solid fa-arrow-right" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {related.map((pkg, index) => (
                  <Link key={pkg.slug} href={`/package/${pkg.slug}`} className="group bg-white rounded-[8px] overflow-hidden border border-velnora-border shadow-lg hover:shadow-2xl transition block">
                    <div className="relative h-[205px] overflow-hidden">
                      <Image src={pkg.image} alt={pkg.title} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition duration-700 group-hover:scale-110" />
                      {template.relatedBadges[index] && (
                        <span className="absolute top-4 left-4 bg-velnora-gold-luxury text-velnora-navy-deep rounded-[4px] px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[2px]">
                          {template.relatedBadges[index]}
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-serif text-2xl text-velnora-navy-deep mb-3">{pkg.title}</h3>
                      <div className="flex flex-wrap gap-4 text-[12px] text-velnora-gold-luxury mb-3">
                        <span>
                          <i className="fa-regular fa-clock mr-1" />
                          {pkg.duration}
                        </span>
                        <span>
                          <i className="fa-regular fa-star mr-1" />
                          {labelFor(taxonomy.packageTypes, pkg.type)}
                        </span>
                      </div>
                      <p className="text-[13px] leading-6 text-slate-600 mb-5">{pkg.summary}</p>
                      <span className="inline-flex items-center gap-3 border-b border-velnora-navy-deep pb-1 text-[11px] font-bold tracking-[2px] uppercase text-velnora-navy-deep group-hover:text-velnora-gold-luxury group-hover:border-velnora-gold-luxury transition">
                        View Package Details <i className="fa-solid fa-arrow-right" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
