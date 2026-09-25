"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { Mark } from "@/components/mark/Mark";
import { GlowAura } from "@/components/ui/GlowAura";

export interface EnquiryModalProps {
  open: boolean;
  onClose: () => void;
  /** The panel's own solid (or gradient) background — cylib's real modals
   * are a solid-coloured card, not a white sheet with colour accents. Each
   * pathway gets its own colour, exactly like cylib's own "recycle"/
   * "prod"/"allg"/"investor" modals each carry a distinct panel colour. */
  panelColor: string;
  /** Which text tone reads on `panelColor` — same "light"/"dark" call as
   * `RecycledMaterial.textOn` reused here. */
  tone: "light" | "dark";
  eyebrow: string;
  /** Plain lead-in phrase, e.g. "Let's talk about". */
  heading: string;
  /** The specific topic word/phrase at the end, rendered in `highlightColor`
   * — cylib's own two-tone heading highlights a fixed phrase ("Get in
   * touch") instead; ours highlights the specific topic instead, which
   * reads better against phrasing like "Let's talk about {topic}." */
  headingAccent: string;
  /** Colour for `headingAccent` — cylib's own two-tone heading uses a
   * constant warm cream (their "beige-span") regardless of panel colour;
   * defaults to that (var(--gold)) on dark panels, brand emerald on light
   * ones. Callers with their own per-item colour (the materials carousel)
   * can override it directly. */
  highlightColor?: string;
  description: string;
  /** Shown as a small read-only chip so the visitor sees exactly what
   * their enquiry is already scoped to (no invented topic categories to
   * pick from). */
  topic: string;
}

// An instant, in-place enquiry form — cylib's own real pattern, inspected
// directly on their live site down to computed styles: a solid-colour
// panel (no white sheet, no dark backdrop scrim dimming the page behind
// it), a bold two-tone heading, dense white pill input fields sitting
// right on the panel colour, and a submit control that reuses their own
// site-wide CTA anatomy (white circle badge + label) rather than a plain
// button. Ours mirrors all of that, reusing our own Mark/GlowAura for the
// badge so the submit button matches ContactButton/EnquiryButton exactly.
//
// No `AnimatePresence` here on purpose — this project hit a real bug where
// its exit phase never resolved after repeated open/close cycles elsewhere
// in the carousels. This modal only ever renders while `open` is true (a
// plain conditional return, not a keyed swap), so entrance-only `motion`
// props are enough and there's no exit state to get stuck on.
//
// Submits to /api/contact — the same Next.js route (proxying to the RMS
// backend) that src/components/contact/ContactForm.tsx uses — with `topic`
// and `company` folded into the message body so every contextual enquiry
// still reaches the company's inbox with its context intact.
export function EnquiryModal({
  open,
  onClose,
  panelColor,
  tone,
  eyebrow,
  heading,
  headingAccent,
  highlightColor,
  description,
  topic,
}: EnquiryModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  // `tone` matches RecycledMaterial.textOn's convention exactly: "light"
  // means light (white) text is what reads on `panelColor`, i.e. the panel
  // itself is dark. Getting this backwards makes a dark panel render with
  // near-invisible dark text — caught while verifying the Black Mass modal
  // (a near-black panel) came out with ink-coloured heading text.
  const useLightText = tone === "light";
  const baseTextClass = useLightText ? "text-white" : "text-ink";
  const mutedTextClass = useLightText ? "text-white/70" : "text-ink/60";
  const fieldBgClass = useLightText ? "bg-white/95" : "bg-white";
  const resolvedHighlight = highlightColor ?? (useLightText ? "var(--gold)" : "var(--brand)");
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setSubmitted(false);
    setSubmitting(false);
    setError("");
    const id = requestAnimationFrame(() => firstFieldRef.current?.focus());
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot — real visitors never fill this (it's hidden off-screen).
    if ((data.get("hp_field") as string)?.trim()) {
      setSubmitted(true);
      return;
    }

    setSubmitting(true);
    setError("");
    const company = (data.get("company") as string)?.trim();
    const note = (data.get("message") as string)?.trim();
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          message: [`Enquiry: ${topic}`, company && `Company: ${company}`, note]
            .filter(Boolean)
            .join("\n"),
          source_url: window.location.href,
        }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || json?.error) {
        setError(json?.error || "Something went wrong. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Could not send your enquiry. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* cylib's own modal has no dark scrim at all — the page stays fully
          visible behind it. A faint, unblurred tint (not our old bg/70 +
          blur) keeps the panel readable against busy content while staying
          close to that "the page doesn't dim" feel. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="absolute inset-0 bg-black/15"
        onClick={onClose}
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-modal-heading"
        className="relative max-h-[90vh] w-full max-w-[920px] overflow-y-auto rounded-[24px] shadow-[0_60px_120px_-24px_rgba(0,0,0,0.45)]"
        style={{ background: panelColor }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-300 hover:rotate-90"
          style={{ background: "var(--surface-yellow)", color: "var(--brand-deep)" }}
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {submitted ? (
          <div className="flex flex-col items-center px-8 py-16 text-center sm:px-12">
            <span className="flex h-14 w-14 items-center justify-center rounded-full" style={{ background: resolvedHighlight }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M4 12.5L9.5 18L20 6" stroke={useLightText ? "var(--brand-deep)" : "white"} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h3 className={`mt-6 text-2xl font-medium ${baseTextClass}`}>Thanks — we&rsquo;ll be in touch.</h3>
            <p className={`mt-2 max-w-xs text-sm ${mutedTextClass}`}>
              Your enquiry about {topic.toLowerCase()} has been noted. Our team will reach out shortly.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-8 rounded-full px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--brand-deep-2)" }}
            >
              Close
            </button>
          </div>
        ) : (
          <div className="px-8 py-10 sm:px-12 sm:py-12">
            <span className={`text-xs font-medium tracking-[0.12em] uppercase ${mutedTextClass}`}>{eyebrow}</span>
            <h3
              id="enquiry-modal-heading"
              className={`mt-3 text-3xl leading-[1.1] font-bold sm:text-4xl ${baseTextClass}`}
            >
              {heading} <span style={{ color: resolvedHighlight }}>{headingAccent}.</span>
            </h3>
            <p className={`mt-3 max-w-lg text-sm ${mutedTextClass}`}>{description}</p>

            {/* A wide rectangle, two-column layout — cylib's own real form
                shape: a stacked column of short fields on the left, a
                topic readout + a tall Message field filling the matching
                height on the right, checkbox + submit spanning both below. */}
            <form onSubmit={handleSubmit} className="mt-7 grid grid-cols-1 gap-3 lg:grid-cols-2">
              <div className="flex flex-col gap-3">
                <input
                  ref={firstFieldRef}
                  required
                  type="text"
                  name="name"
                  placeholder="Full Name*"
                  aria-label="Full name"
                  className={`rounded-full px-5 py-3 text-sm text-ink outline-none placeholder:text-grey-500 ${fieldBgClass}`}
                />
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="E-Mail*"
                  aria-label="Email"
                  className={`rounded-full px-5 py-3 text-sm text-ink outline-none placeholder:text-grey-500 ${fieldBgClass}`}
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  aria-label="Phone"
                  className={`rounded-full px-5 py-3 text-sm text-ink outline-none placeholder:text-grey-500 ${fieldBgClass}`}
                />
                <input
                  type="text"
                  name="company"
                  placeholder="Company"
                  aria-label="Company"
                  className={`rounded-full px-5 py-3 text-sm text-ink outline-none placeholder:text-grey-500 ${fieldBgClass}`}
                />
              </div>

              <div className="flex flex-col gap-3">
                <div
                  className={`flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-ink ${fieldBgClass}`}
                >
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: resolvedHighlight }} />
                  Enquiry about {topic}
                </div>
                <textarea
                  name="message"
                  placeholder={`Tell us a little about your ${topic.toLowerCase()} enquiry...`}
                  aria-label="Message"
                  className={`min-h-[128px] flex-1 resize-none rounded-[20px] px-5 py-3.5 text-sm text-ink outline-none placeholder:text-grey-500 ${fieldBgClass}`}
                />
              </div>

              {/* Honeypot — visually and semantically hidden from real visitors. */}
              <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
                <input name="hp_field" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              {error && (
                <p className={`text-sm lg:col-span-2 ${useLightText ? "text-red-300" : "text-red-600"}`} role="alert">
                  {error}
                </p>
              )}

              <label className={`flex items-start gap-2.5 text-xs lg:col-span-2 ${mutedTextClass}`}>
                <input
                  required
                  type="checkbox"
                  name="privacy"
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-current"
                />
                <span>
                  I agree to the{" "}
                  <a href="/privacy-policy" className={`underline underline-offset-2 ${baseTextClass}`}>
                    privacy policy
                  </a>{" "}
                  and consent to being contacted about this enquiry.
                </span>
              </label>

              {/* Same pill anatomy as ContactButton/EnquiryButton (3px
                  padding, white circle mark badge, label) — cylib's own
                  submit control reuses their site-wide CTA button too,
                  rather than a plain flat rectangle. */}
              <button
                type="submit"
                disabled={submitting}
                className="group relative mt-2 flex w-fit items-center rounded-full p-[3px] text-sm font-medium text-white transition-transform duration-200 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 lg:col-span-2"
                style={{ background: "var(--brand-deep-2)" }}
              >
                <GlowAura />
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
                  <Mark size={18} color="var(--brand-deep-2)" />
                </span>
                <span className="px-4">{submitting ? "Sending…" : "Get in touch"}</span>
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>,
    document.body
  );
}
