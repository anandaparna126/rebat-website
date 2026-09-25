"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionTemplate, useTransform } from "motion/react";
import { ContactButton } from "@/components/ui/ContactButton";
import { EnquiryButton } from "@/components/ui/EnquiryButton";
import { Grain } from "@/components/ui/Grain";
import { Nav } from "@/components/layout/Nav";
import { lerp, useScrollProgress } from "@/lib/useScrollProgress";

// Same "settles into a rounded card as you scroll" clip-path mechanism as
// the homepage Hero (src/components/hero/Hero.tsx) — reused here for this
// page's hero specifically (not folded into the shared PageHero, which
// every other sub-page still uses as-is). A still photo instead of video,
// its own copy, and text centered in the card instead of bottom-left.
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
// `side` clip (24px flat up to a 1400px-wide card, then (100vw - 1400px) / 2
// beyond that), or text quietly overruns the rounded card's edge once it
// finishes settling — a flat 5vw falls short on narrow viewports (18.75px
// vs 24px at 375px wide). Same fix as the homepage Hero (src/components/
// hero/Hero.tsx) for the identical underlying issue: expressed as plain
// CSS, not a scroll-driven motion value, so it can never mismatch between
// server and client render passes.
const TEXT_INSET_CSS = "max(5vw, 24px, calc((100vw - 1400px) / 2))";

export function PartnerHero({
  eyebrow,
  headline,
  image,
  description,
  ctaLabel = "Partner with us",
  ctaHref = "#explore-panels",
  onCtaClick,
}: {
  eyebrow: string;
  headline: string;
  image: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  /** When set, the CTA opens an instant enquiry modal in place instead of
   * navigating to `ctaHref` — cylib's real contextual-CTA pattern. Pages
   * that just need a plain link (the main hub's "Partner with us" scroll
   * anchor) omit this and keep the default ContactButton behaviour. */
  onCtaClick?: () => void;
}) {
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
    const t = setTimeout(() => setContentVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  const top = useTransform(progress, (p) => lerp(0, restClipRef.current.top, p));
  const side = useTransform(progress, (p) => lerp(0, restClipRef.current.side, p));
  const bottom = useTransform(progress, (p) => lerp(0, restClipRef.current.bottom, p));
  const radius = useTransform(progress, (p) => lerp(0, CARD_RADIUS, p));
  const clipPath = useMotionTemplate`inset(${top}px ${side}px ${bottom}px ${side}px round ${radius}px)`;

  return (
    <div style={{ height: "210vh" }}>
      <div className="sticky top-0 h-[100svh] overflow-visible">
        <Nav />
        <section className="relative h-full bg-white">
          <motion.div
            className="absolute inset-0 overflow-hidden bg-cover bg-center"
            style={{ clipPath, backgroundImage: `url(${image})` }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(155deg, var(--grey-900) 0%, var(--brand-deep-2) 55%, var(--brand-deep) 100%)",
                opacity: 0.55,
              }}
            />
            <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black/45 to-transparent" />
            <Grain opacity={0.05} />
          </motion.div>

          <div className="pointer-events-none absolute inset-0 mx-auto max-w-[1400px]">
            <div
              className="pointer-events-auto absolute inset-0 flex flex-col items-center justify-center text-center transition-opacity duration-700"
              style={{ opacity: contentVisible ? 1 : 0, paddingLeft: TEXT_INSET_CSS, paddingRight: TEXT_INSET_CSS }}
            >
              <div className="mb-4 text-xs font-medium tracking-[0.08em] text-white/70 uppercase">{eyebrow}</div>
              <h1 className="max-w-2xl text-4xl font-medium leading-[1.15] text-white sm:text-5xl">{headline}</h1>
              {description && <p className="mt-4 max-w-xl text-lg text-white/80">{description}</p>}
              {onCtaClick ? (
                <EnquiryButton label={ctaLabel} onClick={onCtaClick} className="mt-8 w-fit" />
              ) : (
                <ContactButton href={ctaHref} label={ctaLabel} className="mt-8 w-fit" />
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
