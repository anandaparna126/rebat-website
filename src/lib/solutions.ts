// Data for the Solutions section: the /solutions gateway page and the four
// dedicated pages it links to. Copy for the gateway is specified directly by
// ReBAT; nothing here adds capabilities, guarantees, certifications or
// achievements beyond it. Adding or editing a solution means editing this
// array only.
//
// Imagery: no solution-specific photography exists yet, so each panel uses a
// real ReBAT photo from the existing warm-concrete industrial set (the same
// family used on the Recycle With Us intake list). Swap `image` when
// dedicated photography is supplied.

export interface Solution {
  slug: "battery-design" | "reverse-logistics" | "epr" | "r-and-d";
  number: string;
  title: string;
  statement: string;
  description: string;
  ctaLabel: string;
  href: string;
  image: string;
  imageAlt: string;
  /** CSS object-position for the portrait photo inside its panel. */
  imagePosition?: string;
}

export const SOLUTIONS_HERO = {
  eyebrow: "Solutions",
  headline: "Built around the battery lifecycle.",
  description:
    "From battery design and reverse logistics to EPR and advanced R&D, we bring technology and expertise together across the battery lifecycle.",
};

export const SOLUTIONS_CLOSING = {
  headline: "Let's build what comes next.",
  description: "Have a battery challenge in mind? Let's talk about where ReBat can help.",
  ctaLabel: "Talk to ReBat",
};

export const SOLUTIONS: Solution[] = [
  {
    slug: "battery-design",
    number: "01",
    title: "Battery Design",
    statement: "Engineering batteries for what comes next.",
    description:
      "From battery architecture to application-specific systems, we develop solutions around how energy needs to perform.",
    ctaLabel: "Explore Battery Design",
    href: "/solutions/battery-design",
    image: "/images/story/rejected-battery-packs.webp",
    imageAlt: "An engineered battery pack with busbars and wiring on a workshop floor",
    imagePosition: "50% 60%",
  },
  {
    slug: "reverse-logistics",
    number: "02",
    title: "Reverse Logistics",
    statement: "Moving batteries back into the resource cycle.",
    description:
      "We help businesses manage the movement of batteries and battery materials from collection through recovery.",
    ctaLabel: "Explore Reverse Logistics",
    href: "/solutions/reverse-logistics",
    image: "/images/story/battery-cells-modules.webp",
    imageAlt: "Collected battery cells and modules laid out on a concrete floor",
    imagePosition: "50% 55%",
  },
  {
    slug: "epr",
    number: "03",
    title: "EPR",
    statement: "Turning battery responsibility into action.",
    description: "Supporting businesses in managing their responsibilities across the battery lifecycle.",
    ctaLabel: "Explore EPR",
    href: "/solutions/epr",
    image: "/images/story/manufacturing-process-scrap.webp",
    imageAlt: "Sorted battery material streams (metals, foils and powders) laid out for inspection",
    imagePosition: "50% 65%",
  },
  {
    slug: "r-and-d",
    number: "04",
    title: "R&D",
    statement: "Where new battery possibilities take shape.",
    description:
      "Exploring materials, processes and technologies that can shape the next generation of battery solutions.",
    ctaLabel: "Explore R&D",
    href: "/solutions/r-and-d",
    image: "/images/story/battery-materials.webp",
    imageAlt: "Recovered battery materials (copper, graphite and metal powders) in close view",
    imagePosition: "50% 70%",
  },
];
