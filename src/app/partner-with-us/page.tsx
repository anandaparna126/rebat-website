import { PageShell } from "@/components/layout/PageShell";
import { Reveal } from "@/components/ui/Reveal";
import { PartnerPanels } from "@/components/partner/PartnerPanels";
import { PartnerHero } from "@/components/partner/PartnerHero";
import { ContactButton } from "@/components/ui/ContactButton";
import { GetInTouch } from "@/components/cta/GetInTouch";
import { RECYCLE_HERO } from "@/lib/content";

// The "Partner with us" hub — three audience-segmented entry points
// (recycle with us / source from us / power with us) rather than the old
// single value-chain-links page. The Close the Loop diagram lives on the
// homepage only now; this page's job is routing visitors to the right
// relationship, not re-explaining the process.
export default function PartnerWithUs() {
  return (
    <PageShell hideNav>
      <PartnerHero eyebrow={RECYCLE_HERO.eyebrow} headline={RECYCLE_HERO.headline} image="/images/partner/hero.webp" />

      <section className="bg-white px-[5vw] pt-24 pb-16 text-center">
        <Reveal>
          <p className="mx-auto max-w-none text-lg leading-[1.3] font-semibold text-ink sm:text-xl lg:text-2xl">
            &ldquo;From recovering valuable battery materials to delivering battery solutions,
            <br />
            we work with businesses across the battery value chain.&rdquo;
          </p>
        </Reveal>
      </section>

      <PartnerPanels />

      {/* Same full-bleed closing-video treatment as the homepage's Products
          section (ProductsClosingCTA): real footage filling the frame, a
          dark "to top" gradient for legibility. Structural overlap
          technique: pulled up underneath PartnerPanels via a negative top
          margin, and stays above GetInTouch (passed its own `overlap`
          prop below) in z-index, so both rounded corners reveal their
          neighbour's *real* background through the notch instead of a
          manually colour-matched wrapper. */}
        <div className="relative z-10 -mt-10 flex min-h-[80vh] items-center overflow-hidden rounded-b-[32px] bg-grey-900 px-[5vw] py-28">
          <video
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            src="/videos/partner/get-in-touch.mp4"
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
              Partnerships start with a conversation.
            </h3>
            <ContactButton href="/contact" label="Get in touch" className="mt-10 w-fit" />
          </Reveal>
        </div>

      <GetInTouch overlap />
    </PageShell>
  );
}
