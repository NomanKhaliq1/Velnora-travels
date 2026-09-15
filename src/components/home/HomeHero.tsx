import Image from "next/image";
import Link from "next/link";
import type { PageContent } from "@/lib/content/types";
import { RichText } from "@/components/ui/RichText";
import { BookingWidget } from "./BookingWidget";
import { VideoButton } from "./VideoButton";

export function HomeHero({
  hero,
  destinationNames,
  videoUrl,
}: {
  hero: PageContent["home"]["hero"];
  destinationNames: string[];
  videoUrl: string;
}) {
  return (
    <main className="relative w-full min-h-screen lg:h-screen lg:min-h-[920px] flex flex-col justify-between">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <Image
          src={hero.image}
          alt=""
          fill
          preload
          sizes="100vw"
          className="object-cover object-center scale-105 animate-[zoomBg_20s_infinite_alternate_ease-in-out]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-velnora-navy-deep/80 via-velnora-navy-deep/15 to-velnora-navy-deep/90" />
      </div>

      <div className="relative z-10 h-28" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 w-full grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] items-center gap-10 flex-grow py-8 lg:py-0">
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs font-bold tracking-[3px] text-velnora-gold-soft">{hero.eyebrow}</span>
            <span className="w-[60px] h-[1px] bg-velnora-gold-soft" />
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-[58px] font-normal leading-[1.15] mb-6 tracking-tight text-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.4)]">
            <RichText text={hero.title} accentClassName="text-velnora-gold-soft" />
          </h1>
          <p className="text-[15px] font-normal leading-relaxed text-white/85 max-w-[520px] mb-10 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
            {hero.text}
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5 w-full sm:w-auto">
            <Link
              href={hero.cta.href}
              className="bg-velnora-gold-luxury text-velnora-navy-deep border border-velnora-gold-luxury px-8 h-[52px] rounded font-bold text-xs tracking-wider text-center transition duration-300 hover:bg-velnora-gold-soft hover:border-velnora-gold-soft hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(199,154,67,0.3)] flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-plane-departure" /> {hero.cta.label}
            </Link>
            {videoUrl && <VideoButton label={hero.videoLabel} url={videoUrl} />}
          </div>
        </div>

        <div className="justify-self-start lg:justify-self-end bg-[rgba(45,45,45,0.75)] backdrop-blur-[12px] border border-white/15 rounded-[18px] py-5 pr-8 pl-6 flex items-center gap-5 shadow-[0_10px_30px_rgba(0,0,0,0.3)] text-white w-max relative overflow-hidden group">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -skew-x-[25deg] -left-full group-hover:left-full transition-all duration-1000 ease-in-out" />
          <div className="relative flex justify-center items-center w-[84px] h-[84px] shrink-0">
            <Image src="/images/trust-badge-frame.png" alt="" fill sizes="84px" className="object-contain z-0" />
            <span className="text-[22px] font-medium leading-none text-white z-10 select-none">{hero.badge.rating}</span>
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[15px] font-normal text-white/90 leading-none">{hero.badge.prefix}</span>
            <span className="text-[30px] font-semibold tracking-tight text-white leading-none my-1">{hero.badge.count}</span>
            <span className="text-[15px] font-normal text-white/90 leading-none">{hero.badge.suffix}</span>
            <div className="text-[#e3ae57] text-[18px] tracking-[1px] mt-1.5 [text-shadow:0_1px_2px_rgba(0,0,0,0.2)]" aria-label="5 out of 5 stars">
              &#9733;&#9733;&#9733;&#9733;&#9733;
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-30 w-full max-w-[1400px] mx-auto px-6 lg:px-10 mb-8">
        <BookingWidget destinations={destinationNames} />
      </div>

      <div className="w-full bg-velnora-navy-deep/60 backdrop-blur-md border-t border-white/5 py-8 z-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-wrap items-center justify-between gap-y-6">
          {hero.features.map((feature, index) => (
            <div key={feature.title} className="contents">
              {index > 0 && <span className="w-[1px] h-10 bg-white/10 hidden xl:block mx-4" />}
              <div className="flex items-center gap-4 flex-1 min-w-[250px] max-w-[280px]">
                <div className="text-velnora-gold-luxury text-2xl">
                  <i className={feature.icon} />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-[11px] font-bold tracking-[1.5px] text-white uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                    {feature.title}
                  </h3>
                  <p className="text-[11.5px] text-white/70 leading-relaxed drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">{feature.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
