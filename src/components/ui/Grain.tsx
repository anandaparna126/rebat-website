"use client";

import { useId } from "react";

// Subtle film-grain overlay, matching cylib's treatment of its dark
// photo-overlay bands (hero, intro, CTA band) — not used on light sections.
export function Grain({ opacity = 0.06 }: { opacity?: number }) {
  const filterId = useId();
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ opacity }}
      aria-hidden="true"
    >
      <filter id={filterId}>
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${filterId})`} />
    </svg>
  );
}
