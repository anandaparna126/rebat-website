import { PageShell } from "@/components/layout/PageShell";
import { PartnerHero } from "@/components/partner/PartnerHero";
import { Reveal } from "@/components/ui/Reveal";
import { Grain } from "@/components/ui/Grain";
import { GetInTouch } from "@/components/cta/GetInTouch";
import {
  ABOUT_HERO,
  ABOUT_TAGLINE,
  ABOUT_INTRO_PARAGRAPHS,
  ABOUT_INTRO_EMPHASIS,
  ABOUT_INTRO_CLOSING,
  ABOUT_LEGACY_PARAGRAPHS,
  ABOUT_WHAT_WE_DO_INTRO,
  ABOUT_WHAT_WE_DO,
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
  ABOUT_CLOSING_HEADLINE,
  ABOUT_CLOSING_PARAGRAPHS,
  ABOUT_CLOSING_RHYTHM,
  ABOUT_CLOSING_TAGLINE,
} from "@/lib/content";

// Panel colours for the "Our Approach" pillars — the same homepage Impact
// palette reused for the enquiry modals (see EnquiryModal call sites), not
// a fresh set invented for this page.
const APPROACH_PANELS: { bg: string; light: boolean }[] = [
  { bg: "linear-gradient(150deg, #B9C8C5, #C9D5D2)", light: false },
  { bg: "linear-gradient(150deg, #376F63, #2A5951)", light: true },
  { bg: "linear-gradient(150deg, #DDD5C4, #EAE4D6)", light: false },
  { bg: "linear-gradient(150deg, #343A38, #242826)", light: true },
];

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

      {/* About ReBAT */}
      <section className="bg-white px-[5vw] py-24">
        <Reveal className="mx-auto max-w-[760px]">
          <div className="mb-3 text-xs font-medium tracking-[0.08em] text-grey-600 uppercase">About ReBAT</div>
          <div className="space-y-5 text-lg leading-relaxed text-grey-700">
            {ABOUT_INTRO_PARAGRAPHS.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <p className="mt-8 text-xl font-bold text-brand sm:text-2xl">{ABOUT_INTRO_EMPHASIS}</p>
          <p className="mt-3 text-base leading-relaxed text-grey-600">{ABOUT_INTRO_CLOSING}</p>
        </Reveal>
      </section>

      {/* Powered by the Legacy of SAGE */}
      <section className="bg-surface-mineral px-[5vw] py-24">
        <Reveal className="mx-auto max-w-[760px]">
          <div className="mb-3 text-xs font-medium tracking-[0.08em] text-grey-600 uppercase">Powered by the Legacy of SAGE</div>
          <div className="space-y-5 text-lg leading-relaxed text-grey-700">
            {ABOUT_LEGACY_PARAGRAPHS.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Reveal>
      </section>

      {/* What We Do */}
      <section className="bg-white px-[5vw] py-24">
        <Reveal className="mx-auto mb-12 max-w-[700px] text-center">
          <div className="mb-3 text-xs font-medium tracking-[0.08em] text-grey-600 uppercase">What We Do</div>
          <p className="text-lg text-grey-700">{ABOUT_WHAT_WE_DO_INTRO}</p>
        </Reveal>
        <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ABOUT_WHAT_WE_DO.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.05} className="rounded-2xl border border-grey-200 bg-grey-50 p-7">
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="mb-2 text-base font-bold text-ink">{item.title}</h3>
              <p className="text-sm leading-relaxed text-grey-600">{item.description}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* From Battery Waste to Valuable Resources */}
      <section className="bg-grey-50 px-[5vw] py-24">
        <Reveal className="mx-auto max-w-[720px] text-center">
          <div className="mb-3 text-xs font-medium tracking-[0.08em] text-grey-600 uppercase">
            From Battery Waste to Valuable Resources
          </div>
          <p className="text-2xl font-medium text-ink sm:text-3xl">{ABOUT_FLOW_INTRO[0]}</p>
          <p className="mt-1 text-2xl font-medium text-brand sm:text-3xl">{ABOUT_FLOW_INTRO[1]}</p>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-14 flex max-w-[1100px] flex-wrap items-center justify-center gap-x-2 gap-y-4">
          {ABOUT_FLOW_STAGES.map((stage, i) => (
            <div key={stage} className="flex items-center gap-2">
              <span className="rounded-full border border-grey-200 bg-white px-4 py-2 text-sm font-medium text-ink">{stage}</span>
              {i < ABOUT_FLOW_STAGES.length - 1 && (
                <span className="text-grey-400" aria-hidden="true">
                  &rarr;
                </span>
              )}
            </div>
          ))}
        </Reveal>

        <Reveal delay={0.15} className="mx-auto mt-14 max-w-[680px] space-y-4 text-center text-base leading-relaxed text-grey-600">
          {ABOUT_FLOW_CLOSING.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </Reveal>
      </section>

      {/* Our Approach */}
      <section className="bg-white px-[5vw] py-24">
        <Reveal className="mb-12 text-center">
          <div className="mb-3 text-xs font-medium tracking-[0.08em] text-grey-600 uppercase">Our Approach</div>
        </Reveal>
        <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-5 sm:grid-cols-2">
          {ABOUT_APPROACH.map((pillar, i) => {
            const panel = APPROACH_PANELS[i];
            return (
              <Reveal key={pillar.title} delay={i * 0.06}>
                <div className="h-full rounded-2xl p-8" style={{ background: panel.bg }}>
                  <h3 className={`text-xl font-bold ${panel.light ? "text-white" : "text-ink"}`}>{pillar.title}</h3>
                  <p className={`mt-3 text-sm leading-relaxed ${panel.light ? "text-white/80" : "text-ink/70"}`}>
                    {pillar.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Our Journey */}
      <section className="bg-grey-50 px-[5vw] py-24">
        <Reveal className="mb-14 text-center">
          <div className="mb-3 text-xs font-medium tracking-[0.08em] text-grey-600 uppercase">Our Journey</div>
        </Reveal>
        <div className="relative mx-auto max-w-[1000px]">
          <div className="absolute top-[22px] right-0 left-0 hidden h-px bg-grey-200 sm:block" aria-hidden="true" />
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            {ABOUT_JOURNEY.map((m, i) => (
              <Reveal key={m.year} delay={i * 0.08}>
                <div className="relative z-10 mb-4 flex justify-center sm:justify-start">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-sm font-bold text-white ring-4 ring-grey-50">
                    {i + 1}
                  </span>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-xs font-medium tracking-[0.1em] text-brand uppercase">{m.year}</div>
                  <h3 className="mt-1 text-xl font-bold text-ink">{m.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-grey-600">{m.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership — no photo supplied, an initials mark stands in rather
          than inventing or sourcing a stock headshot. */}
      <section className="relative overflow-hidden bg-grey-900 px-[5vw] py-24">
        <Grain opacity={0.05} />
        <Reveal className="relative mx-auto flex max-w-[720px] flex-col items-center text-center">
          <div className="mb-3 text-xs font-medium tracking-[0.08em] text-white/50 uppercase">Leadership</div>
          <span
            className="mb-6 flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-white"
            style={{ background: "linear-gradient(155deg, var(--brand-hover), var(--brand-deep))" }}
          >
            {ABOUT_LEADERSHIP.initials}
          </span>
          <h3 className="text-2xl font-bold text-white sm:text-3xl">{ABOUT_LEADERSHIP.name}</h3>
          <p className="mt-1 text-sm font-medium tracking-[0.08em] text-gold uppercase">{ABOUT_LEADERSHIP.title}</p>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-white/70">
            {ABOUT_LEADERSHIP.bio.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Our Vision + Our Mission */}
      <section className="relative overflow-hidden bg-brand px-[5vw] py-24 text-center">
        <Grain opacity={0.05} />
        <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
          <circle cx="90%" cy="8%" r="200" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="8 8" opacity="0.12" />
          <circle cx="4%" cy="96%" r="140" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="8 8" opacity="0.1" />
        </svg>
        <Reveal className="relative mx-auto max-w-[720px]">
          <div className="mb-3 text-xs font-medium tracking-[0.08em] text-white/60 uppercase">Our Vision</div>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">{ABOUT_VISION_HEADLINE}</h2>
          <div className="mt-6 space-y-2 text-lg text-white/85">
            {ABOUT_VISION_LINES.map((l, i) => (
              <p key={i}>{l}</p>
            ))}
          </div>
          <p className="mt-6 text-lg font-medium text-white">{ABOUT_VISION_CLOSING}</p>

          <div className="mx-auto mt-14 max-w-[620px] border-t border-white/15 pt-10">
            <div className="mb-3 text-xs font-medium tracking-[0.08em] text-white/60 uppercase">Our Mission</div>
            <p className="text-base leading-relaxed text-white/85">{ABOUT_MISSION}</p>
          </div>
        </Reveal>
      </section>

      {/* Our Values */}
      <section className="bg-white px-[5vw] py-24">
        <Reveal className="mb-12 text-center">
          <div className="mb-3 text-xs font-medium tracking-[0.08em] text-grey-600 uppercase">Our Values</div>
        </Reveal>
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {ABOUT_VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.05} className="border-t-2 border-brand pt-4">
              <h3 className="mb-2 text-base font-bold text-ink">{v.title}</h3>
              <p className="text-sm leading-relaxed text-grey-600">{v.description}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Closing statement */}
      <section className="relative overflow-hidden bg-grey-900 px-[5vw] py-28 text-center">
        <Grain opacity={0.06} />
        <Reveal className="relative mx-auto max-w-[720px]">
          <h2 className="text-3xl font-medium text-white sm:text-4xl">{ABOUT_CLOSING_HEADLINE}</h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-white/70">
            {ABOUT_CLOSING_PARAGRAPHS.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-lg font-bold tracking-[0.04em] text-white uppercase">
            {ABOUT_CLOSING_RHYTHM.map((w, i) => (
              <span key={w} className="flex items-center gap-3">
                {i > 0 && <span className="h-1 w-1 rounded-full bg-gold" aria-hidden="true" />}
                {w}
              </span>
            ))}
          </div>
          <p className="mt-8 text-sm font-medium tracking-[0.08em] text-white/50 uppercase">ReBAT: {ABOUT_CLOSING_TAGLINE}</p>
        </Reveal>
      </section>

      <GetInTouch />
    </PageShell>
  );
}
