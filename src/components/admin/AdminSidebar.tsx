"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logout } from "@/lib/actions/admin";
import { AdminNav } from "./AdminNav";

// Full-height sidebar on desktop; a top bar with a collapsible menu on phones and tablets.
export function AdminSidebar({ email, unread }: { email: string; unread: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  return (
    <aside className="sticky top-0 z-50 bg-velnora-navy-deep text-white lg:self-start lg:h-screen lg:flex lg:flex-col">
      <div className="flex items-center justify-between px-5 lg:px-6 py-3.5 lg:py-5 border-b border-white/10">
        <Link href="/admin" className="font-serif text-xl">
          Velnora <span className="text-velnora-gold-soft">Admin</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="admin-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="lg:hidden relative w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/10"
        >
          <i className={`fa-solid ${open ? "fa-xmark" : "fa-bars"} text-lg`} />
          {!open && unread > 0 && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-velnora-gold-luxury" />}
        </button>
      </div>

      <div
        id="admin-menu"
        className={`${open ? "flex" : "hidden"} lg:flex flex-col flex-1 min-h-0 max-h-[calc(100svh-4rem)] lg:max-h-none overflow-y-auto`}
      >
        <AdminNav unread={unread} />
        <div className="px-6 py-4 border-t border-white/10 text-xs text-white/60">
          <p className="truncate mb-3" title={email}>
            {email}
          </p>
          <div className="flex items-center gap-4">
            <Link href="/" target="_blank" className="hover:text-white">
              View site <i className="fa-solid fa-arrow-up-right-from-square text-[9px]" />
            </Link>
            <form action={logout}>
              <button type="submit" className="hover:text-white">
                Log out
              </button>
            </form>
          </div>
        </div>
      </div>
    </aside>
  );
}
