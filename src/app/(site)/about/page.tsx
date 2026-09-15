import type { Metadata } from "next";
import Image from "next/image";
import { getPage } from "@/lib/content";
import { pad2 } from "@/lib/format";
import { CenteredHero } from "@/components/site/CenteredHero";
import { DiamondDivider } from "@/components/ui/Divider";
import { RichText } from "@/components/ui/RichText";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPage("about");
  return { title: seo.title, description: seo.description, alternates: { canonical: "/about" } };
}

const smallDivider = (
  <DiamondDivider className="flex items-center justify-center gap-3 mt-4" lineClassName="w-8 h-[1px] bg-velnora-gold-luxury/40" iconClassName="text-[5px] text-velnora-gold-soft" />
);

export default async function AboutPage() {
  const page = await getPage("about");
  const { intro, pillars, team, promise } = page;

  return (
    <>
      <CenteredHero
        hero={page.hero}
        sectionClassName="relative min-h-[500px] lg:min-h-[540px] bg-[#051124] text-white overflow-visible rounded-b-[24px] mt-20"
        imageClassName="object-cover object-center scale-105 opacity-80"
        textClassName="text-white/85 max-w-[680px] mx-auto text-base sm:text-lg leading-relaxed mb-8 font-light"
      />

      <section className="py-16 sm:py-24 bg-[#FAF9F6] text-velnora-charcoal">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="text-[11px] font-bold tracking-[2.5px] uppercase text-velnora-gold-soft block mb-3">{intro.eyebrow}</span>
              <h2 className="font-serif text-[34px] sm:text-[46px] font-normal text-velnora-navy-deep mb-5 leading-tight">
                <RichText text={intro.title} accentClassName="text-velnora-gold-luxury" />
              </h2>
              <div className="w-10 h-[2px] bg-velnora-gold-luxury/60 mb-6" />
              {intro.paragraphs.map((p, i) => (
                <p key={i} className={`text-[15px] sm:text-base text-slate-700 leading-relaxed font-light ${i === intro.paragraphs.length - 1 ? "mb-8" : "mb-4"}`}>
                  {p}
                </p>
              ))}
              <div className="flex flex-wrap items-center gap-8 pt-6 border-t border-slate-200/40">
                {intro.stats.map((stat) => (
                  <div key={stat.label} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-velnora-gold-luxury/10 border border-velnora-gold-luxury/20 flex items-center justify-center text-velnora-gold-luxury">
                      <i className={`${stat.icon} text-xs`} />
                    </div>
                    <div>
                      <span className="block text-xl font-bold text-velnora-navy-deep font-serif leading-none mb-1">{stat.value}</span>
                      <span className="text-[10.5px] text-slate-455 uppercase font-bold tracking-wider leading-none">{stat.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative w-full h-[440px] sm:h-[480px] select-none">
              <div className="absolute inset-0 bg-[#FDF9F3]/40 rounded-[40px] -z-10" />
              <div className="absolute top-[8%] left-[2%] w-[42%] h-[40%] rounded-2xl overflow-hidden shadow-lg border border-white/20 -rotate-3 transition duration-500 hover:rotate-0 hover:z-30">
                <Image src={intro.topImage} alt="" fill sizes="(min-width: 1024px) 20vw, 40vw" className="object-cover" />
              </div>
              <div className="absolute bottom-[8%] right-[2%] w-[42%] h-[40%] rounded-2xl overflow-hidden shadow-lg border border-white/20 rotate-3 transition duration-500 hover:rotate-0 hover:z-30">
                <Image src={intro.bottomImage} alt="" fill sizes="(min-width: 1024px) 20vw, 40vw" className="object-cover" />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[68%] rounded-[32px] overflow-hidden shadow-2xl z-10 border-2 border-white">
                <Image src={intro.mainImage} alt="" fill sizes="(min-width: 1024px) 30vw, 60vw" className="object-cover" />
              </div>
              <div className="absolute top-[10%] right-[10%] w-20 h-20 rounded-full bg-[#FAF7F2] border border-velnora-gold-luxury/30 flex flex-col items-center justify-center shadow-lg z-20 rotate-12">
                <div className="absolute inset-1 rounded-full border border-dashed border-velnora-gold-luxury/20" />
                <span className="text-[6px] font-bold text-velnora-gold-luxury uppercase tracking-[0.5px] leading-none mb-0.5">{intro.stamp.top}</span>
                <span className="font-serif text-lg font-bold text-[#051124] leading-none">{intro.stamp.letter}</span>
                <span className="text-[5px] text-velnora-gold-soft font-semibold tracking-[0.5px] leading-none mt-0.5">{intro.stamp.bottom}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-white text-velnora-charcoal border-y border-slate-200/40">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="text-center max-w-[650px] mx-auto mb-16">
            <span className="text-[11px] font-bold tracking-[3px] text-velnora-gold-soft uppercase block mb-3">{pillars.eyebrow}</span>
            <h2 className="font-serif text-[34px] sm:text-[44px] text-velnora-navy-deep font-normal leading-tight">{pillars.title}</h2>
            {smallDivider}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.items.map((item, index) => (
              <div key={item.title} className="bg-[#FAF9F6] border border-slate-200/50 rounded-3xl p-8 shadow-sm hover:shadow-md transition duration-300 relative overflow-hidden group">
                <div className="flex items-center justify-between mb-6">
                  <div className="font-serif font-bold text-4xl text-velnora-gold-soft/30 group-hover:scale-105 transition-transform duration-500">{pad2(index + 1)}</div>
                  <div className="w-10 h-10 rounded-full border border-velnora-gold-luxury/30 flex items-center justify-center text-velnora-gold-luxury shrink-0">
                    <i className={`${item.icon} text-sm`} />
                  </div>
                </div>
                <h3 className="font-serif text-xl text-velnora-navy-deep font-normal mb-3">{item.title}</h3>
                <p className="text-[14px] text-slate-700 leading-relaxed font-light">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#051124] text-white py-12 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-velnora-gold-luxury/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-velnora-gold-luxury/5 rounded-full blur-3xl" />
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10 lg:divide-x lg:divide-white/10">
          {page.stats.map((stat) => (
            <div key={stat.label} className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <i className={`${stat.icon} text-velnora-gold-luxury text-base shrink-0`} />
              <div>
                <span className="block text-2xl font-bold text-velnora-gold-soft font-serif leading-none mb-1">{stat.value}</span>
                <span className="text-[10.5px] text-white/70 font-bold uppercase tracking-wider block">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-[#FAF9F6] text-velnora-charcoal">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="text-center max-w-[650px] mx-auto mb-16">
            <span className="text-[11px] font-bold tracking-[3px] text-velnora-gold-soft uppercase block mb-3">{team.eyebrow}</span>
            <h2 className="font-serif text-[34px] sm:text-[44px] text-velnora-navy-deep font-normal">{team.title}</h2>
            {smallDivider}
            <p className="text-[15px] text-slate-700 leading-relaxed font-light mt-4">{team.text}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.members.map((member) => {
              const socials = [
                member.linkedin && { href: member.linkedin, icon: "fa-brands fa-linkedin-in", label: "LinkedIn" },
                member.instagram && { href: member.instagram, icon: "fa-brands fa-instagram", label: "Instagram" },
                member.email && { href: `mailto:${member.email}`, icon: "fa-regular fa-envelope", label: "Email" },
              ].filter((s): s is { href: string; icon: string; label: string } => Boolean(s));
              return (
                <div key={member.name} className="bg-white rounded-[32px] p-6 text-center border border-slate-200/50 shadow-sm group hover:shadow-xl transition-all duration-300">
                  <div className="w-44 h-44 rounded-full mx-auto overflow-hidden border-4 border-slate-100/80 shadow-sm mb-5 relative">
                    <Image src={member.image} alt={member.name} fill sizes="176px" className="object-cover group-hover:scale-105 transition duration-700" />
                  </div>
                  <h3 className="font-serif text-xl text-velnora-navy-deep font-normal leading-tight mb-1">{member.name}</h3>
                  <span className="text-[10.5px] text-velnora-gold-soft font-bold tracking-[1.5px] uppercase block mb-4">{member.role}</span>
                  <p className="text-[13.5px] text-slate-700 leading-relaxed font-light mb-6 min-h-[72px]">{member.bio}</p>
                  {socials.length > 0 && (
                    <div className="flex justify-center gap-4 text-slate-400 text-sm border-t border-slate-100/60 pt-4">
                      {socials.map((s) => (
                        <a key={s.label} href={s.href} aria-label={`${member.name} on ${s.label}`} className="hover:text-velnora-gold-luxury transition" target="_blank" rel="noopener noreferrer">
                          <i className={s.icon} />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-[#FDF9F3] border border-velnora-gold-luxury/10 rounded-[32px] p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-sm mt-20 max-w-5xl mx-auto overflow-hidden relative">
            <div className="absolute -top-12 -left-12 w-24 h-24 bg-velnora-gold-luxury/5 rounded-full blur-2xl" />
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left z-10">
              <div className="relative w-44 h-24 rounded-2xl overflow-hidden shrink-0 shadow-sm hidden sm:block">
                <Image src={promise.image} alt="" fill sizes="176px" className="object-cover" />
              </div>
              <div>
                <span className="text-[10.5px] font-bold tracking-[2px] text-velnora-gold-soft uppercase block mb-1">{promise.eyebrow}</span>
                <h3 className="font-serif text-xl sm:text-2xl text-velnora-navy-deep font-normal mb-2">{promise.title}</h3>
                <p className="text-sm text-slate-700 font-light leading-relaxed max-w-md">{promise.text}</p>
              </div>
            </div>
            <div className="flex items-center gap-6 justify-center flex-wrap lg:flex-nowrap z-10 shrink-0">
              {promise.items.map((item) => (
                <div key={item.label} className="flex flex-col items-center text-center max-w-[80px]">
                  <div className="w-10 h-10 rounded-full bg-velnora-gold-luxury/10 flex items-center justify-center text-velnora-gold-luxury mb-2">
                    <i className={`${item.icon} text-sm`} />
                  </div>
                  <span className="text-[10.5px] font-semibold text-velnora-navy-deep leading-tight">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
