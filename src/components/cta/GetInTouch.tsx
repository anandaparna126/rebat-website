import { Grain } from "@/components/ui/Grain";
import { Reveal } from "@/components/ui/Reveal";
import { GET_IN_TOUCH_PILLS, TAGLINE_EYEBROW } from "@/lib/content";
import { isExternalHref } from "@/lib/links";

export function GetInTouch({ overlap = false }: {
  /** Set when the section immediately above this one on the page has its
   * own rounded-bottom corner (`rounded-b-[32px]`) — pulls this section up
   * underneath it via a negative top margin, the same structural overlap
   * technique used at every other rounded section boundary on the site, so
   * that corner's notch reveals this section's *real* brand-green
   * background instead of a flat colour-matched wrapper. Left off (the
   * default) on pages where the section above GetInTouch isn't rounded —
   * forcing the margin there would pull GetInTouch under content it
   * doesn't actually sit behind. */
  overlap?: boolean;
}) {
  return (
    <section id="get-in-touch" className={`relative overflow-hidden bg-brand px-[5vw] py-20 text-center ${overlap ? "-mt-10" : ""}`}>
      <Grain opacity={0.05} />
      <Reveal className="relative">
        <div className="mb-3 text-xs font-medium tracking-[0.08em] text-white/70 uppercase">
          {TAGLINE_EYEBROW}
        </div>
        <h2 className="mb-8 text-3xl font-medium text-white">
          Build together. Grow together.
        </h2>
        <div className="flex flex-wrap justify-center gap-2.5">
          {GET_IN_TOUCH_PILLS.map((pill) => (
            <a
              key={pill.href}
              href={pill.href}
              className="group relative rounded-lg border border-white/40 px-5 py-2.5 text-sm text-white transition-colors hover:bg-white/10"
              {...(isExternalHref(pill.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-2 -z-10 rounded-lg opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-50"
                style={{ background: "linear-gradient(90deg, var(--gold), #ffffff 50%, var(--gold))" }}
              />
              {pill.label}
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
