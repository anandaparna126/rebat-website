import { Reveal } from "@/components/ui/Reveal";

export function ProductsIntro() {
  return (
    // No max-w/mx-auto centering here — matches Impact's own heading
    // container (plain px-[5vw]) exactly, so "What we put back..." starts
    // at the same left edge as "What closing the loop changes." above it.
    <div className="px-[5vw] pt-28 pb-16">
      <Reveal>
        <div className="mb-6 text-xs font-medium tracking-[0.25em] text-grey-400 uppercase">Products</div>
        <h2 className="max-w-2xl text-5xl leading-[1.05] font-medium text-ink sm:text-6xl lg:text-7xl">
          What we put back into the world.
        </h2>
        <p className="mt-6 max-w-md text-lg text-body">
          From recovered battery materials to engineered battery solutions, our products keep valuable resources in
          use.
        </p>
      </Reveal>
    </div>
  );
}
