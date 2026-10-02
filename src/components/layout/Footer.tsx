import { ContactButton } from "@/components/ui/ContactButton";
import { Mark } from "@/components/mark/Mark";
import { Grain } from "@/components/ui/Grain";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { NAV_LINKS } from "@/lib/content";
import { isExternalHref } from "@/lib/links";

export function Footer() {
  return (
    // Same rounded-corner notch-fill technique as the rest of the site:
    // wrapped in the colour of the section above it (GetInTouch, brand
    // emerald) so the rounded-top notch reveals that instead of a flat
    // seam where the photo background begins.
    <div className="bg-brand">
    <footer className="relative overflow-hidden rounded-t-[32px] bg-cover bg-center px-[5vw] pt-[120px]" style={{ backgroundImage: "url(/images/footer-bg.webp)" }}>
      <Grain opacity={0.05} />

      <div className="relative mb-16 flex flex-wrap items-start justify-between gap-10">
        <div className="flex flex-col gap-5">
          <Mark size={28} color="#ffffff" />
          <SocialLinks className="-ml-2" />
        </div>

        {/* Main nav links only — no sub-links. */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-white/90 transition-colors hover:text-white"
              {...(isExternalHref(link.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {link.label}
            </a>
          ))}
        </div>

        <ContactButton />
      </div>

      <div className="relative mb-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/40">
        <span>&copy; {new Date().getFullYear()} ReBAT</span>
        <span className="flex gap-3">
          <a href="/privacy-policy" className="transition-colors hover:text-white">Privacy</a>
        </span>
      </div>

      {/* Giant wordmark lockup, centered — near edge-to-edge width, same
          20vw font-size as before. Now bottom-flush and cropped at the top
          instead of shown in full: a fixed, short container clips
          whatever exceeds it, and `items-end` keeps the visible slice
          pinned to the footer's own bottom edge rather than floating with
          empty space beneath it — this is what keeps the footer short at
          this font-size, matching cylib's own footer wordmark mechanism. */}
      <div className="relative flex h-[9vw] min-h-[75px] items-end justify-center overflow-hidden select-none">
        <div
          className="leading-none"
          style={{ fontSize: "10vw", fontFamily: "var(--font-rounded)", color: "#F2F1E9" }}
        >
          ReBAT
        </div>
      </div>

      {/* The Sage Group parent-company lockup, pinned bottom-right. */}
      <img
        src="/images/sage-group-white.webp"
        alt="The Sage Group"
        width={417}
        height={357}
        className="absolute right-[5vw] bottom-4 h-auto w-[clamp(64px,7vw,140px)] select-none"
      />
    </footer>
    </div>
  );
}
