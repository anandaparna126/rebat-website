"use client";

import { useEffect } from "react";
import { useMotionValue, useSpring, type MotionValue } from "motion/react";

// A spring-smoothed progress value (0-1) over the first 1.1 viewport-heights
// of scroll, driving the hero reveal and the nav color lerp from one shared
// source rather than separate scroll listeners. The 1.1 figure must stay in
// sync with HeroTrack's own runway multiplier, since both describe the same
// scroll distance.
//
// Driven by a plain scroll listener into a MotionValue, not Motion's own
// useScroll — useScroll was tried first and does not update in this
// project's React 19.2.8 / Next 16.3.4 / motion 13.2.0 combination (see
// useTrackProgress.ts, which hit the same issue). The raw value is then
// run through useSpring so consumers ease toward the real scroll position
// instead of snapping to it on every scroll event — a fast flick settles
// with a bit of natural motion rather than jumping instantly.
export function useScrollProgress(): MotionValue<number> {
  const raw = useMotionValue(0);
  const smoothed = useSpring(raw, { stiffness: 100, damping: 30, mass: 0.5 });

  useEffect(() => {
    const update = () => {
      const maxScroll = window.innerHeight * 1.1;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      raw.set(maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return smoothed;
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function lerpColor(start: [number, number, number], end: [number, number, number], t: number) {
  const r = Math.round(lerp(start[0], end[0], t));
  const g = Math.round(lerp(start[1], end[1], t));
  const b = Math.round(lerp(start[2], end[2], t));
  return `rgb(${r}, ${g}, ${b})`;
}
