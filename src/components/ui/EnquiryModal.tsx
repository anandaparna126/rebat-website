"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { Mark } from "@/components/mark/Mark";
import { GlowAura } from "@/components/ui/GlowAura";
import { CONTACT_INFO } from "@/lib/content";
import { enquiryFromForm, submitEnquiry } from "@/lib/enquiry";

const PHONE_DIGITS = CONTACT_INFO.phone.replace(/\D/g, "");

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
  /** Pre-filled starting text for the Message field, specific to this
   * enquiry type — an editable draft, not just placeholder hint text, so a
   * visitor in a hurry can submit with minimal typing. */
  messageTemplate: string;
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
// Submission is UI-only for now (no backend wired up yet) — confirmed with
// the site owner as the right first step before building real form
// handling across every contextual CTA on the site.
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
  messageTemplate,
}: EnquiryModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    setError(null);
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
    setSending(true);
    setError(null);
    try {
      await submitEnquiry(enquiryFromForm(e.currentTarget, topic));
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSending(false);
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
              className="mt-8 rounded-lg px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
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

            {/* A faster path than the form for someone who'd rather just
                talk — real number, real WhatsApp link, not a form-only
                dead end. */}
            <div className={`mt-4 flex flex-wrap items-center gap-2 text-xs ${mutedTextClass}`}>
              <span>Prefer to talk?</span>
              <a
                href={`tel:+${PHONE_DIGITS}`}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium transition-colors ${fieldBgClass} text-ink hover:opacity-80`}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8z"
                    fill="currentColor"
                  />
                </svg>
                Call {CONTACT_INFO.phone}
              </a>
              <a
                href={`https://wa.me/${PHONE_DIGITS}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium transition-colors ${fieldBgClass} text-ink hover:opacity-80`}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 18.2a8.1 8.1 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8.9-.2.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.4-.4c.1-.1.2-.3.2-.4.1-.1 0-.3 0-.4-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.2 1.6 2.5 3.9 3.4.5.2 1 .4 1.3.5.5.2 1 .1 1.4.1.4-.1 1.3-.5 1.5-1 .2-.5.2-.9.1-1z" />
                </svg>
                WhatsApp
              </a>
            </div>

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
                  key={messageTemplate}
                  name="message"
                  defaultValue={messageTemplate}
                  aria-label="Message"
                  className={`min-h-[128px] flex-1 resize-none rounded-[20px] px-5 py-3.5 text-sm text-ink outline-none placeholder:text-grey-500 ${fieldBgClass}`}
                />
              </div>

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

              {/* Same square-edged anatomy as ContactButton/EnquiryButton
                  (3px padding, white square mark badge, label) — cylib's
                  own submit control reuses their site-wide CTA button too,
                  rather than a plain flat rectangle. */}
              {/* Honeypot for bots — hidden from people and assistive tech. */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

              {error && (
                <p role="alert" className={`rounded-2xl px-4 py-2.5 text-sm text-red-700 lg:col-span-2 ${fieldBgClass}`}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={sending}
                className="disabled:cursor-wait disabled:opacity-70 group relative mt-2 flex w-fit items-center rounded-lg p-[3px] text-sm font-medium text-white transition-transform duration-200 hover:scale-[1.02] lg:col-span-2"
                style={{ background: "var(--brand-deep-2)" }}
              >
                <GlowAura />
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white">
                  <Mark size={18} color="var(--brand-deep-2)" />
                </span>
                <span className="px-4">{sending ? "Sending…" : "Send enquiry"}</span>
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>,
    document.body
  );
}
