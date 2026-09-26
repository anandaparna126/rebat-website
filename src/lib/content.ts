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
  { href: "/jobs", label: "Jobs" },
  { href: "/newsroom", label: "Newsroom" },
] as const;

export const TAGLINE_EYEBROW = "Next generation battery recycling";
export const TAGLINE = "Renew. Recover. Power. India's energy future.";

export const DESCRIPTION_EMPHASIS =
  "At ReBAT, every battery at its end holds resources for a new beginning.";
export const DESCRIPTION_REST =
  "We give batteries a new purpose by extending the life of usable batteries and recovering valuable critical minerals from those that reach the end of their first life - keeping resources in circulation and powering India's energy future.";

// Editorial-composition impact section — six visual statements, each with
// its own size tier, panel gradient, and photography, rather than six
// identical cards. Content (numbers, titles, descriptions, the "80%" claim,
// panel colours) is specified exactly by the user; only the gradient stops
// and object-position values are this file's own art-direction choices,
// derived from inspecting the real artwork.
export interface ImpactItem {
  number: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  objectPosition: string;
  size: "large" | "medium" | "small";
  gradient: string;
  /** A single solid hex representing the gradient's own tone — used to fade
   * the photo into its panel colour rather than cutting to it abruptly. */
  panelSolid: string;
  textColor: "dark" | "light";
}

export const IMPACT_ITEMS: ImpactItem[] = [
  {
    number: "01",
    title: "80% Lower Carbon Footprint",
    description:
      "A circular approach to battery materials can reduce the carbon intensity associated with resource extraction and battery production.",
    image: "/images/impact/lower-carbon-footprint.webp",
    imageAlt: "A single footprint pressed into a dark, refined recovered-material surface.",
    objectPosition: "42% 48%",
    size: "large",
    gradient: "linear-gradient(150deg, #E8EED8, #F2EFE0)",
    panelSolid: "#EDEEDC",
    textColor: "dark",
  },
  {
    number: "02",
    title: "Reduce Reliance on New Extraction",
    description:
      "Recovering materials from end-of-life batteries reduces the need for new resource extraction.",
    image: "/images/impact/less-reliance-virgin-materials.webp",
    imageAlt: "A refined recovered-metal ingot resting against a raw mineral surface.",
    objectPosition: "50% 46%",
    size: "medium",
    gradient: "linear-gradient(150deg, #B9C8C5, #C9D5D2)",
    panelSolid: "#C1CECB",
    textColor: "dark",
  },
  {
    number: "03",
    title: "Recover What the Future Needs",
    description:
      "Recovering critical minerals from battery waste helps strengthen India's domestic resource base and supply security.",
    image: "/images/impact/recover-what-future-needs.webp",
    imageAlt: "Recovered graphite, copper, and metallic material specimens arranged together.",
    objectPosition: "45% 50%",
    size: "small",
    gradient: "linear-gradient(150deg, #DDD5C4, #EAE4D6)",
    panelSolid: "#E3DCCD",
    textColor: "dark",
  },
  {
    number: "04",
    title: "Nothing Ends Here",
    description:
      "From reuse to recycling, we keep batteries and their valuable resources in circulation for longer.",
    image: "/images/impact/nothing-ends-here.webp",
    imageAlt: "A continuous ring formed from coiled metal and raw material, suggesting an unbroken cycle.",
    objectPosition: "42% 50%",
    size: "large",
    gradient: "linear-gradient(150deg, #376F63, #2A5951)",
    panelSolid: "#30645A",
    textColor: "light",
  },
  {
    number: "05",
    title: "Recover More. Return More.",
    description:
      "We recover valuable materials from spent batteries and return them to the resource cycle.",
    image: "/images/impact/recover-more-return-more.webp",
    imageAlt: "Recovered black mass separating into copper, graphite, and metallic constituent materials.",
    objectPosition: "45% 55%",
    size: "large",
    gradient: "linear-gradient(150deg, #343A38, #242826)",
    panelSolid: "#2C312F",
    textColor: "light",
  },
  {
    number: "06",
    title: "Resources for What Comes Next",
    description:
      "Building domestic battery-recycling capabilities helps strengthen India's clean-energy supply chain.",
    image: "/images/impact/resources-for-what-comes-next.webp",
    imageAlt: "Recovered mineral materials in the foreground, with industrial energy infrastructure beyond.",
    objectPosition: "50% 80%",
    size: "small",
    gradient: "linear-gradient(150deg, #E9E5D8, #F2EFE6)",
    panelSolid: "#EDEADF",
    textColor: "dark",
  },
];

export interface LoopNode {
  id: string;
  label: string;
  sublabel?: string;
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
// described directly. Where each node sits on screen is presentation, not
// content — see ProcessLoop.tsx's LAYOUT.
export const LOOP_NODES: LoopNode[] = [
  { id: "collection", label: "Collection Center", sublabel: "Organized (OEMs) + Unorganized (Scrap Dealers)" },
  { id: "factory", label: "ReBAT Factory" },
  { id: "characterisation", label: "Characterisation / Test", sublabel: "ReBAT Hitech Lab" },
  { id: "recycling", label: "Recycling Plant", sublabel: "Battery Scrap Processing" },
  { id: "refurb", label: "Refurbished Batteries", sublabel: "Reconditioning" },
  { id: "extraction", label: "Critical Mineral Extraction Plant", sublabel: "Lithium, Cobalt, Nickel, etc." },
  { id: "packmaker", label: "Battery Pack Manufacturing Plant", sublabel: "Assemble Battery Packs" },
  { id: "quality", label: "Quality Check Control" },
  { id: "testing", label: "Testing" },
  { id: "cellmaker", label: "Cell Manufacturer", sublabel: "Cells" },
  { id: "customers", label: "Customers", sublabel: "EV Battery Buyers" },
  { id: "used", label: "Used Batteries", sublabel: "Back to Collection" },
];

export const LOOP_EDGES: LoopEdge[] = [
  { from: "collection", to: "factory", label: "Reverse Logistics\nAcross the Nation" },
  { from: "factory", to: "characterisation" },
  { from: "characterisation", to: "recycling" },
  { from: "characterisation", to: "refurb" },
  { from: "recycling", to: "extraction", label: "Black Mass" },
  { from: "refurb", to: "packmaker" },
  { from: "extraction", to: "quality" },
  { from: "packmaker", to: "testing" },
  { from: "quality", to: "cellmaker" },
  { from: "cellmaker", to: "packmaker" },
  { from: "testing", to: "customers" },
  { from: "customers", to: "used" },
  { from: "used", to: "collection" },
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

// The 9 real recovered outputs from the brochure — mechanical-separation
// outputs and hydrometallurgical-refining outputs kept as one flat list
// (not split into two groups). 7 of these are single elements and get real
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
    id: "manganese-sulphate",
    name: "Manganese Sulphate",
    description: "Manganese recovered through hydrometallurgical refining and crystallised as manganese sulphate.",
    application: "Pending",
    swatch: "linear-gradient(155deg, #d3c3ea, #9a80c2)",
    element: { symbol: "Mn", atomicNumber: 25, atomicWeight: "54.94", group: 7, period: 4 },
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

export const NEWSROOM_CATEGORIES = [
  "Company Updates",
  "Announcements",
  "Industry News",
  "Milestones & Achievements",
  "Events & Activities",
  "New Developments",
  "Blogs",
] as const;

export const GET_IN_TOUCH_PILLS = [
  { label: "Partner with us", href: "/partner-with-us" },
  { label: "Products", href: "/products" },
  { label: "Solution", href: "/solutions" },
  { label: "Jobs", href: "/jobs" },
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
  headline: "Let’s build what comes next.",
};

export const RECYCLE_MATERIALS_HERO: PageHeroContent = {
  eyebrow: "Recycle with us",
  headline: "Give your battery materials a new purpose.",
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
  headline: "Closing the Loop on India's Battery Future",
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
// dedicated document.
export const ABOUT_TAGLINE =
  "ReBAT is the battery recycling and critical materials recovery initiative of Sage Green Industries Private Limited, part of the SAGE Group.";

export const ABOUT_INTRO_PARAGRAPHS = [
  "Established in 2023, ReBAT is building a responsible and technology-driven ecosystem for lithium-ion battery recycling, resource recovery, and circularity from its facility in Mandideep, Madhya Pradesh.",
  "As India rapidly moves toward electric mobility, energy storage, and a cleaner energy future, the need for responsible battery end-of-life management is becoming increasingly important. ReBAT is built to address this challenge by transforming end-of-life batteries and battery waste into valuable resources that can return to the industrial supply chain.",
];
export const ABOUT_INTRO_EMPHASIS = "Our vision goes beyond recycling.";
export const ABOUT_INTRO_CLOSING =
  "We are working to build a circular battery ecosystem where batteries are responsibly collected, processed, recovered, and their valuable materials are returned to productive use.";

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
    year: "2023",
    title: "ReBAT Takes Shape",
    description: "The SAGE Group expands into the emerging battery recycling and critical-materials ecosystem with ReBAT.",
  },
  {
    year: "Today",
    title: "Building the Circular Battery Ecosystem",
    description:
      "ReBAT operates from Mandideep, Madhya Pradesh, working toward a scalable and responsible ecosystem for lithium-ion battery recycling, material recovery, and battery lifecycle management.",
  },
];

// No leadership photo supplied — the page shows an initials mark instead
// of inventing or sourcing a stand-in photo.
export const ABOUT_LEADERSHIP = {
  name: "Mr. Karan Khurana",
  title: "Founder & Managing Director",
  initials: "KK",
  bio: [
    "ReBAT is driven by the vision of Mr. Karan Khurana, whose leadership is focused on building a responsible and future-ready battery recycling ecosystem.",
    "As part of the leadership of the SAGE Group, Mr. Khurana brings an entrepreneurial approach to the development of ReBAT and its role in India's evolving clean-energy and circular-economy landscape. The SAGE Group publicly lists Mr. Karan Khurana as a Managing Director.",
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

export const ABOUT_CLOSING_HEADLINE = "Building Tomorrow from What We Recover Today";
export const ABOUT_CLOSING_PARAGRAPHS = [
  "India's energy transition is creating an unprecedented opportunity, and a responsibility.",
  "The batteries powering India's mobility and energy future will eventually reach the end of their first life. What happens next matters.",
  "At ReBAT, we are building the systems, technology, and partnerships needed to give those batteries a responsible next chapter.",
];
export const ABOUT_CLOSING_RHYTHM = ["Recover", "Recycle", "Reuse", "Renew"];
export const ABOUT_CLOSING_TAGLINE = "Closing the Loop on India's Battery Future.";

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

// Real certifications from the brochure.
export const CERTIFICATIONS: Certification[] = [
  { id: "epr", title: "EPR Certified", description: "Authorised support for producer EPR obligations with transparent documentation." },
  { id: "cpcb", title: "CPCB Registered R2 & R4 Recycler", description: "Authorised to recycle end-of-life batteries in India." },
  { id: "hazardous", title: "Hazardous Waste Authorization", description: "Registered for collection, transportation, storage, and treatment." },
  { id: "iso", title: "ISO & Safety Compliance", description: "Quality, safety, and environmental standards." },
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

export interface ValueChainSource {
  id: string;
  slug: string;
  title: string;
  description: string;
}

// The 3 real intake sources cylib's own site dedicates a page to each of —
// ours are grounded in the brochure's real process description rather than
// cylib's own copy.
export const VALUE_CHAIN_SOURCES: ValueChainSource[] = [
  {
    id: "end-of-life-batteries",
    slug: "end-of-life-batteries",
    title: "End-of-life batteries",
    description:
      "Batteries that have reached the end of their usable life — from EVs, energy storage systems, and electronics — collected through our reverse-logistics network and processed through our 10-stage recovery pipeline.",
  },
  {
    id: "production-scraps",
    slug: "production-scraps",
    title: "Production scraps",
    description:
      "Manufacturing scrap from cell and battery production lines, recovered through the same dismantling, crushing, and separation stages as end-of-life batteries.",
  },
  {
    id: "black-mass",
    slug: "black-mass",
    title: "Black mass",
    description:
      "The mixed powder produced by mechanically processing battery scrap, carrying lithium, cobalt, nickel, manganese, and graphite values ahead of hydrometallurgical refining.",
  },
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
  { label: "Jobs", href: "/jobs" },
] as const;

// Real contact details from the brochure.
export const CONTACT_INFO = {
  address: "Plot No. E-17-18, Sector Industrial Area, Phase-II, Mandideep Industrial Area, Dist. Raisen, MP – 462046",
  phone: "+91 93090 52261",
  email: "info@rebat.in",
};
