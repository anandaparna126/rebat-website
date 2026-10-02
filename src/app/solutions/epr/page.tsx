import { PageShell } from "@/components/layout/PageShell";
import { Eyebrow } from "@/components/solutions/Eyebrow";
import { SolutionCta, SolutionHero } from "@/components/solutions/SolutionEnquiry";
import { Grain } from "@/components/ui/Grain";
import { Reveal } from "@/components/ui/Reveal";
import { CERTIFICATIONS } from "@/lib/content";
import { PLANT } from "@/lib/plant-photos";
import { EPR as C, MODALS } from "@/lib/solutions-content";

// EPR — lifecycle, responsibility, structured information. Deliberately not a
// compliance-consulting page: it explains the responsibility, then keeps
// tying it back to the physical battery journey.
export default function EprSolution() {
  const credentials = CERTIFICATIONS.filter((c) => c.id === "epr" || c.id === "cpcb");
  return (
    <PageShell hideNav>
      <SolutionHero
        eyebrow={C.hero.eyebrow}
        headline={C.hero.headline}
        image="/images/products/hero.webp"
        description={C.hero.description}
        ctaLabel={C.hero.ctaLabel}
        modal={MODALS.epr}
      />

      {/* What EPR means */}
      <section className="bg-white px-[5vw] py-32">
        <div className="mx-auto max-w-[1000px]">
          <Reveal>
            <Eyebrow>{C.meaning.eyebrow}</Eyebrow>
            <p className="text-3xl leading-[1.15] font-medium text-ink sm:text-5xl">{C.meaning.statement}</p>
            <p className="mt-10 max-w-[60ch] text-lg leading-relaxed text-grey-600">{C.meaning.body}</p>
          </Reveal>
          <Reveal delay={0.1} className="mt-16">
            <figure>
              <div className="relative aspect-[16/9] overflow-hidden bg-grey-100 sm:aspect-[21/9]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={PLANT.workerAtTanks.src}
                  alt={PLANT.workerAtTanks.alt}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: "50% 35%" }}
                />
              </div>
              <figcaption className="mt-3 text-xs font-medium tracking-[0.1em] text-grey-500 uppercase">{PLANT.workerAtTanks.caption}</figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* Who needs it */}
      <section className="bg-surface-mineral px-[5vw] py-28">
        <div className="mx-auto max-w-[1328px]">
          <Reveal>
            <Eyebrow>{C.who.eyebrow}</Eyebrow>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-4xl leading-[1.15] font-medium text-ink sm:text-6xl">
              {C.who.audience.map((a, i) => (
                <li key={a} className="flex items-center gap-6">
                  {a}
                  {i < C.who.audience.length - 1 && (
                    <span className="text-grey-300" aria-hidden="true">
                      /
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-10 max-w-[56ch] text-base leading-relaxed text-grey-600">{C.who.note}</p>
          </Reveal>
        </div>
      </section>

      {/* From responsibility to recovery */}
      <section className="bg-white px-[5vw] py-28">
        <div className="mx-auto max-w-[1328px]">
          <Reveal className="mb-16 max-w-[820px]">
            <Eyebrow>{C.pathway.eyebrow}</Eyebrow>
            <h2 className="text-4xl leading-[1.08] font-medium text-ink sm:text-5xl">{C.pathway.headline}</h2>
            <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-grey-600">{C.pathway.note}</p>
          </Reveal>
          <div className="relative">
          <span className="absolute top-[19px] right-[6%] left-[3%] hidden h-px bg-grey-300 lg:block" aria-hidden="true" />
          <ol className="relative grid grid-cols-1 gap-10 lg:grid-cols-7 lg:gap-5">
            {C.pathway.steps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.05} className="flex gap-5 lg:block">
                  <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-grey-300 bg-white text-xs font-medium text-ink">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-ink lg:mt-6">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-grey-600">{s.description}</p>
                  </div>
                </Reveal>
            ))}
          </ol>
          </div>
        </div>
      </section>

      {/* More than paperwork */}
      <section className="relative overflow-hidden bg-grey-900 px-[5vw] py-28">
        <Grain opacity={0.05} />
        <div className="relative mx-auto max-w-[1328px]">
          <Reveal className="mb-16 max-w-[900px]">
            <Eyebrow light>{C.paperwork.eyebrow}</Eyebrow>
            <h2 className="text-3xl leading-[1.15] font-medium text-white sm:text-5xl">{C.paperwork.headline}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-col items-stretch gap-6 lg:flex-row lg:items-center lg:gap-5">
              <div className="border border-white/20 px-6 py-5 text-lg font-medium text-white lg:w-40 lg:shrink-0">{C.paperwork.start}</div>
              <span className="text-white/40 max-lg:rotate-90 max-lg:self-center" aria-hidden="true">
                &rarr;
              </span>
              <div className="flex-1 border border-white/25 p-6">
                <div className="mb-5 text-xs font-medium tracking-[0.14em] text-gold uppercase">{C.paperwork.physicalLabel}</div>
                <ol className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-3">
                  {C.paperwork.physical.map((node, i) => (
                    <li key={node} className="flex items-center gap-3">
                      <span className="text-2xl font-semibold tracking-[0.02em] text-white uppercase sm:text-3xl">{node}</span>
                      {i < C.paperwork.physical.length - 1 && (
                        <span className="text-white/40 max-lg:hidden" aria-hidden="true">
                          &rarr;
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
              <span className="text-white/40 max-lg:rotate-90 max-lg:self-center" aria-hidden="true">
                &rarr;
              </span>
              <div className="border border-white/20 px-6 py-5 text-lg font-medium text-white lg:w-52 lg:shrink-0">{C.paperwork.end}</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Traceability + visibility */}
      <section className="bg-white px-[5vw] py-28">
        <div className="mx-auto grid max-w-[1328px] gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
          <Reveal>
            <Eyebrow>{C.visibility.eyebrow}</Eyebrow>
            <h2 className="max-w-[16ch] text-4xl leading-[1.08] font-medium text-ink sm:text-5xl">{C.visibility.headline}</h2>
            <p className="mt-8 max-w-[52ch] text-lg leading-relaxed text-grey-600">{C.visibility.body}</p>
          </Reveal>
          <Reveal delay={0.1} className="self-end">
            <div className="mb-4 text-xs font-medium tracking-[0.14em] text-grey-500 uppercase">As stated in ReBAT&rsquo;s brochure</div>
            <ul className="border-t border-grey-200">
              {credentials.map((c) => (
                <li key={c.id} className="border-b border-grey-200 py-6">
                  <h3 className="text-lg font-bold text-ink">{c.title}</h3>
                  <p className="mt-1 text-sm text-grey-600">{c.description}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* EPR + reverse logistics / recovery */}
      <section className="bg-surface-mineral px-[5vw] py-28">
        <div className="mx-auto grid max-w-[1328px] gap-px bg-grey-300 md:grid-cols-2">
          {C.connect.map((block) => (
            <a
              key={block.href}
              href={block.href}
              className="group block bg-surface-mineral p-10 transition-colors duration-500 hover:bg-white focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-brand focus-visible:outline-solid sm:p-14"
            >
              <div className="text-xs font-medium tracking-[0.14em] text-grey-500 uppercase">{block.eyebrow}</div>
              <h3 className="mt-5 max-w-[16ch] text-3xl leading-[1.1] font-medium text-ink sm:text-4xl">{block.title}</h3>
              <p className="mt-5 max-w-[42ch] text-base leading-relaxed text-grey-600">{block.body}</p>
              <span className="mt-9 inline-flex items-center gap-2 text-sm font-medium text-brand">
                {block.cta}
                <span aria-hidden="true" className="transition-transform duration-500 ease-out group-hover:translate-x-1.5">
                  &rarr;
                </span>
              </span>
            </a>
          ))}
        </div>
      </section>

      <SolutionCta headline={C.cta.headline} description={C.cta.description} ctaLabel={C.cta.ctaLabel} modal={MODALS.epr} />
    </PageShell>
  );
}
