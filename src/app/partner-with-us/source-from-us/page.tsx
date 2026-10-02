"use client";

import { useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { PartnerHero } from "@/components/partner/PartnerHero";
import { EnquiryButton } from "@/components/ui/EnquiryButton";
import { EnquiryModal } from "@/components/ui/EnquiryModal";
import { Reveal } from "@/components/ui/Reveal";
import { GetInTouch } from "@/components/cta/GetInTouch";
import { SOURCE_FROM_US_HERO } from "@/lib/content";
import { PLANT } from "@/lib/plant-photos";
import { LAB } from "@/lib/lab-photos";
import { RECYCLED_MATERIALS } from "@/lib/products";
import { SOURCE_AUDIENCE, SOURCING_REQUIREMENTS, RECOVERED_APPLICATIONS, SOURCING_JOURNEY } from "@/lib/source";

// The "Source from us" pathway's own page — a sourcing/conversion page for
// businesses who want recovered materials, not a repeat of the homepage's
// product carousel. Reuses the real material data + photos from
// lib/products.ts throughout rather than inventing new specs or assets.
//
// cylib's own real pattern (confirmed by inspecting their live site): one
// shared enquiry modal per pathway, reused by every contextual CTA on that
// pathway's page(s) — not a separate modal per button. This page's 3
// contextual CTAs (hero, mid-page, closing) all open the same modal here.
export default function SourceFromUs() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  return (
    <PageShell hideNav>
      <PartnerHero
        eyebrow={SOURCE_FROM_US_HERO.eyebrow}
        headline={SOURCE_FROM_US_HERO.headline}
        image="/images/partner/source-hero.webp"
        description="We recover valuable battery materials and return them to the supply chain as resources for new products, processes and technologies."
        ctaLabel="Talk to our materials team"
        onCtaClick={() => setEnquiryOpen(true)}
      />

      {/* Who can source from us — structural overlap technique: stays
          above the next section in z-index, which tucks in underneath it
          via a negative top margin, so this section's own rounded corner
          reveals that section's *real* background through the notch. */}
        <section className="relative z-10 overflow-hidden rounded-b-[32px] bg-white px-[5vw] py-20">
          <Reveal className="mx-auto mb-12 max-w-[640px] text-center">
            <h2 className="text-3xl font-medium text-ink sm:text-4xl">For those building what comes next.</h2>
            <p className="mt-4 text-body">
              We work with businesses looking for reliable sources of recovered battery materials for manufacturing,
              processing and new applications.
            </p>
          </Reveal>
          <div className="mx-auto max-w-[760px] border-t border-grey-200">
            {SOURCE_AUDIENCE.map((name, i) => (
              <Reveal key={name} delay={i * 0.04}>
                <div className="flex items-center gap-6 border-b border-grey-200 py-5">
                  <span className="text-xs font-medium text-grey-400">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-xl font-medium text-ink sm:text-2xl">{name}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

      {/* Materials that return to the supply chain — same chained overlap:
          tucked under the section above, stays above the next section. */}
        <section className="relative z-10 -mt-10 overflow-hidden rounded-b-[32px] bg-surface-mineral px-[5vw] py-20">
          <Reveal className="mx-auto mb-10 max-w-[720px] text-center">
            <h2 className="text-3xl font-medium text-ink sm:text-4xl">Where these materials come from.</h2>
            <p className="mt-4 text-body">Recovered at our own plant, from battery scrap to the materials below.</p>
          </Reveal>
          <div className="mx-auto mb-20 grid max-w-[1100px] grid-cols-1 gap-4 sm:grid-cols-[1.4fr_1fr]">
            {[PLANT.tankPlatformClose, PLANT.workerSample].map((photo, i) => (
              <Reveal key={photo.src} delay={i * 0.06}>
                <figure>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-grey-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.src} alt={photo.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                  </div>
                  <figcaption className="mt-3 text-xs font-medium tracking-[0.1em] text-grey-600 uppercase">{photo.caption}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
          <Reveal className="mx-auto mb-10 max-w-[720px] text-center">
            <h2 className="text-3xl font-medium text-ink sm:text-4xl">Analysed in our own lab.</h2>
          </Reveal>
          <div className="mx-auto mb-20 grid max-w-[1100px] grid-cols-1 gap-4 sm:grid-cols-2">
            {[LAB.titration, LAB.analyserAtPc].map((photo, i) => (
              <Reveal key={photo.src} delay={i * 0.06}>
                <figure>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-grey-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.src} alt={photo.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                  </div>
                  <figcaption className="mt-3 text-xs font-medium tracking-[0.1em] text-grey-600 uppercase">{photo.caption}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
          <Reveal className="mb-10">
            <div className="mb-2 text-xs font-medium tracking-[0.08em] text-grey-600 uppercase">Material portfolio</div>
            <h2 className="max-w-2xl text-3xl font-medium text-ink sm:text-4xl">
              Materials that return to the supply chain.
            </h2>
            <p className="mt-4 max-w-xl text-body">
              Recovered through our recycling and recovery processes, our material portfolio is built around resources
              that can serve new industrial applications.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {RECYCLED_MATERIALS.map((material, i) => (
              <Reveal key={material.id} delay={i * 0.04}>
                <a href="/products" className="group block">
                  <div className="aspect-square w-full overflow-hidden rounded-2xl bg-grey-100">
                    {material.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={material.squareImage ?? material.image}
                        alt={material.name}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 border border-dashed border-grey-300 text-center text-grey-500">
                        <span className="text-[11px] font-medium tracking-[0.15em] uppercase opacity-70">Pending</span>
                        <span className="text-xs">Product photography</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex items-baseline justify-between gap-2">
                    <h3 className="text-base font-bold text-ink">{material.name}</h3>
                    <span className="text-grey-400 transition-transform duration-300 ease-out group-hover:translate-x-1" aria-hidden="true">
                      &rarr;
                    </span>
                  </div>
                  {material.description && <p className="mt-1 text-sm text-grey-600">{material.description}</p>}
                </a>
              </Reveal>
            ))}
          </div>
        </section>

      {/* Built around your material needs — same chained overlap: tucked
          under the section above, stays above the next section. */}
        <section className="relative z-10 -mt-10 overflow-hidden rounded-b-[32px] bg-white px-[5vw] py-20">
          <Reveal className="mb-12 text-center">
            <h2 className="text-3xl font-medium text-ink sm:text-4xl">Built around your material needs.</h2>
          </Reveal>
          <div className="mx-auto grid max-w-[900px] grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
            {SOURCING_REQUIREMENTS.map((step, i) => (
              <Reveal key={step.number} delay={i * 0.05}>
                <div className="border-t border-grey-200 pt-5">
                  <span className="text-xs font-medium text-grey-400">{step.number}</span>
                  <h3 className="mt-2 text-xl font-medium tracking-[0.02em] text-ink uppercase">{step.title}</h3>
                  <p className="mt-1.5 text-sm text-grey-600">{step.question}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2} className="mt-12 text-center">
            <EnquiryButton label="Tell us what you're looking for" onClick={() => setEnquiryOpen(true)} className="mx-auto w-fit" />
          </Reveal>
        </section>

      {/* Recovered here. Used again. — same chained overlap: tucked under
          the section above, stays above the next section. */}
        <section className="relative z-10 -mt-10 overflow-hidden rounded-b-[32px] bg-surface-mineral px-[5vw] py-20">
          <Reveal className="mb-10 text-center">
            <h2 className="text-3xl font-medium text-ink sm:text-4xl">
              Recovered here.
              <br />
              Used again.
            </h2>
          </Reveal>
          <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-4 sm:grid-cols-2">
            {RECOVERED_APPLICATIONS.map((item, i) => {
              const material = RECYCLED_MATERIALS.find((m) => m.id === item.materialId);
              if (!material || !material.image) return null;
              return (
                <Reveal key={item.materialId} delay={i * 0.05}>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={material.image} alt={material.name} className="absolute inset-0 h-full w-full object-cover" />
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{ background: "linear-gradient(to top, rgba(10,20,18,0.75) 0%, rgba(10,20,18,0.15) 45%, rgba(10,20,18,0) 70%)" }}
                    />
                    <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 p-6">
                      <span className="text-sm font-medium tracking-[0.04em] text-white uppercase">{material.name}</span>
                      <span className="text-white/60" aria-hidden="true">&rarr;</span>
                      <span className="text-sm font-medium text-white/85">{item.application}</span>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

      {/* From recovery to your supply chain — same chained overlap: tucked
          under the section above, stays above the closing CTA. */}
        <section className="relative z-10 -mt-10 overflow-hidden rounded-b-[32px] bg-white px-[5vw] py-20">
          <Reveal className="mb-12 text-center">
            <h2 className="text-3xl font-medium text-ink sm:text-4xl">From recovery to your supply chain.</h2>
          </Reveal>
          <div className="mx-auto max-w-[760px] border-t border-grey-200">
            {SOURCING_JOURNEY.map((stage, i) => (
              <Reveal key={stage.number} delay={i * 0.04}>
                <div className="flex items-center gap-6 border-b border-grey-200 py-5">
                  <span className="text-xs font-medium text-grey-400">{stage.number}</span>
                  <span className="text-xl font-medium text-ink sm:text-2xl">{stage.title}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

      {/* Final CTA — same full-bleed video-CTA treatment as the homepage's
          Products section and the other Partner With Us pages: real
          footage filling the frame, a dark "to top" gradient for
          legibility. Structural overlap technique: pulled up underneath
          the section above via a negative top margin, and stays above
          GetInTouch (passed its own `overlap` prop below) in z-index. */}
        <div className="relative z-10 -mt-10 flex min-h-[80vh] items-center overflow-hidden rounded-b-[32px] bg-grey-900 px-[5vw] py-28">
          <video
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            src="/videos/partner/source-closing.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(10,24,20,0.85), rgba(10,24,20,0.35) 55%, rgba(10,24,20,0.55))" }}
          />

          <Reveal className="relative mx-auto max-w-[1328px] text-center">
            <h2 className="max-w-2xl text-4xl leading-[1.1] font-medium text-white sm:text-5xl">
              Looking for a recovered material?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-white/80">
              Tell us what you&rsquo;re looking for. We&rsquo;ll help you find the right material, specification and
              supply pathway.
            </p>
            <EnquiryButton label="Start a conversation" onClick={() => setEnquiryOpen(true)} className="mx-auto mt-10 w-fit" />
          </Reveal>
        </div>

      <GetInTouch overlap />

      <EnquiryModal
        open={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        // The warm tan/cream from the homepage's own Impact panel (item
        // 03) — differentiates this pathway from the green-family battery
        // modal instead of just using another shade of brand emerald.
        panelColor="linear-gradient(150deg, #DDD5C4, #EAE4D6)"
        tone="dark"
        eyebrow="Source From Us"
        heading="Let's talk about"
        headingAccent="sourcing materials"
        description="Tell us what you're looking for. We'll help you find the right material, specification and supply pathway."
        topic="Recovered Materials"
        messageTemplate="Hi, we're looking to source recovered battery materials. Could you share what's available and the right supply pathway?"
      />
    </PageShell>
  );
}
