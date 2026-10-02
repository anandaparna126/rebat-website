"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { api, getSession, logout, SITE_URL, type AdminUser } from "@/lib/api";
import { Mark } from "@/components/Mark";
import { Loading } from "@/components/ui";

const UserContext = createContext<{ user: AdminUser; setUser: (u: AdminUser) => void } | null>(null);

export function useAdminUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useAdminUser must be used inside <Shell>");
  return ctx;
}

const NAV = [
  { href: "/", label: "Dashboard", icon: "M3 12l9-8 9 8M5 10v10h5v-6h4v6h5V10" },
  { href: "/enquiries", label: "Enquiries", icon: "M4 6h16v12H4zM4 7l8 6 8-6" },
  { href: "/articles", label: "Newsroom", icon: "M5 4h11l3 3v13H5zM8 9h8M8 13h8M8 17h5" },
  { href: "/jobs", label: "Jobs", icon: "M4 8h16v11H4zM9 8V5h6v3M4 13h16" },
  { href: "/users", label: "Admin users", icon: "M9 11a4 4 0 100-8 4 4 0 000 8zM2 21v-1a6 6 0 0112 0v1M17 11a3 3 0 100-6M22 21v-1a5 5 0 00-4-4.9", superuser: true },
  { href: "/account", label: "My account", icon: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 21v-1a7 7 0 0114 0v1" },
];

function NavIcon({ d }: { d: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

// Auth gate + app chrome for every signed-in page: verifies the stored
// session against /api/admin/me/ before rendering anything.
export function Shell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!getSession()) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    api<AdminUser>("/me/")
      .then(setUser)
      .catch(() => {
        // api() already redirects to /login on an expired session.
      });
    // Only on first mount — later navigations reuse the verified user.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  if (!user) return <Loading label="Checking your session…" />;

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const nav = NAV.filter((item) => !item.superuser || user.is_superuser);

  const sidebar = (
    <nav className="flex h-full flex-col bg-brand-deep text-white">
      <div className="flex items-center gap-3 px-5 py-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white">
          <Mark size={22} color="var(--brand)" />
        </span>
        <div>
          <div className="text-base leading-tight font-bold">ReBAT</div>
          <div className="text-xs text-white/60">Website admin</div>
        </div>
      </div>
      <div className="flex-1 space-y-1 px-3">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive(item.href) ? "bg-white/12 text-white" : "text-white/70 hover:bg-white/6 hover:text-white"
            }`}
          >
            <NavIcon d={item.icon} />
            {item.label}
          </Link>
        ))}
      </div>
      <div className="space-y-1 border-t border-white/10 px-3 py-4">
        <a
          href={SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/6 hover:text-white"
        >
          <NavIcon d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" />
          View website
        </a>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/6 hover:text-white"
        >
          <NavIcon d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10" />
          Log out
        </button>
        <div className="px-3 pt-2 text-xs text-white/50">
          Signed in as <span className="font-semibold text-white/80">{user.username}</span>
        </div>
      </div>
    </nav>
  );

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <div className="min-h-screen lg:pl-64">
        <aside className="fixed inset-y-0 left-0 hidden w-64 lg:block">{sidebar}</aside>

        {/* Mobile top bar + slide-in menu */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-grey-100 bg-white px-4 py-3 lg:hidden">
          <div className="flex items-center gap-2 font-bold">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand">
              <Mark size={16} color="white" />
            </span>
            ReBAT Admin
          </div>
          <button className="btn-secondary px-3" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <NavIcon d="M4 7h16M4 12h16M4 17h16" />
          </button>
        </header>
        {menuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
            <div className="relative h-full w-64">{sidebar}</div>
          </div>
        )}

        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8">{children}</main>
      </div>
    </UserContext.Provider>
  );
}
