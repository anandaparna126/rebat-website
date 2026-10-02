import { Grain } from "@/components/ui/Grain";
import { DESCRIPTION_EMPHASIS, DESCRIPTION_REST, SOCIAL_LINKS } from "@/lib/content";

const LINKEDIN_HREF = SOCIAL_LINKS.find((s) => s.label === "LinkedIn")!.href;

export function Description() {
  return (
    // cylib's own real technique (not a manually colour-matched wrapper):
    // this section stays above ProcessLoop in z-index, and ProcessLoop is
    // pulled up underneath it with a negative top margin. Wherever this
    // section's own rounded corner curves away, ProcessLoop's *real*
    // background shows through directly — nothing to keep in sync, unlike
    // the old flat-colour wrapper this replaced. The video already fills
    // this section edge to edge, so no explicit background is needed here.
    <section className="relative z-10 overflow-hidden rounded-b-[32px] px-[5vw] pt-32 pb-24">
      {/* Video first (bottom layer), a semi-transparent version of the
          section's own grey-to-emerald ramp on top of it (keeps the same
          blend into Hero above / ProcessLoop below, just no longer fully
          opaque so the footage actually shows through), grain, then the
          text — in that stacking order. */}
      <video
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        src="/videos/description/maintext.mp4"
        autoPlay
        muted
        loop
        playsInline
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
          href={LINKEDIN_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-grey-100 transition-colors hover:text-white"
        >
          Follow ReBAT on LinkedIn
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </section>
  );
}
