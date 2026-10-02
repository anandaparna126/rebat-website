import type { ReactNode } from "react";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";

// Every non-home page shares this shell: Nav (absolutely positioned, reused
// as-is — its scroll-based color lerp only depends on window scroll, not on
// being inside the home page's pinned HeroTrack) + page content + Footer.
//
// `hideNav` lets a page that builds its own pinned scroll-track hero (like
// PartnerHero) render Nav inside that track itself, matching the homepage's
// HeroTrack pattern, instead of getting this shell's non-pinned copy too.
export function PageShell({ children, hideNav = false }: { children: ReactNode; hideNav?: boolean }) {
  return (
    <div className="relative">
      {!hideNav && <Nav />}
      <main>{children}</main>
      <Footer />
    </div>
  );
}
