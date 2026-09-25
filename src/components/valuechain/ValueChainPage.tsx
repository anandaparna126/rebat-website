import { PageHero } from "@/components/layout/PageHero";
import { PageShell } from "@/components/layout/PageShell";
import { ContactButton } from "@/components/ui/ContactButton";
import { Reveal } from "@/components/ui/Reveal";
import { GetInTouch } from "@/components/cta/GetInTouch";
import { PROCESS_STAGES, WHY_CHOOSE_REBAT, type ValueChainSource } from "@/lib/content";

// Shared template for the 3 real intake-source pages cylib dedicates a page
// each to (End-of-life batteries, Production scraps, Black mass) — same
// structure, source-specific copy passed in.
export function ValueChainPage({ source }: { source: ValueChainSource }) {
  return (
    <PageShell>
      <PageHero content={{ eyebrow: "Partner with us", headline: `ReBAT can recycle your ${source.title.toLowerCase()}.` }}>
        <p className="mt-6 max-w-xl text-lg text-white/80">{source.description}</p>
        <ContactButton href="/partner-with-us" className="mt-8 w-fit" />
      </PageHero>

      <section className="bg-white px-[5vw] py-20">
        <Reveal className="mx-auto max-w-[800px] text-center">
          <div className="mb-2 text-xs font-medium tracking-[0.08em] text-grey-600 uppercase">Why choose ReBAT</div>
          <div className="flex flex-wrap justify-center gap-3">
            {WHY_CHOOSE_REBAT.map((item) => (
              <span
                key={item}
                className="rounded-full border border-grey-200 bg-grey-50 px-4 py-2 text-sm font-medium text-ink"
              >
                {item}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="bg-grey-50 px-[5vw] py-20">
        <Reveal className="mb-10 text-center">
          <div className="mb-2 text-xs font-medium tracking-[0.08em] text-grey-600 uppercase">Partner with us</div>
          <h2 className="text-3xl font-medium text-ink">How it moves through our process.</h2>
        </Reveal>
        <div className="mx-auto flex max-w-[1000px] flex-wrap justify-center gap-3">
          {PROCESS_STAGES.map((stage) => (
            <Reveal key={stage.step} delay={stage.step * 0.03}>
              <div className="flex items-center gap-2 rounded-full border border-grey-200 bg-white px-4 py-2 text-sm text-grey-800">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
                  {stage.step}
                </span>
                {stage.title}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <GetInTouch />
    </PageShell>
  );
}
