"use client";

import { useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { PartnerHero } from "@/components/partner/PartnerHero";
import { EnquiryButton } from "@/components/ui/EnquiryButton";
import { EnquiryModal } from "@/components/ui/EnquiryModal";
import { Reveal } from "@/components/ui/Reveal";
import { GetInTouch } from "@/components/cta/GetInTouch";
import { POWER_WITH_US_HERO } from "@/lib/content";
import { BATTERY_RANGE, BATTERY_PACKS, PACK_CATEGORIES, TESTING, packsIn, uncategorizedPacks } from "@/lib/battery-packs";
import { TESTING_PHOTOS } from "@/lib/battery-photos";
import { POWER_APPLICATIONS, APPLICATION_FACTORS, DEPLOYMENT_STAGES } from "@/lib/power";

// A real, top-down product shot (V:\Rebat Photos\Real Battery Photos,
// supplied 2026-10-01), not the shared cinematic-carousel asset (that one
// is sized/positioned to cross-dissolve against 6 other frames elsewhere,
// so it isn't safe to swap out for a differently-composed photo here).
const POWER_HERO_BATTERY_IMAGE = "/images/battery/power-with-us-hero.webp";

// The "Power with us" pathway's own page — an application-led battery
// solutions page ("you have an application, we have a battery solution"),
// not a repeat of the homepage's product carousel. Application categories
// and product data are reused from lib/content.ts + lib/products.ts
// throughout rather than inventing specs, applications or assets.
//
// One shared enquiry modal per pathway (cylib's own real pattern), reused
// by all 3 contextual CTAs on this page rather than one modal each.
export default function PowerWithUs() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  return (
    <PageShell hideNav>
      <PartnerHero
        eyebrow={POWER_WITH_US_HERO.eyebrow}
        headline={POWER_WITH_US_HERO.headline}
        image="/images/partner/power.webp"
        description="From battery packs to application-ready energy solutions, we build systems around the way energy needs to be used."
        ctaLabel="Talk to our battery team"
        onCtaClick={() => setEnquiryOpen(true)}
      />

      {/* What are you powering? — structural overlap technique: stays
          above the next section in z-index, which tucks in underneath it
          via a negative top margin, so this section's own rounded corner
          reveals that section's *real* background through the notch. */}
        <section className="relative z-10 overflow-hidden rounded-b-[32px] bg-white px-[5vw] py-20">
          <Reveal className="mx-auto mb-12 max-w-[640px] text-center">
            <h2 className="text-3xl font-medium text-ink sm:text-4xl">What are you powering?</h2>
          </Reveal>
          <div className="mx-auto max-w-[760px] border-t border-grey-200">
            {POWER_APPLICATIONS.map((app, i) => (
              <Reveal key={app.number} delay={i * 0.05}>
                <div className="flex flex-col gap-1 border-b border-grey-200 py-6 sm:flex-row sm:items-baseline sm:gap-6">
                  <span className="text-xs font-medium text-grey-400">{app.number}</span>
                  <span className="text-xl font-medium text-ink sm:text-2xl">{app.title}</span>
                  <span className="text-sm text-grey-600 sm:ml-auto">{app.description}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

      {/* The battery pack range: the real, photographed packs currently on
          offer. Same chained overlap: tucked under the section above,
          stays above the next section. */}
        <section id="range" className="relative z-10 -mt-10 overflow-hidden rounded-b-[32px] bg-surface-mineral px-[5vw] py-20">
          <Reveal className="mb-14">
            <div className="mb-2 text-xs font-medium tracking-[0.08em] text-grey-600 uppercase">{BATTERY_RANGE.eyebrow}</div>
            <h2 className="max-w-2xl text-3xl font-medium text-ink sm:text-4xl">{BATTERY_RANGE.tagline}</h2>
            <p className="mt-4 max-w-xl text-body">
              {BATTERY_PACKS.length} packs in the range today, each with published specifications.
            </p>
          </Reveal>

          <div className="mx-auto max-w-[1100px] space-y-12">
            {PACK_CATEGORIES.map((cat, i) => (
              <Reveal key={cat.id} delay={0.03}>
                <div className="grid gap-6 border-t border-grey-300 pt-6 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-16">
                  <div>
                    <span className="text-xs font-medium text-grey-400">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="mt-1 text-2xl font-medium text-ink">{cat.title}</h3>
                    <p className="mt-1 text-sm text-grey-600">{cat.message}</p>
                  </div>
                  <ul className="divide-y divide-grey-200">
                    {packsIn(cat.id).map((p) => (
                      <li key={p.id} className="grid gap-1 py-4 first:pt-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline sm:gap-8">
                        <div>
                          <div className="text-lg font-semibold text-ink">{p.name}</div>
                          <p className="text-sm text-grey-600">{p.headline}</p>
                        </div>
                        <div className="text-sm whitespace-nowrap text-grey-600 tabular-nums">
                          {p.capacity} &middot; {p.energy}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
            {uncategorizedPacks().length > 0 && (
              <Reveal delay={0.03}>
                <div className="grid gap-6 border-t border-grey-300 pt-6 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-16">
                  <div>
                    <span className="text-xs font-medium text-grey-400">{String(PACK_CATEGORIES.length + 1).padStart(2, "0")}</span>
                    <h3 className="mt-1 text-2xl font-medium text-ink">Also in the range</h3>
                  </div>
                  <ul className="divide-y divide-grey-200">
                    {uncategorizedPacks().map((p) => (
                      <li key={p.id} className="grid gap-1 py-4 first:pt-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline sm:gap-8">
                        <div>
                          <div className="text-lg font-semibold text-ink">{p.name}</div>
                          <p className="text-sm text-grey-600">{p.headline}</p>
                        </div>
                        <div className="text-sm whitespace-nowrap text-grey-600 tabular-nums">
                          {p.capacity} &middot; {p.energy}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}
          </div>

          <div className="mx-auto mt-16 max-w-[1100px]">
            <Reveal>
              <h3 className="mb-6 text-2xl font-medium text-ink">Every pack starts on the test rack.</h3>
            </Reveal>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {TESTING_PHOTOS.map((photo, i) => (
                <Reveal key={photo.src} delay={i * 0.06}>
                  <figure>
                    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-grey-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo.src} alt={photo.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                    </div>
                    <figcaption className="mt-3 text-xs font-medium tracking-[0.1em] text-grey-600 uppercase">{photo.caption}</figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal className="mx-auto mt-16 max-w-[1100px] border-t border-grey-300 pt-8">
            <ul className="flex flex-wrap gap-x-3 gap-y-2 text-[11px] tracking-[0.08em] text-grey-500 uppercase">
              {TESTING.strip.map((item, i) => (
                <li key={item} className="flex items-center gap-3">
                  {item}
                  {i < TESTING.strip.length - 1 && (
                    <span className="text-grey-300" aria-hidden="true">
                      |
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <a
              href="/solutions/battery-design"
              className="group mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand focus-visible:outline-solid"
            >
              How every pack is tested
              <span aria-hidden="true" className="transition-transform duration-300 ease-out group-hover:translate-x-1">
                &rarr;
              </span>
            </a>
          </Reveal>
        </section>

      {/* Built around your application — same chained overlap: tucked
          under the section above, stays above the next section. */}
        <section className="relative z-10 -mt-10 overflow-hidden rounded-b-[32px] bg-white px-[5vw] py-20">
          <Reveal className="mb-12 text-center">
            <h2 className="text-3xl font-medium text-ink sm:text-4xl">Built around your application.</h2>
            <p className="mx-auto mt-4 max-w-lg text-body">
              The right battery starts with understanding how and where it needs to perform.
            </p>
          </Reveal>
          <div className="mx-auto grid max-w-[1000px] grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {APPLICATION_FACTORS.map((factor, i) => (
              <Reveal key={factor.title} delay={i * 0.04}>
                <div className="border-t border-grey-200 pt-5">
                  <span className="text-xs font-medium text-grey-400">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-2 text-xl font-medium tracking-[0.02em] text-ink uppercase">{factor.title}</h3>
                  <p className="mt-1.5 text-sm text-grey-600">{factor.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2} className="mt-12 text-center">
            <EnquiryButton label="Discuss your application" onClick={() => setEnquiryOpen(true)} className="mx-auto w-fit" />
          </Reveal>
        </section>

      {/* Built to power more — same chained overlap: tucked under the
          section above, stays above the next section. */}
        <section className="relative z-10 -mt-10 overflow-hidden rounded-b-[32px] bg-surface-mineral px-[5vw] py-20">
          <Reveal className="mb-10 text-center">
            <h2 className="text-3xl font-medium text-ink sm:text-4xl">Built to power more.</h2>
            <p className="mx-auto mt-4 max-w-lg text-body">
              A battery becomes valuable when it performs where it is needed.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="mx-auto max-w-[900px] overflow-hidden rounded-2xl bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={POWER_HERO_BATTERY_IMAGE} alt="ReBAT battery pack, top-down view" className="aspect-[16/10] w-full object-contain p-10" />
            </div>
            <div className="mx-auto mt-8 flex max-w-[900px] flex-wrap justify-center gap-x-10 gap-y-3">
              {POWER_APPLICATIONS.map((app) => (
                <span key={app.number} className="flex items-center gap-2 text-sm font-medium text-ink">
                  Battery Pack
                  <span className="text-grey-400" aria-hidden="true">&rarr;</span>
                  {app.title}
                </span>
              ))}
            </div>
          </Reveal>
        </section>

      {/* From requirement to deployment — same chained overlap: tucked
          under the section above, stays above the closing CTA. */}
        <section className="relative z-10 -mt-10 overflow-hidden rounded-b-[32px] bg-white px-[5vw] py-20">
          <Reveal className="mb-12 text-center">
            <h2 className="text-3xl font-medium text-ink sm:text-4xl">From requirement to deployment.</h2>
            <p className="mx-auto mt-4 max-w-lg text-body">
              A battery solution starts with the application and evolves through engineering, validation and
              integration.
            </p>
          </Reveal>
          <div className="mx-auto max-w-[760px] border-t border-grey-200">
            {DEPLOYMENT_STAGES.map((stage, i) => (
              <Reveal key={stage.number} delay={i * 0.04}>
                <div className="flex flex-col gap-1 border-b border-grey-200 py-6 sm:flex-row sm:items-baseline sm:gap-6">
                  <span className="text-xs font-medium text-grey-400">{stage.number}</span>
                  <span className="text-xl font-medium text-ink sm:text-2xl">{stage.title}</span>
                  <span className="text-sm text-grey-600 sm:ml-auto">{stage.description}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

      {/* Final CTA — structural overlap technique: pulled up underneath
          the section above via a negative top margin, and stays above
          GetInTouch (passed its own `overlap` prop below) in z-index. Same
          cinematic video-background treatment as the /solutions pages'
          own closing CTA (see SolutionCta in components/solutions/
          SolutionEnquiry.tsx) — reuses that same real battery-cells
          footage, on-topic for a battery-application page too. */}
        <div className="bg-brand">
          <section className="relative z-10 -mt-10 flex min-h-[70vh] items-center overflow-hidden rounded-b-[32px] bg-grey-900 px-[5vw] py-28">
            <video
              className="pointer-events-none absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
              src="/videos/solutions/battery-products.mp4"
              autoPlay
              muted
              loop
              playsInline
              aria-hidden="true"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(10,24,20,0.85), rgba(10,24,20,0.35) 55%, rgba(10,24,20,0.55))" }}
            />
            <Reveal className="relative mx-auto w-full max-w-[1328px]">
              <h2 className="max-w-2xl text-4xl leading-[1.1] font-medium text-white sm:text-5xl">Have an application in mind?</h2>
              <p className="mt-4 max-w-md text-white/80">
                Tell us what you need to power. We&rsquo;ll explore the right battery solution with you.
              </p>
              <EnquiryButton label="Talk to our battery team" onClick={() => setEnquiryOpen(true)} className="mt-10 w-fit" />
            </Reveal>
          </section>
        </div>

      <GetInTouch overlap />

      <EnquiryModal
        open={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        // Same deep teal-green as the homepage's Impact panel 04 — kept
        // identical to the Engineered Energy carousel's modal since both
        // represent the same battery pathway.
        panelColor="linear-gradient(150deg, #376F63, #2A5951)"
        tone="light"
        eyebrow="Power With Us"
        heading="Let's talk about"
        headingAccent="your battery solution"
        description="Tell us what you need to power. We'll explore the right battery solution with you."
        topic="Battery Solutions"
        messageTemplate="Hi, we're looking for a battery solution for our application. Could your team help us explore the right option?"
      />
    </PageShell>
  );
}
