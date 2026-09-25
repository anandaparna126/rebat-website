import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { Eyebrow } from "@/components/solutions/Eyebrow";
import { ReducedMotion } from "@/components/solutions/ReducedMotion";
import { SolutionCta, SolutionHero } from "@/components/solutions/SolutionEnquiry";
import { Grain } from "@/components/ui/Grain";
import { Reveal } from "@/components/ui/Reveal";
import { BATTERY_DESIGN as C, MODALS } from "@/lib/solutions-content";

export const metadata: Metadata = {
  title: C.meta.title,
  description: C.meta.description,
};

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand focus-visible:outline-solid";

// Battery Design — engineering, architecture, precision. The story runs:
// what needs powering -> what the application demands -> how the battery is
// architected -> how it is checked against the requirement -> where it sits
// in the larger battery lifecycle. Technical in character, restrained in
// colour: graphite and warm mineral white, with emerald as an accent only.
export default function BatteryDesign() {
  const considerations = C.application.considerations;
  const left = considerations.slice(0, 3);
  const right = considerations.slice(3);

  return (
    <ReducedMotion>
      <PageShell hideNav>
        <SolutionHero
          eyebrow={C.hero.eyebrow}
          headline={C.hero.headline}
          image="/images/solutions/hero.webp"
          description={C.hero.description}
          ctaLabel={C.hero.ctaLabel}
          modal={MODALS.batteryDesign}
        />

        {/* 02 — The application: a central photograph, the six considerations
            either side, joined by thin rules. */}
        <section aria-labelledby="bd-application" className="bg-surface-mineral px-[5vw] py-28 sm:py-36">
          <div className="mx-auto max-w-[1328px]">
            <Reveal className="mx-auto mb-20 max-w-[860px] text-center">
              <div className="flex justify-center">
                <Eyebrow>{C.application.eyebrow}</Eyebrow>
              </div>
              <h2 id="bd-application" className="text-4xl leading-[1.06] font-medium text-ink sm:text-6xl">
                {C.application.headline}
              </h2>
              <p className="mx-auto mt-8 max-w-[56ch] text-lg leading-relaxed text-grey-600">{C.application.body}</p>
            </Reveal>

            <div className="grid items-center gap-12 lg:grid-cols-[1fr_minmax(0,440px)_1fr] lg:gap-10">
              <ul className="order-2 grid gap-px lg:order-1">
                {left.map((label, i) => (
                  <Reveal as="li" key={label} delay={i * 0.06} className="flex items-center gap-5 py-6 lg:justify-end">
                    <span className="text-xs font-medium tracking-[0.14em] text-grey-400 lg:order-3">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-2xl font-semibold tracking-[0.03em] text-ink uppercase sm:text-3xl lg:order-1">{label}</span>
                    <span className="hidden h-px w-16 bg-grey-400 lg:order-2 lg:block xl:w-24" aria-hidden="true" />
                  </Reveal>
                ))}
              </ul>

              <Reveal className="order-1 lg:order-2">
                <figure className="relative">
                  <div className="relative aspect-[3/4] overflow-hidden bg-grey-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={C.application.figure.src}
                      alt={C.application.figure.alt}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                  <figcaption className="absolute bottom-0 left-0 bg-surface-mineral px-5 py-3 text-xs font-medium tracking-[0.18em] text-ink uppercase">
                    {C.application.figure.label}
                  </figcaption>
                </figure>
              </Reveal>

              <ul className="order-3 grid gap-px">
                {right.map((label, i) => (
                  <Reveal as="li" key={label} delay={i * 0.06} className="flex items-center gap-5 py-6">
                    <span className="hidden h-px w-16 bg-grey-400 lg:block xl:w-24" aria-hidden="true" />
                    <span className="text-xs font-medium tracking-[0.14em] text-grey-400 lg:hidden">{String(i + 4).padStart(2, "0")}</span>
                    <span className="text-2xl font-semibold tracking-[0.03em] text-ink uppercase sm:text-3xl">{label}</span>
                    <span className="hidden text-xs font-medium tracking-[0.14em] text-grey-400 lg:inline">{String(i + 4).padStart(2, "0")}</span>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 03 — From requirement to architecture: one ruled, continuous journey. */}
        <section aria-labelledby="bd-process" className="bg-white px-[5vw] py-28 sm:py-36">
          <div className="mx-auto grid max-w-[1328px] gap-16 lg:grid-cols-[minmax(0,440px)_1fr] lg:gap-28">
            <Reveal className="lg:sticky lg:top-28 lg:self-start">
              <Eyebrow>{C.process.eyebrow}</Eyebrow>
              <h2 id="bd-process" className="text-4xl leading-[1.08] font-medium text-ink sm:text-5xl">
                {C.process.headline}
              </h2>
              <p className="mt-6 max-w-[42ch] text-base leading-relaxed text-grey-600">{C.process.body}</p>
              <p className="mt-6 max-w-[42ch] border-l-2 border-brand pl-4 text-sm leading-relaxed text-grey-500">{C.process.note}</p>
            </Reveal>
            <ol className="border-t border-grey-300">
              {C.process.steps.map((step, i) => (
                <Reveal
                  as="li"
                  key={step.title}
                  delay={0.03}
                  className="grid grid-cols-[auto_1fr] items-baseline gap-x-8 border-b border-grey-300 py-9 sm:gap-x-14"
                >
                  <span className="text-5xl font-semibold text-brand tabular-nums sm:text-7xl">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-3xl font-semibold tracking-[0.03em] text-ink uppercase sm:text-4xl">{step.title}</h3>
                    <p className="mt-3 max-w-[46ch] text-base leading-relaxed text-grey-600">{step.description}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* 04 — Battery architecture: the same photograph zoomed from cell to
            module, then the pack, then the application it serves. */}
        <section aria-labelledby="bd-architecture" className="relative overflow-hidden bg-grey-900 px-[5vw] py-28 sm:py-36">
          <Grain opacity={0.05} />
          <div className="relative mx-auto max-w-[1328px]">
            <Reveal className="mb-16 grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-24">
              <div>
                <Eyebrow light>{C.architecture.eyebrow}</Eyebrow>
                <h2 id="bd-architecture" className="text-4xl leading-[1.06] font-medium text-white sm:text-6xl">
                  {C.architecture.headline}
                </h2>
              </div>
              <p className="max-w-[48ch] text-base leading-relaxed text-white/60">{C.architecture.body}</p>
            </Reveal>

            <ol className="grid grid-cols-1 gap-x-3 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {C.architecture.levels.map((level, i) => (
                <Reveal as="li" key={level.label} delay={i * 0.08} className="group relative">
                  <div
                    className={`relative aspect-[4/5] overflow-hidden ${level.tile === "light" ? "bg-[#d8d5c9]" : "bg-[#0e1412]"}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={level.image}
                      alt={level.alt}
                      loading="lazy"
                      className={`absolute inset-0 h-full w-full transition-transform duration-[700ms] ${EASE} [transform:scale(var(--s))] group-hover:[transform:scale(calc(var(--s)*1.02))] motion-reduce:transition-none ${
                        level.tile === "light" ? "object-contain p-6" : "object-cover"
                      }`}
                      style={{ "--s": level.crop.scale, transformOrigin: level.crop.origin } as CSSProperties}
                    />
                    <span className="absolute top-4 left-4 text-xs font-medium tracking-[0.16em] text-white/70 mix-blend-difference">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="mt-5 flex items-center gap-4">
                    <h3 className="text-3xl font-semibold tracking-[0.03em] text-white uppercase sm:text-4xl">{level.label}</h3>
                    {i < C.architecture.levels.length - 1 && (
                      <span className="hidden h-px flex-1 bg-white/25 lg:block" aria-hidden="true" />
                    )}
                  </div>
                  <p className="mt-3 max-w-[30ch] text-sm leading-relaxed text-white/60">{level.description}</p>
                  {i < C.architecture.levels.length - 1 && (
                    <span className="mt-6 block text-white/30 sm:hidden" aria-hidden="true">
                      &darr;
                    </span>
                  )}
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* 05 — Designed around the real world: a large statement, then the
            six questions every design answers to. */}
        <section aria-labelledby="bd-world" className="bg-white px-[5vw] py-28 sm:py-36">
          <div className="mx-auto max-w-[1328px]">
            <Reveal>
              <Eyebrow>{C.world.eyebrow}</Eyebrow>
              <p aria-hidden="true" className="max-w-[16ch] text-5xl leading-[0.98] font-semibold tracking-[0.01em] text-grey-200 uppercase sm:text-7xl lg:text-8xl">
                {C.world.statement}
              </p>
            </Reveal>
            <div className="mt-16 grid gap-14 lg:grid-cols-[minmax(0,440px)_1fr] lg:gap-28">
              <Reveal>
                <h2 id="bd-world" className="text-3xl leading-[1.12] font-medium text-ink sm:text-4xl">
                  {C.world.headline}
                </h2>
                <p className="mt-6 max-w-[42ch] text-base leading-relaxed text-grey-600">{C.world.body}</p>
              </Reveal>
              <dl className="border-t border-grey-300">
                {C.world.factors.map((f, i) => (
                  <Reveal
                    key={f.title}
                    delay={0.02}
                    className="group grid gap-2 border-b border-grey-300 py-7 sm:grid-cols-[minmax(0,230px)_1fr] sm:items-baseline sm:gap-10"
                  >
                    <dt className="flex items-baseline gap-4 text-2xl font-semibold tracking-[0.03em] text-ink uppercase transition-colors duration-500 group-hover:text-brand sm:text-3xl">
                      <span className="text-xs font-medium tracking-[0.14em] text-grey-400">{String(i + 1).padStart(2, "0")}</span>
                      {f.title}
                    </dt>
                    <dd className="text-lg text-grey-600">{f.question}</dd>
                  </Reveal>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* 06 — Application-specific: only the applications ReBAT states. */}
        <section aria-labelledby="bd-apps" className="bg-surface-mineral py-28 sm:py-36">
          <div className="mx-auto max-w-[1328px] px-[5vw]">
            <Reveal className="mb-16 max-w-[820px]">
              <Eyebrow>{C.applications.eyebrow}</Eyebrow>
              <h2 id="bd-apps" className="text-4xl leading-[1.06] font-medium text-ink sm:text-6xl">
                {C.applications.headline}
              </h2>
              <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-grey-600">{C.applications.body}</p>
            </Reveal>
          </div>
          <div className="mx-auto max-w-[1600px]">
            {C.applications.items.map((item, i) => (
              <Reveal key={item.title} className="group grid items-stretch lg:grid-cols-12">
                <div
                  className={`relative h-[340px] overflow-hidden sm:h-[460px] lg:col-span-7 lg:h-[520px] ${i % 2 === 1 ? "lg:order-2" : ""} ${
                    item.tile === "light" ? "bg-[#d8d5c9]" : "bg-[#0e1412]"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.alt}
                    loading="lazy"
                    className={`absolute inset-0 h-full w-full transition-transform duration-[700ms] ${EASE} group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${
                      item.tile === "light" ? "object-contain p-10" : "object-cover"
                    }`}
                  />
                </div>
                <div className="flex flex-col justify-center px-[5vw] py-12 lg:col-span-5 lg:px-16">
                  <span className="text-xs font-medium tracking-[0.16em] text-grey-400">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-4 text-4xl font-semibold tracking-[0.02em] text-ink uppercase sm:text-5xl">{item.title}</h3>
                  <p className="mt-4 max-w-[30ch] text-lg leading-snug text-grey-600">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mx-auto mt-14 max-w-[1328px] px-[5vw]">
            <a href={C.applications.href} className={`group inline-flex items-center gap-2 text-sm font-medium text-brand ${FOCUS}`}>
              {C.applications.cta}
              <span aria-hidden="true" className={`transition-transform duration-500 ${EASE} group-hover:translate-x-1.5`}>
                &rarr;
              </span>
            </a>
          </div>
        </section>

        {/* 07 — Engineered system: one photograph, numbered annotations. */}
        <section aria-labelledby="bd-system" className="relative overflow-hidden bg-grey-900 px-[5vw] py-28 sm:py-36">
          <Grain opacity={0.05} />
          <div className="relative mx-auto max-w-[1328px]">
            <Reveal className="mb-14 max-w-[820px]">
              <Eyebrow light>{C.system.eyebrow}</Eyebrow>
              <h2 id="bd-system" className="text-4xl leading-[1.06] font-medium text-white sm:text-6xl">
                {C.system.headline}
              </h2>
            </Reveal>
            <Reveal>
              <figure>
                <div className="relative aspect-[4/3] overflow-hidden bg-[#0e1412] sm:aspect-[16/9]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={C.system.image}
                    alt={C.system.alt}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ objectPosition: "50% 53%" }}
                  />
                  <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black/10" />
                  {C.system.callouts.map((c, i) => (
                    <span
                      key={c.title}
                      aria-hidden="true"
                      className="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/90 bg-black/35 text-xs font-medium text-white"
                      style={{ left: `${c.x}%`, top: `${c.y}%` }}
                    >
                      {i + 1}
                    </span>
                  ))}
                </div>
                <figcaption className="mt-4 text-xs text-white/40">{C.system.note}</figcaption>
              </figure>
            </Reveal>
            <ol className="mt-10 grid gap-px border-t border-white/15 sm:grid-cols-3">
              {C.system.callouts.map((c, i) => (
                <Reveal as="li" key={c.title} delay={i * 0.06} className="border-b border-white/15 py-6 sm:pr-8">
                  <div className="flex items-baseline gap-3">
                    <span className="text-xs font-medium tracking-[0.14em] text-brand-hover">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="text-lg font-semibold tracking-[0.04em] text-white uppercase">{c.title}</h3>
                  </div>
                  <p className="mt-2 pl-8 text-sm text-white/60">{c.description}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* 08 — Engineering + validation: a short loop, kept high-level. */}
        <section aria-labelledby="bd-validation" className="bg-surface-mineral px-[5vw] py-28 sm:py-36">
          <div className="mx-auto max-w-[1328px]">
            <Reveal className="mb-16 grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-24">
              <div>
                <Eyebrow>{C.validation.eyebrow}</Eyebrow>
                <h2 id="bd-validation" className="text-4xl leading-[1.06] font-medium text-ink sm:text-6xl">
                  {C.validation.headline}
                </h2>
              </div>
              <p className="max-w-[46ch] text-base leading-relaxed text-grey-600">{C.validation.body}</p>
            </Reveal>
            <ol className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-5">
              {C.validation.steps.map((step, i) => (
                <Reveal as="li" key={step} delay={i * 0.06} className="relative border-t-2 border-ink pt-5">
                  <span className="text-xs font-medium tracking-[0.14em] text-grey-400">{String(i + 1).padStart(2, "0")}</span>
                  <div className="mt-2 text-2xl font-semibold tracking-[0.03em] text-ink uppercase">{step}</div>
                  {i < C.validation.steps.length - 1 && (
                    <span className="mt-4 block text-grey-400 sm:hidden" aria-hidden="true">
                      &darr;
                    </span>
                  )}
                </Reveal>
              ))}
            </ol>
            <Reveal delay={0.2} className="mt-3 hidden sm:block">
              <div className="mr-[20%] ml-[20%] h-4 border-x border-b border-dashed border-grey-400" aria-hidden="true" />
            </Reveal>
            <Reveal delay={0.25}>
              <p className="mt-4 text-center text-sm text-grey-500 sm:mt-3">{C.validation.loop}</p>
            </Reveal>
          </div>
        </section>

        {/* 09 — Part of a larger lifecycle. */}
        <section aria-labelledby="bd-lifecycle" className="bg-white px-[5vw] py-28 sm:py-36">
          <div className="mx-auto max-w-[1328px]">
            <Reveal className="mb-16 grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-24">
              <div>
                <Eyebrow>{C.lifecycle.eyebrow}</Eyebrow>
                <h2 id="bd-lifecycle" className="text-4xl leading-[1.06] font-medium text-ink sm:text-6xl">
                  {C.lifecycle.headline}
                </h2>
              </div>
              <p className="max-w-[48ch] text-base leading-relaxed text-grey-600">{C.lifecycle.body}</p>
            </Reveal>

            <div className="relative">
              <span className="absolute top-[13px] right-0 left-0 hidden h-px bg-grey-300 lg:block" aria-hidden="true" />
              <ol className="relative grid grid-cols-1 gap-y-9 sm:grid-cols-2 lg:grid-cols-8 lg:gap-x-4">
                {C.lifecycle.steps.map((step, i) => {
                  const isCurrent = "current" in step && step.current;
                  const inner = (
                    <>
                      <span
                        aria-hidden="true"
                        className={`relative z-10 block h-[27px] w-[27px] rounded-full border ${
                          isCurrent ? "border-brand bg-brand" : step.tag ? "border-ink bg-white" : "border-grey-300 bg-white"
                        }`}
                      />
                      <span className={`mt-5 block text-sm font-semibold tracking-[0.06em] uppercase ${step.tag ? "text-ink" : "text-grey-500"}`}>
                        {step.label}
                        {isCurrent && <span className="sr-only"> (this page)</span>}
                      </span>
                      {step.tag && (
                        <span className="mt-1 block text-[11px] tracking-[0.12em] text-grey-500 uppercase">
                          {step.tag}
                          {"note" in step && step.note ? `: ${step.note}` : ""}
                        </span>
                      )}
                    </>
                  );
                  return (
                    <Reveal as="li" key={step.label} delay={i * 0.04}>
                      {"href" in step && step.href ? (
                        <a href={step.href} className={`block ${FOCUS}`}>
                          {inner}
                        </a>
                      ) : (
                        <div>{inner}</div>
                      )}
                    </Reveal>
                  );
                })}
              </ol>
            </div>

            <Reveal delay={0.1} className="mt-10 text-sm text-grey-500">
              {C.lifecycle.epr.text}{" "}
              <a href={C.lifecycle.epr.href} className={`font-medium text-brand underline underline-offset-4 ${FOCUS}`}>
                {C.lifecycle.epr.label}
              </a>
            </Reveal>

            <div className="mt-16 grid gap-px sm:grid-cols-3">
              {C.lifecycle.images.map((img) => (
                <Reveal key={img.caption}>
                  <figure className="group relative h-[260px] overflow-hidden bg-grey-900 sm:h-[320px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading="lazy"
                      className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[700ms] ${EASE} group-hover:scale-[1.02] motion-reduce:transition-none`}
                      style={{ objectPosition: img.pos }}
                    />
                    <figcaption className="absolute bottom-0 left-0 bg-grey-900/85 px-4 py-2 text-xs tracking-[0.14em] text-white uppercase">
                      {img.caption}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <SolutionCta headline={C.cta.headline} description={C.cta.description} ctaLabel={C.cta.ctaLabel} modal={MODALS.batteryDesign} video="/videos/solutions/battery-products.mp4" />
      </PageShell>
    </ReducedMotion>
  );
}
