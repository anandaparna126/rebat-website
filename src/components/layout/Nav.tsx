"use client";

import { useState } from "react";
import { useMotionValueEvent } from "motion/react";
import { ContactButton } from "@/components/ui/ContactButton";
import { NavDropdown } from "@/components/layout/NavDropdown";
import { NAV_LINKS } from "@/lib/content";
import { NAV_MENUS } from "@/lib/nav-menus";
import { isExternalHref } from "@/lib/links";
import { lerpColor, useScrollProgress } from "@/lib/useScrollProgress";

// The nav's own background never activates — it stays transparent for the
// whole scroll, at every position; only the link text colors and the logo
// crossfade animate. What looks like a "white nav" once the hero has
// contracted is just the page's own white background showing through the
// still-transparent nav.
const LINK_START: [number, number, number] = [255, 255, 255];
const LINK_END: [number, number, number] = [63, 80, 76]; // grey-800
// Nav reaches its "solid" state a little before the hero card finishes
// settling (at shared-progress ~0.87, not 1.0) — a deliberate lead on the
// shared spring value rather than everything finishing in lockstep.
const LEAD_MULTIPLIER = 1.15;

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const sharedProgress = useScrollProgress();
  const [progress, setProgress] = useState(0);
  useMotionValueEvent(sharedProgress, "change", (v) => setProgress(Math.min(1, v * LEAD_MULTIPLIER)));

  // Same hard cutover point cylib uses for its logo crossfade — reused here
  // as the general "solid" state for anything binary (mobile menu, borders).
  const solid = progress >= 0.75 || menuOpen;

  const linkColor = menuOpen ? "rgb(63, 80, 76)" : lerpColor(LINK_START, LINK_END, progress);

  return (
    <nav className="absolute inset-x-0 top-0 z-50 px-6">
      {/* Content is centered in the same max-width column as the hero card
          (1400px) so nav and card edges line up on wide screens — the
          nav's own background stays full-width (and transparent) around
          it. */}
      <div className="mx-auto flex max-w-[1400px] items-center justify-between py-7">
        <ul className="hidden items-center gap-7 text-[17px] font-medium md:flex" style={{ color: linkColor }}>
          {NAV_LINKS.slice(0, 3).map((link) => {
            const menu = NAV_MENUS[link.href];
            if (menu) {
              return <NavDropdown key={link.href} href={link.href} label={link.label} items={menu} linkColor={linkColor} align="left" />;
            }
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="transition-colors hover:text-brand"
                  style={{ color: "inherit" }}
                  {...(isExternalHref(link.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Real logo image, not the icon+text approximation — crossfades
            to white (matching cylib's white->brand nav logo swap) the same
            way while over the transparent-over-video state, via filter
            instead of a separate asset. */}
        <a href="/" className="relative flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-source.png"
            alt="ReBAT"
            className="h-12 w-auto transition-[filter] duration-150"
            style={{ filter: solid ? "none" : "brightness(0) invert(1)" }}
          />
        </a>

        <div className="hidden items-center gap-7 md:flex">
          <ul className="flex items-center gap-7 text-[17px] font-medium" style={{ color: linkColor }}>
            {NAV_LINKS.slice(3).map((link) => {
              const menu = NAV_MENUS[link.href];
              if (menu) {
                return <NavDropdown key={link.href} href={link.href} label={link.label} items={menu} linkColor={linkColor} align="right" />;
              }
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="transition-colors hover:text-brand"
                    style={{ color: "inherit" }}
                    {...(isExternalHref(link.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
          <ContactButton />
        </div>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="relative flex h-9 w-9 flex-col items-center justify-center gap-[5px] md:hidden"
        >
          <span className={`h-[1.5px] w-5 transition-transform ${solid ? "bg-ink" : "bg-white"} ${menuOpen ? "translate-y-[6.5px] rotate-45" : ""}`} />
          <span className={`h-[1.5px] w-5 transition-opacity ${solid ? "bg-ink" : "bg-white"} ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`h-[1.5px] w-5 transition-transform ${solid ? "bg-ink" : "bg-white"} ${menuOpen ? "-translate-y-[6.5px] -rotate-45" : ""}`} />
        </button>
      </div>

      {menuOpen && (
        <div className="absolute inset-x-0 top-full flex max-h-[calc(100svh-88px)] flex-col gap-1 overflow-y-auto border-t border-grey-200 bg-grey-100 px-6 py-6 md:hidden">
          {NAV_LINKS.map((link) => {
            const menu = NAV_MENUS[link.href];
            return (
              <div key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-md px-2 py-3 text-base font-medium text-grey-800 transition-colors hover:text-brand"
                  {...(isExternalHref(link.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {link.label}
                </a>
                {menu && (
                  <div className="mb-1 flex flex-col gap-0.5 pl-4">
                    {menu.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className="rounded-md px-2 py-2 text-sm text-grey-600 transition-colors hover:text-brand"
                      >
                        {item.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <div className="mt-3">
            <ContactButton onClick={() => setMenuOpen(false)} />
          </div>
        </div>
      )}
    </nav>
  );
}
