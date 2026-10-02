"use client";

import { useState, type FormEvent } from "react";
import { Mark } from "@/components/mark/Mark";
import { GlowAura } from "@/components/ui/GlowAura";
import { CONTACT_INFO } from "@/lib/content";
import { enquiryFromForm, submitEnquiry } from "@/lib/enquiry";

const PHONE_DIGITS = CONTACT_INFO.phone.replace(/\D/g, "");
const MESSAGE_TEMPLATE = "Hi ReBAT team, I'd like to know more about...";
const FIELD = "rounded-full border border-grey-200 bg-white px-5 py-3 text-sm text-ink outline-none transition-colors placeholder:text-grey-500 focus:border-brand";

// An inline version of the site's own enquiry form (same fields and
// UI-only submission as EnquiryModal — no backend wired up yet), embedded
// directly on the Contact page instead of opening as a popup.
export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      await submitEnquiry(enquiryFromForm(e.currentTarget, "General enquiry (Contact page)"));
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-start rounded-[24px] border border-grey-200 bg-surface-mineral p-8">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M4 12.5L9.5 18L20 6" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h3 className="mt-6 text-2xl font-medium text-ink">Thanks — we&rsquo;ll be in touch.</h3>
        <p className="mt-2 max-w-xs text-sm text-grey-600">Your message has been noted. Our team will reach out shortly.</p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-8 rounded-lg bg-brand px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">
      <div className="flex flex-wrap items-center gap-2 text-xs text-grey-600">
        <span>Prefer to talk?</span>
        <a
          href={`tel:+${PHONE_DIGITS}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-grey-200 bg-white px-3 py-1.5 font-medium text-ink transition-colors hover:border-brand"
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
          className="inline-flex items-center gap-1.5 rounded-full border border-grey-200 bg-white px-3 py-1.5 font-medium text-ink transition-colors hover:border-brand"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 18.2a8.1 8.1 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8.9-.2.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.4-.4c.1-.1.2-.3.2-.4.1-.1 0-.3 0-.4-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.2 1.6 2.5 3.9 3.4.5.2 1 .4 1.3.5.5.2 1 .1 1.4.1.4-.1 1.3-.5 1.5-1 .2-.5.2-.9.1-1z" />
          </svg>
          WhatsApp
        </a>
      </div>

      <input required type="text" name="name" placeholder="Full Name*" aria-label="Full name" className={FIELD} />
      <input required type="email" name="email" placeholder="E-Mail*" aria-label="Email" className={FIELD} />
      <input type="tel" name="phone" placeholder="Phone" aria-label="Phone" className={FIELD} />
      <input type="text" name="company" placeholder="Company" aria-label="Company" className={FIELD} />
      {/* Honeypot for bots — hidden from people and assistive tech. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <textarea
        name="message"
        defaultValue={MESSAGE_TEMPLATE}
        aria-label="Message"
        className={`min-h-[128px] resize-none rounded-[20px] ${FIELD}`}
      />

      <label className="flex items-start gap-2.5 text-xs text-grey-600">
        <input required type="checkbox" name="privacy" className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-brand" />
        <span>
          I agree to the{" "}
          <a href="/privacy-policy" className="text-ink underline underline-offset-2">
            privacy policy
          </a>{" "}
          and consent to being contacted about this enquiry.
        </span>
      </label>

      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="disabled:cursor-wait disabled:opacity-70 group relative mt-2 flex w-fit items-center rounded-lg bg-brand p-[3px] text-sm font-medium text-white transition-transform duration-200 hover:scale-[1.02]"
      >
        <GlowAura />
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white">
          <Mark size={18} color="var(--brand)" />
        </span>
        <span className="px-4">{sending ? "Sending…" : "Send message"}</span>
      </button>
    </form>
  );
}
