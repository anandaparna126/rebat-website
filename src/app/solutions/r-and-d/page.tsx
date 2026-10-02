import { PageShell } from "@/components/layout/PageShell";
import { Eyebrow } from "@/components/solutions/Eyebrow";
import { SolutionCta, SolutionHero } from "@/components/solutions/SolutionEnquiry";
import { Grain } from "@/components/ui/Grain";
import { Reveal } from "@/components/ui/Reveal";
import { RND as C, MODALS } from "@/lib/solutions-content";

// R&D — materials, chemistry, experimentation. The darkest, most scientific
// of the four pages. It describes areas of focus and a method; it does not
// name projects, because none have been published.
export default function RAndD() {
  return (
    <PageShell hideNav>
      <SolutionHero
        eyebrow={C.hero.eyebrow}
        headline={C.hero.headline}
        image="/images/solutions/hero.webp"
        description={C.hero.description}
        ctaLabel={C.hero.ctaLabel}
        modal={MODALS.rAndD}
      />

      {/* Why R&D matters */}
      <section className="relative overflow-hidden bg-[#0e1412] px-[5vw] py-32">
        <Grain opacity={0.05} />
        <div className="relative mx-auto max-w-[1000px]">
          <Reveal>
            <Eyebrow light>{C.why.eyebrow}</Eyebrow>
            <p className="text-3xl leading-[1.15] font-medium text-white sm:text-5xl">{C.why.statement}</p>
            <p className="mt-10 max-w-[56ch] text-lg leading-relaxed text-white/60">{C.why.body}</p>
          </Reveal>
        </div>
      </section>

      {/* What we explore — a ruled grid, like a table of elements */}
      <section className="bg-[#0e1412] px-[5vw] pb-32">
        <div className="mx-auto max-w-[1328px]">
          <Reveal className="mb-12 max-w-[820px]">
            <Eyebrow light>{C.explore.eyebrow}</Eyebrow>
            <h2 className="text-4xl leading-[1.08] font-medium text-white sm:text-5xl">{C.explore.headline}</h2>
            <p className="mt-5 text-sm text-white/50">{C.explore.note}</p>
          </Reveal>
          <ul className="grid grid-cols-1 border-t border-l border-white/15 sm:grid-cols-2 lg:grid-cols-3">
            {C.explore.items.map((item, i) => (
              <Reveal as="li" key={item.title} delay={(i % 3) * 0.05} className="group h-full min-h-[220px] border-r border-b border-white/15 p-8 transition-colors duration-500 hover:bg-white/[0.03]">
                  <div className="text-xs font-medium tracking-[0.14em] text-white/40">{String(i + 1).padStart(2, "0")}</div>
                  <h3 className="mt-10 text-2xl font-semibold tracking-[0.02em] text-white uppercase transition-colors duration-500 group-hover:text-brand-hover">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-[32ch] text-sm leading-relaxed text-white/60">{item.description}</p>
                </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* From question to possibility */}
      <section className="bg-white px-[5vw] py-28">
        <div className="mx-auto max-w-[1328px]">
          <Reveal className="mb-14 max-w-[820px]">
            <Eyebrow>{C.method.eyebrow}</Eyebrow>
            <h2 className="text-4xl leading-[1.08] font-medium text-ink sm:text-5xl">{C.method.headline}</h2>
            <p className="mt-5 text-sm text-grey-600">{C.method.note}</p>
          </Reveal>
          <ol className="flex flex-wrap items-baseline gap-x-5 gap-y-4">
            {C.method.steps.map((step, i) => (
              <Reveal as="li" key={step} delay={i * 0.05} className="flex items-baseline gap-5">
                  <span className="flex items-baseline gap-3 text-4xl font-semibold tracking-[0.01em] text-ink uppercase sm:text-6xl">
                    <span className="text-xs font-medium tracking-[0.1em] text-grey-400">{String(i + 1).padStart(2, "0")}</span>
                    {step}
                  </span>
                  {i < C.method.steps.length - 1 && (
                    <span className="text-2xl text-grey-300" aria-hidden="true">
                      &rarr;
                    </span>
                  )}
                </Reveal>
            ))}
          </ol>
          <Reveal delay={0.2} className="mt-8 flex items-center gap-3 text-sm text-grey-500">
            <span aria-hidden="true">&#8634;</span> Findings loop back into the next question.
          </Reveal>
        </div>
      </section>

      {/* Materials → processes → products */}
      <section className="bg-surface-mineral px-[5vw] py-28">
        <div className="mx-auto max-w-[1328px]">
          <Reveal className="mb-14 max-w-[820px]">
            <Eyebrow>{C.connect.eyebrow}</Eyebrow>
            <h2 className="text-4xl leading-[1.08] font-medium text-ink sm:text-5xl">{C.connect.headline}</h2>
          </Reveal>
          <ol className="grid grid-cols-1 gap-10 lg:grid-cols-4 lg:gap-0">
            {C.connect.steps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.06} className="relative lg:pr-10">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl font-semibold text-brand">{String(i + 1).padStart(2, "0")}</span>
                    {i < C.connect.steps.length - 1 && <span className="hidden h-px flex-1 bg-grey-300 lg:block" aria-hidden="true" />}
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-grey-600">{s.description}</p>
                </Reveal>
            ))}
          </ol>
          <Reveal delay={0.2} className="mt-14">
            <a
              href={C.connect.href}
              className="group inline-flex items-center gap-2 text-sm font-medium text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand focus-visible:outline-solid"
            >
              {C.connect.cta}
              <span aria-hidden="true" className="transition-transform duration-500 ease-out group-hover:translate-x-1.5">
                &rarr;
              </span>
            </a>
          </Reveal>
        </div>
      </section>

      {/* Research environment */}
      <section className="bg-[#0e1412] px-[5vw] py-28">
        <div className="mx-auto max-w-[1328px]">
          <Reveal className="mb-12 grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-24">
            <div>
              <Eyebrow light>{C.environment.eyebrow}</Eyebrow>
              <h2 className="text-4xl leading-[1.08] font-medium text-white sm:text-5xl">{C.environment.headline}</h2>
            </div>
            <p className="max-w-[46ch] text-base leading-relaxed text-white/60">{C.environment.body}</p>
          </Reveal>
          <div className="grid gap-px sm:grid-cols-3 lg:grid-cols-12">
            <Reveal className="sm:col-span-3 lg:col-span-8">
              <div className="relative h-[320px] overflow-hidden sm:h-[520px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={C.environment.images[0].src} alt={C.environment.images[0].alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              </div>
            </Reveal>
            <div className="grid gap-px sm:col-span-3 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
              {C.environment.images.slice(1).map((img, i) => (
                <Reveal key={img.src} delay={0.08 * (i + 1)}>
                  <div className="relative h-[260px] overflow-hidden sm:h-[258px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.src} alt={img.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Where research becomes useful */}
      <section className="bg-white px-[5vw] py-28">
        <div className="mx-auto grid max-w-[1328px] gap-14 lg:grid-cols-[1fr_1.3fr] lg:gap-24">
          <Reveal>
            <Eyebrow>{C.useful.eyebrow}</Eyebrow>
          </Reveal>
          <ul className="border-t border-grey-200">
            {C.useful.items.map((item, i) => (
              <Reveal as="li" key={item.title} delay={i * 0.04} className="grid gap-1 border-b border-grey-200 py-6 sm:grid-cols-[minmax(0,220px)_1fr] sm:gap-8">
                  <h3 className="text-xl font-bold text-ink">{item.title}</h3>
                  <p className="text-sm text-grey-600">{item.description}</p>
                </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* What's next — a framework awaiting real initiatives */}
      <section className="bg-surface-mineral px-[5vw] py-28">
        <div className="mx-auto max-w-[1328px]">
          <Reveal className="mb-12 max-w-[820px]">
            <Eyebrow>{C.next.eyebrow}</Eyebrow>
            <h2 className="text-4xl leading-[1.08] font-medium text-ink sm:text-5xl">{C.next.headline}</h2>
            <p className="mt-5 text-base text-grey-600">{C.next.body}</p>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {C.next.slots.map((slot, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div className="flex h-[200px] flex-col justify-between border border-dashed border-grey-300 p-6">
                  <span className="text-xs font-medium tracking-[0.14em] text-grey-400 uppercase">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[11px] font-medium tracking-[0.15em] text-grey-400 uppercase">{slot}: to be published</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <SolutionCta headline={C.cta.headline} description={C.cta.description} ctaLabel={C.cta.ctaLabel} modal={MODALS.rAndD} />
    </PageShell>
  );
}
