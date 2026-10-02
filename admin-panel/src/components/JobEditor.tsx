"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { EMPLOYMENT_TYPES, type Job } from "@/lib/types";
import { linesToList, listToLines } from "@/lib/format";
import { useToast } from "@/components/Toast";
import { PageHeader, Spinner, Toggle } from "@/components/ui";

interface Form {
  title: string;
  department: string;
  location: string;
  employment_type: string;
  experience: string;
  description: string;
  responsibilities: string;
  requirements: string;
  is_active: boolean;
  sort_order: number;
}

function toForm(job?: Job): Form {
  return {
    title: job?.title ?? "",
    department: job?.department ?? "",
    location: job?.location ?? "Mandideep, Madhya Pradesh",
    employment_type: job?.employment_type ?? "Full-time",
    experience: job?.experience ?? "",
    description: job?.description ?? "",
    responsibilities: listToLines(job?.responsibilities ?? []),
    requirements: listToLines(job?.requirements ?? []),
    is_active: job?.is_active ?? true,
    sort_order: job?.sort_order ?? 0,
  };
}

export function JobEditor({ initial }: { initial?: Job }) {
  const router = useRouter();
  const toast = useToast();
  const [form, setForm] = useState<Form>(() => toForm(initial));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof Form>(key: K, value: Form[K]) => setForm((f) => ({ ...f, [key]: value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      ...form,
      responsibilities: linesToList(form.responsibilities),
      requirements: linesToList(form.requirements),
    };
    try {
      if (initial) {
        const saved = await api<Job>(`/jobs/${initial.id}/`, { method: "PUT", body: payload });
        setForm(toForm(saved));
        toast("Role saved");
      } else {
        const saved = await api<Job>("/jobs/", { method: "POST", body: payload });
        toast("Role created");
        router.replace(`/jobs/${saved.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!initial || !confirm(`Delete the "${initial.title}" role?`)) return;
    try {
      await api(`/jobs/${initial.id}/`, { method: "DELETE" });
      toast("Role deleted");
      router.replace("/jobs");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Delete failed", "error");
    }
  }

  const text = (key: "title" | "department" | "location" | "experience", label: string, placeholder = "") => (
    <div>
      <label className="label" htmlFor={key}>
        {label}
      </label>
      <input
        id={key}
        className="field"
        value={form[key]}
        placeholder={placeholder}
        onChange={(e) => set(key, e.target.value)}
        required={key === "title"}
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      <PageHeader
        title={initial ? "Edit role" : "New role"}
        actions={
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving && <Spinner />}
            {initial ? "Save changes" : "Create role"}
          </button>
        }
      />

      {error && (
        <p role="alert" className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="card space-y-4 p-5 lg:col-span-2">
          {text("title", "Job title", "e.g. Process Engineer")}
          <div>
            <label className="label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              className="field min-h-32"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="About the role"
            />
          </div>
          <div>
            <label className="label" htmlFor="responsibilities">
              Responsibilities
            </label>
            <textarea
              id="responsibilities"
              className="field min-h-32"
              value={form.responsibilities}
              onChange={(e) => set("responsibilities", e.target.value)}
              placeholder="One per line"
            />
          </div>
          <div>
            <label className="label" htmlFor="requirements">
              Requirements
            </label>
            <textarea
              id="requirements"
              className="field min-h-32"
              value={form.requirements}
              onChange={(e) => set("requirements", e.target.value)}
              placeholder="One per line"
            />
          </div>
        </section>

        <aside className="space-y-6">
          <section className="card space-y-4 p-5">
            <Toggle checked={form.is_active} onChange={(v) => set("is_active", v)} label={form.is_active ? "Live on website" : "Hidden"} />
            {text("department", "Department", "e.g. Operations")}
            {text("location", "Location")}
            <div>
              <label className="label" htmlFor="type">
                Employment type
              </label>
              <select id="type" className="field" value={form.employment_type} onChange={(e) => set("employment_type", e.target.value)}>
                {EMPLOYMENT_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            {text("experience", "Experience", "e.g. 3–5 years")}
            <div>
              <label className="label" htmlFor="order">
                Sort order
              </label>
              <input
                id="order"
                type="number"
                className="field"
                value={form.sort_order}
                onChange={(e) => set("sort_order", Number(e.target.value))}
              />
              <p className="mt-1 text-xs text-grey-600">Lower numbers are listed first.</p>
            </div>
          </section>
          {initial && (
            <button type="button" className="btn-danger w-full" onClick={handleDelete}>
              Delete role
            </button>
          )}
        </aside>
      </div>
    </form>
  );
}
