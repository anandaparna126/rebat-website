import { PageHero } from "@/components/layout/PageHero";
import { PageShell } from "@/components/layout/PageShell";
import { Reveal } from "@/components/ui/Reveal";
import { CONTACT_INFO } from "@/lib/content";

// The actual privacy-policy text isn't drafted here — that's a legal
// document that needs to come from ReBAT's legal team, not be fabricated.
export default function PrivacyPolicy() {
  return (
    <PageShell>
      <PageHero content={{ eyebrow: "Legal", headline: "Privacy Policy" }} />

      <section className="bg-white px-[5vw] py-20">
        <Reveal className="mx-auto max-w-[640px] rounded-2xl border border-dashed border-grey-200 bg-grey-50 p-8">
          <div className="mb-1 text-[11px] font-medium tracking-[0.06em] text-grey-400 uppercase">Pending</div>
          <p className="mb-4 text-sm text-grey-600">
            Full privacy policy text to be provided by ReBAT&apos;s legal team.
          </p>
          <p className="text-sm text-grey-600">
            Questions in the meantime can be sent to{" "}
            <a href={`mailto:${CONTACT_INFO.email}`} className="text-brand hover:underline">
              {CONTACT_INFO.email}
            </a>
            .
          </p>
        </Reveal>
      </section>
    </PageShell>
  );
}
