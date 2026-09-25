"use client";

import { useState } from "react";
import { INCOMING_MATERIALS } from "@/lib/story";

// An expanding gallery, not a one-at-a-time slide carousel: all 7 materials
// sit in one row. Tapping a tile grows it and opens a name+description panel
// beside it, while the other tiles compress but stay visible (rather than
// being hidden off-screen or swapped out).
const TOTAL = INCOMING_MATERIALS.length;

export function MaterialInputCarousel() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="mt-12">
      {/* Desktop / tablet — the horizontal expanding gallery. 7 tiles at a
          56px collapsed minimum don't fit a phone width without forcing a
          cramped horizontal scroll, so this layout is sm: and up only. */}
      <div className="hidden h-[60vh] max-h-[600px] min-h-[380px] gap-1 overflow-x-auto sm:flex">
        {INCOMING_MATERIALS.flatMap((material, i) => {
          const isActive = active === i;

          const tile = (
            <button
              key={material.number}
              onClick={() => setActive(isActive ? null : i)}
              aria-expanded={isActive}
              aria-label={material.name}
              className="relative h-full min-w-[56px] overflow-hidden rounded-xl bg-grey-100 text-left"
              style={{ flex: isActive ? "2 1 0%" : active === null ? "1 1 0%" : "0.5 1 0%" }}
            >
              {material.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img loading="lazy" decoding="async" src={material.image} alt={material.name} className="absolute inset-0 h-full w-full object-cover" />
              )}
              {!isActive && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <span className="block text-[10px] font-medium text-white/70">{material.number}</span>
                  <span className="mt-0.5 block text-sm font-medium text-white">{material.name}</span>
                </div>
              )}
            </button>
          );

          if (!isActive) return [tile];

          const panel = (
            <div
              key={`${material.number}-panel`}
              className="flex h-full flex-[1.3_1_0%] flex-col justify-between overflow-hidden rounded-xl bg-grey-50 p-6"
            >
              <button onClick={() => setActive(null)} aria-label="Close" className="self-end text-grey-400 transition-colors hover:text-ink">
                &#10005;
              </button>
              <div>
                <span className="text-xs font-medium text-grey-400">
                  {material.number} / {String(TOTAL).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-3xl font-medium text-ink sm:text-4xl">{material.name}</h3>
                <p className="mt-3 text-sm text-body">{material.description}</p>
              </div>
              <div />
            </div>
          );

          return [tile, panel];
        })}
      </div>

      {/* Mobile — the same tap-to-expand idea, oriented vertically instead
          of sideways: a stacked list of collapsed rows, one full-width
          photo + description opening in place when tapped. */}
      <div className="flex flex-col gap-2 sm:hidden">
        {INCOMING_MATERIALS.map((material, i) => {
          const isActive = active === i;
          return (
            <div key={material.number} className="overflow-hidden rounded-xl bg-grey-100">
              <button
                onClick={() => setActive(isActive ? null : i)}
                aria-expanded={isActive}
                aria-label={material.name}
                className="relative block w-full overflow-hidden text-left"
                style={{ height: isActive ? 240 : 72 }}
              >
                {material.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img loading="lazy" decoding="async" src={material.image} alt={material.name} className="absolute inset-0 h-full w-full object-cover" />
                )}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <span className="block text-[10px] font-medium text-white/70">{material.number}</span>
                  <span className="mt-0.5 block text-sm font-medium text-white">{material.name}</span>
                </div>
              </button>
              {isActive && (
                <div className="bg-grey-50 p-5">
                  <p className="text-sm text-body">{material.description}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
