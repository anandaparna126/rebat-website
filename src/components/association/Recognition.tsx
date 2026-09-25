"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { Grain } from "@/components/ui/Grain";
import { CERTIFICATIONS, RECOGNITION_CATEGORIES } from "@/lib/content";

// Two tabs (Certifications / Awards), not three — "Our Clients" dropped
// since we have no real client logos to show and no plan to fabricate
// placeholder ones. Certifications reuses the same real brochure-sourced
// data as the About page; Awards has no real content yet.
export function Recognition() {
  const [active, setActive] = useState(RECOGNITION_CATEGORIES[0].id);

  return (
    // Same rounded-corner notch-fill technique as the rest of the site:
    // wrapped in the next section's colour (Newsroom, surface-edit) so the
    // rounded-bottom notch reveals that instead of a flat seam.
    <div className="bg-surface-edit">
    <section
      id="recognition"
      className="relative overflow-hidden rounded-b-[32px] px-[5vw] py-20"
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
        <div key="certifications" className="relative grid animate-[fadeIn_0.3s_ease] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CERTIFICATIONS.map((cert, i) => (
            <Reveal key={cert.id} delay={i * 0.05} className="rounded-2xl border border-ink/10 bg-white/55 p-6">
              <h3 className="mb-2 text-base font-bold text-ink">{cert.title}</h3>
              <p className="text-sm text-ink/70">{cert.description}</p>
            </Reveal>
          ))}
        </div>
      ) : (
        <div key="awards" className="relative animate-[fadeIn_0.3s_ease] rounded-xl border border-dashed border-ink/20 bg-white/40 p-8">
          <div className="mb-1 text-[11px] font-medium tracking-[0.06em] text-ink/50 uppercase">Pending</div>
          <p className="text-sm text-ink/70">Awards, recognitions, and milestones — pending.</p>
        </div>
      )}
    </section>
    </div>
  );
}
