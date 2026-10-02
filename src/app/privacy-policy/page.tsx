import { PageHero } from "@/components/layout/PageHero";
import { PageShell } from "@/components/layout/PageShell";
import { Reveal } from "@/components/ui/Reveal";
import { CONTACT_INFO } from "@/lib/content";

// A working draft covering what this site actually does — the enquiry and
// contact forms collect name/email/phone/company/message (see ContactForm
// and EnquiryModal), there are no accounts, no payments and no analytics
// or tracking cookies wired up yet — rather than generic boilerplate or
// claims about data practices the site doesn't actually have. It's still a
// legal document, so it's flagged at the bottom as pending ReBAT's legal
// team's review before being treated as final.
const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: "1. Who this policy covers",
    body: (
      <p>
        This privacy policy explains how ReBAT (&ldquo;ReBAT&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) collects,
        uses and protects personal information from visitors to this website and from anyone who
        contacts us through it. It applies to this website only, not to any other ReBAT premises,
        systems or communications.
      </p>
    ),
  },
  {
    title: "2. Information we collect",
    body: (
      <>
        <p className="mb-3">
          <span className="font-medium text-ink">Information you give us.</span> When you submit an
          enquiry or contact form on this site, we collect what you enter: your name, email address,
          phone number, company name (if given) and the content of your message.
        </p>
        <p>
          <span className="font-medium text-ink">Information collected automatically.</span> Like most
          websites, our hosting and server infrastructure automatically logs standard technical
          information &mdash; such as IP address, browser type and pages visited &mdash; for security and
          operational purposes. We do not currently use analytics, advertising or tracking cookies on
          this site; if that changes, this policy will be updated first.
        </p>
      </>
    ),
  },
  {
    title: "3. How we use your information",
    body: (
      <ul className="list-disc space-y-1.5 pl-5">
        <li>To respond to enquiries submitted through our contact and enquiry forms.</li>
        <li>To provide information about ReBAT&rsquo;s products, services and capabilities.</li>
        <li>To maintain internal business records of enquiries and correspondence.</li>
        <li>To meet legal, regulatory or safety obligations where required.</li>
      </ul>
    ),
  },
  {
    title: "4. Sharing of information",
    body: (
      <p>
        We do not sell or rent your personal information. It is shared only with ReBAT team members
        who need it to respond to your enquiry, and with service providers who help us operate this
        website (such as hosting), bound to protect it. We may disclose information if required by
        law or to protect ReBAT&rsquo;s legal rights.
      </p>
    ),
  },
  {
    title: "5. Data retention",
    body: (
      <p>
        We retain enquiry and contact information for as long as reasonably necessary to respond to
        you and to keep a business record of the correspondence, after which it is deleted or
        anonymised unless a longer period is required by law.
      </p>
    ),
  },
  {
    title: "6. Security",
    body: (
      <p>
        We take reasonable technical and organisational measures to protect the personal information
        we hold from unauthorised access, loss or misuse. No method of transmission or storage is
        completely secure, so we cannot guarantee absolute security.
      </p>
    ),
  },
  {
    title: "7. Your rights",
    body: (
      <p>
        Under India&rsquo;s Digital Personal Data Protection Act, 2023, you have the right to ask us
        what personal information we hold about you, to request correction of inaccurate information,
        and to withdraw consent or ask us to delete information you have submitted to us. To exercise
        any of these rights, contact us using the details below.
      </p>
    ),
  },
  {
    title: "8. Children’s privacy",
    body: (
      <p>
        This website and its forms are intended for business enquiries and are not directed at, or
        knowingly used to collect information from, children.
      </p>
    ),
  },
  {
    title: "9. Changes to this policy",
    body: (
      <p>
        We may update this policy from time to time as our website or practices change. The current
        version always applies, and the date below reflects when it was last updated.
      </p>
    ),
  },
  {
    title: "10. Contact us",
    body: (
      <p>
        For any question about this policy or your personal information, contact us at{" "}
        <a href={`mailto:${CONTACT_INFO.email}`} className="text-brand hover:underline">
          {CONTACT_INFO.email}
        </a>
        , call{" "}
        <a href={`tel:+${CONTACT_INFO.phone.replace(/\D/g, "")}`} className="text-brand hover:underline">
          {CONTACT_INFO.phone}
        </a>
        , or write to us at {CONTACT_INFO.address}.
      </p>
    ),
  },
];

export default function PrivacyPolicy() {
  return (
    <PageShell>
      <PageHero content={{ eyebrow: "Legal", headline: "Privacy Policy" }} image="/images/life/reception.webp" />

      <section className="bg-white px-[5vw] py-20">
        <Reveal className="mx-auto max-w-[720px]">
          <p className="mb-12 text-sm text-grey-500">Last updated: 30 September 2026</p>

          <div className="space-y-10">
            {SECTIONS.map((section) => (
              <div key={section.title}>
                <h2 className="mb-3 text-lg font-bold text-ink">{section.title}</h2>
                <div className="text-sm leading-relaxed text-grey-600">{section.body}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>
    </PageShell>
  );
}
