import { Grain } from "@/components/ui/Grain";
import type { PageHeroContent } from "@/lib/content";

// Shared hero for every non-home page — same grainy-photo-overlay treatment
// used elsewhere on the site (Description, Footer), sized down from the
// Hero's full-bleed video since these pages don't have their own footage.
// Nav sits absolutely positioned on top, same as it does inside HeroTrack
// on the home page, so its transparent-over-dark → solid-on-scroll color
// lerp behaves identically here.
//
// Background photo defaults to a TEMPORARY placeholder — the real facility
// photo already used in the footer, reused here rather than inventing new
// imagery — until page-specific photography exists. Pages with their own
// real hero image (e.g. /partner-with-us) pass `image` to use it instead.
//
// `align`/`theme` let a page's own image dictate the text treatment instead
// of forcing one fixed layout: a photo with its interesting content low and
// a pale area up top (like /partner-with-us's) reads better with dark text
// pinned to the top, over that pale area, with no heavy darkening overlay —
// the opposite of the default (light text, bottom-anchored, dark overlay).
export function PageHero({
  content,
  image = "/images/footer-bg.webp",
  align = "end",
  theme = "light",
  children,
}: {
  content: PageHeroContent;
  image?: string;
  align?: "start" | "end";
  theme?: "light" | "dark";
  children?: React.ReactNode;
}) {
  const isDark = theme === "dark";
  return (
    <section
      className={`relative flex min-h-[100svh] flex-col overflow-hidden bg-cover bg-center px-[5vw] pt-[168px] pb-20 ${
        align === "start" ? "justify-start" : "justify-end"
      }`}
      style={{ backgroundImage: `url(${image})` }}
    >
      {!isDark && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(155deg, var(--grey-900) 0%, var(--brand-deep-2) 55%, var(--brand-deep) 100%)", opacity: 0.82 }}
        />
      )}
      <Grain opacity={0.06} />
      <div className="relative mx-auto max-w-[1328px]">
        <div
          className="mb-4 text-xs font-medium tracking-[0.08em] uppercase"
          style={{ color: isDark ? "var(--grey-800)" : "rgba(255,255,255,0.7)" }}
        >
          {content.eyebrow}
        </div>
        <h1
          className="max-w-2xl text-4xl font-medium leading-[1.15] sm:text-5xl"
          style={{ color: isDark ? "var(--ink)" : "#ffffff" }}
        >
          {content.headline}
        </h1>
        {children}
      </div>
    </section>
  );
}
