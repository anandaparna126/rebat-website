"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";

// Counts up from 0 to the stat's number once the card scrolls into view —
// only for numeric stats ("95%", "73%", "26%"); a non-numeric stat like
// "#1" just renders as-is.
export function StatCounter({ stat, className }: { stat: string; className?: string }) {
  const match = stat.match(/^(\d+)(.*)$/);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView || !match) return;
    const target = parseInt(match[1], 10);
    const controls = animate(0, target, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <span ref={ref} className={className}>
      {match ? `${value}${match[2]}` : stat}
    </span>
  );
}
