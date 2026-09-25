import { PageHero } from "@/components/layout/PageHero";
import { PageShell } from "@/components/layout/PageShell";
import { Reveal } from "@/components/ui/Reveal";
import { CONTACT_INFO } from "@/lib/content";

// Real, verifiable facts only (company contact details from the brochure).
// The legal notice text itself isn't drafted here — that needs to come
// from ReBAT's legal team, not be fabricated.
export default function Imprint() {
  return (
    <PageShell>
      <PageHero content={{ eyebrow: "Legal", headline: "Imprint" }} />

      <section className="bg-white px-[5vw] py-20">
        <Reveal className="mx-auto max-w-[640px]">
          <h2 className="mb-2 text-lg font-bold text-ink">ReBAT</h2>
          <p className="mb-1 text-sm text-grey-600">{CONTACT_INFO.address}</p>
          <p className="mb-1 text-sm text-grey-600">Phone: {CONTACT_INFO.phone}</p>
          <p className="mb-8 text-sm text-grey-600">Email: {CONTACT_INFO.email}</p>
          <div className="rounded-2xl border border-dashed border-grey-200 bg-grey-50 p-6">
            <div className="mb-1 text-[11px] font-medium tracking-[0.06em] text-grey-400 uppercase">Pending</div>
            <p className="text-sm text-grey-600">Full legal notice text to be provided by ReBAT&apos;s legal team.</p>
          </div>
        </Reveal>
      </section>
    </PageShell>
  );
}
