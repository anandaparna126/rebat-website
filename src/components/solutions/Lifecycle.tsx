import { Reveal } from "@/components/ui/Reveal";
import { LIFECYCLE } from "@/lib/solutions-content";
import { Eyebrow } from "@/components/solutions/Eyebrow";

// One line through the whole battery lifecycle. The four steps that are a
// Solution are filled, numbered and link to their page; the rest are the
// wider ReBAT lifecycle they connect, shown hollow. Kept simple on purpose.
export function Lifecycle() {
  return (
    <section aria-labelledby="lifecycle-heading" className="bg-surface-mineral px-[5vw] py-28">
      <div className="mx-auto max-w-[1328px]">
        <Reveal className="mb-16 max-w-[820px]">
          <Eyebrow>{LIFECYCLE.eyebrow}</Eyebrow>
          <h2 id="lifecycle-heading" className="text-4xl leading-[1.08] font-medium text-ink sm:text-6xl">
            {LIFECYCLE.headline}
          </h2>
          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-grey-600">{LIFECYCLE.intro}</p>
        </Reveal>

        <div className="relative">
        <span className="absolute top-[13px] right-0 left-0 hidden h-px bg-grey-300 lg:block" aria-hidden="true" />
        <ol className="relative grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-8 lg:gap-x-4">
          {LIFECYCLE.steps.map((step, i) => {
            const inner = (
              <>
                <span
                  className={`relative z-10 flex h-[27px] w-[27px] items-center justify-center rounded-full border text-[10px] font-semibold ${
                    step.solution ? "border-brand bg-brand text-white" : "border-grey-300 bg-surface-mineral text-transparent"
                  }`}
                  aria-hidden="true"
                >
                  {step.solution?.number ?? "."}
                </span>
                <span className={`mt-5 block text-sm font-semibold tracking-[0.06em] uppercase ${step.solution ? "text-ink" : "text-grey-600"}`}>
                  {step.label}
                </span>
                <span className="mt-2 block max-w-[24ch] text-xs leading-relaxed text-grey-500">{step.note}</span>
                {step.solution && (
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-brand">
                    Explore <span aria-hidden="true">&rarr;</span>
                  </span>
                )}
              </>
            );
            return (
              <Reveal as="li" key={step.label} delay={i * 0.04}>
                  {step.solution ? (
                    <a
                      href={step.solution.href}
                      className="group block focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-brand focus-visible:outline-solid"
                    >
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

        <Reveal delay={0.2} className="mt-14 flex items-center gap-3 text-sm text-grey-500">
          <span aria-hidden="true">&#8634;</span> Recovered resources return to use, and the cycle begins again.
        </Reveal>
      </div>
    </section>
  );
}
