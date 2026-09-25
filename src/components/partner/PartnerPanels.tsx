import { Reveal } from "@/components/ui/Reveal";
import { Mark } from "@/components/mark/Mark";
import { GlowAura } from "@/components/ui/GlowAura";
import { PARTNER_PANELS } from "@/lib/partner";

// Three editorial "doors into ReBAT" — image-led panels, not SaaS cards.
// Each is dominated by its own photograph, full-bleed with no fade at the
// edges; a restrained gradient band (tinted per pathway, see lib/partner.ts)
// sits behind the centered title/CTA only, leaving the rest of the photo
// clear. Panels vary slightly in height so the row reads as three unequal
// chapters rather than a rigid, identical grid.
//
// The CTA reproduces ContactButton's exact anatomy (mark badge + label +
// GlowAura) as a visual-only span rather than the component itself — the
// whole panel is already the one real link, so a nested <a> isn't valid
// here; this keeps the same look without double-nesting anchors.
export function PartnerPanels() {
  return (
    // Wrapped in the next section's colour (the closing video CTA's
    // grey-900) so the rounded-bottom notch below reveals that instead of a
    // flat seam — same technique used at every other section boundary on
    // the homepage.
    <div className="bg-grey-900">
      <section id="explore-panels" className="overflow-hidden rounded-b-[32px] bg-surface-mineral px-[5vw] py-24">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:gap-8">
          {PARTNER_PANELS.map((panel, i) => (
            <Reveal key={panel.number} delay={i * 0.08} className="lg:flex-1">
              <a
                href={panel.href}
                className={`group relative block w-full overflow-hidden rounded-[20px] bg-surface-mineral ${panel.heightClass}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img loading="lazy" decoding="async"
                  src={panel.image}
                  alt={panel.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[750ms] ease-out group-hover:scale-[1.02]"
                />
                <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: panel.gradient }} />

                <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
                  <span className="text-xs font-medium tracking-[0.1em] text-white/60">{panel.number}</span>
                  <h3 className="mt-3 text-3xl font-medium tracking-[0.01em] text-white uppercase sm:text-4xl">
                    {panel.title}
                  </h3>
                  <p className="mt-4 max-w-[28ch] text-base text-white/85 sm:text-lg">{panel.description}</p>

                  <span className="group/cta relative mt-7 flex items-center rounded-full bg-brand p-[3px] text-sm font-medium text-white transition-colors group-hover:bg-brand-hover">
                    <GlowAura />
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
                      <Mark size={18} color="var(--brand)" />
                    </span>
                    <span className="px-3">{panel.ctaLabel}</span>
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
