import { Reveal } from "@/components/ui/Reveal";
import { TRANSFORM_STAGES } from "@/lib/story";
import { LazyVideo } from "@/components/ui/LazyVideo";

// Five stages meant to read as one continuous film strip rather than five
// separate cards — edge-to-edge, no dividers between them, same aspect
// ratio throughout. Stacks to one column below `lg`. The video row and the
// caption row below it are two separate grids so the section's own
// statement (centered over the footage, with a dark scrim) can be scoped
// to just the videos without darkening the captions too.
export function ProcessFilmGrid() {
  return (
    <div>
      {/* Below `lg` the 4 clips stack into one tall column, so a statement
          centered across the whole stack (mid-scrim) would land in the
          middle of an arbitrary video instead of reading as a heading —
          it renders as its own block above the strip on mobile/tablet
          instead, and only moves into the centered video overlay once the
          strip is a single row at `lg`. */}
      <Reveal className="mb-6 px-2 text-center lg:hidden">
        <h2 className="text-3xl leading-[1.15] font-medium text-white sm:text-4xl">
          We transform what&rsquo;s left into what comes next.
        </h2>
      </Reveal>

      {/* Its own fully rounded corners — this grid sits inset inside its
          (larger, padded, dark-emerald) card wrapper rather than bleeding
          to the card's own corners, so it needs a matching radius of its
          own, on every side. */}
      <div className="relative mb-6 grid grid-cols-1 overflow-hidden rounded-2xl lg:grid-cols-5">
        {TRANSFORM_STAGES.map((stage) => (
          <div key={stage.number} className="aspect-[3/4] w-full overflow-hidden bg-grey-100">
            {stage.video ? (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <LazyVideo className="h-full w-full object-cover" src={stage.video} />
            ) : stage.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={stage.image} alt={stage.name} loading="lazy" className="h-full w-full object-cover" />
            ) : null}
          </div>
        ))}

        <div className="pointer-events-none absolute inset-0 z-10 hidden bg-black/45 lg:block" />
        <Reveal className="pointer-events-none absolute inset-0 z-10 hidden items-center justify-center px-10 text-center lg:flex">
          <h2 className="max-w-2xl text-4xl leading-[1.1] font-medium text-white sm:text-5xl lg:text-6xl">
            We transform what&rsquo;s left into what comes next.
          </h2>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5">
        {TRANSFORM_STAGES.map((stage) => (
          <div key={stage.number} className="px-1 py-5 text-center">
            <h4 className="text-sm font-medium tracking-[0.08em] uppercase" style={{ color: "#F5F1E8" }}>
              {stage.name}
            </h4>
          </div>
        ))}
      </div>
    </div>
  );
}
