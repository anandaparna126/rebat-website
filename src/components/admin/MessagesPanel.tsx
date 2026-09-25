"use client";

import { useCallback, useEffect, useState } from "react";

interface Submission {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  source_url: string;
  email_sent: boolean;
  created_at: string;
}

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

function pagePath(sourceUrl: string): string {
  try {
    return new URL(sourceUrl).pathname || "/";
  } catch {
    return sourceUrl || "—";
  }
}

// Extracted from what used to be the entire /admin page, before the
// Newsroom section existed alongside it — see AdminShell.tsx.
export function MessagesPanel() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const loadSubmissions = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await fetch("/api/admin/submissions", { cache: "no-store" });
      const json = await res.json().catch(() => null);
      if (!res.ok || json?.error) {
        setLoadError(json?.error || "Could not load messages.");
        return;
      }
      setSubmissions(json.submissions || []);
      setTotal(json.total ?? (json.submissions || []).length);
    } catch {
      setLoadError("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-ink">Website messages</h1>
          <p className="text-xs text-grey-600">
            {total} {total === 1 ? "message" : "messages"} received from the ReBAT website
          </p>
        </div>
        <button
          type="button"
          onClick={loadSubmissions}
          disabled={loading}
          className="rounded-full border border-grey-200 bg-white px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-brand disabled:opacity-60"
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {loadError && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{loadError}</div>
      )}

      {!loadError && !loading && submissions.length === 0 && (
        <div className="rounded-2xl border border-dashed border-grey-200 bg-white p-10 text-center text-sm text-grey-600">
          No messages yet — they&apos;ll show up here as soon as someone writes in through the website.
        </div>
      )}

      <div className="flex flex-col gap-3">
        {submissions.map((s) => (
          <div key={s.id} className="rounded-2xl border border-grey-200 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-ink">{s.name}</p>
                <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-grey-600">
                  <a href={`mailto:${s.email}`} className="hover:text-brand">{s.email}</a>
                  {s.phone && <a href={`tel:${s.phone}`} className="hover:text-brand">{s.phone}</a>}
                </div>
              </div>
              <div className="text-right text-xs text-grey-600">
                <p>{dateFormatter.format(new Date(s.created_at))}</p>
                <p className="mt-0.5">{pagePath(s.source_url)}</p>
              </div>
            </div>
            <p className="mt-3 text-sm whitespace-pre-wrap text-ink">{s.message}</p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-grey-600">
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: s.email_sent ? "var(--brand)" : "var(--grey-400)" }}
              />
              {s.email_sent ? "Emailed to the company inbox" : "Not emailed (check email settings)"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
