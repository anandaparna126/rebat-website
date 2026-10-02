import { SOLUTIONS } from "@/lib/solutions";

// Full-height photographic panels — one door per solution into ReBAT's
// capabilities, not cards. Each panel is one real <a>, so the whole surface
// is clickable and follows normal browser navigation. The photo is the
// dominant element; text sits directly on it, over a restrained
// readability gradient only (no boxes, glass, or heavy shadows).
//
// Motion is CSS-only and deliberately slow: photo scales to 1.02, the
// gradient deepens a touch, the copy brightens, and the arrow drifts a few
// pixels — all on one 700ms ease-out curve.
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

export function SolutionPanels() {
  return (
    // 1px gaps on a dark ground read as thin dividers between the panels.
    <div className="grid grid-cols-1 gap-px bg-[#0e1412] sm:grid-cols-3">
      {SOLUTIONS.map((solution) => (
        <a
          key={solution.slug}
          href={solution.href}
          className="group relative block h-[540px] overflow-hidden bg-grey-900 sm:h-[600px] lg:h-[min(88vh,860px)] lg:min-h-[640px] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white focus-visible:outline-solid"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={solution.image}
            alt={solution.imageAlt}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[700ms] ${EASE} group-hover:scale-[1.02] group-focus-visible:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100`}
            style={{ objectPosition: solution.imagePosition }}
          />

          {/* Readability only: a soft lift under the index number at the top
              and a deeper one under the copy at the bottom. Deepens
              slightly on hover. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(14,20,18,0.42) 0%, rgba(14,20,18,0) 24%), linear-gradient(to top, rgba(14,20,18,0.88) 0%, rgba(14,20,18,0.55) 34%, rgba(14,20,18,0) 66%)",
            }}
          />
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-[700ms] ${EASE} group-hover:bg-black/[0.07] group-focus-visible:bg-black/[0.07]`}
          />

          <div className="relative flex h-full flex-col justify-between p-7 sm:p-8 lg:p-9">
            <span className="text-sm font-medium tracking-[0.14em] text-white/80">{solution.number}</span>

            <div>
              <h2 className="text-3xl leading-[1.05] font-semibold tracking-[0.02em] text-white uppercase sm:text-4xl">
                {solution.title}
              </h2>
              <p
                className={`mt-4 text-lg leading-snug font-medium text-white/90 transition-colors duration-[700ms] ${EASE} group-hover:text-white group-focus-visible:text-white`}
              >
                {solution.statement}
              </p>
              <p
                className={`mt-3 max-w-[34ch] text-sm leading-relaxed text-white/70 transition-colors duration-[700ms] ${EASE} group-hover:text-white/90 group-focus-visible:text-white/90`}
              >
                {solution.description}
              </p>
              <span className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-white">
                {solution.ctaLabel}
                <span
                  aria-hidden="true"
                  className={`inline-block transition-transform duration-[700ms] ${EASE} group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5 motion-reduce:transition-none`}
                >
                  &rarr;
                </span>
              </span>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
