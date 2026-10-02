import { Reveal } from "@/components/ui/Reveal";
import { StatCounter } from "@/components/impact/StatCounter";
import { IMPACT_ITEMS } from "@/lib/content";

// Bento photo grid, following cylib's own "In a nutshell" structure
// (inspected live: white rounded photo cards, a plain caption below the
// photo — no colour-blocked panels) on this site's own warm yellow-toned
// backdrop instead of cylib's dark one; a soft shadow keeps the white
// cards separated from the light background.
//
// Row 1 is the opening banner (Central India's Pioneer, full width).
// Rows 2-3 are the remaining 5 cards — one tall card (spans two rows),
// two standard cards, one wide card. `gridClass` values are literal so
// Tailwind's static scanner can find them.
const LAYOUT: string[] = [
  // 01 — opening banner, full width
  "md:col-span-2 lg:[grid-column:1/4] lg:[grid-row:1/2]",
  // 02 — tall, LEFT column, rows 2-3, so the strongest quantified claim
  // (95%) is both the most prominent cell and the first one read
  // left-to-right, ahead of 73% and 26%.
  "md:col-span-2 lg:[grid-column:1/2] lg:[grid-row:2/4]",
  // 03 — standard, row 2
  "md:col-span-1 lg:[grid-column:2/3] lg:[grid-row:2/3]",
  // 04 — standard, row 2
  "md:col-span-1 lg:[grid-column:3/4] lg:[grid-row:2/3]",
  // 05 — wide, row 3, columns 2-3 (shifted right so it doesn't collide
  // with the tall card now occupying column 1 through row 3).
  "md:col-span-2 lg:[grid-column:2/4] lg:[grid-row:3/4]",
];

export function Impact() {
  return (
    // Same structural overlap technique as Description/ProcessLoop: pulled
    // up under ProcessLoop via a negative top margin, staying above
    // RebatStorySection in z-index so this section's own rounded-bottom
    // corner reveals RebatStorySection's *real* background through the
    // notch instead of a manually colour-matched wrapper.
    <section
      className="relative z-10 -mt-10 overflow-hidden rounded-b-[32px] px-[5vw] py-20"
      style={{ background: "linear-gradient(100deg, #e2f0ad 0%, var(--surface-yellow) 50%, var(--surface-mineral) 100%)" }}
    >
      <Reveal className="relative mb-12">
        <div className="mb-2 text-2xl font-bold tracking-[0.08em] uppercase" style={{ color: "var(--grey-800)" }}>
          Impact
        </div>
        <h2 className="text-4xl font-bold sm:text-5xl" style={{ color: "var(--brand-deep)" }}>
          Closing the Loop, Changing the Future.
        </h2>
      </Reveal>

      <div className="relative grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 lg:[grid-template-rows:clamp(280px,24vw,340px)_clamp(230px,19vw,290px)_clamp(230px,19vw,290px)]">
        {IMPACT_ITEMS.map((item, i) => (
          <Reveal key={item.number} delay={i * 0.05} className={LAYOUT[i]}>
            <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white p-2 shadow-[0_18px_40px_-20px_rgba(10,36,28,0.35)]">
              <div className="relative flex-1 overflow-hidden rounded-xl" style={{ background: item.imageBackground }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.imageAlt}
                  loading="lazy"
                  style={{ objectPosition: item.objectPosition }}
                  className={`absolute inset-0 h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${
                    item.fit === "contain" ? "object-contain" : "object-cover"
                  }`}
                />
                {/* Only the stat cards need a scrim — it exists purely so
                    the bold number reads over whatever the photo is doing
                    underneath it. */}
                {item.stat && (
                  <>
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-transparent" />
                    {item.overlayLabel ? (
                      <div className="pointer-events-none absolute top-1/2 left-[30%] max-w-[46%] -translate-x-1/2 -translate-y-1/2 text-center">
                        <span className="block text-2xl leading-[1.1] font-black text-balance text-white sm:text-3xl lg:text-4xl">
                          {item.overlayLabel}
                        </span>
                        <StatCounter stat={item.stat} className="mt-1 block text-4xl leading-none font-bold text-white sm:mt-2 sm:text-5xl" />
                      </div>
                    ) : (
                      <StatCounter
                        stat={item.stat}
                        className="absolute bottom-5 left-5 text-4xl leading-none font-bold text-white sm:text-5xl"
                      />
                    )}
                  </>
                )}
              </div>
              <div className="px-2 pt-4 pb-3">
                <h3 className="text-xl leading-snug font-black text-balance" style={{ color: "var(--ink)" }}>
                  {item.heading}
                </h3>
                <p className="mt-1.5 text-base leading-relaxed font-medium sm:text-lg" style={{ color: "var(--grey-800)" }}>
                  {item.description}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
