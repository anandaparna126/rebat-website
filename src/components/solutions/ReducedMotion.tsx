"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

// Makes every Reveal / motion element on the page respect the visitor's
// "reduce motion" setting (transform animations are skipped; the content
// simply appears). Scoped to the page that opts in.
export function ReducedMotion({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
