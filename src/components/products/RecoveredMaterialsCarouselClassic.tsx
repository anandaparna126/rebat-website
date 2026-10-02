"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { RECYCLED_MATERIALS, type RecycledMaterial } from "@/lib/products";

// The homepage's own Recovered Materials view — kept deliberately distinct
// from the /products page's information-first carousel (RecoveredMaterials
// Carousel.tsx). This is the site's original photo+video, auto-rotating,
// drag/wraparound carousel; the homepage teases the material story, the
// dedicated Products page is where a visitor goes to actually read specs.
const N = RECYCLED_MATERIALS.length;
// Padded on both ends with a duplicate of the opposite end so the strip can
// keep sliding past the "last"/"first" slide and land on a position that's
// visually identical to the real wrap-around point.
const EXTENDED = N > 1 ? [...RECYCLED_MATERIALS.slice(-1), ...RECYCLED_MATERIALS, ...RECYCLED_MATERIALS.slice(0, 1)] : RECYCLED_MATERIALS;
const POS_MIN = 0;
const POS_MAX = EXTENDED.length - 1;
const BASE_LOW = 1;
const BASE_HIGH = N;
const SLIDE_MS = 600;

export function RecoveredMaterialsCarouselClassic({
  onActiveChange,
}: {
  /** Fired whenever the centred material changes, so an ancestor (the
   * section's background wash) can stay in sync with it. */
  onActiveChange?: (material: RecycledMaterial) => void;
}) {
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

  function goTo(materialIndex: number) {
    if (N <= 1) return;
    setPos(1 + materialIndex);
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

  const activeMaterialIndex = ((pos - 1) % N + N) % N;
  const activeMaterial = RECYCLED_MATERIALS[activeMaterialIndex];

  useEffect(() => {
    onActiveChange?.(activeMaterial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMaterial.id]);

  return (
    <div className="mx-auto max-w-[1800px] px-[3vw]">
      <div className="relative">
        <div className="flex items-center gap-4">
        {N > 1 && (
          <button
            onClick={() => step(-1)}
            aria-label="Previous material"
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
            {EXTENDED.map((material, i) => (
              <div key={i} className="w-full shrink-0 px-1">
                <MaterialSlide material={material} isActive={i === pos} />
              </div>
            ))}
          </div>
        </div>

        {N > 1 && (
          <button
            onClick={() => step(1)}
            aria-label="Next material"
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-grey-200 bg-white text-ink transition-colors hover:border-grey-400 sm:flex"
          >
            &#8594;
          </button>
        )}
      </div>

      {N > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {RECYCLED_MATERIALS.map((material, i) => (
            <button
              key={material.id}
              onClick={() => goTo(i)}
              aria-label={`Go to ${material.name}`}
              aria-current={i === activeMaterialIndex}
              className={`h-1.5 rounded-full transition-all ${
                i === activeMaterialIndex ? "w-6 bg-brand" : "w-1.5 bg-grey-200"
              }`}
            />
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

function MaterialSlide({ material, isActive }: { material: RecycledMaterial; isActive: boolean }) {
  // true when this material's colour needs light/white text — i.e. its
  // background reads dark.
  const useLightText = material.textOn === "light";
  const videoRef = useRef<HTMLVideoElement>(null);

  // Only the currently-visible slide's video ever loads or plays — every
  // other slide's video stays fully unloaded (preload="none", no src)
  // rather than all 7 buffering/playing at once.
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
    <div className="overflow-hidden rounded-[28px]" style={{ background: material.color }}>
      <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-8">
        <div className="flex flex-col items-center gap-6 p-10 pb-16 md:p-16 md:pb-16">
          <div className="relative aspect-square w-full max-w-[600px] overflow-hidden rounded-2xl shadow-[0_40px_80px_-24px_rgba(0,0,0,0.35)]">
            {material.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={material.squareImage ?? material.image} alt={material.name} className="h-full w-full object-cover" />
            ) : (
              <div
                className={`flex h-full w-full flex-col items-center justify-center gap-2 border border-dashed text-center ${
                  useLightText ? "border-white/25 text-white/60" : "border-grey-900/15 text-grey-600"
                }`}
              >
                <span className="text-[11px] font-medium tracking-[0.15em] uppercase opacity-70">Pending</span>
                <span className="text-xs">Product photography</span>
              </div>
            )}
          </div>
          <div className={`flex w-full max-w-[600px] items-baseline gap-3 ${useLightText ? "text-white" : "text-ink"}`}>
            <span className={`text-sm font-medium ${useLightText ? "text-white/50" : "text-grey-400"}`}>{material.tag}</span>
            <h3 className="text-sm font-medium tracking-[0.1em] uppercase opacity-70">{material.name}</h3>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 px-10 pt-24 pb-16 md:px-16 md:pt-32 md:pb-16">
          {material.video ? (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video
              ref={videoRef}
              src={isActive ? material.video : undefined}
              poster={material.videoPoster}
              preload={isActive ? "auto" : "none"}
              muted
              loop
              playsInline
              className="aspect-video w-full max-w-[600px] rounded-2xl object-cover shadow-[0_40px_80px_-24px_rgba(0,0,0,0.35)]"
            />
          ) : (
            <div
              className={`flex aspect-video w-full max-w-[600px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed p-6 text-center ${
                useLightText ? "border-white/25 text-white/60" : "border-grey-900/15 text-grey-600"
              }`}
            >
              <span className="text-[11px] font-medium tracking-[0.15em] uppercase opacity-70">Pending</span>
              <span className="text-xs">Real-world impact footage</span>
            </div>
          )}
          {material.story && (
            <p className={`w-full max-w-[600px] text-center text-xl leading-snug font-normal tracking-[0.18em] uppercase sm:text-2xl ${useLightText ? "text-white" : "text-ink"}`}>
              {material.story}
            </p>
          )}
          <a
            href={`/products#${material.id}`}
            className={`group flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70 ${useLightText ? "text-white" : "text-ink"}`}
          >
            View in Products
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
