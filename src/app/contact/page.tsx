import { PageHero } from "@/components/layout/PageHero";
import { PageShell } from "@/components/layout/PageShell";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { CONTACT_HERO, CONTACT_INFO, CONTACT_PILLS } from "@/lib/content";

export default function Contact() {
  return (
    <PageShell>
      <PageHero content={CONTACT_HERO}>
        <div className="mt-8 flex flex-wrap gap-2.5">
          {CONTACT_PILLS.map((pill) => (
            <a
              key={pill.href}
              href={pill.href}
              className="rounded-full border border-white/40 px-5 py-2.5 text-sm text-white transition-colors hover:bg-white/10"
            >
              {pill.label}
            </a>
          ))}
        </div>
      </PageHero>

      <section className="bg-white px-[5vw] py-20">
        <Reveal className="mx-auto grid max-w-[1100px] grid-cols-1 gap-10 lg:grid-cols-[minmax(0,340px)_1fr]">
          <div className="flex flex-col gap-4">
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
          </div>

          <div>
            <div className="mb-6">
              <div className="mb-2 text-xs font-medium tracking-[0.08em] text-grey-600 uppercase">Send a message</div>
              <h2 className="text-2xl font-medium text-ink">We&apos;d love to hear from you.</h2>
            </div>
            <ContactForm />
          </div>
        </Reveal>
      </section>
    </PageShell>
  );
}
