import { Reveal } from "@/components/ui/Reveal";
import { Grain } from "@/components/ui/Grain";
import { BATTERY_RANGE } from "@/lib/battery-packs";
import { EngineeredEnergyCarousel } from "@/components/products/EngineeredEnergyCarousel";
import { EngineeredEnergyCarouselClassic } from "@/components/products/EngineeredEnergyCarouselClassic";

// The homepage and the dedicated /products page deliberately show two
// different views: the homepage keeps its own original photo/video
// auto-carousel and simple heading ("classic"), /products shows the newer
// information-first carousel with its own eyebrow + headline ("detailed",
// the default). Real product photography/specs don't exist yet for every
// line (except one real Battery Pack photo), so both carousels render an
// honest "Pending" state for what's missing rather than inventing it.
export function BatteryProductsShowcase({ variant = "detailed" }: { variant?: "classic" | "detailed" }) {
  return (
    // Pulled up underneath RecycledMaterialsShowcase's rounded corner
    // (that section sits at z-10; this one stays at the default stacking
    // level) by roughly its own corner radius plus a few px of buffer —
    // cylib's own real technique for this transition, confirmed live via
    // computed styles (their equivalent pair uses z-index 10/5 and a
    // -48px margin against a 40px radius).
    <section id="battery-products" className="relative -mt-10">
      <div className="relative overflow-hidden bg-grey-900 py-24">
        {/* Same slow-drift technique as the Recovered Materials section's
            background wash, just a single constant brand-emerald glow
            instead of one that tracks an active colour — there's no
            per-slide colour to sync with here, but "Engineered Energy"
            having its own soft glow of light in the dark fits the section
            literally, not just decoratively. */}
        <div aria-hidden="true" className="pointer-events-none absolute top-1/2 left-1/2 -z-10">
          <div
            style={{
              position: "absolute",
              width: "120vw",
              height: "85vh",
              marginLeft: "-60vw",
              marginTop: "-42.5vh",
              borderRadius: "9999px",
              opacity: 0.35,
              filter: "blur(100px)",
              backgroundColor: "var(--brand-hover)",
              animation: "washDrift 42s ease-in-out infinite",
            }}
          />
        </div>

        <Grain opacity={0.05} />
        {variant === "classic" ? (
          <Reveal className="relative mx-auto max-w-[1328px] px-[5vw] text-center">
            <h3 className="text-3xl font-medium text-white sm:text-4xl">Engineered Energy</h3>
            <p className="mt-3 mb-10 text-base text-white/60">{BATTERY_RANGE.tagline}</p>
          </Reveal>
        ) : (
          <Reveal className="relative mx-auto mb-14 max-w-[1328px] px-[5vw] text-center">
            <div className="mb-2 text-xs font-medium tracking-[0.25em] text-white/50 uppercase">{BATTERY_RANGE.eyebrow}</div>
            <h3 className="text-3xl font-medium text-white sm:text-4xl">{BATTERY_RANGE.tagline}</h3>
          </Reveal>
        )}

        <div className="relative">
          {variant === "classic" ? <EngineeredEnergyCarouselClassic /> : <EngineeredEnergyCarousel />}
        </div>
      </div>
    </section>
  );
}
