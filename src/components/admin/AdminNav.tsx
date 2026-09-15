"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const GROUPS = [
  {
    heading: "",
    links: [
      { href: "/admin", label: "Dashboard", icon: "fa-solid fa-gauge" },
      { href: "/admin/submissions", label: "Inbox", icon: "fa-regular fa-envelope", badge: true },
    ],
  },
  {
    heading: "Content",
    links: [
      { href: "/admin/pages", label: "Page copy", icon: "fa-regular fa-file-lines" },
      { href: "/admin/destinations", label: "Destinations", icon: "fa-solid fa-earth-americas" },
      { href: "/admin/packages", label: "Packages", icon: "fa-solid fa-suitcase" },
      { href: "/admin/articles", label: "Travel guide", icon: "fa-regular fa-newspaper" },
      { href: "/admin/faqs", label: "FAQs", icon: "fa-regular fa-circle-question" },
      { href: "/admin/legal", label: "Legal pages", icon: "fa-solid fa-scale-balanced" },
    ],
  },
  {
    heading: "Site",
    links: [
      { href: "/admin/media", label: "Media", icon: "fa-regular fa-images" },
      { href: "/admin/taxonomy", label: "Regions & categories", icon: "fa-solid fa-tags" },
      { href: "/admin/settings", label: "Settings", icon: "fa-solid fa-gear" },
    ],
  },
];

export function AdminNav({ unread }: { unread: number }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5" aria-label="Admin">
      {GROUPS.map((group) => (
        <div key={group.heading || "main"}>
          {group.heading && <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[2px] text-white/40">{group.heading}</p>}
          <ul className="space-y-0.5">
            {group.links.map((link) => {
              const active = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(`${link.href}/`));
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                      active ? "bg-white/10 text-velnora-gold-soft" : "text-white/75 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <i className={`${link.icon} w-4 text-center text-xs`} />
                    <span className="flex-1">{link.label}</span>
                    {"badge" in link && unread > 0 && (
                      <span className="rounded-full bg-velnora-gold-luxury px-2 py-0.5 text-[10px] font-bold text-velnora-navy-deep">{unread}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
