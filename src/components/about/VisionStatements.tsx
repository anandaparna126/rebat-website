"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

// The four vision statements shown one at a time in a fixed-height stage that
// advances on its own, pauses on hover or focus, and can be picked directly.
export function VisionStatements({ statements }: { statements: string[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % statements.length), 5500);
    return () => clearInterval(id);
  }, [paused, statements.length]);

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="min-h-[14rem] sm:min-h-[16rem]" aria-live="polite">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-2xl leading-snug font-medium text-white sm:text-4xl"
        >
          {statements[index]}
        </motion.p>
      </div>
      <div className="mt-6 flex items-center gap-3">
        {statements.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Vision statement ${i + 1}`}
            aria-current={i === index}
            className={`h-10 w-10 rounded-full border text-sm font-medium transition-colors duration-300 ${
              i === index ? "border-white bg-white text-brand" : "border-white/40 text-white/70 hover:border-white hover:text-white"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
