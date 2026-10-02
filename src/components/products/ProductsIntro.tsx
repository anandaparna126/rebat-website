import { Reveal } from "@/components/ui/Reveal";

// `variant` lets the homepage ("classic") show its own shorter heading
// without touching the dedicated /products page ("detailed"), which keeps
// its original full-sentence one.
export function ProductsIntro({ variant = "detailed" }: { variant?: "classic" | "detailed" }) {
  return (
    // No max-w/mx-auto centering here — matches Impact's own heading
    // container (plain px-[5vw]) exactly, so this heading starts at the
    // same left edge as the Impact section's heading above it.
    <div className="px-[5vw] pt-28 pb-16">
      <Reveal>
        <div className="mb-6 text-xs font-medium tracking-[0.25em] text-grey-400 uppercase">Products</div>
        {variant === "classic" ? (
          <h2 className="text-5xl leading-[1.05] font-medium whitespace-nowrap text-ink sm:text-6xl lg:text-7xl">
            Putting Back to the <span style={{ color: "var(--brand)" }}>World</span>
          </h2>
        ) : (
          <h2 className="max-w-2xl text-5xl leading-[1.05] font-medium text-ink sm:text-6xl lg:text-7xl">
            What we put back into the world.
          </h2>
        )}
        <p className="mt-6 max-w-md text-lg text-body">
          From recovered battery materials to engineered battery solutions, our products keep valuable resources in
          use.
        </p>
      </Reveal>
    </div>
  );
}
