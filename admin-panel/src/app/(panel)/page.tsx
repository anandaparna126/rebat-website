"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { Dashboard } from "@/lib/types";
import { timeAgo } from "@/lib/format";
import { useAdminUser } from "@/components/Shell";
import { ErrorState, Loading, PageHeader, StatusBadge } from "@/components/ui";

function Stat({ label, value, hint, href }: { label: string; value: number; hint?: string; href: string }) {
  return (
    <Link href={href} className="card block p-5 transition-shadow hover:shadow-md">
      <div className="text-xs font-semibold tracking-wide text-grey-600 uppercase">{label}</div>
      <div className="mt-2 text-3xl font-bold text-ink tabular-nums">{value}</div>
      {hint && <div className="mt-1 text-xs text-grey-600">{hint}</div>}
    </Link>
  );
}

export default function DashboardPage() {
  const { user } = useAdminUser();
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setError(null);
    api<Dashboard>("/dashboard/")
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  useEffect(load, [load]);

  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!data) return <Loading />;

  const max = Math.max(1, ...data.timeline.map((d) => d.count));
  const topicMax = Math.max(1, ...data.by_topic.map((t) => t.count));

  return (
    <>
      <PageHeader
        title={`Welcome back${user.first_name ? `, ${user.first_name}` : ""}`}
        description="Here's what's happening on the ReBAT website."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="New enquiries" value={data.enquiries.new} hint="Waiting for a reply" href="/enquiries?status=new" />
        <Stat label="Last 7 days" value={data.enquiries.last_7_days} hint={`${data.enquiries.total} enquiries all-time`} href="/enquiries" />
        <Stat label="Published articles" value={data.articles.published} hint={`${data.articles.drafts} draft(s)`} href="/articles" />
        <Stat label="Open roles" value={data.jobs.active} hint={`${data.jobs.inactive} hidden`} href="/jobs" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="card p-5 lg:col-span-2">
          <h2 className="text-sm font-bold text-ink">Enquiries — last 14 days</h2>
          <div className="mt-6 flex h-40 items-end gap-1.5">
            {data.timeline.map((d) => (
              <div key={d.date} className="group relative flex h-full flex-1 flex-col justify-end">
                <div
                  className="rounded-t bg-brand/80 transition-colors group-hover:bg-brand"
                  style={{ height: `${(d.count / max) * 100}%`, minHeight: d.count ? 4 : 1 }}
                />
                <span className="pointer-events-none absolute -top-6 left-1/2 hidden -translate-x-1/2 rounded bg-ink px-1.5 py-0.5 text-[11px] whitespace-nowrap text-white group-hover:block">
                  {d.count} · {new Date(d.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-grey-600">
            <span>{new Date(data.timeline[0].date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</span>
            <span>Today</span>
          </div>
        </section>

        <section className="card p-5">
          <h2 className="text-sm font-bold text-ink">Top enquiry topics</h2>
          {data.by_topic.length === 0 ? (
            <p className="mt-4 text-sm text-grey-600">No enquiries yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {data.by_topic.map((t) => (
                <li key={t.topic}>
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="truncate text-ink">{t.topic}</span>
                    <span className="font-semibold tabular-nums">{t.count}</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-grey-100">
                    <div className="h-full rounded-full bg-brand" style={{ width: `${(t.count / topicMax) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="card mt-6">
        <div className="flex items-center justify-between border-b border-grey-100 px-5 py-4">
          <h2 className="text-sm font-bold text-ink">Latest enquiries</h2>
          <Link href="/enquiries" className="text-sm font-medium text-brand">
            View all →
          </Link>
        </div>
        {data.recent_enquiries.length === 0 ? (
          <p className="p-5 text-sm text-grey-600">
            Nothing yet — submissions from the website&rsquo;s contact and enquiry forms will appear here.
          </p>
        ) : (
          <ul className="divide-y divide-grey-100">
            {data.recent_enquiries.map((e) => (
              <li key={e.id}>
                <Link href={`/enquiries?open=${e.id}`} className="flex items-center gap-4 px-5 py-3 hover:bg-grey-50">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-ink">{e.name}</div>
                    <div className="truncate text-xs text-grey-600">{e.topic}</div>
                  </div>
                  <StatusBadge status={e.status} />
                  <span className="w-16 text-right text-xs text-grey-600">{timeAgo(e.created_at)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
