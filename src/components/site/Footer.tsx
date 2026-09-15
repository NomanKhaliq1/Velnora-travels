import Image from "next/image";
import Link from "next/link";
import type { Settings } from "@/lib/content/types";
import { RichText } from "@/components/ui/RichText";

type NavLink = { label: string; href: string };

function Column({ title, links }: { title: string; links: NavLink[] }) {
  return (
    <div>
      <h4 className="text-velnora-gold-luxury font-bold text-sm tracking-[3px] uppercase mb-5">{title}</h4>
      <div className="w-12 h-[1px] bg-velnora-gold-luxury mb-7" />
      <ul className="space-y-4 text-white/85">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="hover:text-velnora-gold-soft transition">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const SOCIAL_ICONS: Record<keyof Settings["socials"], string> = {
  facebook: "fa-brands fa-facebook-f",
  instagram: "fa-brands fa-instagram",
  youtube: "fa-brands fa-youtube",
  pinterest: "fa-brands fa-pinterest-p",
};

export function Footer({
  settings,
  regionLinks,
  packageLinks,
}: {
  settings: Settings;
  regionLinks: NavLink[];
  packageLinks: NavLink[];
}) {
  const socials = (Object.keys(SOCIAL_ICONS) as (keyof Settings["socials"])[]).filter((key) => settings.socials[key]);

  return (
    <footer className="relative bg-velnora-navy-deep text-white overflow-hidden border-t border-velnora-gold-luxury/20">
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
        <div className="absolute left-0 top-10 w-80 h-80 border border-white/20 rounded-full blur-sm" />
        <div className="absolute right-8 bottom-32 w-72 h-40 border border-white/15 rounded-[50%]" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 pt-[72px] pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1.15fr_0.8fr_0.9fr_0.9fr_0.9fr_0.85fr] gap-10 xl:gap-12 pb-14">
          <div>
            <Link href="/" className="inline-flex items-center mb-6">
              <Image src="/images/logo-white.png" alt={settings.brand} width={1313} height={352} sizes="360px" className="h-24 w-auto object-contain" />
            </Link>
            <div className="flex items-center gap-4 text-velnora-gold-luxury mb-6">
              <span className="w-24 h-[1px] bg-velnora-gold-luxury/60" />
              <i className="fa-solid fa-diamond text-[9px]" />
              <span className="w-24 h-[1px] bg-velnora-gold-luxury/60" />
            </div>
            <p className="text-white/80 text-[16px] leading-relaxed max-w-[280px]">{settings.footer.about}</p>
            <div className="mt-8 font-serif italic text-3xl text-velnora-gold-luxury leading-tight">
              <RichText text={settings.footer.script} />
            </div>
          </div>

          <Column
            title="Company"
            links={[
              { label: "About Us", href: "/about" },
              { label: "Contact", href: "/contact" },
              { label: "Plan Your Trip", href: "/contact#trip-inquiry" },
              { label: "Travel Guide", href: "/travel-guide" },
            ]}
          />
          <Column title="Destinations" links={[...regionLinks, { label: "All Destinations", href: "/destinations" }]} />
          <Column title="Packages" links={[...packageLinks, { label: "All Packages", href: "/packages" }]} />
          <Column
            title="Support"
            links={[
              { label: "FAQs", href: "/faqs" },
              { label: "Booking Terms", href: "/booking-terms" },
              { label: "Cancellation Policy", href: "/cancellation-policy" },
            ]}
          />
          <Column
            title="Legal"
            links={[
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Terms & Conditions", href: "/terms" },
              { label: "Cookie Policy", href: "/cookie-policy" },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 border-t border-white/10 py-8">
          {settings.footer.badges.map((badge) => (
            <div key={badge.title} className="flex items-center gap-4 text-white/85">
              <div className="w-12 h-12 rounded-full border border-velnora-gold-luxury text-velnora-gold-luxury flex items-center justify-center">
                <i className={badge.icon} />
              </div>
              <div>
                <p className="font-serif text-base text-white">{badge.title}</p>
                <p className="text-xs text-white/55">{badge.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-5 border-t border-velnora-gold-luxury/30 pt-8 text-sm text-white/75">
          <p>
            &copy; {new Date().getFullYear()} {settings.brand}. All rights reserved.
          </p>
          <p className="flex items-center gap-3">
            <i className="fa-regular fa-heart text-velnora-gold-luxury" /> {settings.footer.credit}
          </p>
          {socials.length > 0 && (
            <div className="flex items-center gap-3 text-lg">
              {socials.map((key) => (
                <a
                  key={key}
                  href={settings.socials[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={key}
                  className="w-10 h-10 rounded-full border border-velnora-gold-luxury/70 flex items-center justify-center hover:bg-velnora-gold-luxury hover:text-velnora-navy-deep transition"
                >
                  <i className={SOCIAL_ICONS[key]} />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
