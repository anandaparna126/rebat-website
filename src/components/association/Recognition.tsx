"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { Grain } from "@/components/ui/Grain";
import { AWARDS, CERTIFICATIONS, RECOGNITION_CATEGORIES } from "@/lib/content";

// The real certificate document backing each claim (supplied by the user,
// 2026-09-30) — EPR's own Registration Certificate for Recycler, and the
// MP Pollution Control Board's Consent Order (which itself covers both
// the CPCB R4 recycler authorisation and the Hazardous & Other Waste
// authorisation, so both cards point at the same document).
const CERT_BADGE_IMAGES: Record<string, string> = {
  epr: "/images/certifications/epr-registration.webp",
  cpcb: "/images/certifications/cto-consent-order.webp",
  hazardous: "/images/certifications/cto-consent-order.webp",
};

// Two tabs (Certifications / Awards), not three — "Our Clients" dropped
// since we have no real client logos to show and no plan to fabricate
// placeholder ones. Certifications reuses the same real brochure-sourced
// data as the About page; Awards is sourced from ReBAT's own LinkedIn
// posts (see AWARDS in lib/content.ts).
export function Recognition() {
  const [active, setActive] = useState(RECOGNITION_CATEGORIES[0].id);

  return (
    // Structural overlap technique (cylib's own real one, not a manually
    // colour-matched wrapper): this section stays above Newsroom in
    // z-index, and Newsroom is pulled up underneath it with a negative top
    // margin. Wherever this section's own rounded corner curves away,
    // Newsroom's *real* background shows through directly.
    <section
      id="recognition"
      className="relative z-10 overflow-hidden rounded-b-[32px] px-[5vw] py-20"
      style={{ background: "linear-gradient(to bottom, var(--surface-clay), var(--surface-clay-mid), var(--surface-clay-mid-2), var(--surface-clay-deep))" }}
    >
      {/* These stops are pale — dark text/cards throughout this section,
          not the white-on-clay treatment the previous flat #887c59
          background used. */}

      {/* Fine, fully static mineral-grain texture — much lower opacity
          than Grain's use anywhere else on the site (0.06 elsewhere), so
          it reads as a felt surface quality rather than a visible effect. */}
      <Grain opacity={0.025} />

      <Reveal className="relative mb-8">
        <div className="mb-2 text-xs font-medium tracking-[0.08em] text-ink/60 uppercase">Recognition</div>
        <h2 className="text-3xl font-medium text-ink">Built with purpose. Recognised with proof.</h2>
      </Reveal>

      <div className="relative mb-6 flex gap-6 border-b border-ink/15">
        {RECOGNITION_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActive(cat.id)}
            className={`relative pb-3 text-sm font-medium transition-colors ${
              active === cat.id ? "text-ink" : "text-ink/50 hover:text-ink/80"
            }`}
          >
            {cat.title}
            {active === cat.id && <span className="absolute inset-x-0 -bottom-px h-[2px] bg-ink" />}
          </button>
        ))}
      </div>

      {active === "certifications" ? (
        <div key="certifications" className="relative grid animate-[fadeIn_0.3s_ease] grid-cols-1 gap-4 sm:grid-cols-3">
          {CERTIFICATIONS.map((cert, i) => {
            const badge = CERT_BADGE_IMAGES[cert.id];
            return (
              <Reveal key={cert.id} delay={i * 0.05} className="overflow-hidden rounded-2xl border border-ink/10 bg-white/55">
                {badge && (
                  <a href={badge} target="_blank" rel="noopener noreferrer" className="relative block aspect-[3/4] w-full overflow-hidden bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={badge} alt={`${cert.title} certificate`} loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top" />
                  </a>
                )}
                <div className="p-6">
                  <h3 className="mb-2 text-base font-bold text-ink">{cert.title}</h3>
                  <p className="text-sm text-ink/70">{cert.description}</p>
                  {badge && (
                    <a
                      href={badge}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
                    >
                      View certificate
                      <span aria-hidden="true">&rarr;</span>
                    </a>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      ) : (
        <div key="awards" className="relative grid animate-[fadeIn_0.3s_ease] grid-cols-1 gap-4 sm:grid-cols-2">
          {AWARDS.map((award, i) => (
            <Reveal key={award.id} delay={i * 0.05} className="overflow-hidden rounded-2xl border border-ink/10 bg-white/55">
              <div className="relative aspect-video w-full overflow-hidden bg-ink/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={award.image} alt={award.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-base font-bold text-ink">{award.title}</h3>
                <p className="text-sm text-ink/70">{award.description}</p>
                <a
                  href={award.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
                >
                  View post
                  <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
