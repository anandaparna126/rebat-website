import { ProductsIntro } from "@/components/products/ProductsIntro";
import { RecycledMaterialsShowcase } from "@/components/products/RecycledMaterialsShowcase";
import { BatteryProductsShowcase } from "@/components/products/BatteryProductsShowcase";
import { ProductsClosingCTA } from "@/components/products/ProductsClosingCTA";

// Products — a cinematic, data-driven material-to-application story rather
// than a card grid. Two chapters (Recovered Materials, Battery Products) in
// one continuous flow; see src/lib/products.ts for the data feeding both.
//
// `variant` lets the homepage and the dedicated /products page show two
// deliberately different views of the same data — see RecycledMaterials
// Showcase/BatteryProductsShowcase for what each variant actually renders.
//
// `fadeFromWhite` softens the top seam into a preceding white section
// (the /products page's own hero) with a short gradient instead of a hard
// cut. Left off by default — on the homepage this section sits directly
// below another surface-stone section already, so no fade is needed there.
export function Products({
  variant = "detailed",
  fadeFromWhite = false,
}: {
  variant?: "classic" | "detailed";
  fadeFromWhite?: boolean;
}) {
  return (
    <section
      id="products"
      className={fadeFromWhite ? undefined : "bg-surface-stone"}
      style={fadeFromWhite ? { background: "linear-gradient(to bottom, #ffffff 0px, var(--surface-stone) 220px)" } : undefined}
    >
      <ProductsIntro variant={variant} />
      <RecycledMaterialsShowcase variant={variant} />
      <BatteryProductsShowcase variant={variant} />
      <ProductsClosingCTA variant={variant} />
    </section>
  );
}
