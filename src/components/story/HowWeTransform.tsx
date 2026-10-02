import { Reveal } from "@/components/ui/Reveal";
import { ProcessFilmGrid } from "@/components/story/ProcessFilmGrid";

// No separate intro text block — the section's statement now sits directly
// over the video grid itself (see ProcessFilmGrid), not above it. The card
// (dark emerald — the same --brand-deep-2 token used elsewhere on the site,
// e.g. the Hero/Footer gradients) is deliberately larger than the video
// grid itself, with generous padding on every side, so the grid reads as
// placed inside the card rather than filling it.
export function HowWeTransform() {
  return (
    <div className="px-[5vw] pt-16 pb-28">
      <Reveal delay={0.1}>
        <div className="overflow-hidden rounded-[32px] p-4 sm:p-8 lg:p-12" style={{ background: "var(--brand-deep-2)" }}>
          <ProcessFilmGrid />
        </div>
      </Reveal>
    </div>
  );
}
