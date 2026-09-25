import { WhatWeTakeIn } from "@/components/story/WhatWeTakeIn";
import { HowWeTransform } from "@/components/story/HowWeTransform";

// Bridges Impact ("what closing the loop changes") and Products ("what we
// put back into the world") with the missing first half of the story: what
// comes in, and how it's transformed. Shares Impact's/Products' own
// surface-stone tone throughout (both neighbours already use it), so no
// notch-fill colour changes are needed at either seam — this section is a
// plain, flat-edged block sitting between two sections already tuned to
// the same background.
export function RebatStorySection() {
  return (
    <section className="bg-surface-stone">
      <WhatWeTakeIn />
      <div className="mx-auto max-w-[1328px] border-t border-ink/10" />
      <HowWeTransform />
    </section>
  );
}
