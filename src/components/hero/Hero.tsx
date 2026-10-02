"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionTemplate, useTransform } from "motion/react";
import { ContactButton } from "@/components/ui/ContactButton";
import { Grain } from "@/components/ui/Grain";
import { TAGLINE, TAGLINE_EYEBROW } from "@/lib/content";
import { lerp, useScrollProgress } from "@/lib/useScrollProgress";

// Our own take on the "video settles into a card as you scroll" idea — a
// genuinely different mechanism from a transform-scale approach: the video
// layer never moves or scales at all (always rendered full-bleed, at its
// natural resolution — no oversized-fill-scale math needed), and a
// clip-path carves the visible card shape out of it as scroll progresses.
// Text lives as a normal, unscaled sibling overlay, since nothing here ever
// gets transformed. Playback is a plain autoplay loop throughout — scroll-
// scrubbing the footage was tried and didn't read well, so it just runs.
//
// The clip-path itself is driven by useScrollProgress's spring-smoothed
// value via useTransform/useMotionTemplate, so it eases toward the target
// shape instead of snapping to it on every scroll event, and updates
// without triggering a React re-render on every scroll tick.
const CARD_MAX_WIDTH = 1400;
const CARD_TOP_INSET = 104; // matches the nav's own measured height
const CARD_BOTTOM_INSET = 24;
const CARD_RADIUS = 20;

function computeRestClip() {
  if (typeof window === "undefined") return { top: 0, side: 0, bottom: 0 };
  const w = window.innerWidth;
  const cardWidth = Math.min(CARD_MAX_WIDTH, w - 48);
  return { top: CARD_TOP_INSET, side: (w - cardWidth) / 2, bottom: CARD_BOTTOM_INSET };
}

// The text's horizontal inset needs to always be >= the card's own settled
// `side` clip (computeRestClip's formula: 24px flat up to a 1400px-wide
// card, then (100vw - 1400px) / 2 beyond that), or text quietly overruns
// the rounded card's edge once it finishes settling — a flat 5vw (the
// padding used before this fix) falls short on narrow viewports (18.75px
// vs 24px at 375px wide) and, by the same formula, would fall short again
// past ~1448px wide too. Expressed as plain CSS (not a scroll-driven motion
// value) so it can never mismatch between server and client render passes:
// it's the same 3-way max the clip-path math resolves to, evaluated by the
// browser instead of computed from window.innerWidth in JS.
const TEXT_INSET_CSS = "max(5vw, 24px, calc((100vw - 1400px) / 2))";

export function Hero() {
  // A ref, not state — read fresh inside the useTransform callbacks below
  // without needing to recreate them (and without a re-render) when it
  // changes on resize.
  const restClipRef = useRef(computeRestClip());
  const [contentVisible, setContentVisible] = useState(false);
  const progress = useScrollProgress();

  useEffect(() => {
    const update = () => {
      restClipRef.current = computeRestClip();
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setContentVisible(true), 1000);
    return () => clearTimeout(t);
  }, []);

  const top = useTransform(progress, (p) => lerp(0, restClipRef.current.top, p));
  const side = useTransform(progress, (p) => lerp(0, restClipRef.current.side, p));
  const bottom = useTransform(progress, (p) => lerp(0, restClipRef.current.bottom, p));
  const radius = useTransform(progress, (p) => lerp(0, CARD_RADIUS, p));
  const clipPath = useMotionTemplate`inset(${top}px ${side}px ${bottom}px ${side}px round ${radius}px)`;

  return (
    <section className="relative h-full bg-white">
      <motion.div className="absolute inset-0 overflow-hidden bg-brand-deep" style={{ clipPath }}>
        <video className="block h-full w-full object-cover" src="/video/hero.mp4" poster="/video/hero-poster.webp" autoPlay muted loop playsInline />
        <div className="absolute inset-0 bg-gradient-to-b from-brand/25 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-deep via-brand-deep/40 to-transparent" />
        {/* Fixed top vignette, independent of scroll — keeps the nav links
            (which overlay this area) legible regardless of how bright that
            frame of footage happens to be, since the nav has no background
            of its own. */}
        <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black/45 to-transparent" />
        <Grain opacity={0.05} />
      </motion.div>

      {/* A plain, unscaled sibling — not nested inside the clipped layer,
          so it needs no inverse-transform trick to stay a constant size;
          it was never transformed to begin with. Matches the card's own
          max-width so the two stay aligned at rest. */}
      <div className="pointer-events-none absolute inset-0 mx-auto max-w-[1400px]">
        <div
          className="pointer-events-auto absolute inset-0 flex flex-col justify-end pb-16 transition-opacity duration-700"
          style={{ opacity: contentVisible ? 1 : 0, paddingLeft: TEXT_INSET_CSS, paddingRight: TEXT_INSET_CSS }}
        >
          <div className="mb-4 text-xs font-medium tracking-[0.08em] text-white/70 uppercase">{TAGLINE_EYEBROW}</div>
          <h1 className="max-w-2xl text-4xl font-medium leading-[1.15] text-white sm:text-5xl">{TAGLINE}</h1>
          <ContactButton href="#get-in-touch" className="mt-8 w-fit" />
        </div>
      </div>
    </section>
  );
}
