import { WhatWeTakeIn } from "@/components/story/WhatWeTakeIn";
import { HowWeTransform } from "@/components/story/HowWeTransform";

// Bridges Impact ("what closing the loop changes") and Products ("what we
// put back into the world") with the missing first half of the story: what
// comes in, and how it's transformed. Shares Products' own surface-stone
// tone, so its own bottom seam needs no special handling — but its top
// edge sits right under Impact's rounded-bottom corner, so it's pulled up
// underneath Impact via a negative top margin (Impact stays above it in
// z-index), the same structural overlap technique used at every other
// rounded section boundary on this page.
export function RebatStorySection() {
  return (
    <section className="relative -mt-10 bg-surface-stone">
      <WhatWeTakeIn />
      <div className="mx-auto max-w-[1328px] border-t border-ink/10" />
      <HowWeTransform />
    </section>
  );
}
