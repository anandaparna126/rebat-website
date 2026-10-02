import { PageShell } from "@/components/layout/PageShell";
import { PartnerHero } from "@/components/partner/PartnerHero";
import { Products } from "@/components/products/Products";
import { GetInTouch } from "@/components/cta/GetInTouch";
import { PRODUCTS_HERO } from "@/lib/content";

export default function ProductsPage() {
  return (
    <PageShell hideNav>
      <PartnerHero
        eyebrow={PRODUCTS_HERO.eyebrow}
        headline={PRODUCTS_HERO.headline}
        image="/images/products/hero-products.webp"
        description="From recovered battery materials to engineered battery solutions, our products keep valuable resources in use."
        ctaLabel="Get in touch"
        ctaHref="/contact"
      />

      <Products fadeFromWhite />

      <GetInTouch />
    </PageShell>
  );
}
