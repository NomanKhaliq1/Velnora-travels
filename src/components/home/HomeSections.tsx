import Image from "next/image";
import Link from "next/link";
import type { Article, Destination, Faq, PageContent, Settings, Taxonomy } from "@/lib/content/types";
import { formatDate, labelFor, telHref, whatsappHref } from "@/lib/format";
import { DiamondDivider, Eyebrow } from "@/components/ui/Divider";
import { RichText } from "@/components/ui/RichText";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { ContactForm } from "./ContactForm";
import { ExperienceShowcase } from "./ExperienceShowcase";

type Home = PageContent["home"];
type IconItem = { icon: string; title: string; text: string };

const sectionTitle = "font-serif text-4xl sm:text-5xl font-normal text-velnora-navy-deep leading-tight mb-4";
const accent = "text-velnora-gold-luxury font-normal";

function FlightPath({ className }: { className: string }) {
  return (
    <div className={`absolute pointer-events-none hidden xl:block ${className}`} aria-hidden="true">
      <svg className="w-full h-full" viewBox="0 0 250 120" fill="none">
        <path d="M10,80 Q70,20 130,70 T230,40" stroke="#C79A43" strokeWidth="1.5" strokeDasharray="6 6" />
        <g transform="translate(230, 40) rotate(-15)">
          <path d="M-6,0 L6,0 M0,-6 L0,6" stroke="#C79A43" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function HighlightsBar({ items, tone, className = "" }: { items: IconItem[]; tone: "rose" | "gold"; className?: string }) {
  const circle =
    tone === "rose"
      ? "bg-[#FFF5F5] border border-[#FFE3E3] text-[#E07A7A]"
      : "bg-velnora-gold-luxury/10 border border-velnora-gold-luxury/20 text-velnora-gold-luxury";
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-8 px-6 sm:px-10 bg-white border border-[#eae9e6] shadow-md rounded-[20px] ${className}`}>
      {items.map((item, index) => (
        <div key={item.title} className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0 ${circle} ${tone === "gold" && index === 0 ? "animate-pulse" : ""}`}
          >
            <i className={item.icon} />
          </div>
          <div className="flex flex-col">
            <h4 className="text-base font-bold text-velnora-navy-deep mb-0.5">{item.title}</h4>
            <p className="text-[13px] text-slate-600 leading-snug">{item.text}</p>
            {tone === "gold" && index === 0 && (
              <div className="flex gap-0.5 text-velnora-gold-luxury text-[9px] mt-1" aria-hidden="true">
                {Array.from({ length: 5 }, (_, i) => (
                  <i key={i} className="fa-solid fa-star" />
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function PopularDestinations({
  section,
  destinations,
  regions,
}: {
  section: Home["popularDestinations"];
  destinations: Destination[];
  regions: Taxonomy["regions"];
}) {
  const cards = section.cards.flatMap((card) => {
    const destination = destinations.find((d) => d.slug === card.slug);
    return destination ? [{ card, destination }] : [];
  });

  return (
    <section className="py-16 bg-[#FAF9F6] text-velnora-charcoal relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" aria-hidden="true">
        <svg className="w-full h-full" viewBox="0 0 1440 600" fill="none">
          <path d="M 100,250 C 400,100 800,450 1300,150" stroke="#C79A43" strokeWidth="2" strokeDasharray="8 8" />
        </svg>
      </div>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="text-velnora-gold-luxury text-3xl mb-4">
            <i className="fa-solid fa-map-location-dot" />
          </div>
          <span className="text-xs font-bold tracking-[3px] text-[#E07A7A] uppercase mb-3">{section.eyebrow}</span>
          <h2 className={sectionTitle}>
            <RichText text={section.title} accentClassName={accent} />
          </h2>
          <p className="text-[15px] text-slate-600 max-w-[600px] leading-relaxed mb-8">{section.text}</p>
          <Link
            href="/destinations"
            className="bg-velnora-gold-luxury text-white rounded-full px-8 py-3.5 text-xs font-bold tracking-widest uppercase transition duration-300 hover:bg-velnora-gold-soft hover:shadow-lg hover:-translate-y-0.5 inline-flex items-center gap-2"
          >
            {section.ctaLabel} <i className="fa-solid fa-arrow-right-long" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {cards.map(({ card, destination }) => (
            <div
              key={destination.slug}
              className="bg-white rounded-[20px] overflow-visible border border-[#eae9e6] shadow-sm hover:shadow-xl transition duration-300 flex flex-col group relative"
            >
              <Link href={`/destination/${destination.slug}`} className="absolute inset-0 z-30 rounded-[20px]" aria-label={`Explore ${destination.title}`} />
              <div className="h-[220px] overflow-hidden rounded-t-[20px] relative">
                <Image
                  src={destination.image}
                  alt={destination.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="relative pt-8 px-6 pb-6 flex flex-col items-center text-center flex-grow">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#FFF5F5] border border-[#FFE3E3] flex items-center justify-center text-[#E07A7A] text-lg shadow-md z-20 transition duration-300 group-hover:scale-110">
                  <i className={card.icon || "fa-solid fa-location-dot"} />
                </div>
                <h3 className="font-serif text-[21px] font-normal text-velnora-navy-deep mb-2.5">{destination.title}</h3>
                <p className="text-[14px] text-slate-600 leading-relaxed mb-6 flex-grow">{card.text || destination.description}</p>
                <div className="flex items-center justify-center gap-3 border-t border-black/5 pt-4 mt-auto text-[12.5px] text-slate-500 font-medium w-full">
                  <span className="flex items-center gap-1.5">
                    <i className="fa-solid fa-location-dot text-velnora-gold-luxury" /> {card.regionLabel || labelFor(regions, destination.region)}
                  </span>
                  <span className="w-[1px] h-3 bg-black/10" />
                  <span className="flex items-center gap-1.5">
                    <i className="fa-regular fa-calendar text-slate-400" /> Best {card.bestTime || destination.bestTime}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <HighlightsBar items={section.highlights} tone="rose" />
      </div>
    </section>
  );
}

const TAG_POSITIONS = [
  "top-[8%] left-[8%] max-w-[180px]",
  "top-[18%] right-[8%] max-w-[200px]",
  "top-[38%] left-[5%] max-w-[180px]",
  "top-[42%] right-[5%] max-w-[180px]",
  "bottom-[18%] left-[8%] max-w-[190px]",
  "bottom-[15%] right-[8%] max-w-[190px]",
];

export function Complications({ section }: { section: Home["complications"] }) {
  return (
    <section className="py-24 bg-white text-velnora-charcoal relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col items-center text-center mb-16">
          <Eyebrow>{section.eyebrow}</Eyebrow>
          <h2 className={sectionTitle}>
            <RichText text={section.title} accentClassName={accent} />
          </h2>
          <p className="text-[15px] text-slate-600 max-w-[650px] leading-relaxed">{section.text}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-stretch">
          <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-[#eae9e6] aspect-[4/3] lg:aspect-auto lg:h-full min-h-[320px]">
            <Image src={section.image} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            {section.tags.slice(0, TAG_POSITIONS.length).map((tag, index) => (
              <div
                key={tag.text}
                className={`absolute ${TAG_POSITIONS[index]} bg-white/90 backdrop-blur-sm border border-black/5 rounded-xl p-2.5 shadow-md hidden sm:flex items-center gap-2.5 z-20`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                    index < 2 ? "bg-amber-50 border border-amber-100 text-[#c79a43]" : "bg-rose-50 border border-rose-100 text-[#E07A7A]"
                  }`}
                >
                  <i className={tag.icon} />
                </div>
                <span className="text-[11px] font-bold text-slate-700 leading-tight">
                  <RichText text={tag.text} />
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:h-full">
            {section.problems.map((problem) => (
              <div
                key={problem.title}
                className="bg-[#FAF9F6] rounded-2xl border border-[#eae9e6] p-6 shadow-sm flex flex-col items-center text-center hover:shadow-md transition"
              >
                <div className="w-12 h-12 rounded-full bg-[#FFF5F5] border border-[#FFE3E3] flex items-center justify-center text-[#E07A7A] text-lg mb-4">
                  <i className={problem.icon} />
                </div>
                <h3 className="font-serif text-[17px] font-bold text-velnora-navy-deep mb-2.5 leading-tight">{problem.title}</h3>
                <p className="text-[13px] text-slate-500 leading-relaxed">{problem.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#FAF9F6] border border-[#eae9e6] shadow-md rounded-[20px] py-6 px-8 flex flex-col lg:flex-row items-center justify-between gap-8 mt-16">
          <div className="flex items-center gap-5 shrink-0">
            <div className="w-16 h-16 rounded-full bg-velnora-navy-deep flex items-center justify-center text-velnora-gold-soft text-2xl shrink-0">
              <i className="fa-solid fa-suitcase" />
            </div>
            <div className="flex flex-col">
              <h4 className="text-base font-bold text-velnora-navy-deep leading-tight mb-1">{section.stripe.title}</h4>
              <p className="text-[13.5px] text-slate-500">{section.stripe.text}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 w-full lg:w-auto">
            {section.stripe.features.map((feature) => (
              <div key={feature.title} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-velnora-gold-luxury/10 flex items-center justify-center text-velnora-gold-luxury text-sm shrink-0">
                  <i className={feature.icon} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-velnora-navy-deep mb-0.5">{feature.title}</span>
                  <p className="text-[11px] text-slate-500 leading-snug">{feature.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Experience({ section }: { section: Home["experience"] }) {
  return (
    <section className="pt-14 pb-32 bg-[#FAF9F6] text-velnora-charcoal relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-velnora-gold-luxury/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#E07A7A]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col items-center text-center mb-16">
          <Eyebrow>{section.eyebrow}</Eyebrow>
          <h2 className={sectionTitle}>
            <RichText text={section.title} accentClassName={accent} />
          </h2>
          <p className="text-[15px] text-slate-600 max-w-[600px] leading-relaxed">{section.text}</p>
        </div>
        <ExperienceShowcase steps={section.steps} />
        <HighlightsBar items={section.highlights} tone="gold" className="mt-20" />
      </div>
    </section>
  );
}

export function Collections({ section }: { section: Home["collections"] }) {
  return (
    <section className="py-24 bg-white text-velnora-charcoal relative overflow-hidden">
      <div className="absolute top-16 left-16 w-32 h-32 border border-velnora-gold-luxury/10 rounded-full flex-col items-center justify-center p-3 select-none pointer-events-none hidden xl:flex">
        <div className="w-full h-full border border-dashed border-velnora-gold-luxury/15 rounded-full flex flex-col items-center justify-center relative">
          <span className="text-[7px] font-bold text-velnora-gold-luxury/35 tracking-[2.5px] uppercase absolute top-2.5">VELNORA TRAVEL</span>
          <i className="fa-solid fa-plane text-velnora-gold-luxury/30 text-base my-1" />
          <span className="text-[8px] font-serif italic text-velnora-gold-luxury/35 tracking-[1px] uppercase">Time for Adventure</span>
        </div>
      </div>
      <FlightPath className="top-16 right-16 w-64 h-32 opacity-20" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col items-center text-center mb-16">
          <Eyebrow>{section.eyebrow}</Eyebrow>
          <h2 className={sectionTitle}>
            <RichText text={section.title} accentClassName={accent} />
          </h2>
          <p className="text-[15px] text-slate-600 max-w-[600px] leading-relaxed">{section.text}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {section.items.map((item) => (
            <div
              key={item.title}
              className="relative rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 group h-[440px] flex flex-col justify-end bg-velnora-navy-deep border border-black/5"
            >
              <Link href={item.href} className="absolute inset-0 z-30" aria-label={`Explore ${item.title}`} />
              <Image
                src={item.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 z-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-velnora-navy-deep via-velnora-navy-deep/60 to-transparent z-10" />
              <div className="w-14 h-14 rounded-full bg-velnora-navy-deep border border-velnora-gold-luxury/40 flex items-center justify-center text-velnora-gold-luxury text-xl shadow-lg z-20 absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 transition duration-300 group-hover:scale-110 group-hover:border-velnora-gold-luxury">
                <i className={item.icon} />
              </div>
              <div className="relative z-20 p-6 flex flex-col items-center text-center">
                <h3 className="font-serif text-[17px] font-bold text-white mb-2 tracking-wide">{item.title}</h3>
                <span className="w-6 h-[1.5px] bg-velnora-gold-luxury mb-4" />
                <p className="text-[12.5px] text-white/80 leading-relaxed mb-6 font-light max-w-[90%]">{item.text}</p>
                <span className="text-[10px] font-bold tracking-widest text-velnora-gold-luxury group-hover:text-velnora-gold-soft uppercase transition duration-300 flex items-center gap-1.5">
                  EXPLORE COLLECTION <i className="fa-solid fa-arrow-right transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-16">
          <Link
            href={section.cta.href}
            className="bg-white border border-velnora-gold-luxury/40 text-velnora-navy-deep rounded-full px-8 py-3.5 text-xs font-bold tracking-widest uppercase transition duration-300 hover:bg-velnora-gold-luxury hover:text-white hover:shadow-lg hover:-translate-y-0.5 inline-flex items-center gap-3"
          >
            <i className="fa-solid fa-plane text-velnora-gold-luxury text-sm" /> {section.cta.label} <i className="fa-solid fa-arrow-right text-slate-400" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function FeaturedDestination({ section }: { section: Home["featuredDestination"] }) {
  return (
    <section className="py-24 bg-[#FAF9F6] text-velnora-charcoal relative overflow-hidden">
      <FlightPath className="top-16 right-16 w-64 h-32 opacity-20" />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col items-center text-center mb-16">
          <Eyebrow>
            {section.eyebrow} <i className="fa-solid fa-plane-departure text-[10px]" />
          </Eyebrow>
          <h2 className={sectionTitle}>
            <RichText text={section.title} accentClassName={accent} />
          </h2>
          <p className="text-[15px] text-slate-600 max-w-[600px] leading-relaxed">{section.text}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center">
          <div className="relative w-full h-[450px] lg:h-[500px] rounded-[32px] overflow-hidden shadow-2xl border-4 border-white shrink-0 group/photo">
            <Image
              src={section.image}
              alt={section.badgeTitle}
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover transition-transform duration-1000 ease-in-out group-hover/photo:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute top-6 left-6 bg-velnora-navy-deep/90 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/10 text-white flex items-center gap-4 z-20">
              <div className="w-10 h-10 rounded-full bg-velnora-gold-luxury/20 flex items-center justify-center text-velnora-gold-luxury text-sm">
                <i className="fa-solid fa-location-dot" />
              </div>
              <div>
                <h4 className="text-sm font-bold tracking-wide">{section.badgeTitle}</h4>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="flex gap-0.5 text-velnora-gold-luxury text-[10px]" aria-hidden="true">
                    {Array.from({ length: 5 }, (_, i) => (
                      <i key={i} className="fa-solid fa-star" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-300">{section.ratingText}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div>
              <h3 className="font-serif italic text-xl sm:text-2xl text-velnora-gold-luxury mb-4">{section.subtitle}</h3>
              <p className="text-[14.5px] text-slate-600 leading-relaxed font-light">{section.body}</p>
            </div>
            <DiamondDivider
              className="flex items-center gap-3"
              lineClassName="h-[1px] bg-slate-200 flex-grow"
              iconClassName="text-velnora-gold-luxury text-[8px]"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {section.highlights.map((item) => (
                <div key={item.title} className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-velnora-navy-deep/5 flex items-center justify-center text-velnora-navy-deep text-base shrink-0">
                    <i className={item.icon} />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-velnora-navy-deep mb-1">{item.title}</h5>
                    <p className="text-[11.5px] text-slate-500 leading-snug">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 px-6 bg-white border border-slate-100 shadow-sm rounded-2xl">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-velnora-gold-luxury/10 flex items-center justify-center text-velnora-gold-luxury text-base shrink-0">
                  <i className="fa-regular fa-calendar-check" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Best Time to Visit</span>
                  <span className="text-[13.5px] font-medium text-velnora-navy-deep mt-0.5">{section.bestTime}</span>
                </div>
              </div>
              <div className="flex items-center gap-3.5 border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6">
                <div className="w-10 h-10 rounded-full bg-velnora-gold-luxury/10 flex items-center justify-center text-velnora-gold-luxury text-base shrink-0">
                  <i className="fa-solid fa-users" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ideal For</span>
                  <span className="text-[13.5px] font-medium text-velnora-navy-deep mt-0.5">{section.idealFor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-16">
          <Link
            href={section.cta.href}
            className="bg-velnora-navy-deep text-white rounded-full px-8 py-4 text-xs font-bold tracking-widest uppercase transition duration-300 hover:bg-velnora-gold-luxury hover:text-white hover:shadow-lg hover:-translate-y-0.5 inline-flex items-center gap-2"
          >
            {section.cta.label} <i className="fa-solid fa-arrow-right-long" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function WhyFeature({ item, reverse }: { item: IconItem; reverse: boolean }) {
  return (
    <div
      className={`group flex flex-col items-center lg:items-start gap-4 rounded-[18px] border border-slate-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-velnora-gold-luxury/30 hover:shadow-lg ${
        reverse ? "lg:flex-row-reverse" : "lg:flex-row"
      }`}
    >
      <div className="w-14 h-14 rounded-full bg-velnora-ivory-warm border border-velnora-gold-luxury/15 flex items-center justify-center text-velnora-navy-deep text-lg shrink-0 group-hover:bg-velnora-gold-luxury group-hover:text-white group-hover:border-velnora-gold-luxury transition duration-300 shadow-sm">
        <i className={item.icon} />
      </div>
      <div className={`text-center ${reverse ? "lg:text-right" : "lg:text-left"}`}>
        <h3 className="font-serif text-xl font-bold text-velnora-navy-deep mb-2">{item.title}</h3>
        <p className={`text-sm text-slate-600 leading-relaxed max-w-[320px] ${reverse ? "lg:ml-auto" : ""}`}>{item.text}</p>
      </div>
    </div>
  );
}

export function WhyChoose({ section }: { section: Home["whyChoose"] }) {
  const half = Math.ceil(section.features.length / 2);
  return (
    <section className="py-24 bg-white text-velnora-charcoal relative overflow-hidden">
      <FlightPath className="top-20 left-12 w-48 h-32 opacity-20" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-velnora-gold-luxury/30 to-transparent" />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <Eyebrow>
            {section.eyebrow} <i className="fa-solid fa-compass text-[10px]" />
          </Eyebrow>
          <h2 className={sectionTitle}>
            <RichText text={section.title} accentClassName={accent} />
          </h2>
          <p className="text-[15px] text-slate-600 max-w-[650px] leading-relaxed">{section.text}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px_1fr] gap-10 lg:gap-12 items-center">
          <div className="flex flex-col gap-5 lg:text-right">
            {section.features.slice(0, half).map((item) => (
              <WhyFeature key={item.title} item={item} reverse />
            ))}
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute w-[390px] h-[390px] rounded-full border border-dashed border-velnora-gold-luxury/25 animate-[spin_50s_linear_infinite] pointer-events-none hidden lg:block" />
            <div className="absolute w-80 h-80 rounded-full bg-velnora-gold-luxury/10 blur-2xl animate-pulse pointer-events-none" />
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full border-[10px] border-white shadow-2xl overflow-hidden group/center z-20">
              <Image
                src={section.image}
                alt=""
                fill
                sizes="320px"
                className="object-cover transition-transform duration-[1200ms] ease-in-out group-hover/center:scale-110 group-hover/center:rotate-2"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-velnora-navy-deep/55 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-white">
                <span className="block text-[10px] font-bold tracking-[2.5px] uppercase text-velnora-gold-soft mb-1">{section.imageKicker}</span>
                <span className="block font-serif text-2xl leading-none whitespace-nowrap">{section.imageTitle}</span>
              </div>
            </div>
            <div className="absolute -bottom-5 bg-velnora-navy-deep border border-velnora-gold-luxury/30 text-white rounded-full px-6 py-3 text-[10px] font-bold tracking-widest uppercase shadow-lg z-20 flex items-center gap-2 whitespace-nowrap">
              <i className="fa-solid fa-plane text-velnora-gold-luxury text-[10px]" /> {section.badge}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {section.features.slice(half).map((item) => (
              <WhyFeature key={item.title} item={item} reverse={false} />
            ))}
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-[900px] mx-auto">
          {section.stats.map((stat) => (
            <div key={stat.label} className="rounded-[18px] bg-velnora-ivory-warm border border-velnora-border px-5 py-5 text-center">
              <span className="block font-serif text-3xl text-velnora-navy-deep">{stat.value}</span>
              <span className="text-[11px] font-bold tracking-widest uppercase text-slate-500">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Link
            href={section.cta.href}
            className="bg-velnora-navy-deep text-white rounded-full px-8 py-4 text-xs font-bold tracking-widest uppercase transition duration-300 hover:bg-velnora-gold-luxury hover:text-white hover:shadow-lg hover:-translate-y-0.5 inline-flex items-center gap-2 text-center"
          >
            {section.cta.label} <i className="fa-solid fa-arrow-right-long" />
          </Link>
        </div>
      </div>
    </section>
  );
}

const PROCESS_ICONS = [
  <svg key="1" className="w-14 h-14" viewBox="0 0 40 40" fill="none">
    <path d="M19 26H28L33 31V26C35.5 26 37 24.5 37 21C37 17.5 35.5 16 33 16" stroke="#C79A43" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 23V8C7 6.34315 8.34315 5 10 5H27C28.6569 5 30 6.34315 30 8V19C30 20.6569 28.6569 22 27 22H14L8 28V23" stroke="#0A192F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="14" cy="13" r="1.5" fill="#0A192F" />
    <circle cx="18.5" cy="13" r="1.5" fill="#0A192F" />
    <circle cx="23" cy="13" r="1.5" fill="#0A192F" />
  </svg>,
  <svg key="2" className="w-14 h-14" viewBox="0 0 40 40" fill="none">
    <path d="M6 10L14 6L22 10L30 6V28L22 32L14 28L6 32V10Z" stroke="#0A192F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 6V28" stroke="#0A192F" strokeWidth="2" strokeLinecap="round" />
    <path d="M22 10V32" stroke="#0A192F" strokeWidth="2" strokeLinecap="round" />
    <path d="M26 15.5C26 19.5 22 23 22 23C22 23 18 19.5 18 15.5C18 13.0147 20.0147 11 22.5 11C24.9853 11 27 13.0147 27 15.5Z" stroke="#C79A43" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="#FAF9F6" />
    <circle cx="22.5" cy="15.5" r="1.5" fill="#C79A43" />
  </svg>,
  <svg key="3" className="w-14 h-14" viewBox="0 0 40 40" fill="none">
    <rect x="7" y="11" width="22" height="20" rx="3" stroke="#0A192F" strokeWidth="2" />
    <path d="M12 8V12" stroke="#0A192F" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 8V12" stroke="#0A192F" strokeWidth="2" strokeLinecap="round" />
    <path d="M7 17H29" stroke="#0A192F" strokeWidth="2" />
    <circle cx="12" cy="22" r="1" fill="#0A192F" />
    <circle cx="17" cy="22" r="1" fill="#0A192F" />
    <circle cx="12" cy="26" r="1" fill="#0A192F" />
    <circle cx="17" cy="26" r="1" fill="#0A192F" />
    <circle cx="27" cy="27" r="6" fill="#FAF9F6" stroke="#C79A43" strokeWidth="2" />
    <path d="M24.5 27L26.5 29L29.5 25" stroke="#C79A43" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  <svg key="4" className="w-14 h-14" viewBox="0 0 40 40" fill="none">
    <rect x="9" y="13" width="22" height="17" rx="3" stroke="#0A192F" strokeWidth="2" />
    <path d="M15 13V9C15 7.89543 15.8954 7 17 7H23C24.1046 7 25 7.89543 25 9V13" stroke="#0A192F" strokeWidth="2" strokeLinecap="round" />
    <path d="M14 13V30" stroke="#C79A43" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M26 13V30" stroke="#C79A43" strokeWidth="1.5" strokeLinecap="round" />
  </svg>,
  <svg key="5" className="w-14 h-14" viewBox="0 0 40 40" fill="none">
    <path d="M12 26L29 11M29 11L21 9M29 11L31 19M25.5 14.5L16.5 28.5M16.5 28.5L11.5 27M16.5 28.5L18 33" stroke="#0A192F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 31L13 31" stroke="#C79A43" strokeWidth="2" strokeLinecap="round" />
  </svg>,
];

export function Process({ section }: { section: Home["process"] }) {
  return (
    <section className="pt-24 bg-[#FAF9F6] text-velnora-charcoal relative overflow-hidden border border-velnora-border/40">
      <FlightPath className="top-16 left-16 w-48 h-32 opacity-20" />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative z-20">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="w-8 h-[1px] bg-velnora-gold-luxury" />
            <span className="text-[11px] sm:text-xs font-bold tracking-[4px] text-velnora-gold-luxury uppercase flex items-center gap-2">
              <i className="fa-solid fa-plane text-[10px]" /> {section.eyebrow}
            </span>
            <span className="w-8 h-[1px] bg-velnora-gold-luxury" />
          </div>
          <h2 className={sectionTitle}>
            <RichText text={section.title} accentClassName={accent} />
          </h2>
          <DiamondDivider
            className="flex items-center justify-center gap-4 text-velnora-gold-luxury mb-5"
            lineClassName="w-10 h-[1px] bg-velnora-gold-luxury"
            iconClassName="text-[10px]"
          />
          <p className="text-[15px] text-slate-600 max-w-[600px] leading-relaxed">{section.text}</p>
        </div>

        <div className="max-w-[1280px] mx-auto mt-10 mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-12 lg:flex lg:flex-row lg:items-start lg:justify-between lg:gap-5">
            {section.steps.map((step, index) => (
              <div key={step.title} className="contents">
                {index > 0 && (
                  <div className="flex-grow h-2 hidden lg:block self-start mt-14" aria-hidden="true">
                    <svg className="w-full h-full" fill="none">
                      <line x1="0" y1="4" x2="100%" y2="4" stroke="#C79A43" strokeWidth="2" strokeDasharray="1 8" strokeLinecap="round" opacity="0.6" />
                    </svg>
                  </div>
                )}
                <div className="flex flex-col items-center text-center group w-full lg:w-44 xl:w-52 shrink-0">
                  <div className="relative mb-6">
                    <div className="w-28 h-28 rounded-full bg-[#F4EEE6] flex items-center justify-center z-10 shadow-[inset_0_0_35px_rgba(199,154,67,0.06)] transition duration-300 group-hover:scale-105 group-hover:bg-white group-hover:shadow-lg">
                      {PROCESS_ICONS[index % PROCESS_ICONS.length]}
                    </div>
                    <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-velnora-gold-luxury text-white text-xs font-bold flex items-center justify-center border-2 border-white shadow-sm">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-velnora-navy-deep transition duration-300 group-hover:text-velnora-gold-luxury">{step.title}</h3>
                  <span className="w-8 h-[1.5px] bg-velnora-gold-luxury mt-3 mb-4" />
                  <p className="text-sm text-slate-600 leading-relaxed max-w-[220px]">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative w-full min-h-[360px] sm:min-h-[430px] mt-2 flex flex-col justify-end overflow-hidden">
        <Image src={section.closing.image} alt="" fill sizes="100vw" className="object-cover object-bottom md:object-[center_72%]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF9F6] via-[#FAF9F6]/60 to-transparent z-10" />
        <div className="absolute inset-x-0 top-0 h-32 bg-[#FAF9F6] blur-[100px] z-10" />
        <div className="relative z-20 text-center px-6 pb-16 sm:pb-20 pt-12 flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center text-velnora-gold-luxury text-xl mb-3 backdrop-blur-sm">
            <i className="fa-regular fa-heart animate-pulse" />
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-velnora-navy-deep font-bold mb-6 max-w-[620px] leading-relaxed">
            <RichText text={section.closing.title} />
          </h3>
          <Link
            href={section.closing.cta.href}
            className="bg-velnora-navy-deep text-white rounded-full px-8 sm:px-10 py-4 text-xs font-bold tracking-widest uppercase transition duration-300 hover:bg-velnora-gold-luxury hover:text-white hover:shadow-lg hover:-translate-y-0.5 inline-flex items-center gap-3"
          >
            {section.closing.cta.label} <i className="fa-solid fa-arrow-right-long" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Stories({ section }: { section: Home["stories"] }) {
  const { featured } = section;
  return (
    <section className="py-24 bg-[#03101F] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#03101F] via-[#061B2F] to-[#020914]" />
      <FlightPath className="top-16 right-16 w-48 h-32 opacity-10" />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1fr] gap-12 lg:gap-20 items-stretch">
          <div className="flex flex-col justify-between">
            <div className="flex flex-col mb-12">
              <span className="text-xs font-bold tracking-[3px] text-velnora-gold-luxury uppercase flex items-center gap-1.5 mb-3">
                <i className="fa-solid fa-plane-departure text-[10px]" /> {section.eyebrow}
              </span>
              <h2 className="font-serif text-5xl sm:text-6xl font-normal leading-none mb-6">
                <RichText text={section.title} accentClassName="text-velnora-gold-soft font-normal" />
              </h2>
              <DiamondDivider
                className="flex items-center gap-4 text-velnora-gold-luxury mb-5"
                lineClassName="w-24 h-[1px] bg-velnora-gold-luxury"
                iconClassName="text-[8px]"
              />
              <p className="text-base text-white/80 max-w-[540px] leading-relaxed">{section.text}</p>
            </div>

            <div className="relative w-full rounded-[28px] rounded-tr-[110px] overflow-visible shadow-2xl group/photo h-[620px] flex flex-col justify-end">
              <div className="absolute inset-0 rounded-[28px] rounded-tr-[110px] overflow-hidden border border-velnora-gold-luxury/50 bg-[#061A2C]">
                <Image
                  src={featured.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover object-center transition-transform duration-[1200ms] ease-in-out group-hover/photo:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061A2C] via-[#061A2C]/58 to-transparent z-10" />
                <div className="absolute inset-x-0 bottom-0 h-[30%] bg-[#061A2C]/30 z-10" />
              </div>
              <div className="absolute -top-4 -left-8 z-30 w-24 h-24 rounded-full bg-[#050D1A] border border-velnora-gold-luxury/70 items-center justify-center shadow-lg pointer-events-none hidden md:flex">
                <svg className="absolute w-full h-full animate-[spin_20s_linear_infinite]" viewBox="0 0 100 100" aria-hidden="true">
                  <path id="storyStampPath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none" />
                  <text className="fill-velnora-gold-luxury text-[7.5px] tracking-[1.5px] uppercase font-bold">
                    <textPath href="#storyStampPath" startOffset="0%">
                      {featured.stampText}
                    </textPath>
                  </text>
                </svg>
                <i className="fa-regular fa-heart text-velnora-gold-luxury text-base" />
              </div>
              <div className="relative z-20 p-8 sm:p-10 md:pl-16">
                <span className="text-[10px] font-bold tracking-widest text-velnora-gold-luxury uppercase flex items-center gap-1.5 mb-2">
                  <i className="fa-solid fa-location-dot" /> {featured.location}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal mb-3 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">{featured.title}</h3>
                <p className="text-sm text-white/90 leading-relaxed max-w-[520px] mb-6 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">{featured.text}</p>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10 pt-5">
                  <div className="flex items-center gap-3">
                    <Image src={featured.avatar} alt={featured.name} width={64} height={64} className="w-16 h-16 rounded-full object-cover border-2 border-white/20" />
                    <div>
                      <h4 className="font-serif text-lg font-bold text-white">{featured.name}</h4>
                      <span className="text-sm text-velnora-gold-luxury">{featured.trip}</span>
                    </div>
                  </div>
                  <span className="font-serif italic text-velnora-gold-luxury text-2xl tracking-wide sm:self-end">{featured.signature}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between lg:pl-10 relative">
            <div className="absolute left-0 top-0 bottom-0 w-[1px] border-l border-dashed border-velnora-gold-luxury/45 hidden lg:block" />
            <div className="flex flex-col gap-12 lg:pl-10 lg:pt-20">
              {section.testimonials.map((item, index) => (
                <div key={item.name} className="contents">
                  {index > 0 && (
                    <DiamondDivider
                      className="flex items-center gap-4 lg:pl-6 my-2"
                      lineClassName="h-[1px] bg-white/10 flex-grow"
                      iconClassName="text-velnora-gold-luxury text-[8px]"
                    />
                  )}
                  <figure className="relative group/test">
                    <span className="absolute -top-6 -left-4 font-serif text-[72px] text-velnora-gold-luxury/25 select-none pointer-events-none">&ldquo;</span>
                    <span className="absolute -bottom-8 right-0 font-serif text-[72px] text-white/5 select-none pointer-events-none group-hover/test:text-velnora-gold-luxury/5 transition duration-500">
                      &rdquo;
                    </span>
                    <div className="relative z-10 pl-6">
                      <blockquote className="font-serif italic text-xl text-white/90 leading-relaxed mb-6 font-light">&ldquo;{item.quote}&rdquo;</blockquote>
                      <figcaption className="flex items-center gap-3.5">
                        <Image src={item.avatar} alt={item.name} width={64} height={64} className="w-16 h-16 rounded-full object-cover border border-white/15 shadow-md" />
                        <div>
                          <h4 className="font-serif text-lg font-bold text-white">{item.name}</h4>
                          <span className="text-sm text-velnora-gold-luxury">{item.trip}</span>
                        </div>
                      </figcaption>
                    </div>
                  </figure>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-white/10 pt-8 mt-12 lg:pl-10">
              <span className="font-serif italic text-velnora-gold-luxury text-2xl">{section.closing}</span>
              <Link
                href={section.cta.href}
                className="bg-[#F2D2A9] hover:bg-[#E9C496] text-velnora-navy-deep font-bold rounded-full py-2 pl-6 pr-2 text-xs tracking-widest uppercase transition duration-300 inline-flex items-center gap-4 group shrink-0"
              >
                {section.cta.label}
                <span className="w-8 h-8 rounded-full bg-velnora-navy-deep text-[#F2D2A9] flex items-center justify-center transition duration-300 group-hover:scale-105">
                  <i className="fa-solid fa-arrow-right text-xs" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Insights({
  section,
  articles,
  categories,
}: {
  section: Home["insights"];
  articles: Article[];
  categories: Taxonomy["articleCategories"];
}) {
  const featured = articles.find((a) => a.featured) ?? articles[0];
  if (!featured) return null;
  const others = articles.filter((a) => a.slug !== featured.slug).slice(0, 3);

  return (
    <section className="py-24 bg-[#FAF9F6] text-velnora-charcoal relative overflow-hidden">
      <div className="absolute top-20 left-8 w-80 h-56 opacity-[0.06] pointer-events-none hidden xl:block" aria-hidden="true">
        <i className="fa-solid fa-earth-americas text-[220px] text-velnora-gold-luxury" />
      </div>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative z-10">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-xs font-bold tracking-[3px] text-velnora-gold-luxury uppercase flex items-center gap-2">
              <i className="fa-solid fa-plane-departure text-[11px]" /> {section.eyebrow}
            </span>
            <span className="w-8 h-[1px] bg-velnora-gold-luxury" />
          </div>
          <h2 className="font-serif text-5xl sm:text-6xl font-normal text-velnora-navy-deep leading-none mb-4">
            <RichText text={section.title} accentClassName={accent} />
          </h2>
          <DiamondDivider
            className="flex items-center justify-center gap-4 text-velnora-gold-luxury mb-4"
            lineClassName="w-14 h-[1px] bg-velnora-gold-luxury"
            iconClassName="text-[9px]"
          />
          <p className="text-lg text-slate-600 max-w-[640px] leading-relaxed">{section.text}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.22fr_0.9fr] gap-8 lg:gap-10 items-stretch">
          <article className="bg-white rounded-[18px] overflow-hidden border border-velnora-border shadow-lg">
            <div className="relative h-[260px] sm:h-[315px] overflow-hidden">
              <Image src={featured.image} alt={featured.title} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover transition duration-700 hover:scale-105" />
              <div className="absolute top-6 left-6 bg-velnora-gold-luxury text-white rounded px-4 py-2 text-[11px] font-bold tracking-wider uppercase">
                {labelFor(categories, featured.category)}
              </div>
            </div>
            <div className="relative p-6 sm:p-7 min-h-[270px]">
              <div className="flex flex-wrap items-center gap-5 text-sm text-slate-600 mb-4">
                <span className="inline-flex items-center gap-2">
                  <i className="fa-regular fa-calendar text-velnora-gold-luxury" /> {formatDate(featured.date)}
                </span>
                <span className="h-4 w-[1px] bg-velnora-border" />
                <span className="inline-flex items-center gap-2">
                  <i className="fa-regular fa-clock text-velnora-gold-luxury" /> {featured.readTime}
                </span>
              </div>
              <h3 className="font-serif text-3xl sm:text-4xl font-bold text-velnora-navy-deep leading-tight max-w-[620px] mb-3">{featured.title}</h3>
              <span className="block w-16 h-[1.5px] bg-velnora-gold-luxury mb-4" />
              <p className="text-[15px] text-slate-600 leading-relaxed max-w-[560px] mb-5">{featured.excerpt}</p>
              <Link
                href={`/article/${featured.slug}`}
                className="inline-flex items-center gap-4 bg-velnora-navy-deep text-white rounded-full px-6 py-3 text-xs font-bold tracking-widest uppercase transition duration-300 hover:bg-velnora-gold-luxury"
              >
                Read Full Article <i className="fa-solid fa-arrow-right-long text-velnora-gold-luxury" />
              </Link>
            </div>
          </article>

          <div className="lg:border-l border-velnora-border lg:pl-9 flex flex-col">
            {others.map((article, index) => (
              <article
                key={article.slug}
                className={`grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-4 sm:gap-6 ${index === 0 ? "pb-5" : index === others.length - 1 ? "pt-5" : "py-5"} ${
                  index < others.length - 1 ? "border-b border-velnora-border" : ""
                }`}
              >
                <div className="relative w-full h-48 sm:h-36 rounded-[14px] overflow-hidden">
                  <Image src={article.image} alt="" fill sizes="(min-width: 640px) 180px, 100vw" className="object-cover" />
                </div>
                <div>
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <span className="text-[11px] font-bold tracking-widest uppercase text-velnora-gold-luxury">{labelFor(categories, article.category)}</span>
                    <span className="text-xs text-slate-500 inline-flex items-center gap-1.5 whitespace-nowrap">
                      <i className="fa-regular fa-clock text-velnora-gold-luxury" /> {article.readTime}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold leading-tight text-velnora-navy-deep mb-3">{article.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-2">{article.excerpt}</p>
                  <Link
                    href={`/article/${article.slug}`}
                    className="text-xs font-bold tracking-widest uppercase text-velnora-navy-deep inline-flex items-center gap-4 hover:text-velnora-gold-luxury transition"
                  >
                    Read More <i className="fa-solid fa-arrow-right-long text-velnora-gold-luxury" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-5">
          <Link
            href="/travel-guide"
            className="border border-velnora-gold-luxury text-velnora-navy-deep rounded-full px-8 py-3 text-xs font-bold tracking-widest uppercase transition duration-300 hover:bg-velnora-gold-luxury hover:text-white inline-flex items-center gap-5"
          >
            <i className="fa-regular fa-newspaper text-lg" /> {section.ctaLabel} <i className="fa-solid fa-arrow-right-long" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function HomeFaq({ section, faqs }: { section: Home["faq"]; faqs: Faq[] }) {
  return (
    <section className="py-24 bg-[#FAF9F6] text-velnora-charcoal relative overflow-hidden">
      <FlightPath className="top-16 left-16 w-48 h-32 opacity-20" />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <Eyebrow>
            <i className="fa-solid fa-plane-departure text-[10px]" /> {section.eyebrow}
          </Eyebrow>
          <h2 className={sectionTitle}>
            <RichText text={section.title} accentClassName={accent} />
          </h2>
          <div className="w-12 h-[1px] bg-velnora-gold-luxury/40 mb-4 mx-auto" />
          <p className="text-[15px] text-slate-600 max-w-[650px] leading-relaxed">{section.text}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.25fr] gap-8 lg:gap-14 items-stretch">
          <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl min-h-[520px] flex flex-col justify-end group/faq-photo">
            <Image
              src={section.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover transition-transform duration-[1200ms] ease-in-out group-hover/faq-photo:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-velnora-navy-deep/20 via-transparent to-transparent" />
            <div className="relative z-10 bg-velnora-navy-deep text-white rounded-t-3xl p-8 sm:p-10 shadow-2xl border-t border-white/10 overflow-hidden">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full border border-velnora-gold-luxury flex items-center justify-center text-velnora-gold-luxury text-xl shrink-0">
                  <i className="fa-solid fa-headset animate-pulse" />
                </div>
                <div className="flex-grow">
                  <h3 className="font-serif text-xl font-bold mb-2">{section.card.title}</h3>
                  <p className="text-[13px] text-slate-300 leading-relaxed mb-5">{section.card.text}</p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2.5 text-velnora-gold-luxury text-xs font-bold tracking-widest uppercase hover:text-white transition"
                  >
                    {section.card.ctaLabel} <i className="fa-solid fa-arrow-right-long" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <FaqAccordion items={faqs.slice(0, section.count)} variant="home" />
        </div>

        <div className="mt-16 rounded-[24px] bg-[#F6F4EE] border border-slate-200/60 shadow-sm px-8 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {section.pillars.map((pillar, index) => (
            <div key={pillar.title} className={`flex items-center gap-4 ${index > 0 ? "lg:border-l border-slate-200 lg:pl-8" : ""}`}>
              <div className="w-12 h-12 rounded-full bg-[#FAF5EE] flex items-center justify-center text-lg shrink-0">
                <i className={`${pillar.icon} text-slate-700`} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-velnora-navy-deep">{pillar.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{pillar.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function JourneyStarts({ section }: { section: Home["journey"] }) {
  return (
    <section className="pt-14 pb-14 lg:pb-36 bg-[#FAF9F6] text-velnora-charcoal relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="relative w-full rounded-[32px] overflow-visible lg:min-h-[760px] flex flex-col justify-start p-6 sm:p-12 lg:p-16">
          <div className="absolute inset-0 rounded-[32px] overflow-hidden border border-velnora-gold-luxury/20 shadow-2xl">
            <Image src={section.image} alt="" fill sizes="100vw" className="object-cover object-center z-0" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#050C18]/78 via-[#050C18]/50 to-[#050C18]/72 z-10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(5,12,24,0.58)_0%,rgba(5,12,24,0.34)_36%,rgba(5,12,24,0.12)_64%,rgba(5,12,24,0.34)_100%)] z-10" />
          </div>

          <div className="relative z-20 flex flex-col items-center text-center max-w-[760px] mx-auto mt-5 text-white">
            <div className="flex items-center justify-center gap-8 mb-7 text-velnora-gold-luxury">
              <span className="w-14 sm:w-28 h-[1px] bg-velnora-gold-luxury/80" />
              <div className="relative w-16 h-16 rounded-full border border-velnora-gold-luxury/70 flex items-center justify-center">
                <i className="fa-solid fa-earth-americas text-velnora-gold-luxury text-3xl" />
                <span className="absolute -top-2 -right-2 text-velnora-gold-luxury text-xl rotate-12">
                  <i className="fa-solid fa-plane" />
                </span>
              </div>
              <span className="w-14 sm:w-28 h-[1px] bg-velnora-gold-luxury/80" />
            </div>
            <h2 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-normal leading-[0.95] mb-6 drop-shadow-[0_5px_18px_rgba(0,0,0,0.9)]">
              <RichText text={section.title} accentClassName="text-[#E5B75C] font-normal drop-shadow-[0_4px_14px_rgba(0,0,0,0.85)]" />
            </h2>
            <DiamondDivider
              className="flex items-center justify-center gap-4 text-velnora-gold-luxury mb-6"
              lineClassName="w-16 h-[1px] bg-velnora-gold-luxury"
              iconClassName="text-[9px]"
            />
            <p className="text-xl sm:text-2xl text-white leading-relaxed mb-8 font-semibold drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              <RichText text={section.text} accentClassName="text-velnora-gold-luxury font-medium" />
            </p>
            <Link
              href={section.cta.href}
              className="bg-[#F2C15F] hover:bg-[#E9B24F] text-velnora-navy-deep font-bold rounded-full py-3.5 pl-6 sm:pl-8 pr-2.5 text-xs sm:text-sm tracking-wider sm:tracking-widest uppercase transition duration-300 inline-flex items-center gap-3 sm:gap-6 group shadow-lg"
            >
              {section.cta.label}
              <span className="w-9 h-9 rounded-full bg-velnora-navy-deep text-[#F2D2A9] flex items-center justify-center transition duration-300 group-hover:scale-105">
                <i className="fa-solid fa-arrow-right text-xs" />
              </span>
            </Link>
            <span className="font-serif italic text-white text-3xl sm:text-4xl tracking-wide mt-8 block drop-shadow-[0_2px_5px_rgba(0,0,0,0.55)]">
              {section.script}
            </span>
          </div>

          <div className="relative z-30 mt-12 lg:mt-0 lg:absolute lg:left-24 lg:right-24 lg:-bottom-20 bg-velnora-navy-deep text-white rounded-2xl p-7 sm:p-9 border border-white/10 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
              {section.features.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`flex flex-col items-center text-center px-4 ${index > 0 ? "lg:border-l border-velnora-gold-luxury/50" : ""}`}
                >
                  <div className="h-14 flex items-center justify-center text-velnora-gold-luxury text-4xl mb-4 shrink-0">
                    <i className={feature.icon} />
                  </div>
                  <h4 className="text-sm font-bold text-velnora-gold-luxury tracking-[1.5px] uppercase mb-2">{feature.title}</h4>
                  <p className="text-sm text-white leading-relaxed font-light max-w-[190px]">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeContact({ section, settings }: { section: Home["contact"]; settings: Settings }) {
  const channels = [
    { icon: "fa-solid fa-phone", title: "Call Us", line1: settings.phone, line2: settings.phoneAlt ? `(${settings.phoneAlt})` : "", href: telHref(settings.phone) },
    { icon: "fa-regular fa-envelope", title: "Email Us", line1: settings.email, line2: "We reply within 24 hours", href: `mailto:${settings.email}` },
    { icon: "fa-solid fa-location-dot", title: "Visit Our Office", line1: settings.addressLine1, line2: settings.addressLine2, href: "" },
    { icon: "fa-brands fa-whatsapp", title: "Chat on WhatsApp", line1: settings.whatsapp, line2: "Chat with our team", href: settings.whatsapp ? whatsappHref(settings.whatsapp) : "" },
  ];

  return (
    <section className="pt-24 pb-12 bg-[#FAF9F6] text-velnora-charcoal relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="text-center max-w-[920px] mx-auto mb-14">
          <div className="text-velnora-gold-luxury text-xs font-bold tracking-[4px] uppercase mb-3">{section.eyebrow}</div>
          <DiamondDivider
            className="flex items-center justify-center gap-4 text-velnora-gold-luxury mb-4"
            lineClassName="w-14 h-[1px] bg-velnora-gold-luxury/55"
            iconClassName="text-[8px]"
          />
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-velnora-navy-deep">
            <RichText text={section.title} accentClassName="text-velnora-gold-luxury" />
          </h2>
          <p className="text-slate-600 text-[17px] leading-relaxed mt-5">
            <RichText text={section.text} breakClassName="hidden sm:block" />
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-10 lg:gap-16 items-start justify-center">
          <div className="lg:pr-12 lg:border-r border-velnora-gold-luxury/25">
            <h3 className="font-serif text-2xl font-bold text-velnora-navy-deep mb-3">{section.infoTitle}</h3>
            <div className="w-10 h-[1px] bg-velnora-gold-luxury mb-6" />
            <div>
              {channels.map((channel, index) => (
                <div key={channel.title} className={`flex items-start gap-5 py-6 ${index < channels.length - 1 ? "border-b border-slate-200" : ""}`}>
                  <div className="w-14 h-14 rounded-full bg-[#FAF5EE] flex items-center justify-center text-velnora-navy-deep text-2xl shrink-0">
                    <i className={channel.icon} />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg font-bold text-velnora-navy-deep">{channel.title}</h4>
                    {channel.href ? (
                      <a href={channel.href} className="block text-sm text-slate-700 mt-1 hover:text-velnora-gold-luxury transition">
                        {channel.line1}
                      </a>
                    ) : (
                      <p className="text-sm text-slate-700 mt-1">{channel.line1}</p>
                    )}
                    {channel.line2 && <p className="text-sm text-slate-500 mt-1">{channel.line2}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:pl-2">
            <div className="flex items-center gap-3 text-velnora-gold-luxury mb-4">
              <i className="fa-regular fa-star text-2xl" />
              <h3 className="font-serif text-2xl font-bold text-[#0A1931]">{section.formTitle}</h3>
            </div>
            <DiamondDivider className="flex items-center gap-3 mb-6" lineClassName="w-10 h-[1px] bg-velnora-gold-luxury/40" />
            <p className="text-slate-600 text-[15px] leading-relaxed mb-7">{section.formText}</p>
            <ContactForm planningOptions={section.planningOptions} privacyNote={section.privacyNote} />
          </div>
        </div>
      </div>
    </section>
  );
}
