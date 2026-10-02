"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { api, SITE_URL } from "@/lib/api";
import type { Job } from "@/lib/types";
import { useToast } from "@/components/Toast";
import { EmptyState, ErrorState, Loading, PageHeader, Pill } from "@/components/ui";

export default function JobsPage() {
  const toast = useToast();
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setError(null);
    api<{ results: Job[] }>("/jobs/")
      .then((d) => setJobs(d.results))
      .catch((err) => setError(err.message));
  }, []);

  useEffect(load, [load]);

  async function toggleActive(job: Job) {
    try {
      await api(`/jobs/${job.id}/`, { method: "PUT", body: { ...job, is_active: !job.is_active } });
      toast(job.is_active ? "Role hidden from the website" : "Role is live on the website");
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Update failed", "error");
    }
  }

  return (
    <>
      <PageHeader
        title="Jobs"
        description="Open roles listed on the website's Jobs page. Applications arrive in Enquiries."
        actions={
          <>
            <a className="btn-secondary" href={`${SITE_URL}/jobs`} target="_blank" rel="noopener noreferrer">
              View Jobs page
            </a>
            <Link href="/jobs/new" className="btn-primary">
              + New role
            </Link>
          </>
        }
      />

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : !jobs ? (
        <Loading />
      ) : jobs.length === 0 ? (
        <EmptyState title="No roles yet">
          The Jobs page shows a &ldquo;Pending&rdquo; note until you{" "}
          <Link href="/jobs/new" className="text-brand">
            add a role
          </Link>
          .
        </EmptyState>
      ) : (
        <div className="card divide-y divide-grey-100">
          {jobs.map((job) => (
            <div key={job.id} className="flex flex-wrap items-center gap-4 p-4">
              <div className="min-w-0 flex-1">
                <Link href={`/jobs/${job.id}`} className="font-semibold text-ink hover:text-brand">
                  {job.title}
                </Link>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-grey-600">
                  {[job.department, job.location, job.employment_type].filter(Boolean).join(" · ")}
                  <Pill on={job.is_active}>{job.is_active ? "Live" : "Hidden"}</Pill>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary" onClick={() => toggleActive(job)}>
                  {job.is_active ? "Hide" : "Publish"}
                </button>
                <Link href={`/jobs/${job.id}`} className="btn-secondary">
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
