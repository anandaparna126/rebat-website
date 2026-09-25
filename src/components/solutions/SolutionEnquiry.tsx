"use client";

import { useState } from "react";
import { PartnerHero } from "@/components/partner/PartnerHero";
import { EnquiryButton } from "@/components/ui/EnquiryButton";
import { EnquiryModal } from "@/components/ui/EnquiryModal";
import { Grain } from "@/components/ui/Grain";
import { Reveal } from "@/components/ui/Reveal";
import { LazyVideo } from "@/components/ui/LazyVideo";

// The dedicated solution pages are server-rendered, editorial pages; only
// the parts that open the enquiry modal need client state, so they live here.
// Each solution gets its own modal colour from the same homepage Impact
// palette used elsewhere (battery = deep teal, logistics = sage-grey, EPR =
// tan, R&D = charcoal) — one system, not a new one per page.

export interface SolutionModalConfig {
  panelColor: string;
  tone: "light" | "dark";
  eyebrow: string;
  heading: string;
  headingAccent: string;
  description: string;
  topic: string;
}

export function SolutionHero({
  eyebrow,
  headline,
  image,
  description,
  ctaLabel,
  modal,
}: {
  eyebrow: string;
  headline: string;
  image: string;
  description: string;
  ctaLabel: string;
  modal: SolutionModalConfig;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <PartnerHero
        eyebrow={eyebrow}
        headline={headline}
        image={image}
        description={description}
        ctaLabel={ctaLabel}
        onCtaClick={() => setOpen(true)}
      />
      <EnquiryModal open={open} onClose={() => setOpen(false)} {...modal} />
    </>
  );
}

export function SolutionCta({
  headline,
  description,
  ctaLabel,
  modal,
  video,
  className = "bg-brand",
}: {
  headline: string;
  description: string;
  ctaLabel: string;
  modal: SolutionModalConfig;
  /** Optional looping footage behind the text — same closing treatment as
   * the Products and Partner pages (dark readability gradient, text on the
   * left, rounded bottom over brand emerald so the footer's rounded top
   * meets it cleanly). */
  video?: string;
  /** Section background; must stay brand emerald when this is the last
   * section, since the footer's rounded top reveals that colour. */
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  if (video) {
    return (
      <div className="bg-brand">
        <section className="relative flex min-h-[80vh] items-center overflow-hidden rounded-b-[32px] bg-grey-900 px-[5vw] py-28">
          <LazyVideo
            className="pointer-events-none absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
            src={video}
            aria-hidden="true"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(10,24,20,0.85), rgba(10,24,20,0.35) 55%, rgba(10,24,20,0.55))" }}
          />
          <Reveal className="relative mx-auto w-full max-w-[1328px]">
            <h2 className="max-w-2xl text-4xl leading-[1.1] font-medium text-white sm:text-5xl">{headline}</h2>
            <p className="mt-4 max-w-md text-white/80">{description}</p>
            <EnquiryButton label={ctaLabel} onClick={() => setOpen(true)} className="mt-10 w-fit" />
          </Reveal>
          <EnquiryModal open={open} onClose={() => setOpen(false)} {...modal} />
        </section>
      </div>
    );
  }

  return (
    <section className={`relative overflow-hidden px-[5vw] py-24 text-center ${className}`}>
      <Grain opacity={0.05} />
      <Reveal className="relative mx-auto max-w-[720px]">
        <h2 className="text-3xl font-medium text-white sm:text-5xl">{headline}</h2>
        <p className="mx-auto mt-4 max-w-[46ch] text-base text-white/80">{description}</p>
        <EnquiryButton label={ctaLabel} onClick={() => setOpen(true)} className="mx-auto mt-9 w-fit" />
      </Reveal>
      <EnquiryModal open={open} onClose={() => setOpen(false)} {...modal} />
    </section>
  );
}
