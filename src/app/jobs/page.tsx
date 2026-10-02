import { PageHero } from "@/components/layout/PageHero";
import { PageShell } from "@/components/layout/PageShell";
import { ContactButton } from "@/components/ui/ContactButton";
import { Reveal } from "@/components/ui/Reveal";
import { GetInTouch } from "@/components/cta/GetInTouch";
import { OpenRoles } from "@/components/jobs/OpenRoles";
import { JOBS_FAQ, JOBS_HERO, JOBS_PROCESS } from "@/lib/content";
import { getJobs } from "@/lib/api";

// Open roles come from the backend (managed in the admin panel); refetched
// at most every 30s.
export const revalidate = 30;

export default async function Jobs() {
  const jobs = await getJobs();
  return (
    <PageShell>
      <PageHero content={JOBS_HERO}>
        <ContactButton href="/contact" className="mt-8 w-fit" />
      </PageHero>

      {/* Open roles aren't published yet — an honest empty state rather
          than fabricated listings, same convention as Newsroom. */}
      <section className="bg-white px-[5vw] py-20">
        <OpenRoles jobs={jobs} />
      </section>

      <section className="bg-grey-50 px-[5vw] py-20">
        <Reveal className="mb-10">
          <div className="mb-2 text-xs font-medium tracking-[0.08em] text-grey-600 uppercase">Our process</div>
          <h2 className="text-3xl font-medium text-ink">Your way to us.</h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {JOBS_PROCESS.map((step) => (
            <Reveal key={step.step} delay={step.step * 0.04} className="rounded-2xl border border-grey-200 bg-white p-6">
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                {step.step}
              </div>
              <h3 className="mb-2 text-sm font-bold text-ink">{step.title}</h3>
              <p className="text-xs text-grey-600">{step.description}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-white px-[5vw] py-20">
        <Reveal className="mb-10">
          <div className="mb-2 text-xs font-medium tracking-[0.08em] text-grey-600 uppercase">FAQ</div>
          <h2 className="text-3xl font-medium text-ink">Our recruitment process.</h2>
        </Reveal>
        <div className="mx-auto max-w-[800px] divide-y divide-grey-200">
          {JOBS_FAQ.map((item) => (
            <Reveal key={item.question} className="py-5">
              <h3 className="mb-2 text-base font-bold text-ink">{item.question}</h3>
              <p className="text-sm text-grey-600">{item.answer}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <GetInTouch />
    </PageShell>
  );
}
