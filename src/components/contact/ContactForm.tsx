"use client";

import { useState, type FormEvent } from "react";
import { GlowAura } from "@/components/ui/GlowAura";
import { Mark } from "@/components/mark/Mark";

type Status = "idle" | "submitting" | "success" | "error";

const fieldClass =
  "rounded-full border border-grey-200 bg-white px-5 py-3 text-sm text-ink outline-none transition-colors placeholder:text-grey-500 focus:border-brand";

// Small, self-contained contact form — posts to /api/contact (this site's
// own route handler), which forwards to the RMS backend's public
// website-contact endpoint. See src/app/api/contact/route.ts.
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot — real visitors never fill this (it's hidden off-screen).
    // A bot that fills every field trips it; we just no-op instead of
    // telling it anything was rejected.
    if ((data.get("hp_field") as string)?.trim()) {
      setStatus("success");
      return;
    }

    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          message: data.get("message"),
          source_url: window.location.href,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.error) {
        setError(json?.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setError("Could not send your message. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-grey-200 bg-grey-50 p-8 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M4 12.5L9.5 18L20 6" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h3 className="mt-4 text-lg font-bold text-ink">Message sent.</h3>
        <p className="mt-1 text-sm text-grey-600">
          Thanks for reaching out — our team will get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 text-sm font-medium text-brand underline-offset-4 hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3 rounded-2xl border border-grey-200 bg-grey-50 p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input required name="name" type="text" maxLength={150} placeholder="Full name*" aria-label="Full name" className={fieldClass} />
        <input required name="email" type="email" maxLength={254} placeholder="Email*" aria-label="Email" className={fieldClass} />
      </div>
      <input name="phone" type="tel" maxLength={30} placeholder="Phone (optional)" aria-label="Phone" className={fieldClass} />
      <textarea
        required
        name="message"
        placeholder="How can we help?*"
        aria-label="Message"
        rows={4}
        maxLength={4000}
        className="resize-none rounded-[20px] border border-grey-200 bg-white px-5 py-3.5 text-sm text-ink outline-none transition-colors placeholder:text-grey-500 focus:border-brand"
      />

      {/* Honeypot — visually and semantically hidden from real visitors. */}
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <input name="hp_field" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="group relative mt-1 flex w-fit items-center rounded-full bg-brand p-[3px] text-sm font-medium text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        <GlowAura />
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
          <Mark size={18} color="var(--brand)" />
        </span>
        <span className="px-4">{status === "submitting" ? "Sending…" : "Send message"}</span>
      </button>
    </form>
  );
}
