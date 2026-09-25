import { PageShell } from "@/components/layout/PageShell";
import { Eyebrow } from "@/components/solutions/Eyebrow";
import { SolutionCta, SolutionHero } from "@/components/solutions/SolutionEnquiry";
import { Grain } from "@/components/ui/Grain";
import { Reveal } from "@/components/ui/Reveal";
import { REVERSE_LOGISTICS as C, MODALS } from "@/lib/solutions-content";

// Reverse Logistics — movement, infrastructure, traceability. A flow page:
// the challenge, who it is for, what is managed, the flow itself, what each
// input becomes, and why visibility matters.
export default function ReverseLogistics() {
  return (
    <PageShell hideNav>
      <SolutionHero
        eyebrow={C.hero.eyebrow}
        headline={C.hero.headline}
        image="/images/partner/recycle.webp"
        description={C.hero.description}
        ctaLabel={C.hero.ctaLabel}
        modal={MODALS.reverseLogistics}
      />

      {/* The challenge */}
      <section className="bg-white px-[5vw] py-32">
        <div className="mx-auto max-w-[1000px]">
          <Reveal>
            <Eyebrow>{C.challenge.eyebrow}</Eyebrow>
          </Reveal>
          <div className="space-y-8">
            {C.challenge.lines.map((line, i) => (
              <Reveal key={line} delay={i * 0.08}>
                <p
                  className={`text-3xl leading-[1.15] font-medium sm:text-5xl ${
                    i === 0 ? "text-grey-400" : i === 1 ? "text-ink" : "text-brand"
                  }`}
                >
                  {line}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Who needs it */}
      <section className="bg-surface-mineral px-[5vw] py-28">
        <div className="mx-auto grid max-w-[1328px] gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
          <Reveal>
            <Eyebrow>{C.who.eyebrow}</Eyebrow>
            <h2 className="max-w-[14ch] text-4xl leading-[1.08] font-medium text-ink sm:text-5xl">{C.who.headline}</h2>
          </Reveal>
          <ul className="border-t border-grey-300">
            {C.who.groups.map((g, i) => (
              <Reveal as="li" key={g} delay={i * 0.04} className="flex items-baseline gap-6 border-b border-grey-300 py-5">
                  <span className="text-xs font-medium text-grey-400">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-xl font-medium text-ink sm:text-2xl">{g}</span>
                </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* What we help manage */}
      <section className="bg-white px-[5vw] py-28">
        <div className="mx-auto max-w-[1328px]">
          <Reveal className="mb-14 max-w-[820px]">
            <Eyebrow>{C.manage.eyebrow}</Eyebrow>
            <h2 className="text-4xl leading-[1.08] font-medium text-ink sm:text-5xl">{C.manage.headline}</h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-x-16 md:grid-cols-2">
            {C.manage.items.map((item, i) => (
              <Reveal key={item.title} delay={(i % 2) * 0.06}>
                <div className="grid gap-2 border-t border-grey-200 py-8 sm:grid-cols-[minmax(0,180px)_1fr] sm:gap-8">
                  <h3 className="text-xl font-bold text-ink">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-grey-600">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How the flow works */}
      <section className="relative overflow-hidden bg-grey-900 px-[5vw] py-28">
        <Grain opacity={0.05} />
        <div className="relative mx-auto grid max-w-[1328px] gap-14 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-24">
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <Eyebrow light>{C.flow.eyebrow}</Eyebrow>
            <h2 className="text-4xl leading-[1.08] font-medium text-white sm:text-5xl">{C.flow.headline}</h2>
            <p className="mt-6 max-w-[40ch] text-base leading-relaxed text-white/60">{C.flow.note}</p>
          </Reveal>
          <ol className="relative border-l border-white/20">
            {C.flow.steps.map((step, i) => (
              <Reveal as="li" key={step.title} delay={0.02} className="relative pb-12 pl-10 last:pb-0 sm:pl-14">
                  <span className="absolute top-2 -left-[5px] h-2.5 w-2.5 rounded-full bg-brand-hover" aria-hidden="true" />
                  <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
                    <span className="text-xs font-medium tracking-[0.12em] text-white/40">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="text-3xl font-semibold tracking-[0.02em] text-white uppercase sm:text-5xl">{step.title}</h3>
                  </div>
                  <p className="mt-2 text-sm text-white/60 sm:ml-[3.25rem]">{step.description}</p>
                </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Different inputs, different pathways */}
      <section className="bg-surface-mineral px-[5vw] py-28">
        <div className="mx-auto max-w-[1328px]">
          <Reveal className="mb-14 max-w-[820px]">
            <Eyebrow>{C.pathways.eyebrow}</Eyebrow>
            <h2 className="text-4xl leading-[1.08] font-medium text-ink sm:text-5xl">{C.pathways.headline}</h2>
          </Reveal>
          <div className="grid gap-x-16 md:grid-cols-2">
            {C.pathways.items.map((p, i) => (
              <Reveal key={p.from} delay={(i % 2) * 0.06}>
                <div className="border-t border-grey-300 py-9">
                  <div className="text-lg font-medium text-grey-600">{p.from}</div>
                  <div className="mt-2 flex items-center gap-4 text-3xl font-semibold text-brand sm:text-4xl">
                    <span aria-hidden="true">&rarr;</span>
                    {p.to}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Traceability */}
      <section className="bg-white px-[5vw] py-28">
        <div className="mx-auto grid max-w-[1328px] items-center gap-16 lg:grid-cols-[1.2fr_minmax(0,380px)] lg:gap-24">
          <div>
            <Reveal>
              <Eyebrow>{C.traceability.eyebrow}</Eyebrow>
              <h2 className="max-w-[18ch] text-4xl leading-[1.08] font-medium text-ink sm:text-5xl">{C.traceability.headline}</h2>
              <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-grey-600">{C.traceability.body}</p>
            </Reveal>
            <div className="relative mt-14">
            <span className="absolute top-[5px] right-0 left-0 hidden h-px bg-grey-300 sm:block" aria-hidden="true" />
            <ol className="relative grid gap-8 sm:grid-cols-5 sm:gap-4">
              {C.traceability.markers.map((m, i) => (
                <Reveal as="li" key={m} delay={i * 0.06} className="relative">
                    <span className="relative z-10 mb-4 block h-2.5 w-2.5 rounded-full bg-brand" aria-hidden="true" />
                    <span className="text-sm font-medium tracking-[0.06em] text-ink uppercase">{m}</span>
                  </Reveal>
              ))}
            </ol>
            </div>
          </div>
          <Reveal>
            <div className="relative aspect-[3/4] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/story/end-of-life-batteries.webp"
                alt="A collection bin of spent batteries feeding a conveyor in a recycling hall"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Why it matters */}
      <section className="relative overflow-hidden bg-grey-900 px-[5vw] py-28">
        <Grain opacity={0.05} />
        <div className="relative mx-auto grid max-w-[1328px] gap-16 lg:grid-cols-2 lg:gap-24">
          <Reveal>
            <Eyebrow light>{C.matters.eyebrow}</Eyebrow>
            <ul className="border-t border-white/15">
              {C.matters.items.map((item) => (
                <li key={item} className="border-b border-white/15 py-5 text-2xl font-medium text-white sm:text-3xl">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1} className="lg:pt-10">
            <p className="max-w-[44ch] text-lg leading-relaxed text-white/70">{C.matters.reach.body}</p>
            <div className="mt-10 grid grid-cols-2 gap-8">
              {C.matters.reach.stats.map((s) => (
                <div key={s.label} className="border-t border-white/20 pt-5">
                  <div className="text-5xl font-bold text-white sm:text-6xl">{s.value}</div>
                  <div className="mt-2 text-xs tracking-[0.1em] text-white/50 uppercase">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <SolutionCta headline={C.cta.headline} description={C.cta.description} ctaLabel={C.cta.ctaLabel} modal={MODALS.reverseLogistics} />
    </PageShell>
  );
}
