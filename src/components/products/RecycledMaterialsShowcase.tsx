"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { RecoveredMaterialsCarousel } from "@/components/products/RecoveredMaterialsCarousel";
import { RecoveredMaterialsCarouselClassic } from "@/components/products/RecoveredMaterialsCarouselClassic";
import { RECYCLED_MATERIALS } from "@/lib/products";

// The homepage and the dedicated /products page deliberately show two
// different views of the same material data: the homepage teases the
// story (its own original photo+video auto-carousel, "classic"), while
// /products is where a visitor actually reads specs (the newer
// information-first carousel, "detailed" — the default).
export function RecycledMaterialsShowcase({ variant = "detailed" }: { variant?: "classic" | "detailed" }) {
  const [washColor, setWashColor] = useState(RECYCLED_MATERIALS[0].glow);

  return (
    // cylib's own real technique (inspected live via computed styles, not
    // a manually colour-matched wrapper): this section sits above
    // BatteryProductsShowcase in z-index (10 vs. its default stacking) and
    // BatteryProductsShowcase is pulled up underneath it with a negative
    // top margin. Wherever this section's own rounded corner curves away,
    // BatteryProductsShowcase's *real* background shows through directly —
    // nothing to keep manually in sync, unlike the old flat-colour wrapper
    // this replaced (which went stale more than once this project).
    <section id="recovered-materials" className="relative z-10 overflow-hidden rounded-b-[32px] bg-surface-stone pb-24">
      {/* A soft, slowly-drifting tint across the section's own stone
          background — colour follows whichever material is centred in the
          carousel below. Two nested layers: the outer one just anchors a
          center point (fixed vw/vh size + negative margins, not a
          percentage height — that silently fails to resolve against an
          auto-height section, the exact bug the carousel's own glow hit
          earlier); the inner one owns the drift animation, so its keyframes
          can use `transform` freely without fighting a static centering
          transform on the same property. */}
      <div aria-hidden="true" className="pointer-events-none absolute top-1/2 left-1/2 -z-10">
        <div
          style={{
            position: "absolute",
            width: "130vw",
            height: "90vh",
            marginLeft: "-65vw",
            marginTop: "-45vh",
            borderRadius: "9999px",
            opacity: 0.55,
            filter: "blur(90px)",
            backgroundColor: washColor,
            transition: "background-color 1200ms ease",
            animation: "washDrift 38s ease-in-out infinite",
          }}
        />
      </div>
      {/* The wash blob above is clipped hard by this section's own
          `overflow-hidden` (needed for the rounded-bottom corner) — without
          this, that clip reads as a visible seam right where the section
          starts, instead of the tint gently building up. Fades the
          section's own top edge back to plain surface-stone over a short
          distance so the colour arrives gradually. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-40"
        style={{ background: "linear-gradient(to bottom, var(--surface-stone) 0%, transparent 100%)" }}
      />

      <Reveal className="relative mx-auto max-w-[1328px] px-[5vw] pb-12 text-center">
        <h3 className="text-3xl font-medium text-ink sm:text-4xl">Recovered Materials</h3>
      </Reveal>
      <div className="relative">
        {variant === "classic" ? (
          <RecoveredMaterialsCarouselClassic onActiveChange={(m) => setWashColor(m.glow)} />
        ) : (
          <RecoveredMaterialsCarousel onActiveChange={(m) => setWashColor(m.glow)} />
        )}
      </div>
    </section>
  );
}
