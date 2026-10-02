"use client";

import { useEffect } from "react";
import type { EnquiryStatus } from "@/lib/types";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-ink">{title}</h1>
        {description && <p className="mt-1 text-sm text-grey-600">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

const STATUS_STYLE: Record<EnquiryStatus, string> = {
  new: "bg-amber-100 text-amber-800",
  contacted: "bg-sky-100 text-sky-800",
  closed: "bg-grey-100 text-grey-600",
};
export const STATUS_LABEL: Record<EnquiryStatus, string> = { new: "New", contacted: "Contacted", closed: "Closed" };

export function StatusBadge({ status }: { status: EnquiryStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLE[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

export function Pill({ on, children }: { on: boolean; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        on ? "bg-emerald-100 text-emerald-800" : "bg-grey-100 text-grey-600"
      }`}
    >
      {children}
    </span>
  );
}

export function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent ${className}`}
      aria-hidden="true"
    />
  );
}

export function Loading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 py-16 text-sm text-grey-600 justify-center">
      <Spinner /> {label}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="card flex flex-col items-center gap-3 p-10 text-center">
      <p className="text-sm text-red-700">{message}</p>
      {onRetry && (
        <button className="btn-secondary" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="card flex flex-col items-center gap-2 p-12 text-center">
      <p className="font-semibold text-ink">{title}</p>
      {children && <div className="text-sm text-grey-600">{children}</div>}
    </div>
  );
}

export function Pagination({
  page,
  numPages,
  count,
  onChange,
}: {
  page: number;
  numPages: number;
  count: number;
  onChange: (page: number) => void;
}) {
  if (numPages <= 1) return <p className="mt-4 text-xs text-grey-600">{count} total</p>;
  return (
    <div className="mt-4 flex items-center justify-between text-sm">
      <span className="text-xs text-grey-600">
        {count} total · page {page} of {numPages}
      </span>
      <div className="flex gap-2">
        <button className="btn-secondary" disabled={page <= 1} onClick={() => onChange(page - 1)}>
          Previous
        </button>
        <button className="btn-secondary" disabled={page >= numPages} onClick={() => onChange(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}

/** Right-hand slide-over panel. */
export function Drawer({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden="true" />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative flex h-full w-full max-w-xl flex-col overflow-y-auto bg-white shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-grey-100 bg-white px-6 py-4">
          <h2 className="text-lg font-bold text-ink">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-2 text-grey-600 hover:bg-grey-50" aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="flex-1 p-6">{children}</div>
      </aside>
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-3 text-sm font-medium text-ink">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${checked ? "bg-brand" : "bg-grey-200"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
      {label}
    </label>
  );
}
