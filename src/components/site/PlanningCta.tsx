import Image from "next/image";
import Link from "next/link";
import { DiamondDivider } from "@/components/ui/Divider";
import { RichText } from "@/components/ui/RichText";

export function PlanningCta({ cta }: { cta: { title: string; text: string; image: string; ctaLabel: string } }) {
  return (
    <section className="planning-cta-strip relative py-20 bg-[#FAF9F6] overflow-hidden text-center border-t border-slate-200/45">
      <Image src={cta.image} alt="" fill sizes="100vw" className="object-cover object-center" />
      <div className="planning-cta-content relative max-w-[1400px] mx-auto px-6 lg:px-10 z-10">
        <h2 className="font-serif text-3xl sm:text-4xl text-velnora-navy-deep mb-3">{cta.title}</h2>
        <DiamondDivider className="flex items-center justify-center gap-3 mb-6" lineClassName="w-10 h-[1px] bg-velnora-gold-luxury/40" />
        <p className="text-slate-600 text-sm leading-relaxed mb-8 max-w-[500px] mx-auto font-light">
          <RichText text={cta.text} breakClassName="hidden sm:inline" />
        </p>
        <Link
          href="/contact#trip-inquiry"
          className="bg-[#051124] hover:bg-velnora-gold-luxury text-white hover:text-velnora-navy-deep px-8 py-3.5 rounded-[10px] text-xs font-semibold tracking-wider uppercase transition shadow-md inline-flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-plus text-xs" /> {cta.ctaLabel}
        </Link>
      </div>
    </section>
  );
}
