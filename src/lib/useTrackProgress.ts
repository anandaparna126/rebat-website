"use client";

import { useEffect } from "react";
import { useMotionValue, type MotionValue } from "motion/react";
import type { RefObject } from "react";

// A scroll-linked progress value (0-1) for a "tall pinned track" element —
// 0 when the track's top reaches the viewport top, 1 when its bottom
// reaches the viewport bottom. Same math as useScrollProgress.ts, but
// driven by a plain scroll listener instead of Framer Motion's useScroll.
//
// useScroll({ target }) was tried first and does not update in this
// project's React 19.2.8 / Next 16.3.4 / motion 13.2.0 combination —
// confirmed by scrubbing a full track and checking computed styles at
// many scroll positions; the derived values never changed from their
// initial state. This hook reuses the plain-scroll-listener approach
// already proven to work for the Hero/Nav scroll effects, and still
// returns a real MotionValue so useTransform/useMotionTemplate keep
// working unchanged downstream.
export function useTrackProgress(ref: RefObject<HTMLElement | null>): MotionValue<number> {
  const progress = useMotionValue(0);

  useEffect(() => {
    function update() {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? -rect.top / total : 0;
      progress.set(Math.min(1, Math.max(0, p)));
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ref, progress]);

  return progress;
}
