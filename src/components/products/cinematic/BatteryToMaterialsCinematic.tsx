"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Reveal } from "@/components/ui/Reveal";
import { useTrackProgress } from "@/lib/useTrackProgress";
import {
  CINEMATIC_BATTERY_IMAGE,
  CINEMATIC_BLACKMASS_IMAGE,
  CINEMATIC_MATERIALS,
  CINEMATIC_TIMING,
} from "@/lib/cinematic";

const T = CINEMATIC_TIMING;

// A single full-frame image layer (Battery or Black Mass) that fades,
// softens and scales as it arrives/leaves — the blur+scale coupling is
// what keeps a two-image crossfade from reading as a flat dissolve.
function FullFrameLayer({
  src,
  alt,
  opacity,
  scale,
  blur,
}: {
  src: string;
  alt: string;
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
  blur: MotionValue<number>;
}) {
  const filter = useMotionTemplate`blur(${blur}px)`;
  return (
    <motion.div className="absolute inset-0" style={{ opacity, scale, filter }}>
      <Image src={src} alt={alt} fill sizes="(max-width: 768px) 92vw, 72vw" className="object-contain" priority={false} />
    </motion.div>
  );
}

// One recovered material, animating outward from the black mass's own
// position (0,0) to its pentagon slot — so it reads as separating out of
// the mass rather than appearing at an already-scattered spot.
function MaterialLayer({
  material,
  progress,
}: {
  material: (typeof CINEMATIC_MATERIALS)[number];
  progress: MotionValue<number>;
}) {
  const windowStart = T.blackMassHoldEnd;
  const windowLen = T.separationEnd - T.blackMassHoldEnd;
  const start = windowStart + windowLen * 0.5 * (material.order / (CINEMATIC_MATERIALS.length - 1));
  const end = start + windowLen * 0.55;

  const opacity = useTransform(progress, [start, end], [0, 1], { clamp: true });
  const scale = useTransform(progress, [start, end], [1.18, 1], { clamp: true });
  const blur = useTransform(progress, [start, end], [10, 0], { clamp: true });
  const x = useTransform(progress, [start, end], [0, material.x], { clamp: true });
  const y = useTransform(progress, [start, end], [0, material.y], { clamp: true });
  const transform = useMotionTemplate`translate(-50%, -50%) translate(${x}%, ${y}%) scale(${scale})`;
  const filter = useMotionTemplate`blur(${blur}px)`;

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 h-[26vh] w-[34vw] max-h-[220px] max-w-[300px]"
      style={{ opacity, transform, filter }}
    >
      <Image src={material.image} alt={material.name} fill sizes="34vw" className="object-contain" />
    </motion.div>
  );
}

function LightBloom({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [T.fieldHoldEnd, T.lightPeak, 1], [0, 0.9, 0.3], { clamp: true });
  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      style={{
        opacity,
        background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.25) 40%, transparent 70%)",
      }}
    />
  );
}

export function BatteryToMaterialsCinematic() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const progress = useTrackProgress(trackRef);

  const batteryOpacity = useTransform(progress, [0, T.batteryHoldEnd, T.breakdownEnd], [1, 1, 0]);
  const batteryScale = useTransform(progress, [T.batteryHoldEnd, T.breakdownEnd], [1, 0.94]);
  const batteryBlur = useTransform(progress, [T.batteryHoldEnd, T.breakdownEnd], [0, 6]);

  const blackMassOpacity = useTransform(
    progress,
    [T.batteryHoldEnd, T.breakdownEnd, T.blackMassHoldEnd, T.separationEnd],
    [0, 1, 1, 0]
  );
  const blackMassScale = useTransform(
    progress,
    [T.batteryHoldEnd, T.breakdownEnd, T.separationEnd],
    [1.1, 1, 0.94]
  );
  const blackMassBlur = useTransform(progress, [T.batteryHoldEnd, T.breakdownEnd, T.separationEnd], [10, 0, 4]);

  const whiteWash = useTransform(progress, [T.lightPeak, 1], [0, 1]);

  if (reduceMotion) {
    return (
      <div className="flex flex-col items-center gap-10 bg-grey-900 px-[5vw] py-20">
        {[
          { src: CINEMATIC_BATTERY_IMAGE, alt: "Battery" },
          { src: CINEMATIC_BLACKMASS_IMAGE, alt: "Black mass" },
        ].map((item) => (
          <div key={item.alt} className="relative h-[40vh] w-full max-w-[640px]">
            <Image src={item.src} alt={item.alt} fill className="object-contain" />
          </div>
        ))}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-5">
          {CINEMATIC_MATERIALS.map((m) => (
            <div key={m.id} className="relative h-[16vh] w-[30vw] max-w-[160px]">
              <Image src={m.image} alt={m.name} fill className="object-contain" />
            </div>
          ))}
        </div>
        <RecoveredMaterialsTitle />
      </div>
    );
  }

  return (
    <div>
      <div ref={trackRef} style={{ height: "650vh" }} className="relative">
        <div className="sticky top-0 h-screen overflow-hidden bg-grey-900">
          <div className="absolute inset-x-0 top-10 z-10 text-center text-xs font-medium tracking-[0.2em] text-white/50 uppercase">
            From Battery to Material
          </div>

          <div className="relative mx-auto h-full max-w-[1100px]">
            <FullFrameLayer src={CINEMATIC_BATTERY_IMAGE} alt="Battery" opacity={batteryOpacity} scale={batteryScale} blur={batteryBlur} />
            <FullFrameLayer src={CINEMATIC_BLACKMASS_IMAGE} alt="Black mass" opacity={blackMassOpacity} scale={blackMassScale} blur={blackMassBlur} />
            {CINEMATIC_MATERIALS.map((material) => (
              <MaterialLayer key={material.id} material={material} progress={progress} />
            ))}
            <LightBloom progress={progress} />
          </div>

          <motion.div className="pointer-events-none absolute inset-0 bg-white" style={{ opacity: whiteWash }} />
        </div>
      </div>

      <div className="bg-white px-[5vw] py-28">
        <RecoveredMaterialsTitle />
      </div>
    </div>
  );
}

function RecoveredMaterialsTitle() {
  return (
    <Reveal className="mx-auto max-w-[1328px] text-center">
      <h2 className="text-4xl leading-[1.05] font-medium text-ink sm:text-5xl lg:text-6xl">
        Recovered Battery Materials
      </h2>
    </Reveal>
  );
}
