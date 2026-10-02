"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { motion } from "motion/react";
import { EnquiryButton } from "@/components/ui/EnquiryButton";
import { EnquiryModal } from "@/components/ui/EnquiryModal";
import { APPLICATION_LABEL, RECYCLED_MATERIALS, type RecycledMaterial } from "@/lib/products";

const N = RECYCLED_MATERIALS.length;
const AUTO_MS = 4500;
const PAUSE_MS = 6000;

// A product carousel that auto-advances on a timer, pausing on hover/drag/
// manual navigation — click, keyboard arrows and swipe all work too.
//
// The crossfade is a plain key-triggered entrance animation (`initial` →
// `animate` on a fresh element per material, no `AnimatePresence`) rather
// than an exit+enter choreography — `AnimatePresence mode="wait"` here
// reliably got stuck after the first navigation (its exit phase never
// resolved, so the new slide never mounted). A plain fade-in on mount
// doesn't have an exit phase to get stuck on, and reads just as smooth.
export function RecoveredMaterialsCarousel({
  onActiveChange,
}: {
  /** Fired whenever the active material changes, so an ancestor (the
   * section's background wash) can stay in sync with it. */
  onActiveChange?: (material: RecycledMaterial) => void;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const pauseTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const dragStartX = useRef<number | null>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const material = RECYCLED_MATERIALS[index];

  useEffect(() => {
    onActiveChange?.(material);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [material.id]);

  useEffect(() => {
    const i = RECYCLED_MATERIALS.findIndex((m) => m.id === window.location.hash.slice(1));
    if (i >= 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIndex(i);
      pauseBriefly();
      // A visitor arriving via a deep link (e.g. from the homepage's "View
      // in Products") should land on this section, not the top of the page.
      requestAnimationFrame(() => sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    const el = rail?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!rail || !el || rail.scrollWidth <= rail.clientWidth) return;
    rail.scrollTo({ left: el.offsetLeft - rail.clientWidth / 2 + el.clientWidth / 2, behavior: "smooth" });
  }, [index]);

  function select(i: number) {
    goTo(i);
    window.history.replaceState(null, "", `#${RECYCLED_MATERIALS[i].id}`);
  }

  function pauseBriefly() {
    setPaused(true);
    clearTimeout(pauseTimeout.current);
    pauseTimeout.current = setTimeout(() => setPaused(false), PAUSE_MS);
  }

  function go(delta: number) {
    setIndex((i) => (i + delta + N) % N);
    pauseBriefly();
  }

  function goTo(i: number) {
    setIndex(i);
    pauseBriefly();
  }

  // Auto-advance — paused on hover, drag, or for a few seconds after any
  // manual navigation, so it never fights a visitor who's mid-interaction.
  // Also gated on `enquiryOpen` directly (not just `paused`): the modal is
  // a portal outside the tile, so once it opens the cursor is no longer
  // over the tile and its onMouseLeave would otherwise flip `paused` back
  // to false, silently swapping the material — and the modal's own colour
  // and heading with it — while someone is mid-form.
  useEffect(() => {
    if (paused || enquiryOpen) return;
    const id = setInterval(() => go(1), AUTO_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, enquiryOpen]);

  // Keyboard left/right — this is the section's main experience, so a
  // plain window listener (no focus-trapping needed) is enough.
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

  const applicationLabel = material.application ? APPLICATION_LABEL[material.application] : undefined;
  const useLightText = material.textOn === "light";
  const dividerClass = useLightText ? "border-white/15" : "border-black/10";
  const labelClass = useLightText ? "text-white/50" : "text-black/45";
  const bodyClass = useLightText ? "text-white/80" : "text-black/70";
  // The card's own background is a translucent panel in the opposite tone
  // from the material's base colour — a light card on a dark material tile,
  // a dark card on a light one — so it always reads as a distinct surface
  // rather than disappearing into (or fighting) the tile behind it.
  const cardClass = useLightText ? "bg-white/10 backdrop-blur-sm" : "bg-black/[0.06] backdrop-blur-sm";

  return (
    <div ref={sectionRef} className="mx-auto max-w-[1328px] px-[5vw]">
      {/* The whole slide sits on the material's own real colour (its
          gradient from lib/products.ts) — a large rounded tile, not a
          plain white background, so the product's own tone carries
          through the details the way it did in the site's earlier
          material carousel. */}
      <div
        className="overflow-hidden rounded-[28px] p-6 transition-colors duration-500 sm:p-10 lg:p-12"
        style={{ background: material.color }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[58%_1fr] lg:gap-16 lg:items-center">
          {/* Image — the product stays the dominant visual element; a plain
              crossfade on change, no slide/scale drama. */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-[0_40px_80px_-24px_rgba(0,0,0,0.35)] select-none lg:aspect-[5/4]">
            {material.image ? (
              <motion.img
                key={material.id}
                src={material.image}
                alt={material.name}
                draggable={false}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <motion.div
                key={material.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`absolute inset-0 flex flex-col items-center justify-center gap-2 border border-dashed text-center ${
                  useLightText ? "border-white/25 text-white/60" : "border-grey-900/15 text-grey-600"
                }`}
              >
                <span className="text-[11px] font-medium tracking-[0.15em] uppercase opacity-70">Pending</span>
                <span className="text-xs">Product photography</span>
              </motion.div>
            )}
          </div>

          {/* Information — a self-contained card in a complementary tone,
              its content centered, sitting on the material-coloured tile. */}
          <motion.div
            key={material.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`rounded-2xl p-8 text-center sm:p-10 ${cardClass}`}
          >
            <h3 className={`text-3xl font-medium sm:text-4xl ${useLightText ? "text-white" : "text-ink"}`}>
              {material.name}
            </h3>
            <p className={`mt-1 text-sm ${labelClass}`}>Recovered {material.name}</p>

            {material.description && (
              <p className={`mx-auto mt-6 max-w-md text-base ${bodyClass}`}>{material.description}</p>
            )}

            {/* At a glance — only fields with real data; a thin, spare
                row strip, not a spec table. */}
            <div className={`mt-8 flex flex-wrap justify-center gap-x-10 gap-y-3 border-t pt-6 ${dividerClass}`}>
              {material.tag !== "—" && (
                <div>
                  <div className={`text-[11px] font-medium tracking-[0.1em] uppercase ${labelClass}`}>Symbol</div>
                  <div className={`mt-1 text-sm font-medium ${useLightText ? "text-white" : "text-ink"}`}>{material.tag}</div>
                </div>
              )}
              {material.purity && (
                <div>
                  <div className={`text-[11px] font-medium tracking-[0.1em] uppercase ${labelClass}`}>Purity</div>
                  <div className={`mt-1 text-sm font-medium ${useLightText ? "text-white" : "text-ink"}`}>{material.purity}</div>
                </div>
              )}
              {applicationLabel && (
                <div>
                  <div className={`text-[11px] font-medium tracking-[0.1em] uppercase ${labelClass}`}>Application</div>
                  <div className={`mt-1 text-sm font-medium ${useLightText ? "text-white" : "text-ink"}`}>{applicationLabel}</div>
                </div>
              )}
            </div>

            <div className={`mt-10 border-t pt-6 ${dividerClass}`}>
              <p className={`text-sm ${labelClass}`}>Looking for this material?</p>
              <EnquiryButton
                label="Talk to our materials team"
                onClick={() => {
                  setPaused(true);
                  setEnquiryOpen(true);
                }}
                className="mx-auto mt-4 w-fit"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Every material at once: the tile for the one showing above is
          lit in its own colour with a thin progress bar toward the next. */}
      <div ref={railRef} className="relative mt-10 flex gap-3 overflow-x-auto border-t border-grey-200 p-1 pt-8 lg:gap-4">
        {RECYCLED_MATERIALS.map((m, i) => {
          const active = i === index;
          const src = m.squareImage ?? m.image;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => select(i)}
              aria-label={m.name}
              aria-current={active}
              className="group w-[104px] shrink-0 text-left lg:w-auto lg:flex-1"
            >
              <span
                className="relative block aspect-square overflow-hidden rounded-xl transition-shadow duration-500"
                style={{ background: m.color, boxShadow: active ? `0 0 0 3px ${m.glow}` : "none" }}
              >
                {src && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    draggable={false}
                    className={`absolute inset-0 h-full w-full object-cover transition duration-500 ${
                      active ? "scale-105" : "opacity-60 grayscale group-hover:opacity-100 group-hover:grayscale-0"
                    }`}
                  />
                )}
                {active && !paused && !enquiryOpen && (
                  <span
                    key={index}
                    className="absolute inset-x-0 bottom-0 h-1 origin-left"
                    style={{ background: m.glow, animation: `tileProgress ${AUTO_MS}ms linear forwards` }}
                  />
                )}
              </span>
              <span
                className={`mt-2 block text-[11px] leading-tight font-medium tracking-[0.06em] uppercase transition-colors duration-300 ${active ? "" : "text-grey-500"}`}
                style={active ? { color: m.glow } : undefined}
              >
                {m.name}
              </span>
            </button>
          );
        })}
      </div>

      <EnquiryModal
        open={enquiryOpen}
        onClose={() => {
          setEnquiryOpen(false);
          pauseBriefly();
        }}
        panelColor={material.color}
        tone={material.textOn}
        eyebrow="Recovered Materials"
        heading="Let's talk about"
        headingAccent={material.name}
        description={`Tell us a little about your ${material.name.toLowerCase()} sourcing needs and our materials team will get back to you.`}
        topic={material.name}
        messageTemplate={`Hi, I'd like to know more about sourcing ${material.name.toLowerCase()} from ReBAT. Could you share availability, specifications and pricing?`}
      />
    </div>
  );
}
