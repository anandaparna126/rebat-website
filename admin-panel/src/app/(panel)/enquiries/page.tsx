"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api, download } from "@/lib/api";
import type { Enquiry, EnquiryStatus, Paginated } from "@/lib/types";
import { formatDateTime, timeAgo } from "@/lib/format";
import { useToast } from "@/components/Toast";
import {
  Drawer,
  EmptyState,
  ErrorState,
  Loading,
  PageHeader,
  Pagination,
  Spinner,
  STATUS_LABEL,
  StatusBadge,
} from "@/components/ui";

const STATUS_TABS: { value: "" | EnquiryStatus; label: string }[] = [
  { value: "", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "closed", label: "Closed" },
];

function EnquiryDetail({
  enquiry,
  onSaved,
  onDeleted,
}: {
  enquiry: Enquiry;
  onSaved: (e: Enquiry) => void;
  onDeleted: (id: number) => void;
}) {
  const toast = useToast();
  const [status, setStatus] = useState<EnquiryStatus>(enquiry.status);
  const [notes, setNotes] = useState(enquiry.admin_notes);
  const [saving, setSaving] = useState(false);
  const dirty = status !== enquiry.status || notes !== enquiry.admin_notes;

  async function save() {
    setSaving(true);
    try {
      const updated = await api<Enquiry>(`/enquiries/${enquiry.id}/`, {
        method: "PATCH",
        body: { status, admin_notes: notes },
      });
      onSaved(updated);
      toast("Enquiry updated");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Save failed", "error");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!confirm(`Delete the enquiry from ${enquiry.name}? This can't be undone.`)) return;
    try {
      await api(`/enquiries/${enquiry.id}/`, { method: "DELETE" });
      onDeleted(enquiry.id);
      toast("Enquiry deleted");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Delete failed", "error");
    }
  }

  const rows: [string, React.ReactNode][] = [
    ["Email", <a key="e" className="text-brand hover:underline" href={`mailto:${enquiry.email}`}>{enquiry.email}</a>],
    ["Phone", enquiry.phone ? <a key="p" className="text-brand hover:underline" href={`tel:${enquiry.phone}`}>{enquiry.phone}</a> : "—"],
    ["Company", enquiry.company || "—"],
    ["Topic", enquiry.topic],
    ["Submitted from", enquiry.source_page || "—"],
    ["Received", formatDateTime(enquiry.created_at)],
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-ink">{enquiry.name}</h3>
          <StatusBadge status={enquiry.status} />
        </div>
        <dl className="mt-4 grid grid-cols-[130px_1fr] gap-y-2 text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-grey-600">{k}</dt>
              <dd className="break-words text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div>
        <span className="label">Message</span>
        <p className="rounded-lg bg-grey-50 p-4 text-sm leading-relaxed whitespace-pre-wrap text-ink">
          {enquiry.message || <span className="text-grey-400">No message</span>}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <a className="btn-secondary" href={`mailto:${enquiry.email}?subject=${encodeURIComponent(`Re: ${enquiry.topic}`)}`}>
          Reply by email
        </a>
        {enquiry.phone && (
          <a className="btn-secondary" href={`https://wa.me/${enquiry.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
        )}
      </div>

      <div className="space-y-4 border-t border-grey-100 pt-6">
        <div>
          <label className="label" htmlFor="status">
            Status
          </label>
          <select id="status" className="field" value={status} onChange={(e) => setStatus(e.target.value as EnquiryStatus)}>
            {(Object.keys(STATUS_LABEL) as EnquiryStatus[]).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="notes">
            Internal notes
          </label>
          <textarea
            id="notes"
            className="field min-h-28"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Only visible to admins"
          />
        </div>
        <div className="flex justify-between gap-2">
          <button className="btn-danger" onClick={remove}>
            Delete
          </button>
          <button className="btn-primary" onClick={save} disabled={!dirty || saving}>
            {saving && <Spinner />}
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

function EnquiriesInbox() {
  const router = useRouter();
  const params = useSearchParams();
  const toast = useToast();

  const status = (params.get("status") ?? "") as "" | EnquiryStatus;
  const topic = params.get("topic") ?? "";
  const q = params.get("q") ?? "";
  const page = Number(params.get("page") ?? 1);
  const openId = params.get("open");

  const [data, setData] = useState<(Paginated<Enquiry> & { topics: string[] }) | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState(q);
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [exporting, setExporting] = useState(false);

  const setParams = useCallback(
    (changes: Record<string, string | null>) => {
      const next = new URLSearchParams(params.toString());
      for (const [k, v] of Object.entries(changes)) {
        if (v) next.set(k, v);
        else next.delete(k);
      }
      router.replace(`/enquiries${next.size ? `?${next}` : ""}`);
    },
    [params, router],
  );

  const query = new URLSearchParams();
  if (status) query.set("status", status);
  if (topic) query.set("topic", topic);
  if (q) query.set("q", q);
  const queryString = query.toString();

  const load = useCallback(() => {
    setError(null);
    const qs = new URLSearchParams(queryString);
    qs.set("page", String(page));
    api<Paginated<Enquiry> & { topics: string[] }>(`/enquiries/?${qs}`)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [queryString, page]);

  useEffect(load, [load]);

  // Debounced search box -> URL
  useEffect(() => {
    if (search === q) return;
    const t = setTimeout(() => setParams({ q: search.trim() || null, page: null }), 350);
    return () => clearTimeout(t);
  }, [search, q, setParams]);

  // Deep link (?open=ID) from the dashboard
  useEffect(() => {
    if (!openId) return;
    api<Enquiry>(`/enquiries/${openId}/`)
      .then(setSelected)
      .catch(() => toast("That enquiry no longer exists", "error"));
  }, [openId, toast]);

  function closeDrawer() {
    setSelected(null);
    if (openId) setParams({ open: null });
  }

  async function exportCsv() {
    setExporting(true);
    try {
      await download(`/enquiries/?${queryString}${queryString ? "&" : ""}export=csv`, "rebat-enquiries.csv");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Export failed", "error");
    } finally {
      setExporting(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Enquiries"
        description="Everything submitted through the website's contact, enquiry and job-application forms."
        actions={
          <button className="btn-secondary" onClick={exportCsv} disabled={exporting}>
            {exporting && <Spinner />}
            Export CSV
          </button>
        }
      />

      <div className="card mb-4 flex flex-wrap items-center gap-3 p-3">
        <div className="flex flex-wrap gap-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setParams({ status: tab.value || null, page: null })}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                status === tab.value ? "bg-brand text-white" : "text-grey-600 hover:bg-grey-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <select
          className="field w-auto min-w-44 flex-1 sm:flex-none"
          value={topic}
          onChange={(e) => setParams({ topic: e.target.value || null, page: null })}
          aria-label="Filter by topic"
        >
          <option value="">All topics</option>
          {data?.topics.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <input
          className="field min-w-52 flex-1"
          placeholder="Search name, email, company, message…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search enquiries"
        />
      </div>

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : !data ? (
        <Loading />
      ) : data.results.length === 0 ? (
        <EmptyState title="No enquiries found">
          {status || topic || q ? "Try clearing the filters." : "Website form submissions will show up here."}
        </EmptyState>
      ) : (
        <>
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-grey-100 text-xs tracking-wide text-grey-600 uppercase">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Topic</th>
                  <th className="px-4 py-3 font-semibold">Company</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-grey-100">
                {data.results.map((e) => (
                  <tr
                    key={e.id}
                    onClick={() => setSelected(e)}
                    className={`cursor-pointer hover:bg-grey-50 ${e.status === "new" ? "font-semibold" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <div className="text-ink">{e.name}</div>
                      <div className="text-xs font-normal text-grey-600">{e.email}</div>
                    </td>
                    <td className="max-w-[240px] truncate px-4 py-3 text-ink">{e.topic}</td>
                    <td className="px-4 py-3 font-normal text-grey-600">{e.company || "—"}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={e.status} />
                    </td>
                    <td className="px-4 py-3 text-right text-xs font-normal whitespace-nowrap text-grey-600" title={formatDateTime(e.created_at)}>
                      {timeAgo(e.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            page={data.page}
            numPages={data.num_pages}
            count={data.count}
            onChange={(p) => setParams({ page: p > 1 ? String(p) : null })}
          />
        </>
      )}

      <Drawer open={selected !== null} onClose={closeDrawer} title="Enquiry">
        {selected && (
          <EnquiryDetail
            key={selected.id}
            enquiry={selected}
            onSaved={(updated) => {
              setSelected(updated);
              load();
            }}
            onDeleted={() => {
              closeDrawer();
              load();
            }}
          />
        )}
      </Drawer>
    </>
  );
}

export default function EnquiriesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <EnquiriesInbox />
    </Suspense>
  );
}
