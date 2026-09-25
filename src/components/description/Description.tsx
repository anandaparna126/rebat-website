import { Mark } from "@/components/mark/Mark";
import { Grain } from "@/components/ui/Grain";
import { DESCRIPTION_EMPHASIS, DESCRIPTION_REST } from "@/lib/content";
import { LazyVideo } from "@/components/ui/LazyVideo";

export function Description() {
  return (
    // This wrapper's only job is to sit directly behind the section below,
    // so that where the section's own rounded-bottom corners cut its box
    // away, this shows through instead of the page's white background.
    // Must stay the exact color ProcessLoop starts with (its gradient's
    // left end) so the notch reads as a continuation of that section, not
    // a separate color. A rectangle placed *in front of*/overlapping the
    // curve (the previous attempt, moving ProcessLoop up) doesn't work —
    // it paints over the curve itself instead of only filling the notch.
    <div style={{ background: "linear-gradient(90deg, #aaead2, #dff6ed)" }}>
      <section className="relative overflow-hidden rounded-b-[32px] px-[5vw] pt-32 pb-24">
        {/* Video first (bottom layer), a semi-transparent version of the
            section's own grey-to-emerald ramp on top of it (keeps the same
            blend into Hero above / ProcessLoop below, just no longer fully
            opaque so the footage actually shows through), grain, then the
            text — in that stacking order. */}
        <LazyVideo
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          src="/videos/description/maintext.mp4"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, rgba(228,231,230,0.65) 8%, rgba(200,208,206,0.42) 18%, rgba(159,173,170,0.3) 30%, rgba(103,126,121,0.35) 42%, rgba(63,80,76,0.5) 55%, rgba(21,59,47,0.8) 78%, rgba(21,59,47,0.92) 100%)",
          }}
        />
        <Grain opacity={0.05} />

        {/* cylib's own measured proportions: a 938px column, centered on
            the page (not stuck to the left edge), text left-aligned
            inside it, scaling up to 45px on desktop. */}
        <div className="relative mx-auto max-w-[938px]">
          <p className="text-3xl leading-tight font-bold sm:text-4xl lg:text-[45px]">
            <span style={{ color: "#105402" }}>{DESCRIPTION_EMPHASIS}</span>{" "}
            <span className="text-grey-100">{DESCRIPTION_REST}</span>
          </p>
          <a
            href="#solution"
            className="group relative mt-8 flex w-fit items-center gap-2.5 rounded-full bg-white/10 p-[3px] pr-5 text-xs font-medium text-grey-100 transition-colors hover:bg-white/20"
          >
            <span className="pointer-events-none absolute -inset-2 -z-10 rounded-full opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-40" style={{ background: "linear-gradient(90deg, var(--gold), var(--brand-hover) 60%)" }} />
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
              <Mark size={18} color="var(--brand-deep)" />
            </span>
            Discover our process
          </a>
        </div>
      </section>
    </div>
  );
}
