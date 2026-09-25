import { PageHero } from "@/components/layout/PageHero";
import { PageShell } from "@/components/layout/PageShell";
import { ContactButton } from "@/components/ui/ContactButton";
import { Reveal } from "@/components/ui/Reveal";
import { GetInTouch } from "@/components/cta/GetInTouch";
import { JOBS_FAQ, JOBS_HERO, JOBS_PROCESS } from "@/lib/content";
import { getWebsiteCareers, isHttpUrl, type WebsiteJob } from "@/lib/careers";

const JOB_TYPES: Record<string, string> = {
  full_time: "Full time", part_time: "Part time", contract: "Contract", internship: "Internship",
};
const WORK_MODES: Record<string, string> = { onsite: "On-site", remote: "Remote", hybrid: "Hybrid" };

function experienceLabel(job: WebsiteJob) {
  if (!job.max_experience && !job.min_experience) return "Freshers welcome";
  if (job.max_experience > job.min_experience) return `${job.min_experience}–${job.max_experience} yrs`;
  return `${job.min_experience}+ yrs`;
}

export default async function Jobs() {
  const careers = await getWebsiteCareers();

  return (
    <PageShell>
      <PageHero content={JOBS_HERO}>
        <ContactButton href="/contact" className="mt-8 w-fit" />
      </PageHero>

      <section className="bg-white px-[5vw] py-20">
        {careers.linked ? (
          <>
            <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="mb-2 text-xs font-medium tracking-[0.08em] text-grey-600 uppercase">Open roles</div>
                <h2 className="text-3xl font-medium text-ink">
                  {careers.total > 0
                    ? `${careers.total} ${careers.total === 1 ? "opening" : "openings"} right now.`
                    : "No openings right now."}
                </h2>
              </div>
              {isHttpUrl(careers.jobs_url) && careers.total > 0 && (
                <a href={careers.jobs_url} target="_blank" rel="noopener noreferrer"
                  className="text-sm font-medium text-brand underline-offset-4 hover:underline">
                  View all on our careers portal →
                </a>
              )}
            </Reveal>

            {careers.jobs.length > 0 ? (
              <div className="mx-auto flex max-w-[960px] flex-col gap-4">
                {careers.jobs.map((job, i) => (
                  <Reveal key={job.id} delay={Math.min(i, 8) * 0.04}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-grey-200 bg-white p-6">
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-1 text-base font-bold text-ink">{job.title}</h3>
                      <p className="text-sm text-grey-600">
                        {[job.department, job.location, WORK_MODES[job.work_mode], JOB_TYPES[job.job_type], experienceLabel(job)]
                          .filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    {isHttpUrl(job.apply_url) && (
                      <a href={job.apply_url} target="_blank" rel="noopener noreferrer"
                        className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-hover">
                        Apply
                      </a>
                    )}
                  </Reveal>
                ))}
              </div>
            ) : (
              <Reveal className="mx-auto max-w-[640px] rounded-2xl border border-dashed border-grey-200 bg-grey-50 p-10 text-center">
                <p className="text-sm text-grey-600">
                  We&apos;re not hiring for any role at the moment. New openings appear here as soon as they&apos;re published.
                </p>
                {isHttpUrl(careers.careers_portal_url) && (
                  <a href={careers.careers_portal_url} target="_blank" rel="noopener noreferrer"
                    className="mt-3 inline-block text-sm font-medium text-brand underline-offset-4 hover:underline">
                    Visit our careers portal →
                  </a>
                )}
              </Reveal>
            )}
          </>
        ) : (
          // Careers portal not linked to this site — honest empty state
          // rather than fabricated listings, same convention as Newsroom.
          <Reveal className="mx-auto max-w-[640px] rounded-2xl border border-dashed border-grey-200 bg-grey-50 p-10 text-center">
            <div className="mb-2 text-[11px] font-medium tracking-[0.06em] text-grey-400 uppercase">Pending</div>
            <p className="text-sm text-grey-600">Open roles will be listed here once available.</p>
          </Reveal>
        )}
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
