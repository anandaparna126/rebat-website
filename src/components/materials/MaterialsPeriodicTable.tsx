"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { motion } from "motion/react";
import { Grain } from "@/components/ui/Grain";
import { MATERIALS } from "@/lib/content";
import { FULL_GRID, GRID_COLUMNS, atomicNumberOf, categoryOf, CATEGORY_COLORS } from "@/lib/periodicTable";

const elementBySymbol = new Map(
  MATERIALS.filter((m) => m.element).map((m) => [m.element!.symbol, m])
);

const VISIBLE = 3;
// Padded on both ends with a duplicate of the opposite end (one full
// window's worth) so the strip can keep sliding past the "last" or "first"
// material and land on a position that's visually identical to the real
// wrap-around point — the snap back to that real point is imperceptible.
const PAD = VISIBLE;
const EXTENDED = [...MATERIALS.slice(-PAD), ...MATERIALS, ...MATERIALS.slice(0, PAD)];
const POS_MIN = 0;
const POS_MAX = EXTENDED.length - VISIBLE;
const BASE_LOW = PAD; // pos here shows the same slides as POS_MAX
const BASE_HIGH = PAD + MATERIALS.length - VISIBLE; // pos here shows the same slides as POS_MIN
const SLIDE_MS = 500;

// The periodic table doubles as both a real, complete reference (all 118
// elements, real atomic numbers) and the section's navigation: the 7
// elements we actually recover light up at their true coordinates, and
// whichever one is centered in the carousel below is highlighted here too
// — carousel and table are two synced views of the same selection. Black
// Mass and Steel Fraction aren't single elements, so they never get a fake
// table position; they're just two more slides in the carousel.
export function MaterialsPeriodicTable() {
  const startMaterial = Math.max(0, MATERIALS.findIndex((m) => m.id === "lithium-compounds"));
  const [pos, setPos] = useState(PAD + startMaterial - 1);
  const [jump, setJump] = useState(false);
  // The table opens full-width and centered — its own moment — then once
  // the section is actually scrolled into view it shifts left to make room
  // for the carousel, which fades in from the right. Triggered once, not
  // scrubbed frame-by-frame with scroll position (that heavier, pinned
  // mechanism is reserved for the Hero).
  const [settled, setSettled] = useState(false);
  // Defensive fallback: pos can transiently overshoot EXTENDED's bounds
  // between rapid steps (batched clicks skipping past the exact snap
  // trigger) before the correction effect below catches up.
  const active = EXTENDED[pos + 1] ?? MATERIALS[0];
  const [paused, setPaused] = useState(false);
  const pauseTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const dragStartX = useRef<number | null>(null);
  const draggedRef = useRef(false);

  function pauseBriefly() {
    setPaused(true);
    clearTimeout(pauseTimeout.current);
    pauseTimeout.current = setTimeout(() => setPaused(false), 5000);
  }

  // Centers the given material in the 3-wide window, landing inside the
  // padded range (never right on the snap boundary), so no wrap-around
  // correction is ever needed for a direct pick.
  function selectMaterial(materialIndex: number) {
    setPos(PAD + materialIndex - 1);
    pauseBriefly();
  }

  function selectBySymbol(symbol: string) {
    const idx = MATERIALS.findIndex((m) => m.element?.symbol === symbol);
    if (idx !== -1) selectMaterial(idx);
  }

  function step(delta: number) {
    setPos((p) => p + delta);
    pauseBriefly();
  }

  // Once the strip reaches or passes a padded edge, it's showing the same
  // (or an out-of-range) slide as some position on the opposite end — snap
  // there instantly (transition off for one frame) so stepping can continue
  // forever in either direction without a visible reset. Uses >=/<= plus
  // the actual overshoot rather than an exact-equality check, since two
  // rapid steps can batch into one render that skips right past the exact
  // boundary value.
  useEffect(() => {
    if (jump) return;
    if (pos >= POS_MAX) {
      const overshoot = pos - POS_MAX;
      const t = setTimeout(() => {
        setJump(true);
        setPos(BASE_LOW + overshoot);
      }, SLIDE_MS);
      return () => clearTimeout(t);
    }
    if (pos <= POS_MIN) {
      const overshoot = POS_MIN - pos;
      const t = setTimeout(() => {
        setJump(true);
        setPos(BASE_HIGH - overshoot);
      }, SLIDE_MS);
      return () => clearTimeout(t);
    }
  }, [pos, jump]);

  useEffect(() => {
    if (!jump) return;
    const id = requestAnimationFrame(() => setJump(false));
    return () => cancelAnimationFrame(id);
  }, [jump]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => step(1), 2600);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused]);

  function onPointerDown(e: ReactPointerEvent) {
    dragStartX.current = e.clientX;
    draggedRef.current = false;
    setPaused(true);
  }
  function onPointerMove(e: ReactPointerEvent) {
    if (dragStartX.current === null) return;
    if (Math.abs(e.clientX - dragStartX.current) > 6) draggedRef.current = true;
  }
  function onPointerUp(e: ReactPointerEvent) {
    if (dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    dragStartX.current = null;
    if (Math.abs(delta) > 40) step(delta < 0 ? 1 : -1);
    else pauseBriefly();
  }

  return (
    <motion.div
      onViewportEnter={() => setSettled(true)}
      viewport={{ once: true, amount: 0.4 }}
      className={
        settled
          ? "lg:grid lg:grid-cols-[460px_1fr] lg:items-start lg:gap-10"
          : "lg:flex lg:justify-center"
      }
    >
      <motion.div
        layout
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={settled ? "overflow-x-auto pb-3" : "overflow-x-auto pb-3 lg:w-[640px]"}
      >
        <div
          className="grid gap-[2px]"
          style={{ gridTemplateColumns: `repeat(${GRID_COLUMNS}, minmax(24px, 1fr))`, minWidth: 440 }}
        >
          {FULL_GRID.map((symbol, i) => {
            const row = Math.floor(i / GRID_COLUMNS);
            const col = i % GRID_COLUMNS;
            const delay = `${(row + col) * 12}ms`;

            if (!symbol) return <div key={i} />;

            // The "La–Lu" / "Ac–Lr" f-block placeholder cells — real table
            // convention, not an element of their own.
            if (symbol.includes("–")) {
              return (
                <div
                  key={i}
                  aria-hidden="true"
                  style={{ animationDelay: delay }}
                  className="flex aspect-square animate-[cellIn_0.5s_ease_backwards] items-center justify-center rounded-[2px] bg-grey-100 text-[6px] font-medium text-grey-400"
                >
                  {symbol}
                </div>
              );
            }

            const material = elementBySymbol.get(symbol);
            const number = atomicNumberOf(symbol);

            if (!material) {
              const category = categoryOf(symbol);
              const color = CATEGORY_COLORS[category];
              return (
                <div
                  key={i}
                  aria-hidden="true"
                  style={{ animationDelay: delay, background: color, ["--glow" as string]: color }}
                  className="relative flex aspect-square animate-[cellIn_0.5s_ease_backwards] flex-col items-center justify-center rounded-[2px] text-grey-900/70 opacity-70 transition-all duration-200 hover:z-10 hover:scale-125 hover:opacity-100 hover:shadow-[0_0_8px_var(--glow)]"
                >
                  <span className="absolute top-[1px] left-[2px] text-[5px] leading-none">{number}</span>
                  <span className="text-[8px] leading-none font-bold">{symbol}</span>
                </div>
              );
            }

            const isActive = material.id === active.id;
            return (
              <button
                key={i}
                onClick={() => selectBySymbol(symbol)}
                aria-pressed={isActive}
                aria-label={material.name}
                style={
                  isActive
                    ? { animationDelay: delay }
                    : {
                        animationName: "cellIn, pulseGlow",
                        animationDuration: `0.5s, 2.4s`,
                        animationDelay: `${delay}, 0s`,
                        animationIterationCount: "1, infinite",
                        animationTimingFunction: "ease, ease-in-out",
                        animationFillMode: "backwards, none",
                      }
                }
                className={`relative flex aspect-square flex-col items-center justify-center rounded-[3px] transition-all duration-200 ${
                  isActive
                    ? "z-10 scale-[1.35] animate-[cellIn_0.5s_ease_backwards] bg-brand text-white shadow-lg"
                    : "z-[1] scale-110 bg-brand-deep-2 text-white/90 hover:scale-125 hover:bg-brand"
                }`}
              >
                <span className="absolute top-[1px] left-[2px] text-[5px] leading-none opacity-70">{number}</span>
                <span className="text-[9px] leading-none font-bold">{symbol}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Carousel, dots, and text readout — only mounted once the table has
          settled into its left position, so it fades/slides in from the
          right rather than sitting there pre-formed. */}
      {settled && (
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
        className="mt-10 lg:mt-0"
      >
      {/* Three-wide, endlessly-looping window — real element badge (atomic
          number / symbol / weight) stamped over the material's swatch, name
          below. Unlike cylib's flat, equal-size grid, the two side cards
          visibly recede — shrunk, dimmed, softly blurred — so the center
          material reads as the one "in focus" rather than three equals.
          Drag/swipe and the arrow buttons step it the same way the
          auto-advance timer does, all sharing the same wrap-around logic. */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => step(-1)}
          aria-label="Previous material"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-grey-200 bg-white text-ink transition-colors hover:border-grey-400"
        >
          &#8592;
        </button>

        <div
          className="flex-1 cursor-grab overflow-hidden py-2 touch-pan-y select-none active:cursor-grabbing"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <div
            className="flex"
            style={{
              transform: `translateX(-${pos * (100 / VISIBLE)}%)`,
              transition: jump ? "none" : `transform ${SLIDE_MS}ms ease-out`,
            }}
          >
            {EXTENDED.map((material, i) => {
              const isActive = i === pos + 1;
              return (
                <div key={i} className="shrink-0 px-2" style={{ width: `${100 / VISIBLE}%` }}>
                  <button
                    onClick={() => {
                      if (draggedRef.current) return;
                      selectMaterial(((i - PAD) % MATERIALS.length + MATERIALS.length) % MATERIALS.length);
                    }}
                    className={`block w-full origin-center text-left transition-all duration-500 ease-out ${
                      isActive
                        ? "scale-100 opacity-100 blur-none"
                        : "scale-[0.8] translate-y-2 opacity-30 blur-[1.5px] hover:opacity-60 hover:blur-none"
                    }`}
                  >
                    <div className="relative aspect-square overflow-hidden rounded-2xl" style={{ background: material.swatch }}>
                      <Grain opacity={0.1} />
                      {material.element && (
                        <div className="absolute top-1/2 left-1/2 flex h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-md border border-white/50 bg-white/10 backdrop-blur-[1px]">
                          <span className="absolute top-1 left-1.5 text-[10px] leading-none text-white/80">
                            {material.element.atomicNumber}
                          </span>
                          <span className="text-2xl leading-none font-bold text-white">{material.element.symbol}</span>
                          <span className="mt-1 text-[9px] leading-none text-white/80">{material.element.atomicWeight}</span>
                        </div>
                      )}
                    </div>
                    <div
                      className={`mt-3 text-center text-sm font-bold transition-colors ${
                        isActive ? "text-brand" : "text-ink"
                      }`}
                    >
                      {material.name}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => step(1)}
          aria-label="Next material"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-grey-200 bg-white text-ink transition-colors hover:border-grey-400"
        >
          &#8594;
        </button>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {MATERIALS.map((material, i) => (
          <button
            key={material.id}
            onClick={() => selectMaterial(i)}
            aria-label={`Go to ${material.name}`}
            aria-current={material.id === active.id}
            className={`h-1.5 rounded-full transition-all ${
              material.id === active.id ? "w-6 bg-brand" : "w-1.5 bg-grey-200"
            }`}
          />
        ))}
      </div>

      {/* The information the strip deliberately leaves out, read out here
          instead — still real brochure content, just not inside the
          "element only" carousel itself. */}
      <div key={active.id} className="mt-6 max-w-[640px] animate-[fadeIn_0.3s_ease]">
        <div className="mb-1 flex items-center gap-2 text-[11px] font-medium tracking-[0.06em] text-grey-400 uppercase">
          {active.element ? (
            <span>Recovered element &middot; {active.element.symbol} &middot; {active.element.atomicNumber}</span>
          ) : (
            <span>Recovered mixture</span>
          )}
        </div>
        <h3 className="mb-2 text-lg font-bold text-ink">{active.name}</h3>
        <p className="mb-2 text-sm text-grey-600">{active.description}</p>
        <div className="text-[11px] font-medium tracking-[0.06em] text-grey-400 uppercase">
          Key application: {active.application}
        </div>
      </div>
      </motion.div>
      )}
    </motion.div>
  );
}
