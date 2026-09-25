"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { BATTERY_PRODUCT_LINES, type BatteryProductLine } from "@/lib/products";

// The homepage's own Engineered Energy view — kept deliberately distinct
// from the /products page's information-first carousel (EngineeredEnergy
// Carousel.tsx). Same original auto-rotating, drag/wraparound mechanism as
// the site's Recovered Materials classic carousel.
const N = BATTERY_PRODUCT_LINES.length;
const EXTENDED = N > 1 ? [...BATTERY_PRODUCT_LINES.slice(-1), ...BATTERY_PRODUCT_LINES, ...BATTERY_PRODUCT_LINES.slice(0, 1)] : BATTERY_PRODUCT_LINES;
const POS_MIN = 0;
const POS_MAX = EXTENDED.length - 1;
const BASE_LOW = 1;
const BASE_HIGH = N;
const SLIDE_MS = 600;

export function EngineeredEnergyCarouselClassic() {
  const [pos, setPos] = useState(N > 1 ? 1 : 0);
  const [jump, setJump] = useState(false);
  const [paused, setPaused] = useState(false);
  const pauseTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const dragStartX = useRef<number | null>(null);
  const draggedRef = useRef(false);

  function pauseBriefly() {
    if (N <= 1) return;
    setPaused(true);
    clearTimeout(pauseTimeout.current);
    pauseTimeout.current = setTimeout(() => setPaused(false), 6000);
  }

  function step(delta: number) {
    if (N <= 1) return;
    setPos((p) => p + delta);
    pauseBriefly();
  }

  function goTo(lineIndex: number) {
    if (N <= 1) return;
    setPos(1 + lineIndex);
    pauseBriefly();
  }

  useEffect(() => {
    if (N <= 1 || jump) return;
    if (pos >= POS_MAX || pos <= POS_MIN) {
      const target = pos >= POS_MAX ? BASE_LOW : BASE_HIGH;
      const t = setTimeout(() => {
        setJump(true);
        setPos(target);
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
    if (N <= 1 || paused) return;
    const id = setInterval(() => step(1), 5500);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused]);

  function onPointerDown(e: ReactPointerEvent) {
    if (N <= 1) return;
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
    if (Math.abs(delta) > 50) step(delta < 0 ? 1 : -1);
    else pauseBriefly();
  }

  const activeIndex = ((pos - 1) % N + N) % N;

  return (
    <div className="mx-auto max-w-[1800px] px-[3vw]">
      <div className="flex items-center gap-4">
        {N > 1 && (
          <button
            onClick={() => step(-1)}
            aria-label="Previous"
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-grey-200 bg-white text-ink transition-colors hover:border-grey-400 sm:flex"
          >
            &#8592;
          </button>
        )}

        <div
          className="flex-1 overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <div
            className={`flex ${N > 1 ? "cursor-grab select-none active:cursor-grabbing" : ""}`}
            style={{
              transform: `translateX(-${pos * 100}%)`,
              transition: jump ? "none" : `transform ${SLIDE_MS}ms cubic-bezier(0.22,1,0.36,1)`,
            }}
          >
            {EXTENDED.map((line, i) => (
              <div key={i} className="w-full shrink-0 px-1">
                <LineSlide line={line} isActive={i === pos} />
              </div>
            ))}
          </div>
        </div>

        {N > 1 && (
          <button
            onClick={() => step(1)}
            aria-label="Next"
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-grey-200 bg-white text-ink transition-colors hover:border-grey-400 sm:flex"
          >
            &#8594;
          </button>
        )}
      </div>

      {N > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {BATTERY_PRODUCT_LINES.map((line, i) => (
            <button
              key={line.id}
              onClick={() => goTo(i)}
              aria-label={`Go to ${line.name}`}
              aria-current={i === activeIndex}
              className={`h-1.5 rounded-full transition-all ${
                i === activeIndex ? "w-6 bg-brand" : "w-1.5 bg-grey-200"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function LineSlide({ line, isActive }: { line: BatteryProductLine; isActive: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    function tryPlay() {
      if (!el || document.visibilityState !== "visible") return;
      el.muted = true;
      el.play().catch(() => {});
    }

    if (isActive) {
      tryPlay();
      document.addEventListener("visibilitychange", tryPlay);
      return () => document.removeEventListener("visibilitychange", tryPlay);
    } else {
      el.pause();
    }
  }, [isActive]);

  return (
    <div
      className="overflow-hidden rounded-[28px]"
      style={{ background: "linear-gradient(155deg, var(--surface-emerald), var(--surface-emerald-deep))" }}
    >
      <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-8">
        <div className="flex items-center justify-center p-10 md:p-16">
          {line.video ? (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video
              ref={videoRef}
              src={isActive ? line.video : undefined}
              preload={isActive ? "auto" : "none"}
              muted
              loop
              playsInline
              className="aspect-video w-full max-w-[640px] rounded-2xl object-cover shadow-[0_40px_80px_-24px_rgba(0,0,0,0.25)]"
            />
          ) : line.image ? (
            <div className="relative aspect-video w-full max-w-[640px] overflow-hidden rounded-2xl shadow-[0_40px_80px_-24px_rgba(0,0,0,0.25)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img loading="lazy" decoding="async" src={line.image} alt={line.name} className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="flex aspect-video w-full max-w-[640px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-brand-deep/20 p-6 text-center text-brand-deep/60">
              <span className="text-[11px] font-medium tracking-[0.15em] uppercase opacity-70">Pending</span>
              <span className="text-xs">Product footage</span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-start gap-4 p-10 pb-16 text-left md:p-16 md:pb-16">
          <h3 className="text-3xl font-medium text-brand-deep sm:text-4xl">{line.name}</h3>
          {line.description ? (
            <p className="max-w-md text-base text-brand-deep/80">{line.description}</p>
          ) : (
            <span className="text-[11px] font-medium tracking-[0.15em] text-brand-deep/50 uppercase">Pending</span>
          )}
        </div>
      </div>
    </div>
  );
}
