"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import type { RecycledMaterial } from "@/lib/products";
import { APPLICATION_LABEL, TRANSFORMATION_STAGES } from "@/lib/products";
import { useTrackProgress } from "@/lib/useTrackProgress";

const STAGE_COUNT = TRANSFORMATION_STAGES.length;

// Fixed, precomputed particle geometry (angle/distance/size only) — not
// randomised per render, and not one hook-call-per-particle: every particle
// is driven purely by CSS reading a single shared --lp custom property, so
// this scales to more particles for free instead of adding React overhead.
const PARTICLES = Array.from({ length: 16 }, (_, i) => {
  const angle = (360 / 16) * i + (i % 2) * 11;
  return { angle, distance: 70 + ((i * 37) % 60), size: 3 + (i % 3) };
});

function stageRange(index: number): [number[], number[]] {
  const start = index / STAGE_COUNT;
  const end = (index + 1) / STAGE_COUNT;
  const pad = 0.045;
  if (index === 0) return [[start, end - pad, end], [1, 1, 0]];
  if (index === STAGE_COUNT - 1) return [[start, start + pad, end], [0, 1, 1]];
  return [[start, start + pad, end - pad, end], [0, 1, 1, 0]];
}

function Stage({
  index,
  progress,
  material,
}: {
  index: number;
  progress: MotionValue<number>;
  material: RecycledMaterial;
}) {
  const [inputRange, outputRange] = stageRange(index);
  const opacity = useTransform(progress, inputRange, outputRange);
  const start = index / STAGE_COUNT;
  const end = (index + 1) / STAGE_COUNT;
  const localProgress = useTransform(progress, [start, end], [0, 1], { clamp: true });
  const stage = TRANSFORMATION_STAGES[index];

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ opacity, ["--lp" as string]: localProgress }}
    >
      {stage.key === "material" && <PhotoLayer material={material} localProgress={localProgress} engineered={false} />}
      {stage.key === "engineered" && <PhotoLayer material={material} localProgress={localProgress} engineered />}
      {stage.key === "cell" && <CellSchematic localProgress={localProgress} />}
      {stage.key === "battery" && <PackSchematic localProgress={localProgress} />}
      {stage.key === "application" && <ApplicationSvg localProgress={localProgress} material={material} />}
    </motion.div>
  );
}

function PhotoLayer({
  material,
  localProgress,
  engineered,
}: {
  material: RecycledMaterial;
  localProgress: MotionValue<number>;
  engineered: boolean;
}) {
  const scale = useTransform(localProgress, [0, 1], [1, engineered ? 0.92 : 1.06]);
  return (
    <div className="relative h-[62vmin] w-[62vmin] max-h-[520px] max-w-[520px]">
      <HexFrame />
      <motion.div
        className="absolute inset-[6%] overflow-hidden"
        style={{ clipPath: HEX_CLIP, scale }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img loading="lazy" decoding="async"
          src={material.image}
          alt={material.name}
          className="h-full w-full object-cover transition-[filter] duration-700"
          style={{ filter: engineered ? "grayscale(0.55) contrast(1.15) brightness(0.85)" : "none" }}
        />
        {engineered && (
          <div
            className="pointer-events-none absolute inset-0 mix-blend-screen"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, rgba(0,163,125,0.35) 48%, transparent 60%)",
              backgroundSize: "100% 260%",
              backgroundPositionY: "calc((1 - var(--lp)) * -160%)",
            }}
          />
        )}
      </motion.div>
      {engineered && <ParticleField />}
    </div>
  );
}

function ParticleField() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
      {PARTICLES.map((p, i) => (
        <circle
          key={i}
          cx="50%"
          cy="50%"
          r={p.size}
          fill="var(--brand-hover)"
          style={{
            opacity: "calc(var(--lp) * 0.8)",
            transform: `rotate(${p.angle}deg) translateX(calc(var(--lp) * ${p.distance}px))`,
            transformOrigin: "center",
            transformBox: "fill-box",
          }}
        />
      ))}
    </svg>
  );
}

// A simplified cylindrical-cell cross-section — concentric wound layers,
// drawn in via pathLength rather than faded in, so it reads as something
// being engineered rather than a picture swap.
function CellSchematic({ localProgress }: { localProgress: MotionValue<number> }) {
  return (
    <svg viewBox="0 0 200 200" className="h-[46vmin] w-[46vmin] max-h-[380px] max-w-[380px]" aria-hidden="true">
      <motion.circle cx="100" cy="100" r="86" fill="none" stroke="var(--grey-400)" strokeWidth="1" style={{ pathLength: localProgress, opacity: 0.5 }} />
      {[68, 52, 36].map((r, i) => (
        <motion.circle
          key={r}
          cx="100"
          cy="100"
          r={r}
          fill="none"
          stroke="var(--brand-hover)"
          strokeWidth="1.4"
          strokeDasharray="3 4"
          style={{ pathLength: localProgress, opacity: useTransform(localProgress, [i * 0.12, i * 0.12 + 0.4], [0, 1]) }}
        />
      ))}
      <motion.circle cx="100" cy="100" r="14" fill="var(--brand)" style={{ scale: localProgress, opacity: localProgress }} />
      <motion.line x1="100" y1="14" x2="100" y2="0" stroke="var(--grey-400)" strokeWidth="1.4" style={{ pathLength: localProgress }} />
    </svg>
  );
}

// The cell schematic re-arrayed into a small pack grid — each unit
// staggers in on its own slice of the stage's local progress.
function PackSchematic({ localProgress }: { localProgress: MotionValue<number> }) {
  const cells = [0, 1, 2, 3];
  return (
    <div className="grid h-[42vmin] w-[42vmin] max-h-[340px] max-w-[340px] grid-cols-2 gap-4">
      {cells.map((i) => {
        const start = i * 0.15;
        const end = start + 0.5;
        return <PackCell key={i} start={start} end={end} localProgress={localProgress} />;
      })}
    </div>
  );
}

function PackCell({ start, end, localProgress }: { start: number; end: number; localProgress: MotionValue<number> }) {
  const opacity = useTransform(localProgress, [start, end], [0, 1]);
  const y = useTransform(localProgress, [start, end], [16, 0]);
  return (
    <motion.div
      className="relative overflow-hidden rounded-[10px] border"
      style={{ opacity, y, borderColor: "var(--grey-400)", background: "var(--brand-deep-2)" }}
    >
      <div className="absolute inset-x-0 top-0 h-[3px]" style={{ background: "var(--brand-hover)" }} />
    </motion.div>
  );
}

// A minimal technical side-profile of a vehicle — stroke-drawn, not a stock
// photo, kept deliberately schematic rather than literal.
function ApplicationSvg({ localProgress, material }: { localProgress: MotionValue<number>; material: RecycledMaterial }) {
  const labelOpacity = useTransform(localProgress, [0.65, 1], [0, 1]);
  const label = material.application ? APPLICATION_LABEL[material.application] : undefined;
  return (
    <div className="flex flex-col items-center gap-6">
      <svg viewBox="0 0 320 120" className="h-auto w-[70vmin] max-w-[560px]" aria-hidden="true">
        <motion.path
          d="M20 92 L44 92 L58 62 Q66 50 82 50 L166 50 Q178 50 186 60 L206 84 L296 84 Q300 84 300 90 L300 96 L280 96"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ pathLength: localProgress }}
        />
        <motion.path
          d="M44 92 L280 92"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="2"
          style={{ pathLength: localProgress, opacity: 0.6 }}
        />
        {[80, 250].map((cx) => (
          <motion.circle
            key={cx}
            cx={cx}
            cy="96"
            r="13"
            fill="none"
            stroke="var(--brand-hover)"
            strokeWidth="2.4"
            style={{ pathLength: localProgress }}
          />
        ))}
        <motion.rect
          x="96"
          y="72"
          width="70"
          height="8"
          rx="2"
          fill="var(--brand-hover)"
          style={{ scaleX: localProgress, opacity: localProgress, transformOrigin: "96px 76px" }}
        />
      </svg>
      {label && (
        <motion.div
          style={{ opacity: labelOpacity }}
          className="text-xs font-medium tracking-[0.2em] text-grey-600 uppercase"
        >
          {label}
        </motion.div>
      )}
    </div>
  );
}

const HEX_CLIP =
  "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)";

function HexFrame() {
  return (
    <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
      <polygon
        points="50,3 92,26 92,74 50,97 8,74 8,26"
        fill="none"
        stroke="var(--brand)"
        strokeWidth="0.5"
        opacity="0.35"
      />
    </svg>
  );
}

export function TransformationVisual({ material }: { material: RecycledMaterial }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const scrollYProgress = useTrackProgress(trackRef);
  const [stageIndex, setStageIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setStageIndex(Math.min(STAGE_COUNT - 1, Math.floor(v * STAGE_COUNT)));
  });

  // Reduced motion: skip the pinned scroll-scrub entirely and lay the
  // stages out as a simple static stack — the story still reads, nothing
  // moves on its own or hijacks scroll.
  if (reduceMotion) {
    return (
      <div className="flex flex-col items-center gap-16 py-16">
        {TRANSFORMATION_STAGES.map((stage, i) => (
          <div key={stage.key} className="flex flex-col items-center gap-4">
            <div className="text-xs font-medium tracking-[0.2em] text-grey-400 uppercase">
              {String(i + 1).padStart(2, "0")} / {String(STAGE_COUNT).padStart(2, "0")} — {stage.label}
            </div>
            <div className="relative flex h-[320px] w-full items-center justify-center">
              <StaticStage stageKey={stage.key} material={material} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={trackRef} style={{ height: `${STAGE_COUNT * 100}vh` }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        <div className="relative h-[64vmin] w-full">
          {TRANSFORMATION_STAGES.map((stage, i) => (
            <Stage key={stage.key} index={i} progress={scrollYProgress} material={material} />
          ))}
        </div>
        <div className="mt-10 text-xs font-medium tracking-[0.2em] text-grey-400 uppercase">
          {String(stageIndex + 1).padStart(2, "0")} / {String(STAGE_COUNT).padStart(2, "0")}
          <span className="ml-3 text-grey-600">{TRANSFORMATION_STAGES[stageIndex].label}</span>
        </div>
      </div>
    </div>
  );
}

// Reduced-motion fallback renders — same visuals, held at their resting
// (fully "arrived") state instead of scroll-scrubbed.
function StaticStage({ stageKey, material }: { stageKey: string; material: RecycledMaterial }) {
  // A MotionValue pinned at 1 (the "arrived" end state) so the same stage
  // components render unmodified, just without any scroll-driven motion.
  const full = useMotionValue(1);
  if (stageKey === "material") return <PhotoLayer material={material} localProgress={full} engineered={false} />;
  if (stageKey === "engineered") return <PhotoLayer material={material} localProgress={full} engineered />;
  if (stageKey === "cell") return <CellSchematic localProgress={full} />;
  if (stageKey === "battery") return <PackSchematic localProgress={full} />;
  return <ApplicationSvg localProgress={full} material={material} />;
}
