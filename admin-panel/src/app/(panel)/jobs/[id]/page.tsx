"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import type { Job } from "@/lib/types";
import { JobEditor } from "@/components/JobEditor";
import { ErrorState, Loading } from "@/components/ui";

export default function EditJobPage() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<Job>(`/jobs/${id}/`)
      .then(setJob)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <ErrorState message={error} />;
  if (!job) return <Loading />;
  return <JobEditor key={job.id} initial={job} />;
}
