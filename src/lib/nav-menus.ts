import { PARTNER_PANELS } from "@/lib/partner";
import { SOLUTIONS } from "@/lib/solutions";

// Quick-link menus for nav items that lead somewhere with real subsections
// — cylib's own "hover a top link, see its subsections" pattern (confirmed
// against their live site: a tight stack of small pill links, title only,
// no image or description). A nav item with no subsections just stays a
// plain link (About us, Jobs, Newsroom).
export interface NavMenuItem {
  title: string;
  href: string;
}

export const PARTNER_MENU: NavMenuItem[] = PARTNER_PANELS.map((p) => ({ title: p.title, href: p.href }));

export const PRODUCTS_MENU: NavMenuItem[] = [
  { title: "Recovered Materials", href: "/products#recovered-materials" },
  { title: "Battery Products", href: "/products#battery-products" },
];

export const SOLUTIONS_MENU: NavMenuItem[] = SOLUTIONS.map((s) => ({ title: s.title, href: s.href }));

// Keyed by the exact NAV_LINKS href it attaches to. Only Partner with us and
// Solution get the hover dropdown; Products stays a plain link.
export const NAV_MENUS: Record<string, NavMenuItem[]> = {
  "/partner-with-us": PARTNER_MENU,
  "/solutions": SOLUTIONS_MENU,
};
