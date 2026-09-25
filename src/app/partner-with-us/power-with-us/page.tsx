"use client";

import { useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { PartnerHero } from "@/components/partner/PartnerHero";
import { EnquiryButton } from "@/components/ui/EnquiryButton";
import { EnquiryModal } from "@/components/ui/EnquiryModal";
import { Reveal } from "@/components/ui/Reveal";
import { GetInTouch } from "@/components/cta/GetInTouch";
import { POWER_WITH_US_HERO, BUSINESS_LINES } from "@/lib/content";
import { BATTERY_PRODUCT_LINES } from "@/lib/products";
import { CINEMATIC_BATTERY_IMAGE } from "@/lib/cinematic";
import { POWER_APPLICATIONS, APPLICATION_FACTORS, DEPLOYMENT_STAGES } from "@/lib/power";

// The "Power with us" pathway's own page — an application-led battery
// solutions page ("you have an application, we have a battery solution"),
// not a repeat of the homepage's product carousel. Application categories
// and product data are reused from lib/content.ts + lib/products.ts
// throughout rather than inventing specs, applications or assets.
//
// One shared enquiry modal per pathway (cylib's own real pattern), reused
// by all 3 contextual CTAs on this page rather than one modal each.
export default function PowerWithUs() {
  const batteryManufacturing = BUSINESS_LINES.find((l) => l.title === "Battery Manufacturing");
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

      {/* What are you powering? — wrapped in the next section's colour
          (surface-mineral) for the same rounded-corner reveal used at
          every section boundary on the homepage. */}
      <div className="bg-surface-mineral">
        <section className="overflow-hidden rounded-b-[32px] bg-white px-[5vw] py-20">
          <Reveal className="mx-auto mb-12 max-w-[640px] text-center">
            <h2 className="text-3xl font-medium text-ink sm:text-4xl">What are you powering?</h2>
            {batteryManufacturing && <p className="mt-4 text-body">{batteryManufacturing.description}</p>}
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
      </div>

      {/* Battery Solutions — wrapped in white (section 4's colour). */}
      <div className="bg-white">
        <section className="overflow-hidden rounded-b-[32px] bg-surface-mineral px-[5vw] py-20">
          <Reveal className="mb-14">
            <div className="mb-2 text-xs font-medium tracking-[0.08em] text-grey-600 uppercase">Battery solutions</div>
            <h2 className="max-w-2xl text-3xl font-medium text-ink sm:text-4xl">
              Engineered energy for real applications.
            </h2>
            <p className="mt-4 max-w-xl text-body">
              Our battery systems are designed around the energy, power and operating requirements of the
              application.
            </p>
          </Reveal>

          <div className="flex flex-col gap-16">
            {BATTERY_PRODUCT_LINES.map((line, i) => (
              <Reveal key={line.id} delay={i * 0.06}>
                <a href="/products" className="group grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
                  <div className={`aspect-[4/3] w-full overflow-hidden rounded-2xl bg-grey-100 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                    {line.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img loading="lazy" decoding="async"
                        src={line.image}
                        alt={line.name}
                        className="h-full w-full object-contain p-8 transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 border border-dashed border-grey-300 text-center text-grey-500">
                        <span className="text-[11px] font-medium tracking-[0.15em] uppercase opacity-70">Pending</span>
                        <span className="text-xs">Product photography</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-3xl font-medium text-ink sm:text-4xl">{line.name}</h3>
                    {line.description ? (
                      <p className="mt-3 max-w-md text-body">{line.description}</p>
                    ) : (
                      <span className="mt-3 block text-[11px] font-medium tracking-[0.15em] text-grey-400 uppercase">Pending</span>
                    )}
                    <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand">
                      Explore solution
                      <span className="transition-transform duration-300 ease-out group-hover:translate-x-1" aria-hidden="true">
                        &rarr;
                      </span>
                    </span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </section>
      </div>

      {/* Built around your application — wrapped in surface-mineral
          (section 5's colour). */}
      <div className="bg-surface-mineral">
        <section className="overflow-hidden rounded-b-[32px] bg-white px-[5vw] py-20">
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
      </div>

      {/* Built to power more — wrapped in white (section 6's colour). */}
      <div className="bg-white">
        <section className="overflow-hidden rounded-b-[32px] bg-surface-mineral px-[5vw] py-20">
          <Reveal className="mb-10 text-center">
            <h2 className="text-3xl font-medium text-ink sm:text-4xl">Built to power more.</h2>
            <p className="mx-auto mt-4 max-w-lg text-body">
              A battery becomes valuable when it performs where it is needed.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="mx-auto max-w-[900px] overflow-hidden rounded-2xl bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img loading="lazy" decoding="async" src={CINEMATIC_BATTERY_IMAGE} alt="Battery Pack" className="aspect-[16/10] w-full object-contain p-10" />
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
      </div>

      {/* From requirement to deployment — wrapped in surface-mineral
          (section 7's colour). */}
      <div className="bg-surface-mineral">
        <section className="overflow-hidden rounded-b-[32px] bg-white px-[5vw] py-20">
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
      </div>

      {/* Final CTA — wrapped in the next section's colour (GetInTouch's
          brand green) for the same rounded-corner reveal. */}
      <div className="bg-brand">
        <section className="overflow-hidden rounded-b-[32px] bg-surface-mineral px-[5vw] py-20 text-center">
          <Reveal>
            <h2 className="text-3xl font-medium text-ink sm:text-4xl">Have an application in mind?</h2>
            <p className="mx-auto mt-4 max-w-lg text-body">
              Tell us what you need to power. We&rsquo;ll explore the right battery solution with you.
            </p>
            <EnquiryButton label="Talk to our battery team" onClick={() => setEnquiryOpen(true)} className="mx-auto mt-8 w-fit" />
          </Reveal>
        </section>
      </div>

      <GetInTouch />

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
      />
    </PageShell>
  );
}
