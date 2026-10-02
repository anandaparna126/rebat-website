// Real content sourced from "Website Home Page Flow.docx" (supplied by the
// user) — this is the only source of truth for homepage copy on this fresh
// build. Nothing here is carried over from the old rebat.in project.

// Real routes, matching cylib's actual multi-page structure (confirmed by
// inspecting their live site's nav + footer links) rather than in-page
// anchors. "Solution" has no cylib equivalent and isn't part of that
// rebuild — left as its own in-page anchor per the standing decision to
// treat it separately.
export const NAV_LINKS = [
  { href: "/partner-with-us", label: "Partner with us" },
  { href: "/products", label: "Products" },
  { href: "/about-us", label: "About us" },
  { href: "/solutions", label: "Solution" },
  { href: "https://career.rebat.in/", label: "Jobs" },
  { href: "/newsroom", label: "Newsroom" },
] as const;

export const TAGLINE_EYEBROW = "Energising the circular battery economy";
export const TAGLINE = "Renew. Recover. Power. India's energy future.";

export const DESCRIPTION_EMPHASIS =
  "At ReBAT, we help secure critical minerals for India while powering our circular economy.";
export const DESCRIPTION_REST =
  "Every battery, from its production to end of life, moves its resources toward full utilization. We combine high-tech repurpose solutions and advanced recycling to maximize value across the battery lifecycle.";

// Impact section — five statements in a bento-style grid (cylib's own
// "In a nutshell" pattern: white photo cards, a plain caption below the
// photo). Content (numbers, headings, descriptions, the stat claims) is
// specified exactly by the user.
//
// Each card's photo carries only its bare stat number (bottom-left,
// bold) when it has one; the rest of the claim moves down into the white
// section as the card's own heading, with the description beneath it as
// before. Cards with no numeric claim (Central India's Pioneer, Nothing
// Ends Here) just show their full heading in the white section and no
// text on the photo itself.
//
// The opening "Central India's Pioneer" card uses an AI-generated map
// graphic (Gemini, supplied by the user 2026-09-30 at their explicit
// direction) pinning the facility's location in Madhya Pradesh, in place
// of the real aerial photo used here previously (that photo is still used
// on the About Us page). Back to the ordinary cropped `cover` fit (an
// earlier pass switched this to `contain` so the whole map outline never
// got clipped, but the user preferred the fuller, edge-to-edge cropped
// look back). Of the remaining four: the 95% card still uses AI-generated
// abstract art (supplied by the user at their explicit direction, flagged
// for the same reason); the other three (Lower Carbon Footprint,
// Reduction in Reliance on New Extraction, Nothing Ends Here) use real
// stock/conceptual photography the user supplied 2026-09-30 — not
// AI-generated, but also not ReBAT's own facility photography.
export interface ImpactItem {
  number: string;
  /** The bare stat shown in bold on the photo itself — omitted for
   * statements that aren't a number claim. */
  stat?: string;
  /** Shown as the card's own bold heading in the white section: the rest
   * of the claim after the stat for number cards, or the full statement
   * for cards with no stat. */
  heading: string;
  description: string;
  image: string;
  imageAlt: string;
  objectPosition: string;
  /** "contain" for a graphic/illustration that must never be cropped —
   * paired with `imageBackground` so the letterboxed edges blend into the
   * graphic's own backdrop instead of showing bare white. Defaults to
   * "cover" (crops to fill, like a photo). */
  fit?: "cover" | "contain";
  imageBackground?: string;
  /** A short line shown vertically centred on the left side of the photo
   * — for the Pioneer card's "Only in the Nation" line, sitting over the
   * map graphic's own dark-green texture on that side. */
  overlayLabel?: string;
}

export const IMPACT_ITEMS: ImpactItem[] = [
  {
    number: "01",
    stat: "#1",
    heading: "Central India's Pioneer",
    description:
      "Central India's first and only integrated battery recycling facility, driven by proprietary technology and in-house innovation.",
    image: "/images/impact/central-india-pioneer-map.webp",
    imageAlt: "Stylised map of India in emerald green, with a location pin marking ReBAT's facility in Madhya Pradesh.",
    objectPosition: "60% 50%",
    overlayLabel: "Only in the Nation",
  },
  {
    number: "02",
    stat: "96%",
    heading: "Recover More. Return More.",
    description:
      "96% high-rate recovery of valuable material from spent LIBs, returned to the resource cycle.",
    image: "/images/impact/recover-what-future-needs.webp",
    imageAlt: "Abstract AI-generated artwork: separated piles of graphite, black mass, copper, and other recovered materials on dark slate.",
    objectPosition: "50% 55%",
  },
  {
    number: "03",
    stat: "73%",
    heading: "Lower Carbon Footprint",
    description:
      "From extraction to production, circularity changes the battery material story. Less virgin mining, lower carbon intensity, greater resource efficiency.",
    image: "/images/impact/lower-carbon-footprint.webp",
    imageAlt: "Two footprints made of green plant growth on bare soil, illustrating a lowered carbon footprint.",
    objectPosition: "75% 50%",
  },
  {
    number: "04",
    stat: "26%",
    heading: "Reduction in Reliance on New Extraction",
    description:
      "Strengthening resource security while reducing dependency on virgin materials.",
    image: "/images/impact/less-reliance-virgin-materials.webp",
    imageAlt: "Crushed raw rock and mineral aggregate, fading into a dark teal overlay.",
    objectPosition: "72% 60%",
  },
  {
    number: "05",
    heading: "Nothing Ends Here",
    description:
      "From reuse to recycling, we keep batteries and their valuable resources in circulation for longer.",
    image: "/images/impact/nothing-ends-here.webp",
    imageAlt: "Aerial view of a car driving down a road cutting through dense forest.",
    objectPosition: "50% 50%",
  },
];

export interface LoopNode {
  id: string;
  label: string;
  sublabel?: string;
  /** The real building this step happens in, shown as a small chip on the
   * step's hover card — only set for steps that happen inside ReBAT's own
   * compound (matches that building's own roof signage in the diagram). */
  plant?: string;
  x: number;
  y: number;
}

export interface LoopEdge {
  from: string;
  to: string;
  label?: string;
}

// The ReBAT factory flow diagram, updated per ReBAT's own walkthrough of
// the real process: collection center -> reverse logistics -> factory ->
// characterisation/test -> [recycling / refurbishment] -> ... -> customers,
// looping back to the collection center. Nothing invented beyond what was
// described directly.
export const LOOP_NODES: LoopNode[] = [
  { id: "collection", label: "Collection Center", sublabel: "Organized (OEMs) + Unorganized (Scrap Dealers)", x: 20, y: 90 },
  { id: "factory", label: "ReBAT Factory", plant: "Warehouse", x: 200, y: 90 },
  { id: "characterisation", label: "Characterisation / Test", sublabel: "ReBAT Hitech Lab", plant: "QC & Innovation Lab", x: 380, y: 90 },
  { id: "recycling", label: "Recycling Plant", sublabel: "Battery Scrap Processing", plant: "Recycling Plant", x: 560, y: 30 },
  { id: "refurb", label: "Refurbished Batteries", sublabel: "Reconditioning", plant: "Second Life Plant", x: 560, y: 150 },
  { id: "extraction", label: "Critical Mineral Extraction Plant", sublabel: "Lithium, Cobalt, Nickel, etc.", plant: "Hydrometallurgy Plant", x: 740, y: 30 },
  { id: "packmaker", label: "Battery Pack Manufacturing Plant", sublabel: "Assemble Battery Packs", plant: "Second Life Plant", x: 740, y: 150 },
  { id: "quality", label: "Quality Check Control", plant: "QC & Innovation Lab", x: 920, y: 30 },
  { id: "testing", label: "Testing", plant: "Testing", x: 920, y: 150 },
  { id: "cellmaker", label: "Cell Manufacturer", sublabel: "Cells", x: 1100, y: 30 },
  { id: "customers", label: "Customers", sublabel: "EV Battery Buyers", x: 1100, y: 150 },
];

// Quality checks happen at the QC Lab (the same place as characterisation)
// and pack assembly happens at the Second Life Plant (the same place as
// refurb) — both ride on their host step's own card instead of being a
// separate stop along the road, so neither needs an edge of its own here.
export const LOOP_EDGES: LoopEdge[] = [
  { from: "collection", to: "factory", label: "Reverse Logistics\nAcross the Nation" },
  { from: "factory", to: "characterisation" },
  { from: "characterisation", to: "recycling" },
  { from: "characterisation", to: "refurb" },
  { from: "recycling", to: "extraction", label: "Black Mass" },
  { from: "extraction", to: "cellmaker" },
  { from: "cellmaker", to: "collection" },
  { from: "refurb", to: "testing" },
  { from: "testing", to: "customers" },
  { from: "customers", to: "collection" },
];

export interface MaterialItem {
  id: string;
  name: string;
  description: string;
  application: string;
  /** CSS gradient standing in for real material photography, matching the
   * actual described color/form of each output until real photos exist. */
  swatch: string;
  element?: {
    symbol: string;
    atomicNumber: number;
    atomicWeight: string;
    group: number;
    period: number;
  };
}

// The 8 real recovered outputs from the brochure — mechanical-separation
// outputs and hydrometallurgical-refining outputs kept as one flat list
// (not split into two groups). 6 of these are single elements and get real
// periodic-table coordinates; Black Mass and Steel Fraction are mixtures/
// alloys and are never assigned a fake element position.
export const MATERIALS: MaterialItem[] = [
  {
    id: "black-mass",
    name: "Black Mass",
    description:
      "The mixed powder recovered during mechanical processing of end-of-life battery scrap, carrying lithium, cobalt, nickel, manganese and graphite values ahead of chemical refining.",
    application: "Pending",
    swatch: "linear-gradient(155deg, #2a2a28, #050505)",
  },
  {
    id: "copper-fraction",
    name: "Copper Fraction",
    description: "Mechanically separated copper recovered from current collectors and internal wiring in battery scrap.",
    application: "Pending",
    swatch: "linear-gradient(155deg, #d98b4a, #7a3f1a)",
    element: { symbol: "Cu", atomicNumber: 29, atomicWeight: "63.55", group: 11, period: 4 },
  },
  {
    id: "aluminium-fraction",
    name: "Aluminium Fraction",
    description: "Mechanically separated aluminium recovered from battery casings and current collectors.",
    application: "Pending",
    swatch: "linear-gradient(155deg, #d9dcde, #9aa1a6)",
    element: { symbol: "Al", atomicNumber: 13, atomicWeight: "26.98", group: 13, period: 3 },
  },
  {
    id: "steel-fraction",
    name: "Steel Fraction",
    description: "Mechanically separated steel recovered from battery casings and structural components.",
    application: "Pending",
    swatch: "linear-gradient(155deg, #6b7278, #2e3336)",
  },
  {
    id: "graphite-concentrate",
    name: "Graphite Concentrate",
    description: "Recovered graphite concentrate from spent battery anodes, separated out during mechanical processing.",
    application: "Pending",
    swatch: "linear-gradient(155deg, #3a3a3a, #0d0d0d)",
    element: { symbol: "C", atomicNumber: 6, atomicWeight: "12.011", group: 14, period: 2 },
  },
  {
    id: "cobalt-sulphate",
    name: "Cobalt Sulphate",
    description: "Cobalt recovered through hydrometallurgical refining and crystallised as cobalt sulphate.",
    application: "Pending",
    swatch: "linear-gradient(155deg, #f0a8b8, #c85f7c)",
    element: { symbol: "Co", atomicNumber: 27, atomicWeight: "58.93", group: 9, period: 4 },
  },
  {
    id: "nickel-sulphate",
    name: "Nickel Sulphate",
    description: "Nickel recovered through hydrometallurgical refining and crystallised as nickel sulphate.",
    application: "Pending",
    swatch: "linear-gradient(155deg, #a9d9a0, #5f9e56)",
    element: { symbol: "Ni", atomicNumber: 28, atomicWeight: "58.69", group: 10, period: 4 },
  },
  {
    id: "lithium-compounds",
    name: "Lithium Compounds",
    description: "Lithium carbonate and other lithium compounds recovered through hydrometallurgical refining.",
    application: "Pending",
    swatch: "linear-gradient(155deg, #ffffff, #d8dad9)",
    element: { symbol: "Li", atomicNumber: 3, atomicWeight: "6.94", group: 1, period: 2 },
  },
];

export interface RecognitionCategory {
  id: "certifications" | "awards";
  title: string;
}

// Two tabs only — Certifications has real content (see CERTIFICATIONS
// below); Awards has none yet, so it renders as an honest pending state.
export const RECOGNITION_CATEGORIES: RecognitionCategory[] = [
  { id: "certifications", title: "Certifications" },
  { id: "awards", title: "Awards" },
];

// The full category set articles can be tagged with — kept as-is so
// existing article data still typechecks. What the newsroom's own filter
// tabs show is NEWSROOM_VISIBLE_CATEGORIES below, which is narrower.
export const NEWSROOM_CATEGORIES = [
  "Company Updates",
  "Announcements",
  "Industry News",
  "Milestones & Achievements",
  "Events & Activities",
  "New Developments",
  "Blogs",
] as const;

// Industry News, Milestones & Achievements and New Developments are
// hidden as filter tabs at the user's direction; articles tagged with
// them still exist and still show up under "All" and on their own
// article pages, they just don't get their own tab.
const HIDDEN_NEWSROOM_CATEGORIES: readonly string[] = ["Industry News", "Milestones & Achievements", "New Developments"];
export const NEWSROOM_VISIBLE_CATEGORIES = NEWSROOM_CATEGORIES.filter((c) => !HIDDEN_NEWSROOM_CATEGORIES.includes(c));

export const GET_IN_TOUCH_PILLS = [
  { label: "Partner with us", href: "/partner-with-us" },
  { label: "Products", href: "/products" },
  { label: "Solution", href: "/solutions" },
  { label: "Jobs", href: "https://career.rebat.in/" },
  { label: "Newsroom", href: "/newsroom" },
] as const;

// ---------------------------------------------------------------------
// Sub-page content — real facts from the ReBAT brochure PDF everywhere
// they're available; explicitly marked "Pending" where they aren't
// (founding story, headcount, named open roles, press articles). Nothing
// below is invented.
// ---------------------------------------------------------------------

export interface PageHeroContent {
  eyebrow: string;
  headline: string;
}

export const RECYCLE_HERO: PageHeroContent = {
  eyebrow: "Partner with us",
  headline: "Let’s build the circular energy future today.",
};

export const RECYCLE_MATERIALS_HERO: PageHeroContent = {
  eyebrow: "Recycle with us",
  headline: "Give your battery scrap a new purpose.",
};

export const SOURCE_FROM_US_HERO: PageHeroContent = {
  eyebrow: "Source from us",
  headline: "Recovered materials. Ready for what comes next.",
};

export const POWER_WITH_US_HERO: PageHeroContent = {
  eyebrow: "Power with us",
  headline: "Power for what comes next.",
};

export const PRODUCTS_HERO: PageHeroContent = {
  eyebrow: "Products",
  headline: "What we recover, and what we build.",
};

export const ABOUT_HERO: PageHeroContent = {
  eyebrow: "About us",
  headline: "Closing the Loop on India's Battery Future.",
};

export const JOBS_HERO: PageHeroContent = {
  eyebrow: "Jobs",
  headline: "Build India's battery recycling future with us.",
};

export const NEWSROOM_HERO: PageHeroContent = {
  eyebrow: "Newsroom",
  headline: "Updates from ReBAT.",
};

export const CONTACT_HERO: PageHeroContent = {
  eyebrow: "Contact",
  headline: "Get in touch with us.",
};

// Real content for the About Us page, supplied directly by ReBAT (source:
// "Rebat About Us.docx") — supersedes the earlier brochure-derived
// positioning/vision/mission below, which used different wording than this
// dedicated document. Founding year corrected from the docx's "2023" to
// "2024" per ReBAT's own LinkedIn company page (linkedin.com/company/
// rebatindia), confirmed by the user as the accurate year, 2026-09-30.
export const ABOUT_TAGLINE =
  "ReBAT is the battery recycling and critical materials recovery initiative of Sage Green Industries Private Limited, part of the SAGE Group.";

export const ABOUT_INTRO_PARAGRAPHS = [
  "Established in 2024, ReBAT is building a responsible and technology-driven ecosystem for lithium-ion battery recycling, resource recovery, and circularity from its facility in Mandideep, Madhya Pradesh.",
  "As India rapidly moves toward electric mobility, energy storage, and a cleaner energy future, the need for responsible battery end-of-life management is becoming increasingly important. ReBAT is built to address this challenge by transforming end-of-life batteries and battery waste into valuable resources that can return to the industrial supply chain.",
];
export const ABOUT_INTRO_EMPHASIS = "Our vision goes beyond recycling.";
export const ABOUT_INTRO_CLOSING =
  "We are working to build a circular battery ecosystem where batteries are responsibly collected, processed, recovered, and their valuable materials are returned to productive use.";

// At-a-glance facts, sourced from ReBAT's own LinkedIn company page
// (linkedin.com/company/rebatindia, reviewed 2026-09-30). Team size is
// LinkedIn's self-reported company-size band, not its "employees on
// LinkedIn" count (which only reflects who has linked their profile).
export interface AboutQuickFact {
  label: string;
  value: string;
}
export const ABOUT_QUICK_FACTS: AboutQuickFact[] = [
  { label: "Founded", value: "2024" },
  { label: "Headquarters", value: "Mandideep, Madhya Pradesh" },
  { label: "Team size", value: "51–200 employees" },
  { label: "Parent group", value: "The SAGE Group, est. 1983" },
];

export const ABOUT_LEGACY_PARAGRAPHS = [
  "ReBAT carries forward the entrepreneurial vision and long-standing legacy of the SAGE Group, an established business group with roots dating back to 1983.",
  "Over more than four decades, the SAGE Group has expanded across diverse sectors including education, healthcare, real estate, electrical infrastructure, and now critical mineral processing and battery recycling.",
  "ReBAT represents the Group's commitment to participating in India's emerging clean-energy and circular-economy ecosystem. With this foundation, ReBAT combines institutional experience, entrepreneurial leadership, technology, and a sustainability-driven approach to address one of the most important challenges emerging from the energy transition.",
];

export interface AboutCapability {
  title: string;
  description: string;
}

export const ABOUT_WHAT_WE_DO_INTRO =
  "ReBAT works across the battery recycling value chain to recover value from lithium-ion batteries and support a more circular battery ecosystem.";
export const ABOUT_WHAT_WE_DO: AboutCapability[] = [
  {
    title: "Collect",
    description:
      "We facilitate the responsible collection and movement of end-of-life lithium-ion batteries, production scrap, and other battery waste streams.",
  },
  {
    title: "Recycle",
    description:
      "Through specialised battery processing and recycling technologies, we safely process used batteries and prepare them for material recovery.",
  },
  {
    title: "Recover",
    description:
      "Our processes are designed to recover valuable battery materials and critical resources, helping return them to the broader supply chain.",
  },
  {
    title: "Refurbish & Repurpose",
    description:
      "Where technically feasible, battery assets can be evaluated for refurbishment, second-life applications, or other productive uses before final recycling.",
  },
  {
    title: "Enable EPR",
    description:
      "We support battery producers, manufacturers, importers, OEMs, and other stakeholders with responsible end-of-life management and EPR-related requirements. ReBAT provides collection, recycling, documentation, and compliance support under the applicable Battery Waste Management framework.",
  },
];

export const ABOUT_FLOW_INTRO = [
  "A battery's useful life does not necessarily end when it can no longer serve its original application.",
  "It can begin a new journey.",
];
export const ABOUT_FLOW_STAGES = ["Collection", "Sorting", "Processing", "Material Recovery", "Reuse", "Circular Supply Chain"];
export const ABOUT_FLOW_CLOSING = [
  "ReBAT is working to create this circular pathway by ensuring that valuable resources contained within used batteries are recovered and directed toward productive applications.",
  "This approach helps reduce dependence on virgin resources, minimise battery waste, and contribute to a more resilient domestic battery-material ecosystem.",
];

export interface AboutApproachPillar {
  title: string;
  description: string;
}

export const ABOUT_APPROACH: AboutApproachPillar[] = [
  {
    title: "Technology Driven",
    description:
      "Battery recycling requires specialised processes capable of handling different battery formats, chemistries, and waste streams. ReBAT focuses on improving process efficiency, material recovery, and resource utilisation through technology and continuous innovation.",
  },
  {
    title: "Sustainability Focused",
    description:
      "We believe recycling should create environmental value, not simply move waste from one location to another. Our approach focuses on responsible processing, resource recovery, waste minimisation, and efficient use of energy and materials.",
  },
  {
    title: "Compliance Led",
    description:
      "Responsible battery management requires strong systems for collection, documentation, traceability, and regulatory compliance. ReBAT works with businesses to create structured end-of-life pathways for their battery waste and support their applicable EPR obligations.",
  },
  {
    title: "Circular by Purpose",
    description:
      "Our objective is to keep valuable battery materials within the economic cycle for as long as possible. By recovering resources from spent batteries, we help transform a waste challenge into a resource opportunity.",
  },
];

export interface AboutJourneyMilestone {
  year: string;
  title: string;
  description: string;
}

export const ABOUT_JOURNEY: AboutJourneyMilestone[] = [
  {
    year: "1983",
    title: "The SAGE Legacy Begins",
    description:
      "The SAGE Group begins its journey, establishing a foundation built around entrepreneurship, trust, and long-term institution building.",
  },
  {
    year: "2024",
    title: "ReBAT Takes Shape",
    description: "The SAGE Group expands into the emerging battery recycling and critical-materials ecosystem with ReBAT.",
  },
  {
    year: "2026",
    title: "Building the Circular Battery Ecosystem",
    description:
      "ReBAT operates from Mandideep, Madhya Pradesh, working toward a scalable and responsible ecosystem for lithium-ion battery recycling, material recovery, and battery lifecycle management.",
  },
];

export const ABOUT_LEADERSHIP = {
  name: "Karan Khurana",
  title: "Founder & CEO",
  initials: "KK",
  bio: [
    "Karan Khurana is an entrepreneur and business leader working at the intersection of clean energy, circular economy, critical minerals, and EV mobility. He is the Founder & CEO of ReBAT, building an integrated battery lifecycle platform spanning refurbishment, advanced recycling, and critical-mineral recovery and refining. An MBA from UCLA Anderson School of Management, combined with experience across high-growth organisations, shapes his global perspective and disciplined execution in building scalable businesses for India's evolving energy landscape.",
    "With SAGE Green Industries, his focus on urban mining reflects a broader vision: turning end-of-life batteries into valuable resources, reducing dependency on virgin materials, and strengthening India's domestic clean-energy supply chain. Karan is a growing voice in clean energy, electric mobility, circular economy and critical minerals, contributing to platforms including the EMFAI Sustainable Mobility Summit, India Battery & Critical Materials Conference, BRICS Young Leaders Dialogue and Economic Times Viksit Bharat Conclave.",
  ],
};

export const ABOUT_VISION_HEADLINE = "A Circular Battery Economy for India";
export const ABOUT_VISION_LINES = [
  "We envision a future where every battery has a responsible pathway beyond its first life.",
  "Where battery waste is treated as a valuable resource.",
  "Where critical materials are recovered and returned to the supply chain.",
  "And where India's growing clean-energy economy is supported by a strong, domestic, circular resource ecosystem.",
];
export const ABOUT_VISION_CLOSING = "ReBAT is building that future, by closing the loop on batteries.";

export const ABOUT_MISSION =
  "To build a safe, responsible, technology-enabled, and scalable battery recycling ecosystem that maximises resource recovery, supports regulatory compliance, and contributes to India's transition toward a circular and sustainable economy.";

export interface AboutValue {
  title: string;
  description: string;
}

export const ABOUT_VALUES: AboutValue[] = [
  { title: "Sustainability", description: "Making resource recovery and environmental responsibility central to the way we operate." },
  {
    title: "Innovation",
    description: "Continuously improving technology and processes to make battery recycling more efficient and effective.",
  },
  { title: "Integrity", description: "Building relationships through transparency, accountability, and responsible business practices." },
  {
    title: "Responsibility",
    description: "Treating every battery, material, partner, and community with the highest level of responsibility.",
  },
  {
    title: "Circularity",
    description: "Keeping valuable resources in productive use and reducing the need for virgin resource extraction.",
  },
];


export interface BusinessLine {
  title: string;
  description: string;
}

// The brochure's 4 real capability lines — ReBAT is broader than a single-
// purpose recycler.
export const BUSINESS_LINES: BusinessLine[] = [
  { title: "Battery Manufacturing", description: "Advanced lithium battery packs for EVs, BESS, and industrial applications." },
  { title: "Battery Recycling", description: "End-to-end Li-ion battery recycling with efficient material recovery." },
  { title: "EPR & Compliance Solutions", description: "EPR registration, credit management, and compliance support for producers." },
  { title: "Hazardous Waste Management", description: "Collection, storage, treatment, and disposal per regulatory norms." },
];

// Real bullet list from the brochure's "Why Choose ReBAT" section.
export const WHY_CHOOSE_REBAT = [
  "Integrated battery lifecycle solutions",
  "High recovery efficiency",
  "Environmentally responsible operations",
  "Scalable infrastructure",
  "End-to-end transparency",
];

// Real, verbatim from the brochure.
export const INDUSTRIES_SERVED = [
  "EV Manufacturers",
  "Battery Manufacturers",
  "Energy Storage Companies",
  "Automotive OEMs",
  "Electronics Manufacturers",
  "Battery Collection Networks",
  "EPR Organizations",
  "Battery Material Traders",
  "Fleet Operators",
  "Renewable Energy Companies",
];

export interface Certification {
  id: string;
  title: string;
  description: string;
}

export interface Award {
  id: string;
  title: string;
  description: string;
  /** The real photo from the LinkedIn post, extracted via its public
   * og:image tag (LinkedIn doesn't serve post media into the page itself
   * for a signed-out viewer, but still publishes it there for link
   * previews). */
  image: string;
  /** The real LinkedIn post this was sourced from. */
  link: string;
}

// Sourced directly from ReBAT's own LinkedIn posts (supplied by the user,
// 2026-09-30), photos included. The CII item is a speaking engagement,
// not a formal award — described as such rather than folded into
// "award" language the post itself doesn't use; its date and location
// ("11 December 2025, Bhopal") were read off the event backdrop banner in
// the post's own og:image podium photo, which the user then had swapped
// twice for photos they supplied directly — first a plaque-presentation +
// venue composite, then just the plaque-presentation half of it — so the
// date/location are no longer visible in the photo actually shown, but
// remain accurate to the same real event.
export const AWARDS: Award[] = [
  {
    id: "et-changemakers-2026",
    title: "ET Industry Changemakers Award – North 2026",
    description:
      "Founder Karan Khurana was honoured with the ET Industry Changemakers Award – North 2026, for Excellence in Critical Minerals and the Circular Economy.",
    image: "/images/awards/et-changemakers-2026.webp",
    link: "https://www.linkedin.com/posts/rebatindia_a-proud-moment-for-rebat-were-thrilled-activity-7498974736765382656-S6qI",
  },
  {
    id: "cii-green-logistics-2025",
    title: "CII Green Logistics Conclave 2025",
    description:
      "ReBAT shared the stage at the CII MP Green Logistics Conclave 2025 (11 December 2025, Bhopal), discussing the transition to electric vehicles in Madhya Pradesh and the role of battery recycling in building a circular economy.",
    image: "/images/awards/cii-green-logistics-2025.webp",
    link: "https://www.linkedin.com/posts/rebatindia_batteryrecycling-electricvehicles-batteryrecycling-activity-7405137085306990593-HW8-",
  },
];

// Real certifications from the brochure.
// "ISO & Safety Compliance" was dropped at the user's direction — no real
// certificate exists for it, unlike the other three (each now backed by
// an actual certificate document, see CERT_BADGE_IMAGES in Recognition.tsx).
export const CERTIFICATIONS: Certification[] = [
  { id: "epr", title: "EPR Certified", description: "Authorised support for producer EPR obligations with transparent documentation." },
  { id: "cpcb", title: "CPCB Registered R4 Recycler", description: "Authorised to recycle end-of-life batteries in India." },
  { id: "hazardous", title: "Hazardous Waste Authorization", description: "Registered for collection, transportation, storage, and treatment." },
];

export interface ProcessStage {
  step: number;
  title: string;
}

// The brochure's real 10-stage process — same source the homepage's loop
// diagram condenses into its own nodes.
export const PROCESS_STAGES: ProcessStage[] = [
  { step: 1, title: "Collection & Reverse Logistics" },
  { step: 2, title: "Safe Discharging" },
  { step: 3, title: "Dismantling & Sorting" },
  { step: 4, title: "Crushing & Shredding" },
  { step: 5, title: "Separation & Processing" },
  { step: 6, title: "Black Mass Production" },
  { step: 7, title: "Hydrometallurgical Refining" },
  { step: 8, title: "Critical Material Recovery" },
  { step: 9, title: "Battery Material Production" },
  { step: 10, title: "Sustainable Loop" },
];

// Generic, non-fabricated description of a standard hiring process — no
// invented headcounts, timelines, or team names.
export interface JobsProcessStep {
  step: number;
  title: string;
  description: string;
}

export const JOBS_PROCESS: JobsProcessStep[] = [
  { step: 1, title: "Application", description: "Send us your CV and a brief note on why you're interested. Every application is reviewed." },
  { step: 2, title: "Introductory conversation", description: "A first call to get to know your background and introduce you to ReBAT." },
  { step: 3, title: "Role-focused interview", description: "A deeper conversation about the role, your experience, and how you'd contribute." },
  { step: 4, title: "Decision & offer", description: "If it's a match, you'll receive an offer and we'll answer any remaining questions." },
  { step: 5, title: "Onboarding", description: "We'll set you up with what you need to get started." },
];

export const JOBS_FAQ = [
  { question: "How does the hiring process work?", answer: "It typically moves through an application review, one or more conversations, and an offer — the exact steps depend on the role." },
  { question: "Will I meet the team during the process?", answer: "Yes — for most roles you'll speak with the team you'd be joining before any offer is made." },
  { question: "How long does the process take?", answer: "It varies by role. We aim to keep candidates updated at every stage." },
];

// Category pills matching the intent of cylib's own contact page (routed
// by who's reaching out) — mapped to our real nav sections rather than
// cylib's own categories (we don't have a Media/Investors program to
// point these at yet).
export const CONTACT_PILLS = [
  { label: "Partner with us", href: "/partner-with-us" },
  { label: "Products", href: "/products" },
  { label: "Jobs", href: "https://career.rebat.in/" },
] as const;

// Real contact details from the brochure. Phone corrected from the
// brochure's "+91 93090 52261" to "+91 9039 052 261" per rebat.in's own
// live footer (two digits were transposed), confirmed by the user as the
// accurate number, 2026-09-30.
export const CONTACT_INFO = {
  address: "Plot No. E-17-18, Sector Industrial Area, Phase-II, Mandideep Industrial Area, Dist. Raisen, MP – 462046",
  phone: "+91 9039 052 261",
  email: "info@rebat.in",
};

// Real social profile links, sourced directly from rebat.in's own live
// footer (reviewed 2026-09-30). No YouTube/TikTok link exists there.
export const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://www.facebook.com/rebatind/" },
  { label: "Instagram", href: "https://www.instagram.com/rebatbhopal" },
  { label: "X (Twitter)", href: "https://x.com/Rebatindia" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/rebatindia/" },
  { label: "Pinterest", href: "https://in.pinterest.com/ReBATindia/" },
] as const;
