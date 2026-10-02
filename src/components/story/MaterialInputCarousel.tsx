"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { INCOMING_MATERIALS } from "@/lib/story";

// A row of 4, then a row of 2 — every photo stays full-size and visible
// at once (no expanding/shrinking neighbours). Tapping a tile opens a
// drawer below its row with the name + description, pushing the rows
// below it down; the photo itself never gets replaced or resized.
const ROW_SIZES = [4, 2];
const ROWS: (typeof INCOMING_MATERIALS)[number][][] = [];
{
  let cursor = 0;
  for (const size of ROW_SIZES) {
    ROWS.push(INCOMING_MATERIALS.slice(cursor, cursor + size));
    cursor += size;
  }
}
const ROW_COLS: Record<number, string> = {
  4: "grid-cols-2 sm:grid-cols-4",
  2: "grid-cols-2",
};
const TOTAL = INCOMING_MATERIALS.length;

export function MaterialInputCarousel() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="mt-12 space-y-2">
      {ROWS.map((row, rowIdx) => {
        const activeInRow = row.some((m) => INCOMING_MATERIALS.indexOf(m) === active);
        const activeMaterial = activeInRow ? INCOMING_MATERIALS[active as number] : null;

        return (
          <div key={rowIdx}>
            <div className={`grid gap-2 ${ROW_COLS[row.length]}`}>
              {row.map((material) => {
                const i = INCOMING_MATERIALS.indexOf(material);
                const isActive = active === i;
                return (
                  <button
                    key={material.number}
                    onClick={() => setActive(isActive ? null : i)}
                    aria-expanded={isActive}
                    aria-label={material.name}
                    className="relative block h-40 w-full overflow-hidden rounded-xl bg-grey-100 text-left sm:h-48 lg:h-56"
                  >
                    {material.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={material.image} alt={material.name} className="absolute inset-0 h-full w-full object-cover" />
                    )}
                    <div
                      className={`pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 transition-opacity sm:p-4 ${
                        isActive ? "opacity-0" : "opacity-100"
                      }`}
                    >
                      <span className="block text-[10px] font-medium text-white/70">{material.number}</span>
                      <span className="mt-0.5 block text-sm font-medium text-white sm:text-base">{material.name}</span>
                    </div>
                    <div
                      className={`absolute inset-0 ring-2 ring-inset ring-white transition-opacity ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <AnimatePresence initial={false}>
              {activeMaterial && (
                <motion.div
                  key="drawer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 flex flex-col justify-between gap-4 rounded-xl bg-grey-900 p-5 sm:flex-row sm:items-start sm:p-6">
                    <div>
                      <span className="text-xs font-medium text-white/50">
                        {activeMaterial.number} / {String(TOTAL).padStart(2, "0")}
                      </span>
                      <h3 className="mt-1 text-2xl font-medium text-white sm:text-3xl">{activeMaterial.name}</h3>
                      <p className="mt-2 max-w-md text-sm leading-relaxed text-white/70">{activeMaterial.description}</p>
                    </div>
                    <button
                      onClick={() => setActive(null)}
                      aria-label="Close"
                      className="self-end text-lg text-white/50 transition-colors hover:text-white sm:self-start"
                    >
                      &#10005;
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
