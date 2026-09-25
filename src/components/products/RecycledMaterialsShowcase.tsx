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
    // Same rounded-corner notch-fill technique used across the rest of the
    // site (Description, ProcessLoop, Impact): this wrapper carries the
    // next section's colour (BatteryProductsShowcase's dark grey-900) so it
    // shows through the notch instead of leaving a flat colour seam.
    <div className="bg-grey-900">
    <section id="recovered-materials" className="relative overflow-hidden rounded-b-[32px] bg-surface-stone pb-24">
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
    </div>
  );
}
