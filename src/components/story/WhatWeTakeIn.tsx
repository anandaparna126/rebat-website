import { Reveal } from "@/components/ui/Reveal";
import { MaterialInputCarousel } from "@/components/story/MaterialInputCarousel";

// Heading scale (text-5xl/6xl/7xl) and section padding (px-[5vw]) match
// ProductsIntro's own heading block, so this reads as the same section
// family even without repeating its small-eyebrow treatment.
export function WhatWeTakeIn() {
  return (
    <div className="px-[5vw] pt-28 pb-20">
      <Reveal>
        <h2 className="max-w-2xl text-5xl leading-[1.05] font-medium text-ink sm:text-6xl lg:text-7xl">
          Today&rsquo;s Waste Tomorrow&rsquo;s Future
        </h2>
        <p className="mt-4 max-w-xl text-lg text-body">
          From production scrap to end-of-life batteries, we take in materials that still hold value and give them a path forward.
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <MaterialInputCarousel />
      </Reveal>
    </div>
  );
}
