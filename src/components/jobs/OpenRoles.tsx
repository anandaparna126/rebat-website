"use client";

import { useState } from "react";
import { EnquiryModal } from "@/components/ui/EnquiryModal";
import { Reveal } from "@/components/ui/Reveal";
import type { Job } from "@/lib/api";

// Open roles published from the admin panel. Applying reuses the site's own
// enquiry modal (topic = the role), so applications land in the same admin
// inbox as every other enquiry instead of a separate pipeline.
export function OpenRoles({ jobs }: { jobs: Job[] }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [applyingTo, setApplyingTo] = useState<Job | null>(null);

  if (jobs.length === 0) {
    return (
      <Reveal className="mx-auto max-w-[640px] rounded-2xl border border-dashed border-grey-200 bg-grey-50 p-10 text-center">
        <div className="mb-2 text-[11px] font-medium tracking-[0.06em] text-grey-400 uppercase">Pending</div>
        <p className="text-sm text-grey-600">Open roles will be listed here once available.</p>
      </Reveal>
    );
  }

  return (
    <>
      <Reveal className="mb-10">
        <div className="mb-2 text-xs font-medium tracking-[0.08em] text-grey-600 uppercase">Open roles</div>
        <h2 className="text-3xl font-medium text-ink">Build the loop with us.</h2>
      </Reveal>

      <div className="mx-auto grid max-w-[1000px] grid-cols-1 gap-4">
        {jobs.map((job, i) => {
          const isOpen = expanded === job.id;
          const meta = [job.department, job.location, job.employment_type, job.experience].filter(Boolean);
          return (
            <Reveal key={job.id} delay={i * 0.04} className="rounded-2xl border border-grey-200 bg-white p-6 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-ink">{job.title}</h3>
                  <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-grey-600">
                    {meta.map((m, j) => (
                      <span key={m} className="flex items-center gap-3">
                        {j > 0 && <span aria-hidden="true">&middot;</span>}
                        {m}
                      </span>
                    ))}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : job.id)}
                    aria-expanded={isOpen}
                    className="rounded-full border border-grey-200 px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-grey-400"
                  >
                    {isOpen ? "Hide details" : "View details"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setApplyingTo(job)}
                    className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="mt-6 space-y-5 border-t border-grey-200 pt-6 text-sm leading-relaxed text-grey-700">
                  {job.description && <p className="whitespace-pre-line">{job.description}</p>}
                  {job.responsibilities.length > 0 && (
                    <div>
                      <h4 className="mb-2 font-bold text-ink">What you&rsquo;ll do</h4>
                      <ul className="space-y-1.5 border-l-2 border-grey-200 pl-5">
                        {job.responsibilities.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {job.requirements.length > 0 && (
                    <div>
                      <h4 className="mb-2 font-bold text-ink">What we&rsquo;re looking for</h4>
                      <ul className="space-y-1.5 border-l-2 border-grey-200 pl-5">
                        {job.requirements.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </Reveal>
          );
        })}
      </div>

      <EnquiryModal
        open={applyingTo !== null}
        onClose={() => setApplyingTo(null)}
        panelColor="#00674F"
        tone="light"
        eyebrow="Careers"
        heading="Apply for"
        headingAccent={applyingTo?.title ?? "this role"}
        description="Tell us a little about yourself. Include a link to your CV or LinkedIn profile in the message and our team will get back to you."
        topic={applyingTo ? `Job application: ${applyingTo.title}` : "Job application"}
        messageTemplate={`Hi ReBAT team, I'd like to apply for the ${applyingTo?.title ?? ""} role.\n\nCV / LinkedIn: `}
      />
    </>
  );
}
