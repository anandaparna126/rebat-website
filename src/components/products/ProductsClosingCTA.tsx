import { Reveal } from "@/components/ui/Reveal";
import { ContactButton } from "@/components/ui/ContactButton";

// The Products section's closing moment — a big, full-bleed looping video
// (cylib's own treatment for a section like this: real footage filling the
// frame, a dark overlay for legibility, text sitting on top) rather than a
// flat text band. Square bottom edge, not rounded — this one sits flush
// against the section below rather than using the rounded-corner notch
// technique used elsewhere on the site.
//
// `variant` gives the homepage and the dedicated /products page their own
// separate video files — a lesson learned the hard way: this used to be a
// single shared file, and swapping it for /products silently changed the
// homepage's footage too. "classic" restores the homepage's original clip
// (Cinematic_1.mp4); "detailed" (default) is the newer /products footage.
export function ProductsClosingCTA({ variant = "detailed" }: { variant?: "classic" | "detailed" }) {
  const src = variant === "classic" ? "/videos/products/closing-cinematic-home.mp4" : "/videos/products/closing-cinematic.mp4";
  return (
    <div className="relative flex min-h-[80vh] items-center overflow-hidden bg-grey-900 px-[5vw] py-28">
      <video
        key={src}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        src={src}
        autoPlay
        muted
        loop
        playsInline
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(10,24,20,0.85), rgba(10,24,20,0.35) 55%, rgba(10,24,20,0.55))" }}
      />

      <Reveal className="relative mx-auto max-w-[1328px]">
        <h3 className="max-w-2xl text-4xl leading-[1.1] font-medium text-white sm:text-5xl">
          Building for what is yet to come.
        </h3>
        <p className="mt-4 max-w-md text-white/80">
          From recovered resources to energy that moves the world forward.
        </p>
        <ContactButton href="/contact" className="mt-10 w-fit" />
      </Reveal>
    </div>
  );
}
