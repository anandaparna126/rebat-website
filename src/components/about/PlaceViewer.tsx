"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { LAB_GALLERY } from "@/lib/lab-photos";
import { TEAM } from "@/lib/team-photos";

const GROUPS = [
  { label: "The lab", photos: LAB_GALLERY },
  { label: "The team", photos: [TEAM.entrance, TEAM.hivis, TEAM.closeup] },
];

// One large photograph at a time, grouped by place, with thumbnails to pick
// the next one. Everything stays inside a single screen.
export function PlaceViewer() {
  const [g, setG] = useState(0);
  const [p, setP] = useState(0);
  const group = GROUPS[g];
  const photo = group.photos[p];

  function pickGroup(i: number) {
    setG(i);
    setP(0);
  }
  function step(delta: number) {
    const n = group.photos.length;
    setP((cur) => (cur + delta + n) % n);
  }

  return (
    <div className="mx-auto max-w-[1328px]">
      <div className="mb-6 flex flex-wrap gap-3">
        {GROUPS.map((grp, i) => (
          <button
            key={grp.label}
            type="button"
            onClick={() => pickGroup(i)}
            aria-pressed={i === g}
            className={`rounded-full border px-5 py-2 text-sm font-medium transition-colors duration-300 ${
              i === g ? "border-white bg-white text-ink" : "border-white/30 text-white/70 hover:border-white hover:text-white"
            }`}
          >
            {grp.label}
          </button>
        ))}
      </div>

      <div className="relative aspect-[3/2] w-full overflow-hidden bg-[#0e1412] sm:aspect-[16/9]">
        <motion.img
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 sm:p-8">
          <span className="text-xs font-medium tracking-[0.12em] text-white/85 uppercase">{photo.caption}</span>
        </div>
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous photo"
          className="absolute top-1/2 left-3 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
        >
          &#8592;
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next photo"
          className="absolute top-1/2 right-3 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
        >
          &#8594;
        </button>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-3">
        {group.photos.map((ph, i) => (
          <button
            key={ph.src}
            type="button"
            onClick={() => setP(i)}
            aria-label={ph.caption}
            aria-current={i === p}
            className={`relative aspect-[3/2] overflow-hidden transition-opacity duration-300 ${i === p ? "opacity-100 ring-2 ring-white" : "opacity-50 hover:opacity-90"}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ph.src} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
