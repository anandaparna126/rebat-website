"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { BATTERY_PACKS, categoryOf, type BatteryPack } from "@/lib/battery-packs";

// The homepage's own Engineered Energy view: deliberately distinct from the
// /products page's information-first carousel (EngineeredEnergyCarousel.tsx),
// but showing the same battery pack range. Same original auto-rotating,
// drag / wraparound sliding mechanism as the site's Recovered Materials
// classic carousel; light emerald tiles, arrows and dots.
const N = BATTERY_PACKS.length;
const EXTENDED = N > 1 ? [...BATTERY_PACKS.slice(-1), ...BATTERY_PACKS, ...BATTERY_PACKS.slice(0, 1)] : BATTERY_PACKS;
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

  function goTo(packIndex: number) {
    if (N <= 1) return;
    setPos(1 + packIndex);
    pauseBriefly();
  }

  // Wraparound: after sliding onto a padded clone, snap (with no
  // transition) to the matching real slide.
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
    setPaused(true);
  }
  function onPointerUp(e: ReactPointerEvent) {
    if (dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    dragStartX.current = null;
    if (Math.abs(delta) > 50) step(delta < 0 ? 1 : -1);
    else pauseBriefly();
  }

  const activeIndex = (((pos - 1) % N) + N) % N;

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
          onPointerUp={onPointerUp}
        >
          <div
            className={`flex ${N > 1 ? "cursor-grab select-none active:cursor-grabbing" : ""}`}
            style={{
              transform: `translateX(-${pos * 100}%)`,
              transition: jump ? "none" : `transform ${SLIDE_MS}ms cubic-bezier(0.22,1,0.36,1)`,
            }}
          >
            {EXTENDED.map((pack, i) => (
              <div key={i} className="w-full shrink-0 px-1">
                <PackSlide pack={pack} />
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
          {BATTERY_PACKS.map((pack, i) => (
            <button
              key={pack.id}
              onClick={() => goTo(i)}
              aria-label={`Go to ${pack.name}`}
              aria-current={i === activeIndex}
              className={`h-1.5 rounded-full transition-all ${i === activeIndex ? "w-6 bg-brand" : "w-1.5 bg-grey-200"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PackSlide({ pack }: { pack: BatteryPack }) {
  const category = categoryOf(pack);
  const specs = [
    { label: "Voltage", value: pack.voltage },
    { label: "Capacity", value: pack.capacity },
    { label: "Energy", value: pack.energy },
    ...(pack.comms ? [{ label: "Comms", value: pack.comms }] : []),
    ...(pack.specs ?? []),
  ];

  return (
    <div
      className="overflow-hidden rounded-[28px]"
      style={{ background: "linear-gradient(155deg, var(--surface-emerald), var(--surface-emerald-deep))" }}
    >
      <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-8">
        <div className="flex items-center justify-center p-10 pb-0 md:p-16">
          {pack.image ? (
            <div className="relative aspect-[4/5] w-full max-w-[420px] overflow-hidden rounded-2xl bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pack.image} alt={`ReBAT ${pack.name} battery pack`} draggable={false} className="absolute inset-0 h-full w-full object-contain p-4" />
            </div>
          ) : (
            <div className="flex aspect-video w-full max-w-[640px] flex-col items-center justify-center rounded-2xl border border-brand-deep/15 bg-white/40 p-6 text-center">
              <div className="text-6xl leading-none font-bold text-brand-deep sm:text-7xl lg:text-8xl">{pack.voltage}</div>
              <div className="mt-4 text-xl font-medium text-brand-deep/70 sm:text-2xl">
                {pack.capacity} <span className="text-brand-deep/30">/</span> {pack.energy}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-start gap-4 p-10 pt-0 text-left md:p-16 md:pl-4">
          {category && <span className="text-[11px] font-medium tracking-[0.15em] text-brand-deep/55 uppercase">{category.title}</span>}
          <h3 className="text-3xl font-medium text-brand-deep sm:text-4xl">{pack.productName}</h3>
          <p className="max-w-md text-base text-brand-deep/80">{pack.description}</p>
          <dl className="mt-2 flex flex-wrap gap-x-8 gap-y-3 border-t border-brand-deep/15 pt-4">
            {specs.map((s) => (
              <div key={s.label}>
                <dt className="text-[11px] font-medium tracking-[0.1em] text-brand-deep/50 uppercase">{s.label}</dt>
                <dd className="mt-0.5 text-base font-semibold text-brand-deep">{s.value}</dd>
              </div>
            ))}
          </dl>
          <a href={`/products#${pack.id}`} className="group flex items-center gap-1.5 text-sm font-medium text-brand-deep transition-opacity hover:opacity-70">
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
