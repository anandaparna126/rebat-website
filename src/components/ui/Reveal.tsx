"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

// Restrained scroll-reveal — fade + slight rise, once per element. This is
// the extent of cylib's own scroll motion (no pinning/scrubbing).
// `as="li"` renders the reveal wrapper itself as the list item, so lists keep
// valid markup (a <div> is not allowed directly inside <ol>/<ul>).
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li";
}) {
  const Tag = as === "li" ? motion.li : motion.div;
  return (
    <Tag
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </Tag>
  );
}
