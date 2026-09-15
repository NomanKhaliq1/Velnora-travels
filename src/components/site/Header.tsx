"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { SearchItem } from "@/lib/content/types-search";
import { SearchOverlay } from "./SearchOverlay";

type NavLink = { label: string; href: string };

const dropdownLink =
  "block px-6 py-2.5 text-[13px] font-medium text-white hover:bg-velnora-gold-luxury/10 hover:text-velnora-gold-soft transition";

export function Header({
  siteName,
  regionLinks,
  packageLinks,
  searchItems,
  popularSearches,
}: {
  siteName: string;
  regionLinks: NavLink[];
  packageLinks: NavLink[];
  searchItems: SearchItem[];
  popularSearches: NavLink[];
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // Close the mobile menu after navigating.
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (prefix: string) => pathname === prefix || pathname.startsWith(`${prefix}/`);
  const navClass = (active: boolean, extra = "") =>
    `text-sm font-medium tracking-wide py-2 transition duration-300 hover:text-velnora-gold-soft ${active ? "text-velnora-gold-soft" : "text-white/90"} ${extra}`;

  const sections = [
    { label: "Destinations", href: "/destinations", active: isActive("/destinations") || isActive("/destination"), children: regionLinks, allLabel: "View All Destinations" },
    { label: "Vacation Packages", href: "/packages", active: isActive("/packages") || isActive("/package"), children: packageLinks, allLabel: "View All Packages" },
  ];
  const simple = [
    { label: "Travel Guide", href: "/travel-guide", active: isActive("/travel-guide") || isActive("/article") },
    { label: "About", href: "/about", active: isActive("/about") },
    { label: "Contact", href: "/contact", active: isActive("/contact") },
  ];

  return (
    <>
      <header
        className={
          isHome
            ? "site-header absolute top-0 left-0 w-full z-50 py-6 bg-transparent"
            : "site-header fixed top-0 left-0 w-full z-50 transition-all duration-300 py-5 bg-velnora-navy-midnight shadow-lg"
        }
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex items-center justify-between">
          <Link href="/" className="flex items-center" aria-label={`${siteName} home`}>
            <Image src="/images/logo-white.png" alt={`${siteName} logo`} width={1313} height={352} preload sizes="150px" className="h-10 w-auto" />
          </Link>

          <nav className="hidden lg:block" aria-label="Main navigation">
            <ul className="flex items-center gap-8">
              {sections.map((section) => (
                <li key={section.href} className="relative group">
                  <Link href={section.href} className={navClass(section.active, "flex items-center gap-1.5")}>
                    {section.label}
                    <i className="fa-solid fa-chevron-down text-[9px] group-hover:rotate-180 transition-transform duration-300" />
                  </Link>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 translate-y-3 w-60 bg-velnora-navy-midnight/90 backdrop-blur-md border border-white/10 rounded-xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible group-hover:translate-y-1 transition-all duration-300 shadow-2xl z-50">
                    {section.children.map((child) => (
                      <Link key={child.href} href={child.href} className={dropdownLink}>
                        {child.label}
                      </Link>
                    ))}
                    <Link href={section.href} className="block px-6 py-2.5 text-[13px] font-semibold text-velnora-gold-soft hover:bg-velnora-gold-luxury/10 transition">
                      {section.allLabel}
                    </Link>
                  </div>
                </li>
              ))}
              {simple.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={navClass(item.active)}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
              className="text-white hover:text-velnora-gold-soft hover:scale-110 transition duration-300 p-2"
            >
              <i className="fa-solid fa-magnifying-glass text-lg" />
            </button>
            <span className="w-[1px] h-5 bg-white/20 hidden sm:block" />
            <Link
              href="/contact#trip-inquiry"
              className="hidden sm:flex border border-white/50 text-white px-6 py-2.5 text-xs font-medium tracking-widest rounded-[10px] transition duration-300 hover:bg-white/10 hover:border-white hover:-translate-y-0.5 items-center gap-3"
            >
              <i className="fa-solid fa-plane text-velnora-gold-soft text-sm" /> PLAN YOUR TRIP
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="lg:hidden text-white p-2 hover:text-velnora-gold-soft transition duration-300"
            >
              <i className="fa-solid fa-bars-staggered text-2xl" />
            </button>
          </div>
        </div>
      </header>

      <div
        aria-hidden={!menuOpen}
        className={`fixed inset-0 bg-[#020b16] z-[999] flex flex-col justify-center items-center px-10 transition-transform duration-300 ease-out lg:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full invisible"
        }`}
      >
        <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu" className="absolute top-8 right-8 text-white hover:text-velnora-gold-soft text-3xl">
          <i className="fa-solid fa-xmark" />
        </button>
        <Image src="/images/logo-white.png" alt={`${siteName} logo`} width={1313} height={352} sizes="180px" className="h-12 w-auto mb-12" />
        <nav className="text-center" aria-label="Mobile navigation">
          <ul className="flex flex-col gap-6 text-xl text-white">
            {[...sections, ...simple].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={`hover:text-velnora-gold-soft transition duration-300 ${item.active ? "text-velnora-gold-soft" : ""}`}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link
          href="/contact#trip-inquiry"
          className="mt-12 border-[1.5px] border-velnora-gold-luxury text-white px-8 py-3 text-sm font-semibold tracking-wider rounded hover:bg-velnora-gold-luxury hover:text-velnora-navy-deep transition duration-300 flex items-center gap-2"
        >
          <i className="fa-solid fa-paper-plane text-xs" /> PLAN YOUR TRIP
        </Link>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} items={searchItems} popular={popularSearches} />
    </>
  );
}
