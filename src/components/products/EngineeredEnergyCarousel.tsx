"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { motion } from "motion/react";
import { EnquiryButton } from "@/components/ui/EnquiryButton";
import { EnquiryModal } from "@/components/ui/EnquiryModal";
import { BATTERY_PACKS, PACK_CATEGORIES, TESTING, categoryOf, packsIn, uncategorizedPacks } from "@/lib/battery-packs";

const N = BATTERY_PACKS.length;
const AUTO_MS = 4500;
const PAUSE_MS = 7000;

// The battery pack range as an information-first carousel: auto-advances,
// pauses on hover, drag, keyboard or while the enquiry modal is open. There
// is no product photography for individual packs, so the left panel is the
// pack's own headline numbers (voltage, capacity, energy) rather than a
// stand-in image. Prev / current / next navigation, no numbering.
export function EngineeredEnergyCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const pauseTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const dragStartX = useRef<number | null>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const pack = BATTERY_PACKS[index];
  const category = categoryOf(pack);

  function pauseBriefly() {
    setPaused(true);
    clearTimeout(pauseTimeout.current);
    pauseTimeout.current = setTimeout(() => setPaused(false), PAUSE_MS);
  }

  function goTo(i: number) {
    setIndex(i);
    pauseBriefly();
    window.history.replaceState(null, "", `#${BATTERY_PACKS[i].id}`);
  }

  useEffect(() => {
    const i = BATTERY_PACKS.findIndex((p) => p.id === window.location.hash.slice(1));
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

  function go(delta: number) {
    setIndex((i) => (i + delta + N) % N);
    pauseBriefly();
  }

  // Also gated on `enquiryOpen`: the modal is a portal outside this tile, so
  // hover-based pausing does not cover it and the pack would otherwise swap
  // under someone mid-form.
  useEffect(() => {
    if (paused || enquiryOpen) return;
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

  const specs = [
    { label: "Voltage", value: pack.voltage },
    { label: "Capacity", value: pack.capacity },
    { label: "Energy", value: pack.energy },
    ...(pack.comms ? [{ label: "Comms", value: pack.comms }] : []),
    ...(pack.specs ?? []),
  ];

  return (
    <div ref={sectionRef} className="mx-auto max-w-[1328px] px-[5vw]">
      <div
        className="grid grid-cols-1 gap-10 lg:grid-cols-[58%_1fr] lg:gap-16"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className={`relative aspect-[4/5] w-full overflow-hidden rounded-2xl select-none ${pack.image ? "bg-white" : "bg-white/[0.04]"}`}>
          {pack.image ? (
            <motion.div
              key={pack.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pack.image} alt={`ReBAT ${pack.name} battery pack`} draggable={false} className="absolute inset-0 h-full w-full object-contain p-4" />
              {category && <span className="absolute top-6 left-8 text-xs font-medium tracking-[0.16em] text-grey-600 uppercase">{category.title}</span>}
            </motion.div>
          ) : (
          <motion.div
            key={pack.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0 flex flex-col justify-between p-8 sm:p-10"
          >
            {category && <span className="text-xs font-medium tracking-[0.16em] text-white/50 uppercase">{category.title}</span>}
            <div>
              <div className="text-7xl leading-none font-bold text-white sm:text-8xl lg:text-9xl">{pack.voltage}</div>
              <div className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-1 text-2xl font-medium text-white/70 sm:text-3xl">
                <span>{pack.capacity}</span>
                <span className="text-white/30" aria-hidden="true">
                  /
                </span>
                <span>{pack.energy}</span>
                {pack.comms && (
                  <span className="rounded-full border border-white/25 px-3 py-1 text-xs font-medium tracking-[0.14em] text-white/70 uppercase">
                    {pack.comms}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <motion.div
            key={pack.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <h3 className="text-3xl leading-[1.1] font-medium text-white sm:text-4xl">{pack.productName}</h3>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/70">{pack.description}</p>

            <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-white/10 pt-6 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {specs.map((s) => (
                <div key={s.label}>
                  <dt className="text-[11px] font-medium tracking-[0.1em] text-white/40 uppercase">{s.label}</dt>
                  <dd className="mt-1 text-lg font-semibold text-white">{s.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 border-t border-white/10 pt-6">
              {category && <p className="text-sm text-white/60">{category.message}</p>}
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

      {/* Every pack at once, grouped by application; the one showing above
          is lit with a thin progress bar toward the next. */}
      <div ref={railRef} className="relative mt-14 flex gap-x-6 overflow-x-auto border-t border-white/10 p-1 pt-8 lg:justify-center">
        {PACK_CATEGORIES.map((cat) => {
          const list = packsIn(cat.id);
          if (list.length === 0) return null;
          return (
            <div key={cat.id} className="shrink-0">
              <div className="mb-3 h-7 max-w-[210px] text-[10px] leading-tight font-medium tracking-[0.12em] text-white/45 uppercase">{cat.title}</div>
              <div className="flex gap-2">
                {list.map((p) => {
                  const i = BATTERY_PACKS.indexOf(p);
                  const active = i === index;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => goTo(i)}
                      aria-label={p.name}
                      aria-current={active}
                      className={`relative w-[104px] overflow-hidden rounded-xl border px-3 py-3 text-left transition-colors duration-300 ${
                        active ? "border-white bg-white/10" : "border-white/15 hover:border-white/50"
                      }`}
                    >
                      <span className={`block text-xl leading-none font-semibold transition-colors ${active ? "text-white" : "text-white/60"}`}>{p.voltage}</span>
                      <span className="mt-1.5 block text-xs text-white/55">
                        {p.capacity}
                        {p.comms ? ` ${p.comms}` : ""}
                      </span>
                      {active && !paused && !enquiryOpen && (
                        <span
                          key={index}
                          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-white"
                          style={{ animation: `tileProgress ${AUTO_MS}ms linear forwards` }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
        {uncategorizedPacks().length > 0 && (
          <div className="shrink-0">
            <div className="mb-3 h-7 max-w-[210px] text-[10px] leading-tight font-medium tracking-[0.12em] text-white/45 uppercase">Also available</div>
            <div className="flex gap-2">
              {uncategorizedPacks().map((p) => {
                const i = BATTERY_PACKS.indexOf(p);
                const active = i === index;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={p.name}
                    aria-current={active}
                    className={`relative w-[104px] overflow-hidden rounded-xl border px-3 py-3 text-left transition-colors duration-300 ${
                      active ? "border-white bg-white/10" : "border-white/15 hover:border-white/50"
                    }`}
                  >
                    <span className={`block text-xl leading-none font-semibold transition-colors ${active ? "text-white" : "text-white/60"}`}>{p.voltage}</span>
                    <span className="mt-1.5 block text-xs text-white/55">{p.capacity}</span>
                    {active && !paused && !enquiryOpen && (
                      <span
                        key={index}
                        className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-white"
                        style={{ animation: `tileProgress ${AUTO_MS}ms linear forwards` }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <ul className="mt-10 flex flex-wrap justify-center gap-x-3 gap-y-2 text-[11px] tracking-[0.08em] text-white/50 uppercase">
        {TESTING.strip.map((item, i) => (
          <li key={item} className="flex items-center gap-3">
            {item}
            {i < TESTING.strip.length - 1 && (
              <span className="text-white/20" aria-hidden="true">
                |
              </span>
            )}
          </li>
        ))}
      </ul>

      <EnquiryModal
        open={enquiryOpen}
        onClose={() => {
          setEnquiryOpen(false);
          pauseBriefly();
        }}
        panelColor="linear-gradient(150deg, #376F63, #2A5951)"
        tone="light"
        eyebrow="Battery pack range"
        heading="Let's talk about"
        headingAccent={pack.name}
        description={`Tell us about your ${pack.name} requirement and our battery team will get back to you.`}
        topic={category ? `${pack.name} (${category.title})` : pack.name}
        messageTemplate={`Hi, I'm interested in the ${pack.name} battery pack. Could you share more on availability, specifications and pricing?`}
      />
    </div>
  );
}
