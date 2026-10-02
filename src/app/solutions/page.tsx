import { PageShell } from "@/components/layout/PageShell";
import { PartnerHero } from "@/components/partner/PartnerHero";
import { Lifecycle } from "@/components/solutions/Lifecycle";
import { SolutionPanels } from "@/components/solutions/SolutionPanels";
import { ContactButton } from "@/components/ui/ContactButton";
import { Grain } from "@/components/ui/Grain";
import { Reveal } from "@/components/ui/Reveal";
import { SOLUTIONS_CLOSING, SOLUTIONS_HERO } from "@/lib/solutions";

// The Solutions gateway: introduces the four solution verticals and hands
// visitors to each one's own page. Deliberately light on copy — the detail
// lives on the dedicated pages. Products = what ReBAT produces; Solutions =
// the capabilities it can bring; Partner with us = how to engage.
//
// The hero is the same scroll-shrink PartnerHero used on the homepage and the
// Partner with us pages (it renders its own Nav, hence `hideNav`).
export default function Solutions() {
  return (
    <PageShell hideNav>
      <PartnerHero
        eyebrow={SOLUTIONS_HERO.eyebrow}
        headline={SOLUTIONS_HERO.headline}
        image="/images/solutions/hero.webp"
        description={SOLUTIONS_HERO.description}
        ctaLabel="Explore solutions"
        ctaHref="#solution-panels"
      />

      <div id="solution-panels">
        <SolutionPanels />
      </div>

      <Lifecycle />

      {/* Closing — brand emerald, the same colour the footer's rounded top
          reveals, so the two meet without a seam. */}
      <section className="relative overflow-hidden bg-brand px-[5vw] py-24 text-center">
        <Grain opacity={0.05} />
        <Reveal className="relative mx-auto max-w-[720px]">
          <h2 className="text-3xl font-medium text-white sm:text-5xl">{SOLUTIONS_CLOSING.headline}</h2>
          <p className="mx-auto mt-4 max-w-[46ch] text-base text-white/80">{SOLUTIONS_CLOSING.description}</p>
          <ContactButton href="/contact" label={SOLUTIONS_CLOSING.ctaLabel} className="mx-auto mt-9 w-fit" />
        </Reveal>
      </section>
    </PageShell>
  );
}
