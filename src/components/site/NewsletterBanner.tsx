import { NewsletterForm } from "./NewsletterForm";

export function NewsletterBanner({
  title,
  text,
  sectionClassName = "py-12 bg-white text-velnora-charcoal border-t border-slate-100",
}: {
  title: string;
  text: string;
  sectionClassName?: string;
}) {
  return (
    <section className={sectionClassName}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="relative bg-[#051124] border border-velnora-gold-luxury/20 rounded-[32px] p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl overflow-hidden">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-velnora-gold-luxury/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-velnora-gold-luxury/5 rounded-full blur-3xl" />
          <div className="flex flex-col sm:flex-row items-center gap-6 z-10 text-center sm:text-left">
            <div className="relative w-16 h-16 rounded-full bg-velnora-gold-luxury/10 border border-velnora-gold-luxury/30 flex items-center justify-center shrink-0">
              <div className="absolute inset-1 rounded-full border border-velnora-gold-luxury/20" />
              <i className="fa-regular fa-envelope text-velnora-gold-luxury text-xl" />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-white mb-2 font-normal">{title}</h2>
              <p className="text-xs text-slate-400 leading-relaxed font-light">{text}</p>
            </div>
          </div>
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
