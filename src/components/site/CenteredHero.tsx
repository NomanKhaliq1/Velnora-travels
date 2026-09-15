import Image from "next/image";
import Link from "next/link";
import { DiamondDivider } from "@/components/ui/Divider";
import { RichText } from "@/components/ui/RichText";

export type HeroContent = {
  eyebrow: string;
  title: string;
  text: string;
  image: string;
  cta?: { label: string; href: string };
};

export function CenteredHero({
  hero,
  sectionClassName = "relative min-h-[500px] lg:min-h-[540px] bg-[#051124] text-white overflow-visible rounded-b-[24px]",
  imageClassName = "object-cover object-center scale-105",
  gradientClassName = "bg-gradient-to-r from-[#051124]/95 via-[#051124]/70 to-transparent",
  contentClassName = "relative max-w-[1400px] mx-auto px-6 lg:px-10 pt-32 lg:pt-36 pb-32 z-10 text-center",
  titleClassName = "font-serif text-[38px] sm:text-[48px] lg:text-[60px] leading-[1.1] font-normal text-white mt-4 mb-2 max-w-[950px] mx-auto",
  dividerClassName = "flex items-center justify-center gap-3 mt-5 mb-6",
  textClassName = "text-white/80 max-w-[550px] mx-auto text-sm leading-relaxed mb-8 font-light",
  children,
}: {
  hero: HeroContent;
  sectionClassName?: string;
  imageClassName?: string;
  gradientClassName?: string;
  contentClassName?: string;
  titleClassName?: string;
  dividerClassName?: string;
  textClassName?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className={sectionClassName}>
      <div className="absolute inset-0 overflow-hidden rounded-b-[24px]">
        <Image src={hero.image} alt="" fill preload sizes="100vw" className={imageClassName} />
        <div className={`absolute inset-0 ${gradientClassName}`} />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#051124] to-transparent" />
      </div>

      <div className={contentClassName}>
        <span className="text-xs font-bold tracking-[3px] text-velnora-gold-luxury uppercase">{hero.eyebrow}</span>
        <h1 className={titleClassName}>
          <RichText text={hero.title} accentClassName="text-velnora-gold-soft italic font-serif" breakClassName="hidden sm:inline" />
        </h1>
        <DiamondDivider className={dividerClassName} />
        <p className={textClassName}>
          <RichText text={hero.text} breakClassName="hidden sm:inline" />
        </p>
        {hero.cta && (
          <Link
            href={hero.cta.href}
            className="bg-[#F2D2A9] hover:bg-[#E9C496] text-[#051124] px-8 py-3.5 rounded-full text-xs font-bold tracking-[2px] uppercase transition inline-flex items-center gap-3 shadow-md"
          >
            {hero.cta.label} <i className="fa-solid fa-arrow-right text-[10px]" />
          </Link>
        )}
      </div>

      {children}
    </section>
  );
}
