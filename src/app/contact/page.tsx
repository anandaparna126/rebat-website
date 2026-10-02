import { PageHero } from "@/components/layout/PageHero";
import { PageShell } from "@/components/layout/PageShell";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { CONTACT_HERO, CONTACT_INFO, CONTACT_PILLS } from "@/lib/content";
import { isExternalHref } from "@/lib/links";

export default function Contact() {
  return (
    <PageShell>
      <PageHero content={CONTACT_HERO} image="/images/life/reception.webp">
        <div className="mt-8 flex flex-wrap gap-2.5">
          {CONTACT_PILLS.map((pill) => (
            <a
              key={pill.href}
              href={pill.href}
              className="rounded-lg border border-white/40 px-5 py-2.5 text-sm text-white transition-colors hover:bg-white/10"
              {...(isExternalHref(pill.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {pill.label}
            </a>
          ))}
        </div>
      </PageHero>

      <section className="bg-white px-[5vw] py-20">
        <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <h2 className="mb-2 text-3xl font-medium text-ink">Send us a message.</h2>
            <p className="mb-8 text-sm text-grey-600">Tell us what you need and our team will get back to you directly.</p>
            <ContactForm />
          </Reveal>

          <Reveal delay={0.05} className="flex flex-col gap-6">
            <div className="rounded-2xl border border-grey-200 bg-grey-50 p-6">
              <div className="mb-2 text-xs font-medium tracking-[0.08em] text-grey-600 uppercase">Address</div>
              <p className="text-sm text-ink">{CONTACT_INFO.address}</p>
            </div>
            <div className="rounded-2xl border border-grey-200 bg-grey-50 p-6">
              <div className="mb-2 text-xs font-medium tracking-[0.08em] text-grey-600 uppercase">Phone</div>
              <a href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, "")}`} className="text-sm text-ink hover:text-brand">
                {CONTACT_INFO.phone}
              </a>
            </div>
            <div className="rounded-2xl border border-grey-200 bg-grey-50 p-6">
              <div className="mb-2 text-xs font-medium tracking-[0.08em] text-grey-600 uppercase">Email</div>
              <a href={`mailto:${CONTACT_INFO.email}`} className="text-sm text-ink hover:text-brand">
                {CONTACT_INFO.email}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
