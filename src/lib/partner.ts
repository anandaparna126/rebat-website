// Data for the "Partner with us" hub page (/partner-with-us) — three
// audience-segmented panels (people with materials to recycle, people who
// want to buy recovered materials, people who need battery solutions).
// Copy and imagery specified directly by ReBAT.

export interface PartnerPanel {
  number: string;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
  image: string;
  // Per-pathway gradient tint (bottom-anchored, for text legibility over the
  // photo) and how tall this panel reads at desktop — the three are meant
  // to vary slightly rather than sit in a perfectly even grid.
  gradient: string;
  heightClass: string;
}

export const PARTNER_PANELS: PartnerPanel[] = [
  {
    number: "01",
    title: "Recycle With Us",
    description: "Have materials that need a new purpose?",
    ctaLabel: "Explore recovery",
    href: "/partner-with-us/materials",
    image: "/images/partner/recycle.webp",
    gradient:
      "linear-gradient(to bottom, rgba(25,40,36,0.00) 0%, rgba(25,40,36,0.18) 22%, rgba(25,40,36,0.58) 46%, rgba(25,40,36,0.58) 54%, rgba(25,40,36,0.18) 78%, rgba(25,40,36,0.00) 100%)",
    heightClass: "h-[460px] lg:h-[520px]",
  },
  {
    number: "02",
    title: "Source From Us",
    description: "Looking for recovered battery materials?",
    ctaLabel: "Explore materials",
    href: "/partner-with-us/source-from-us",
    image: "/images/partner/source.webp",
    gradient:
      "linear-gradient(to bottom, rgba(74,65,52,0.00) 0%, rgba(74,65,52,0.14) 22%, rgba(74,65,52,0.44) 46%, rgba(74,65,52,0.44) 54%, rgba(74,65,52,0.14) 78%, rgba(74,65,52,0.00) 100%)",
    heightClass: "h-[460px] lg:h-[600px]",
  },
  {
    number: "03",
    title: "Power With Us",
    description: "Looking for battery solutions?",
    ctaLabel: "Explore battery solutions",
    href: "/partner-with-us/power-with-us",
    image: "/images/partner/power.webp",
    gradient:
      "linear-gradient(to bottom, rgba(3,45,37,0.00) 0%, rgba(3,45,37,0.22) 22%, rgba(3,45,37,0.66) 46%, rgba(3,45,37,0.66) 54%, rgba(3,45,37,0.22) 78%, rgba(3,45,37,0.00) 100%)",
    heightClass: "h-[460px] lg:h-[560px]",
  },
];
