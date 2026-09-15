import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getFaqs, getPage, getSettings } from "@/lib/content";
import { telHref, whatsappHref } from "@/lib/format";
import { CenteredHero } from "@/components/site/CenteredHero";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { InquiryForm } from "@/components/contact/InquiryForm";
import { DiamondDivider } from "@/components/ui/Divider";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPage("contact");
  return { title: seo.title, description: seo.description, alternates: { canonical: "/contact" } };
}

const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)?.slice(0, 200) ?? "";

export default async function ContactPage({ searchParams }: Props) {
  const params = await searchParams;
  const [page, settings, faqs] = await Promise.all([getPage("contact"), getSettings(), getFaqs()]);

  // The home booking widget and package pages link here with the trip details in the URL.
  const adults = Number(one(params.adults)) || 0;
  const children = Number(one(params.children)) || 0;
  const prefill = {
    destination: one(params.destination),
    dates: [one(params.checkIn), one(params.checkOut)].filter(Boolean).join(" to "),
    travelers: adults + children > 0 ? String(adults + children) : "",
    package: one(params.package),
  };

  const contactRows = [
    { icon: "fa-solid fa-phone", label: "CALL US", value: `${settings.phone}${settings.phoneAlt ? ` (${settings.phoneAlt})` : ""}`, href: telHref(settings.phone) },
    { icon: "fa-regular fa-envelope", label: "EMAIL", value: settings.email, href: `mailto:${settings.email}` },
    ...(settings.whatsapp ? [{ icon: "fa-brands fa-whatsapp", label: "WHATSAPP", value: settings.whatsapp, href: whatsappHref(settings.whatsapp) }] : []),
  ];

  return (
    <>
      <CenteredHero
        hero={page.hero}
        sectionClassName="relative min-h-[500px] lg:min-h-[540px] bg-[#051124] text-white overflow-visible rounded-b-[24px] mt-20"
        imageClassName="object-cover object-center scale-105 opacity-80"
      />

      <section className="py-16 sm:py-24 bg-[#FAF9F6] text-velnora-charcoal">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10 items-start">
            <div className="relative bg-[#051124] text-white rounded-[32px] p-8 shadow-xl overflow-hidden border border-white/5">
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-velnora-gold-luxury/5 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-velnora-gold-luxury/5 rounded-full blur-3xl" />
              <div className="text-center mb-6">
                <span className="text-[10px] font-bold tracking-[2px] text-velnora-gold-soft uppercase block">{page.advisor.kicker}</span>
                <DiamondDivider className="flex items-center justify-center gap-3 my-3" lineClassName="w-8 h-[1px] bg-velnora-gold-luxury/35" iconClassName="text-[5px] text-velnora-gold-soft" />
              </div>
              <div className="flex justify-center mb-6">
                <div className="relative w-36 h-36 rounded-full border-2 border-velnora-gold-luxury p-1">
                  <div className="relative w-full h-full rounded-full overflow-hidden">
                    <Image src={page.advisor.image} alt={page.advisor.name} fill sizes="136px" className="object-cover" />
                  </div>
                </div>
              </div>
              <div className="text-center mb-8">
                <h3 className="font-serif text-2xl text-white font-normal mb-1">{page.advisor.name}</h3>
                <span className="text-[10px] font-semibold tracking-[1.5px] uppercase text-velnora-gold-soft block">{page.advisor.role}</span>
              </div>
              <div className="space-y-6 text-xs border-t border-white/10 pt-6 mb-8">
                {contactRows.map((row) => (
                  <div key={row.label} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full border border-velnora-gold-luxury/30 flex items-center justify-center text-velnora-gold-luxury shrink-0">
                      <i className={`${row.icon} text-[10px]`} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-slate-455 block uppercase text-[9px] tracking-[1px] mb-0.5">{row.label}</span>
                      <a href={row.href} className="text-white font-semibold hover:text-velnora-gold-soft transition break-words">
                        {row.value}
                      </a>
                    </div>
                  </div>
                ))}
                {settings.hours.length > 0 && (
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full border border-velnora-gold-luxury/30 flex items-center justify-center text-velnora-gold-luxury shrink-0">
                      <i className="fa-regular fa-clock text-[10px]" />
                    </div>
                    <div>
                      <span className="text-slate-455 block uppercase text-[9px] tracking-[1px] mb-0.5">AVAILABILITY</span>
                      <span className="text-white/90 leading-relaxed">
                        {settings.hours.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <a
                href="#trip-inquiry"
                className="block w-full border border-velnora-gold-luxury hover:bg-velnora-gold-luxury hover:text-[#051124] text-velnora-gold-luxury text-center py-3 rounded-xl text-[10px] font-bold tracking-[1.5px] uppercase transition duration-300 mb-8"
              >
                {page.advisor.ctaLabel} <i className="fa-solid fa-paper-plane text-[9px] ml-1" />
              </a>
              <div className="text-center pt-2 border-t border-white/5">
                <div className="font-serif italic text-2xl text-velnora-gold-soft mb-2 opacity-90 select-none tracking-wide">{page.advisor.signature}</div>
                <span className="text-[9px] font-medium tracking-[1.5px] uppercase text-white/50 block">{page.advisor.tagline}</span>
              </div>
            </div>

            <InquiryForm
              title={page.form.title}
              text={page.form.text}
              submitLabel={page.form.submitLabel}
              privacyNote={page.form.privacyNote}
              options={page.form}
              prefill={prefill}
            />
          </div>
        </div>
      </section>

      <section className="py-10 bg-[#051124] text-white border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4 lg:divide-x lg:divide-white/10">
            {page.trust.map((item) => (
              <div key={item.title} className="flex items-center gap-4 lg:px-6">
                <div className="w-12 h-12 rounded-full border border-velnora-gold-luxury/35 flex items-center justify-center text-velnora-gold-luxury shrink-0">
                  <i className={`${item.icon} text-lg`} />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold text-white mb-0.5">{item.title}</h4>
                  <p className="text-[11px] text-slate-400 font-light">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-[#FAF9F6] text-velnora-charcoal border-b border-slate-100">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-12 items-start">
            <div>
              <span className="text-[10px] font-bold tracking-[2.5px] text-velnora-gold-soft uppercase block mb-2">{page.faq.eyebrow}</span>
              <h2 className="font-serif text-3xl sm:text-4xl text-velnora-navy-deep font-normal leading-tight mb-4">{page.faq.title}</h2>
              <DiamondDivider className="flex items-center gap-2 mb-5" lineClassName="w-8 h-[1px] bg-velnora-gold-luxury/40" iconClassName="text-[5px] text-velnora-gold-soft" />
              <p className="text-xs text-slate-500 font-light leading-relaxed max-w-sm mb-6">{page.faq.text}</p>
              <a
                href={`mailto:${settings.email}`}
                className="bg-[#051124] text-white hover:bg-velnora-gold-luxury hover:text-[#051124] px-6 py-4 rounded-xl text-[10px] font-bold tracking-[1.5px] uppercase transition flex items-center gap-2 w-fit shadow-md"
              >
                {page.faq.ctaLabel} <i className="fa-regular fa-comment-dots text-xs" />
              </a>
            </div>
            <FaqAccordion items={faqs} variant="contact" />
          </div>
        </div>
      </section>

      <section className="relative py-20 overflow-hidden">
        <Image src={page.cta.image} alt="" fill sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(5,17,36,0.85)] to-[rgba(5,17,36,0.45)]" />
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal mb-3 leading-tight">{page.cta.title}</h2>
              <p className="text-xs text-slate-200/90 leading-relaxed font-light max-w-md">{page.cta.text}</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full sm:w-auto">
              <Link
                href="/destinations"
                className="inline-flex items-center justify-center gap-2 border border-white hover:bg-white hover:text-[#051124] text-white px-6 py-3.5 rounded-full text-[10px] font-bold tracking-[1.5px] uppercase transition duration-300 w-full sm:w-auto shadow-md"
              >
                <i className="fa-solid fa-location-dot text-[10px]" /> EXPLORE DESTINATIONS
              </Link>
              <Link
                href="/packages"
                className="inline-flex items-center justify-center gap-2 border border-white hover:bg-white hover:text-[#051124] text-white px-6 py-3.5 rounded-full text-[10px] font-bold tracking-[1.5px] uppercase transition duration-300 w-full sm:w-auto shadow-md"
              >
                <i className="fa-solid fa-briefcase text-[10px]" /> VIEW LUXURY PACKAGES
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
