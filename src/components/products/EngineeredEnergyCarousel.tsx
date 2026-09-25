"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { motion } from "motion/react";
import { EnquiryButton } from "@/components/ui/EnquiryButton";
import { EnquiryModal } from "@/components/ui/EnquiryModal";
import { BATTERY_PRODUCT_LINES } from "@/lib/products";

const N = BATTERY_PRODUCT_LINES.length;
const APPLICATIONS = ["Mobility", "Energy Storage", "Industrial"];
const AUTO_MS = 5500;
const PAUSE_MS = 6000;

// Same manual-plus-auto-advance carousel mechanism as the Recovered
// Materials one, adapted for a physical engineered product on a dark
// section instead of a material on a light one.
export function EngineeredEnergyCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const pauseTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const dragStartX = useRef<number | null>(null);
  const line = BATTERY_PRODUCT_LINES[index];

  function pauseBriefly() {
    if (N <= 1) return;
    setPaused(true);
    clearTimeout(pauseTimeout.current);
    pauseTimeout.current = setTimeout(() => setPaused(false), PAUSE_MS);
  }

  function go(delta: number) {
    if (N <= 1) return;
    setIndex((i) => (i + delta + N) % N);
    pauseBriefly();
  }

  function goTo(i: number) {
    setIndex(i);
    pauseBriefly();
  }

  // Auto-advance — paused on hover, drag, or for a few seconds after any
  // manual navigation. Also gated on `enquiryOpen` directly: the modal is a
  // portal outside this tile, so once it opens the cursor is no longer over
  // the tile and onMouseLeave would otherwise flip `paused` back to false,
  // silently swapping the line (and the modal's own heading/topic with it)
  // while someone is mid-form — see the same fix in RecoveredMaterialsCarousel.
  useEffect(() => {
    if (paused || enquiryOpen || N <= 1) return;
    const id = setInterval(() => go(1), AUTO_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, enquiryOpen]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onPointerDown(e: ReactPointerEvent) {
    dragStartX.current = e.clientX;
    setPaused(true);
  }
  function onPointerUp(e: ReactPointerEvent) {
    if (dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    dragStartX.current = null;
    if (Math.abs(delta) > 50) go(delta < 0 ? 1 : -1);
    else pauseBriefly();
  }

  return (
    <div className="mx-auto max-w-[1328px] px-[5vw]">
      <div
        className="grid grid-cols-1 gap-10 lg:grid-cols-[58%_1fr] lg:gap-16"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white/[0.04] select-none lg:aspect-[5/4]">
          {line.image ? (
            <motion.img
              key={line.id}
              src={line.image}
              alt={line.name}
              draggable={false}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 h-full w-full object-contain p-10"
            />
          ) : (
            <motion.div
              key={line.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center text-white/40"
            >
              <span className="text-[11px] font-medium tracking-[0.15em] uppercase opacity-70">Pending</span>
              <span className="text-xs">Product photography</span>
            </motion.div>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <motion.div
            key={line.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <h3 className="text-4xl font-medium text-white sm:text-5xl">{line.name}</h3>

            {line.description ? (
              <p className="mt-6 max-w-md text-base text-white/70">{line.description}</p>
            ) : (
              <span className="mt-6 block text-[11px] font-medium tracking-[0.15em] text-white/40 uppercase">
                Pending
              </span>
            )}

            <div className="mt-8 border-t border-white/10 pt-6">
              <div className="text-[11px] font-medium tracking-[0.1em] text-white/40 uppercase">Applications</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {APPLICATIONS.map((app) => (
                  <span key={app} className="rounded-full border border-white/15 px-4 py-1.5 text-xs text-white/70">
                    {app}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-10 border-t border-white/10 pt-6">
              <p className="text-sm text-white/60">Looking for a battery solution?</p>
              <EnquiryButton
                label="Talk to our battery team"
                onClick={() => {
                  setPaused(true);
                  setEnquiryOpen(true);
                }}
                className="mt-4 w-fit"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation — every line shown centered, no numbering; the active
          one reads full and bright, the rest sit faded beside it. */}
      {N > 1 && (
        <div className="mt-14 flex flex-wrap items-center justify-center gap-8 border-t border-white/10 pt-6">
          {BATTERY_PRODUCT_LINES.map((l, i) => (
            <button
              key={l.id}
              onClick={() => goTo(i)}
              aria-current={i === index}
              className={`shrink-0 text-sm font-medium tracking-[0.04em] uppercase transition-all duration-300 ${
                i === index ? "text-xl text-white opacity-100 sm:text-2xl" : "text-white/70 opacity-35 hover:opacity-60"
              }`}
            >
              {l.name}
            </button>
          ))}
        </div>
      )}

      <EnquiryModal
        open={enquiryOpen}
        onClose={() => {
          setEnquiryOpen(false);
          pauseBriefly();
        }}
        // The deep teal-green from the homepage's own Impact panel (item
        // 04) — reused here rather than a fresh brand-green shade, so the
        // battery pathway's modal (also used by Power With Us) reads as
        // one of the site's own established colours, not a one-off.
        panelColor="linear-gradient(150deg, #376F63, #2A5951)"
        tone="light"
        eyebrow="Engineered Energy"
        heading="Let's talk about"
        headingAccent={line.name}
        description={`Tell us about your ${line.name.toLowerCase()} requirements and our battery team will get back to you.`}
        topic={line.name}
      />
    </div>
  );
}
