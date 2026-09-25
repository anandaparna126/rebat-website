import { Reveal } from "@/components/ui/Reveal";
import { Grain } from "@/components/ui/Grain";
import { IMPACT_ITEMS, type ImpactItem } from "@/lib/content";

// Editorial composition, not a card grid: one dramatically tall cell for the
// "80%" statement, four standard cells beside it, and a full-bleed cell for
// "Nothing Ends Here." Layout config only — content stays in content.ts.
// `gridClass` values are literal (not template-built) so Tailwind's static
// scanner can find them.
const LAYOUT: {
  gridClass: string;
  slot: "tall" | "banner" | "standard";
}[] = [
  // 01 — tall, two-row cell, column 1. "80%" stays the most dominant piece.
  // Row-height clamps trimmed ~18% from the previous pass so it anchors the
  // composition without dominating it.
  { gridClass: "md:col-span-2 lg:[grid-column:1/2] lg:[grid-row:1/3]", slot: "tall" },
  // 02 — standard, row 1
  { gridClass: "md:col-span-1 lg:[grid-column:2/3] lg:[grid-row:1/2]", slot: "standard" },
  // 03 — standard, row 1
  { gridClass: "md:col-span-1 lg:[grid-column:3/4] lg:[grid-row:1/2]", slot: "standard" },
  // 04 — full-width cell, closing row. Given the exact same treatment as
  // every other panel (padded artwork, soft vignette, continuous colour
  // field) so it reads as the collection's fourth piece, not a banner.
  { gridClass: "md:col-span-2 lg:[grid-column:1/4] lg:[grid-row:3/4]", slot: "banner" },
  // 05 — standard, row 2
  { gridClass: "md:col-span-1 lg:[grid-column:3/4] lg:[grid-row:2/3]", slot: "standard" },
  // 06 — standard, row 2
  { gridClass: "md:col-span-1 lg:[grid-column:2/3] lg:[grid-row:2/3]", slot: "standard" },
];

function hexToRgb(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

function ImpactPanel({ item }: { item: ImpactItem }) {
  const light = item.textColor === "light";
  const rgb = hexToRgb(item.panelSolid);
  const isStat = item.number === "01";
  return (
    // No outer card boundary (no border, shadow, or full-panel radius) —
    // the panel is one continuous colour field; whitespace (the grid gap)
    // separates it from its neighbours, not a visible edge. A faint radial
    // catch-light adds tonal variation without reading as an "effect."
    <div
      className="group relative flex h-full flex-col"
      style={{ background: `radial-gradient(140% 90% at 28% -8%, rgba(255,255,255,0.16), transparent 55%), ${item.gradient}` }}
    >
      {/* The artwork sits inset within its own field (a "mat," not a
          full-bleed rectangle) — several of the source images already carry
          their own matching matte border, so this lets that show through
          naturally instead of cropping it away. */}
      <div className="relative flex-1 p-4 sm:p-5">
        <div className="relative h-full w-full overflow-hidden rounded-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image}
            alt={item.imageAlt}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            style={{ objectPosition: item.objectPosition }}
          />
          {/* Soft vignette on every edge, blending the artwork into the
              panel's own colour on all sides, not just where it meets the
              text below. */}
          <div className="pointer-events-none absolute inset-0" style={{ boxShadow: `inset 0 0 60px 16px rgba(${rgb}, 0.55)` }} />
          {/* A stronger fade at the very bottom keeps the text zone clean. */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
            style={{ background: `linear-gradient(to bottom, rgba(${rgb}, 0) 0%, rgba(${rgb}, 0.92) 100%)` }}
          />
        </div>
      </div>

      <div className="relative -mt-2 px-5 pb-5 sm:px-6 sm:pb-6">
        {isStat ? (
          <>
            <div className="text-4xl leading-none font-bold sm:text-5xl" style={{ color: "var(--brand)" }}>
              80%
            </div>
            <div className="mt-1.5 text-lg font-bold sm:text-xl" style={{ color: "var(--ink)" }}>
              Lower Carbon Footprint
            </div>
          </>
        ) : (
          <h3 className="text-lg leading-snug font-bold text-balance sm:text-xl" style={{ color: light ? "#F5F1E8" : "var(--ink)" }}>
            {item.title}
          </h3>
        )}
        <p className="mt-1.5 max-w-[42ch] text-sm leading-relaxed" style={{ color: light ? "rgba(245,241,232,0.72)" : "var(--body-c)" }}>
          {item.description}
        </p>
      </div>
    </div>
  );
}

export function Impact() {
  return (
    // Same technique as Description/ProcessLoop: this wrapper carries the
    // next section's color (Products, surface-stone) so it shows through
    // the notch left by the rounded-bottom corners, instead of white.
    <div className="bg-surface-stone">
      <section
        className="relative overflow-hidden rounded-b-[32px] px-[5vw] py-20"
        style={{ background: "linear-gradient(100deg, #dde3d3 0%, var(--surface-mineral) 50%, #eae1ce 100%)" }}
      >
        <Grain opacity={0.05} />

        {/* Dashed orbit lines — reuses the mark's own dashed-loop motif
            (the circular arc from the logo) rather than a generic pattern.
            Conceptually tied to "closing the loop," not just decoration. */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
          <circle cx="88%" cy="10%" r="220" fill="none" stroke="var(--brand-deep)" strokeWidth="1.5" strokeDasharray="8 8" opacity="0.14" />
          <circle cx="6%" cy="95%" r="140" fill="none" stroke="var(--brand-deep)" strokeWidth="1.5" strokeDasharray="8 8" opacity="0.1" />
        </svg>

        {/* Clean section opener — eyebrow + heading only, generous
            whitespace beneath. No secondary tagline: the six statements
            below already carry their own titles and descriptions. */}
        <Reveal className="relative mb-16">
          <div className="mb-2 text-2xl font-bold tracking-[0.08em] uppercase" style={{ color: "var(--grey-800)" }}>
            Impact
          </div>
          <h2 className="text-5xl font-bold" style={{ color: "var(--brand-deep)" }}>
            What closing the loop changes.
          </h2>
        </Reveal>

        <div className="relative grid grid-cols-1 gap-7 md:grid-cols-2 md:gap-7 lg:grid-cols-3 lg:gap-8 lg:[grid-template-rows:clamp(250px,21vw,320px)_clamp(250px,21vw,320px)_clamp(230px,19vw,280px)]">
          {IMPACT_ITEMS.map((item, i) => {
            const layout = LAYOUT[i];
            return (
              <Reveal key={item.number} delay={i * 0.05} className={layout.gridClass}>
                <ImpactPanel item={item} />
              </Reveal>
            );
          })}
        </div>
      </section>
    </div>
  );
}
