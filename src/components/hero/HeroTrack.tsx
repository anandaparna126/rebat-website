"use client";

import { useEffect, useState } from "react";
import { Nav } from "@/components/layout/Nav";
import { Hero } from "@/components/hero/Hero";

// The nav lives inside a sticky hero box, nested in a taller "track" div
// that reserves the extra scroll room the reveal/color-lerp animation
// needs. Once the user scrolls past the track's height, the sticky hero
// (nav included) un-sticks and scrolls away with the page — there's no
// persistent header after that.
export function HeroTrack() {
  const [trackHeight, setTrackHeight] = useState<number | null>(null);

  useEffect(() => {
    // 1 viewport (the sticky window) + 1.1 viewports (the scroll runway the
    // reveal animation plays out over) — kept in sync with the same 1.1
    // figure in useScrollProgress, since both encode the runway's length.
    const update = () => setTrackHeight(window.innerHeight * 2.1);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div id="top" style={{ height: trackHeight ?? "210vh" }}>
      <div className="sticky top-0 h-[100svh] overflow-visible">
        <Nav />
        <Hero />
      </div>
    </div>
  );
}
