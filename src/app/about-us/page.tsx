import { PageShell } from "@/components/layout/PageShell";
import { PartnerHero } from "@/components/partner/PartnerHero";
import { Reveal } from "@/components/ui/Reveal";
import { Grain } from "@/components/ui/Grain";
import { GetInTouch } from "@/components/cta/GetInTouch";
import { WhatWeDoList } from "@/components/about/WhatWeDoList";
import { PlaceViewer } from "@/components/about/PlaceViewer";
import { VisionStatements } from "@/components/about/VisionStatements";
import {
  ABOUT_HERO,
  ABOUT_TAGLINE,
  ABOUT_INTRO_PARAGRAPHS,
  ABOUT_INTRO_EMPHASIS,
  ABOUT_INTRO_CLOSING,
  ABOUT_QUICK_FACTS,
  ABOUT_LEGACY_PARAGRAPHS,
  ABOUT_WHAT_WE_DO_INTRO,
  ABOUT_FLOW_INTRO,
  ABOUT_FLOW_STAGES,
  ABOUT_FLOW_CLOSING,
  ABOUT_APPROACH,
  ABOUT_JOURNEY,
  ABOUT_LEADERSHIP,
  ABOUT_VISION_HEADLINE,
  ABOUT_VISION_LINES,
  ABOUT_VISION_CLOSING,
  ABOUT_MISSION,
  ABOUT_VALUES,
} from "@/lib/content";

// Story first: the belief, the people, the vision, where it comes from, what
// is done, where it happens, how the work is done, who leads it.
export default function AboutUs() {
  return (
    <PageShell hideNav>
      <PartnerHero
        eyebrow={ABOUT_HERO.eyebrow}
        headline={ABOUT_HERO.headline}
        image="/images/about/facility-gate.webp"
        description={ABOUT_TAGLINE}
        ctaLabel="Get in touch"
        ctaHref="/contact"
      />

      {/* 01 The belief — cylib's own real technique (not a manually
          colour-matched wrapper): stays above section 02 in z-index, and
          section 02 is pulled up underneath it with a negative top
          margin, so this section's own rounded corner reveals section
          02's *real* background through its notch. */}
      <section className="relative z-10 overflow-hidden rounded-b-[32px] bg-white px-[5vw] py-24 sm:py-32">
        <div className="mx-auto max-w-[1328px]">
          <Reveal>
            <h2 className="max-w-[16ch] text-5xl leading-[1.02] font-medium text-ink sm:text-7xl lg:text-8xl">{ABOUT_INTRO_EMPHASIS}</h2>
          </Reveal>
          <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-24">
            <Reveal delay={0.05} className="space-y-6 text-lg leading-relaxed text-grey-700">
              {ABOUT_INTRO_PARAGRAPHS.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-2xl leading-snug font-medium text-brand sm:text-3xl">{ABOUT_INTRO_CLOSING}</p>
            </Reveal>
          </div>
          <Reveal delay={0.15} className="mt-20 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-grey-200 pt-10 sm:grid-cols-4">
            {ABOUT_QUICK_FACTS.map((fact) => (
              <div key={fact.label}>
                <div className="text-xs font-medium tracking-[0.12em] text-grey-500 uppercase">{fact.label}</div>
                <div className="mt-2 text-xl font-medium text-ink sm:text-2xl">{fact.value}</div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 02 What we do — moved here (was section 05) to stand in for the
          team photo, at the user's direction. Same chained overlap:
          tucked under section 01, stays above section 03. */}
      <section className="relative z-10 -mt-10 overflow-hidden rounded-b-[32px] bg-white px-[5vw] py-24 sm:py-32">
        <Reveal className="mx-auto mb-16 max-w-[1328px]">
          <h2 className="max-w-[20ch] text-4xl leading-[1.05] font-medium text-ink sm:text-6xl">What we do.</h2>
          <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-grey-600">{ABOUT_WHAT_WE_DO_INTRO}</p>
        </Reveal>
        <WhatWeDoList />
      </section>

      {/* 03 Vision and mission — same chained overlap: tucked under
          section 02, stays above section 04. */}
      <section className="rounded-b-[32px] relative z-10 -mt-10 overflow-hidden bg-brand px-[5vw] py-24 sm:py-32">
        <Grain opacity={0.05} />
        <div className="relative mx-auto max-w-[1328px]">
          <Reveal>
            <h2 className="max-w-[18ch] text-5xl leading-[1.02] font-medium text-white sm:text-7xl lg:text-8xl">{ABOUT_VISION_HEADLINE}</h2>
          </Reveal>
          <div className="mt-16 grid gap-14 md:grid-cols-2 md:gap-20">
            <Reveal>
              <VisionStatements statements={ABOUT_VISION_LINES} />
            </Reveal>
            <Reveal delay={0.1} className="md:border-l md:border-white/25 md:pl-16">
              <h3 className="text-sm font-medium tracking-[0.12em] text-white/60 uppercase">Our mission</h3>
              <p className="mt-6 text-xl leading-snug font-medium text-white sm:text-2xl">{ABOUT_MISSION}</p>
              <p className="mt-8 text-base font-semibold text-white/90">{ABOUT_VISION_CLOSING}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 04 The SAGE legacy and the journey — same chained overlap: tucked
          under section 03, stays above section 05. */}
      <section className="overflow-clip rounded-b-[32px] relative z-10 -mt-10 bg-surface-mineral px-[5vw] py-24 sm:py-32">
        <div className="mx-auto grid max-w-[1328px] gap-16 lg:grid-cols-2 lg:gap-24">
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="text-4xl leading-[1.05] font-medium text-ink sm:text-6xl">Powered by the legacy of SAGE.</h2>
            <div className="mt-8 max-w-[52ch] space-y-5 text-base leading-relaxed text-grey-700">
              {ABOUT_LEGACY_PARAGRAPHS.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Reveal>
          <ol className="border-t border-grey-300">
            {ABOUT_JOURNEY.map((m) => (
              <Reveal as="li" key={m.year} className="grid grid-cols-[6.5rem_1fr] items-baseline gap-x-6 border-b border-grey-300 py-8 sm:grid-cols-[9rem_1fr]">
                <div className="text-4xl leading-none font-semibold text-brand sm:text-6xl">{m.year}</div>
                <div>
                  <h3 className="text-xl font-medium text-ink sm:text-2xl">{m.title}</h3>
                  <p className="mt-2 max-w-[46ch] text-base leading-relaxed text-grey-600">{m.description}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 05 From waste to resources — the team-photo section that used to
          sit here was removed at the user's direction. Same chained
          overlap: tucked under section 04, stays above section 06. */}
      <section className="relative z-10 -mt-10 overflow-hidden rounded-b-[32px] bg-surface-mineral px-[5vw] py-24 sm:py-32">
        <div className="mx-auto max-w-[1328px]">
          <Reveal>
            <p className="max-w-[22ch] text-4xl leading-[1.08] font-medium text-ink sm:text-6xl">{ABOUT_FLOW_INTRO[0]}</p>
            <p className="mt-6 text-4xl leading-[1.08] font-medium text-brand sm:text-6xl">{ABOUT_FLOW_INTRO[1]}</p>
          </Reveal>
          <ol className="mt-20 grid grid-cols-2 border-t border-grey-300 sm:grid-cols-3 lg:grid-cols-6">
            {ABOUT_FLOW_STAGES.map((stage, i) => (
              <Reveal as="li" key={stage} delay={i * 0.05} className="border-b border-grey-300 py-6 pr-4">
                <span className="block text-xs font-medium text-grey-400 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span className="mt-2 block text-lg font-medium text-ink">{stage}</span>
              </Reveal>
            ))}
          </ol>
          <Reveal className="mt-16 grid gap-6 text-base leading-relaxed text-grey-600 lg:grid-cols-2 lg:gap-24">
            {ABOUT_FLOW_CLOSING.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 06 Where it happens — same chained overlap: tucked under section
          05, stays above section 07. */}
      <section className="rounded-b-[32px] relative z-10 -mt-10 overflow-hidden bg-grey-900 px-[5vw] py-24 sm:py-32">
        <Grain opacity={0.05} />
        <div className="relative">
          <Reveal className="mx-auto mb-10 max-w-[1328px]">
            <h2 className="text-4xl leading-[1.05] font-medium text-white sm:text-6xl">Where it happens.</h2>
          </Reveal>
          <Reveal delay={0.05}>
            <PlaceViewer />
          </Reveal>
        </div>
      </section>

      {/* 07 How we work: approach and values — same chained overlap:
          tucked under section 06, stays above section 08. */}
      <section className="relative z-10 -mt-10 overflow-hidden rounded-b-[32px] bg-white px-[5vw] py-24 sm:py-32">
        <div className="mx-auto max-w-[1328px]">
          <Reveal className="mb-14">
            <h2 className="text-4xl leading-[1.05] font-medium text-ink sm:text-6xl">How we work.</h2>
          </Reveal>
          <div className="grid gap-x-16 gap-y-12 md:grid-cols-2">
            {ABOUT_APPROACH.map((pillar, i) => (
              <Reveal key={pillar.title} delay={i * 0.05}>
                <h3 className="text-2xl font-medium text-ink sm:text-3xl">{pillar.title}</h3>
                <p className="mt-3 max-w-[52ch] text-base leading-relaxed text-grey-600">{pillar.description}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-20 border-t border-grey-300 pt-8">
            <h3 className="mb-8 text-sm font-medium tracking-[0.12em] text-grey-600 uppercase">What we hold to</h3>
            <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
              {ABOUT_VALUES.map((v) => (
                <div key={v.title}>
                  <div className="text-xl font-semibold text-brand">{v.title}</div>
                  <p className="mt-1 text-sm leading-relaxed text-grey-600">{v.description}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 09 Leadership — the closing section that used to follow here was
          removed at the user's direction, so this is now the last section
          before GetInTouch. Same chained overlap: tucked under section
          08, and stays above GetInTouch (passed its own `overlap` prop
          below) in z-index so this last rounded corner reveals
          GetInTouch's real brand-green background too. */}
      <section className="relative z-10 -mt-10 overflow-hidden rounded-b-[32px] bg-surface-mineral px-[5vw] py-24 sm:py-32">
        <div className="mx-auto grid max-w-[1328px] items-center gap-12 lg:grid-cols-2 lg:gap-24">
          <Reveal className="order-2 lg:order-1">
            <h2 className="text-sm font-medium tracking-[0.12em] text-grey-600 uppercase">Leadership</h2>
            <h3 className="mt-6 text-4xl leading-[1.05] font-medium text-ink sm:text-6xl">{ABOUT_LEADERSHIP.name}</h3>
            <p className="mt-3 text-sm font-medium tracking-[0.1em] text-brand uppercase">{ABOUT_LEADERSHIP.title}</p>
            <div className="mt-8 max-w-[52ch] space-y-4 text-base leading-relaxed text-grey-700">
              {ABOUT_LEADERSHIP.bio.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1} className="order-1 lg:order-2">
            <div className="relative aspect-[2/3] overflow-hidden bg-grey-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/team/leadership.webp"
                alt={`${ABOUT_LEADERSHIP.name}, ${ABOUT_LEADERSHIP.title}, seated portrait`}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <GetInTouch overlap />
    </PageShell>
  );
}
