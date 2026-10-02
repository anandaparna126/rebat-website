import { Grain } from "@/components/ui/Grain";
import { Reveal } from "@/components/ui/Reveal";
import { COLLECTED_PHOTOS, COLLECTED_VIDEO } from "@/lib/battery-photos";

export function CollectedGallery({ rounded = false }: { rounded?: boolean }) {
  return (
    // When `rounded`, this section plays both roles in the structural
    // overlap technique: it's pulled up underneath the section above it
    // via a negative top margin, and it stays above the section below it
    // in z-index (its own rounded-bottom corner needs that section's real
    // background to show through the notch). Only the one current caller
    // that renders this rounded (partner-with-us/materials) is part of
    // that chain — the unrounded default stays a plain flat section.
    <section
      className={`relative overflow-hidden bg-grey-900 px-[5vw] py-28 ${rounded ? "z-10 -mt-10 rounded-b-[32px]" : ""}`}
    >
      <Grain opacity={0.05} />
      <div className="relative mx-auto max-w-[1328px]">
        <Reveal className="mb-14 max-w-[820px]">
          <h2 className="text-4xl leading-[1.08] font-medium text-white sm:text-5xl">Your Scrap, Our Treasure.</h2>
          <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-white/60">
            Cells, modules and packs in every condition, and small-format batteries by the floor-load. Photographed as received.
          </p>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <Reveal className="relative col-span-2 aspect-[3/4] overflow-hidden bg-[#0e1412] sm:col-span-1 lg:row-span-2 lg:aspect-auto">
            <video
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              src={COLLECTED_VIDEO}
              aria-label="A floor covered in small-format lithium batteries"
              autoPlay
              muted
              loop
              playsInline
            />
          </Reveal>
          {COLLECTED_PHOTOS.map((photo, i) => (
            <Reveal key={photo.src} delay={(i % 3) * 0.06}>
              <figure>
                <div className="relative aspect-[4/3] overflow-hidden bg-[#0e1412]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.src} alt={photo.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                </div>
                <figcaption className="mt-2 text-[11px] font-medium tracking-[0.14em] text-white/50 uppercase">{photo.caption}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
