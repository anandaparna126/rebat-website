"use client";

import { useState } from "react";
import { PartnerHero } from "@/components/partner/PartnerHero";
import { PageShell } from "@/components/layout/PageShell";
import { ContactButton } from "@/components/ui/ContactButton";
import { EnquiryButton } from "@/components/ui/EnquiryButton";
import { EnquiryModal } from "@/components/ui/EnquiryModal";
import { Reveal } from "@/components/ui/Reveal";
import { RECYCLE_MATERIALS_HERO } from "@/lib/content";
import { MaterialTileMedia } from "@/components/story/MaterialTileMedia";
import { CollectedGallery } from "@/components/story/CollectedGallery";
import { INCOMING_MATERIALS } from "@/lib/story";
import { VALUE_CHAIN_PARTNERS, MATERIALS_JOURNEY, WHAT_HAPPENS_NEXT, MORE_THAN_RECYCLING } from "@/lib/materials";

// The deep-dive page panel 01 ("Recycle with us") on the /partner-with-us
// hub links to — who we work with, what we accept, the four-stage journey
// a shipment goes through, what each stream becomes, and the value beyond
// recycling itself. Reuses real data already established elsewhere (the
// homepage's incoming-materials list and its four real process clips,
// relabeled for this audience) rather than inventing new assets.
//
// The hero CTA keeps its default "Get in touch" label and real /contact
// link (the one exception to the instant-modal pattern); the page's own
// contextual closing CTA ("Talk to ReBat") opens this pathway's shared
// enquiry modal instead, matching cylib's real "recycle" modal.
export default function PartnerWithUsMaterials() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  return (
    <PageShell hideNav>
      <PartnerHero
        eyebrow={RECYCLE_MATERIALS_HERO.eyebrow}
        headline={RECYCLE_MATERIALS_HERO.headline}
        image="/images/partner/recycle.webp"
        ctaLabel="Get in touch"
        ctaHref="/contact"
      />

      {/* Who we work with — structural overlap technique: stays above the
          next section in z-index, which tucks in underneath it via a
          negative top margin, so this section's own rounded corner
          reveals that section's *real* background through the notch. */}
        <section className="relative z-10 overflow-hidden rounded-b-[32px] bg-white px-[5vw] py-20">
        <Reveal className="mb-10">
          <div className="mb-2 text-xs font-medium tracking-[0.08em] text-grey-600 uppercase">
            Built for the battery value chain
          </div>
          <h2 className="text-3xl font-medium text-ink">Who we work with.</h2>
        </Reveal>
        <div className="mx-auto max-w-[760px] border-t border-grey-200">
          {VALUE_CHAIN_PARTNERS.map((name, i) => (
            <Reveal key={name} delay={i * 0.04}>
              <div className="flex items-center gap-6 border-b border-grey-200 py-5">
                <span className="text-xs font-medium text-grey-400">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-xl font-medium text-ink sm:text-2xl">{name}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* What we accept — same chained overlap: tucked under the section
          above, stays above CollectedGallery (which plays the same dual
          role for the section after it — see CollectedGallery.tsx). */}
        <section className="relative z-10 -mt-10 overflow-hidden rounded-b-[32px] bg-surface-mineral px-[5vw] py-20">
        <Reveal className="mb-10">
          <div className="mb-2 text-xs font-medium tracking-[0.08em] text-grey-600 uppercase">What we accept</div>
          <h2 className="max-w-2xl text-3xl font-medium text-ink sm:text-4xl">
            From production scrap to end-of-life batteries, we recover what still holds value.
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {INCOMING_MATERIALS.map((material, i) => (
            <Reveal key={material.number} delay={i * 0.04}>
              <div className="overflow-hidden rounded-2xl border border-grey-200 bg-grey-50">
                <MaterialTileMedia material={material} />
                <div className="p-5">
                  <h3 className="mb-1.5 text-base font-bold text-ink">{material.name}</h3>
                  <p className="text-sm text-grey-600">{material.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CollectedGallery rounded />

      {/* From your site to the next life — same chained overlap: tucked
          under CollectedGallery, stays above the next section. */}
        <section className="relative z-10 -mt-10 overflow-hidden rounded-b-[32px] bg-surface-mineral px-[5vw] py-20">
        <Reveal className="mb-10 text-center">
          <div className="mb-2 text-xs font-medium tracking-[0.08em] text-grey-600 uppercase">
            From your site to the next life
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <div className="grid grid-cols-1 gap-1 overflow-hidden rounded-2xl sm:grid-cols-2 lg:grid-cols-4">
            {MATERIALS_JOURNEY.map((stage) => (
              <div key={stage.step} className="aspect-[3/4] w-full overflow-hidden bg-grey-200">
                <video className="h-full w-full object-cover" src={stage.video} autoPlay muted loop playsInline />
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {MATERIALS_JOURNEY.map((stage, i) => (
              <div key={stage.step} className="flex items-center justify-center gap-3 px-1 py-2 text-center">
                <span className="text-sm font-medium tracking-[0.04em] text-ink uppercase">{stage.title}</span>
                {i < MATERIALS_JOURNEY.length - 1 && (
                  <span className="hidden text-grey-400 lg:inline" aria-hidden="true">
                    &rarr;
                  </span>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* What happens next — same chained overlap: tucked under the
          section above, stays above the next section. */}
        <section className="relative z-10 -mt-10 overflow-hidden rounded-b-[32px] bg-white px-[5vw] py-20">
        <Reveal className="mb-10">
          <div className="mb-2 text-xs font-medium tracking-[0.08em] text-grey-600 uppercase">What happens next</div>
        </Reveal>
        <div className="mx-auto max-w-[900px] border-t border-grey-200">
          {WHAT_HAPPENS_NEXT.map((row, i) => (
            <Reveal key={row.from} delay={i * 0.05}>
              <div className="flex flex-col gap-1.5 border-b border-grey-200 py-6 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-lg font-medium text-ink sm:text-xl">{row.from}</span>
                <span className="flex items-center gap-3 text-lg font-medium text-brand sm:text-xl">
                  <span aria-hidden="true">&rarr;</span> {row.to}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* More than recycling — same chained overlap: tucked under the
          section above, stays above the closing video CTA. */}
        <section className="relative z-10 -mt-10 overflow-hidden rounded-b-[32px] border-t border-grey-100 bg-surface-mineral px-[5vw] py-20">
          <Reveal className="mb-10">
            <div className="mb-2 text-xs font-medium tracking-[0.08em] text-grey-600 uppercase">More than recycling</div>
          </Reveal>
          <div className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
            {MORE_THAN_RECYCLING.map((phrase, i) => (
              <Reveal key={phrase} delay={i * 0.05}>
                <div className="border-t border-grey-300 pt-5">
                  <span className="text-xs font-medium text-grey-500">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-2 text-2xl font-medium text-ink sm:text-3xl">{phrase}</h3>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

      {/* Closing — same full-bleed video-CTA treatment as the homepage's
          Products section and the parent /partner-with-us page. Pulled up
          underneath "More than recycling" via a negative top margin (that
          section stays above it in z-index) — the same structural overlap
          technique used above. This section's OWN rounded-bottom corner
          still uses the old colour-matched wrapper below, deliberately
          left as-is: it hands off straight to the shared Footer (no
          GetInTouch on this page), and Footer's own rounded-top corner is
          a separate, already-solved concern (out of scope here — see
          Footer.tsx) that a shared negative margin on Footer risks
          breaking on every other page that goes straight to Footer
          without a rounded section above it. */}
      <div className="bg-brand">
        <div className="relative -mt-10 flex min-h-[80vh] items-center overflow-hidden rounded-b-[32px] bg-grey-900 px-[5vw] py-28">
          <video
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            src="/videos/products/closing-cinematic.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(10,24,20,0.85), rgba(10,24,20,0.35) 55%, rgba(10,24,20,0.55))" }}
          />

          <Reveal className="relative mx-auto max-w-[1328px]">
            <h3 className="max-w-2xl text-4xl leading-[1.1] font-medium text-white sm:text-5xl">
              Your materials have more to give.
            </h3>
            <p className="mt-4 max-w-md text-white/80">Let&rsquo;s find the right path for them.</p>
            <EnquiryButton label="Talk to ReBat" onClick={() => setEnquiryOpen(true)} className="mt-10 w-fit" />
          </Reveal>
        </div>
      </div>

      <EnquiryModal
        open={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        // The sage-grey from the homepage's own Impact panel (item 02) —
        // a third distinct tone alongside Source's tan and Battery's deep
        // teal-green, all pulled from the same established homepage set.
        panelColor="linear-gradient(150deg, #B9C8C5, #C9D5D2)"
        tone="dark"
        eyebrow="Recycle With Us"
        heading="Let's talk about"
        headingAccent="recycling your materials"
        description="Tell us about your production scrap, end-of-life batteries or black mass, and our team will help find the right path for them."
        topic="Recycling & Materials Intake"
        messageTemplate="Hi, we have production scrap / end-of-life batteries / black mass to recycle. Could you help us find the right intake pathway?"
      />
    </PageShell>
  );
}
