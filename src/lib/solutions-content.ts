// Copy for the four dedicated Solutions pages. Each block notes where it
// comes from. Anything marked CONCEPTUAL is a way of explaining the
// lifecycle or a methodology, not a claim that ReBAT performs that step as a
// guaranteed service. Nothing here adds certifications, customers,
// quantities, percentages, recovery rates, specifications, test standards or
// project names.
//
// Sources:
//  - power.ts: battery applications, design considerations, deployment stages
//  - materials.ts: who ReBAT works with, what each stream becomes
//  - content.ts: the factory flow (LOOP_NODES), brochure lists, About docx
//  - live rebat.in EPR page: BWMR 2022 framing, 24/48-hour reverse-logistics
//    figures, zero-waste recovery line (the old site's claims — to be
//    confirmed by ReBAT before launch)

import type { SolutionModalConfig } from "@/components/solutions/SolutionEnquiry";

export const MODALS = {
  batteryDesign: {
    panelColor: "linear-gradient(150deg, #376F63, #2A5951)",
    tone: "light",
    eyebrow: "Solutions: Battery Design",
    heading: "Let's talk about",
    headingAccent: "your battery application",
    description: "Tell us what you're trying to power and we'll explore the right battery solution with you.",
    topic: "Battery Design",
  },
  reverseLogistics: {
    panelColor: "linear-gradient(150deg, #B9C8C5, #C9D5D2)",
    tone: "dark",
    eyebrow: "Solutions: Reverse Logistics",
    heading: "Let's talk about",
    headingAccent: "your battery material flow",
    description: "Tell us where your batteries or battery materials are and where they need to go.",
    topic: "Reverse Logistics",
  },
  epr: {
    panelColor: "linear-gradient(150deg, #DDD5C4, #EAE4D6)",
    tone: "dark",
    eyebrow: "Solutions: EPR",
    heading: "Let's talk about",
    headingAccent: "your battery responsibility",
    description: "Tell us about your batteries and your responsibility pathway, and we'll take it from there.",
    topic: "EPR",
  },
  rAndD: {
    panelColor: "linear-gradient(150deg, #343A38, #242826)",
    tone: "light",
    eyebrow: "Solutions: R&D",
    heading: "Let's talk about",
    headingAccent: "your technology challenge",
    description: "Have a technology or battery challenge worth exploring? Tell us about it.",
    topic: "R&D",
  },
} satisfies Record<string, SolutionModalConfig>;

// ----------------------------------------------------------------------
// Landing page: the lifecycle section. Four of the eight steps are the
// four solutions; the rest are the wider ReBAT lifecycle they connect.
export interface LifecycleStep {
  label: string;
  note: string;
  /** Set for the four steps that are a Solution. */
  solution?: { number: string; href: string };
}

export const LIFECYCLE = {
  eyebrow: "The battery lifecycle",
  headline: "From first design to next life.",
  intro: "Four capabilities, one lifecycle. Each solution picks up where another leaves off.",
  steps: [
    { label: "Design", note: "A battery built around its application.", solution: { number: "01", href: "/solutions/battery-design" } },
    { label: "Use", note: "Powering mobility, storage and industry." },
    { label: "Collection", note: "Batteries and scrap reach a collection centre." },
    { label: "Reverse logistics", note: "Moving batteries back into the resource cycle.", solution: { number: "02", href: "/solutions/reverse-logistics" } },
    { label: "Recovery", note: "Materials recovered through recycling." },
    { label: "EPR", note: "Responsibility connected to what physically happens.", solution: { number: "03", href: "/solutions/epr" } },
    { label: "R&D", note: "Materials, processes and technology explored.", solution: { number: "04", href: "/solutions/r-and-d" } },
    { label: "Next application", note: "Recovered resources return to use." },
  ] satisfies LifecycleStep[],
};

// ----------------------------------------------------------------------
// 01 Battery Design
// Sources: power.ts (applications, design considerations), products.ts (Battery
// Pack line), the brochure line "advanced lithium battery packs for EVs, BESS
// and industrial applications", and the factory flow (pack assembly ->
// testing -> customers). The six process stages, the validation loop and the
// lifecycle order are supplied by ReBAT as conceptual stages, not as
// certified procedures. No chemistries, capacities, voltages, BMS/thermal
// systems, standards or performance figures appear anywhere on the page.
export const BATTERY_DESIGN = {
  meta: {
    title: "Battery Design | ReBat",
    description:
      "Explore ReBat's battery design capabilities, from application requirements and battery architecture to application-specific energy solutions.",
  },
  hero: {
    eyebrow: "Battery Design",
    headline: "Engineering batteries for what comes next.",
    description:
      "From battery architecture to application-specific systems, we develop solutions around how energy needs to perform.",
    ctaLabel: "Talk to our battery team",
  },
  application: {
    eyebrow: "The application",
    headline: "A battery starts with what it needs to do.",
    body: "Every application places different demands on its energy system. Battery design begins by understanding those requirements before defining the system around them.",
    considerations: ["Energy", "Power", "Form", "Environment", "Integration", "Intended use"],
    figure: {
      src: "/images/story/battery-cells-modules.webp",
      alt: "Battery cells and modules laid out on a concrete floor beside hand tools",
      label: "Application",
    },
  },
  process: {
    eyebrow: "From requirement to architecture",
    headline: "Turning application requirements into a battery system.",
    body: "The design process begins with understanding the application and progressively translating its requirements into a battery architecture.",
    note: "High-level stages of the design approach, scoped to each application.",
    steps: [
      { title: "Understand", description: "Application, operating conditions and energy requirements." },
      { title: "Define", description: "Translate the application requirements into battery-level requirements." },
      { title: "Architect", description: "Develop the battery configuration around those requirements." },
      { title: "Engineer", description: "Develop the physical system around the intended application." },
      { title: "Evaluate", description: "Assess the solution against the requirements it was designed around." },
      { title: "Refine", description: "Iterate toward an application-ready solution." },
    ],
  },
  architecture: {
    eyebrow: "Battery architecture",
    headline: "From cells to a complete system.",
    body: "A battery is more than its individual cells. Its architecture determines how those components come together to serve the application.",
    levels: [
      {
        label: "Cell",
        description: "The basic unit that stores energy.",
        image: "/images/story/battery-cells-modules.webp",
        alt: "Two cylindrical battery cells",
        // Zoomed crops of one real photograph, so scale reads as scale.
        crop: { origin: "24% 76%", scale: 2.6 },
        tile: "dark",
      },
      {
        label: "Module",
        description: "Cells grouped and connected together.",
        image: "/images/story/battery-cells-modules.webp",
        alt: "Cylindrical cells grouped and wired into a module",
        crop: { origin: "50% 38%", scale: 2 },
        tile: "dark",
      },
      {
        label: "Pack",
        description: "Modules brought together as a complete battery.",
        image: "/images/products/cinematic/battery.webp",
        alt: "A complete ReBAT battery pack with enclosure and connectors",
        crop: { origin: "50% 50%", scale: 1.05 },
        tile: "light",
      },
      {
        label: "Application",
        description: "Where the battery does its work.",
        image: "/images/partner/power.webp",
        alt: "Racked battery energy storage hardware in an industrial hall",
        crop: { origin: "40% 55%", scale: 1 },
        tile: "dark",
      },
    ],
  },
  world: {
    eyebrow: "Designed around the real world",
    statement: "Designed around the application.",
    headline: "Designed around the way energy is used.",
    body: "The right battery configuration depends on the environment, operating requirements and system it is designed to support.",
    // power.ts APPLICATION_FACTORS, phrased as the questions each answers.
    factors: [
      { title: "Energy", question: "How much energy does the application require?" },
      { title: "Power", question: "How does that energy need to be delivered?" },
      { title: "Form", question: "Where does the battery need to fit?" },
      { title: "Environment", question: "What conditions does it need to operate in?" },
      { title: "Integration", question: "How does it become part of the larger system?" },
      { title: "Application", question: "What is the battery ultimately being built to do?" },
    ],
  },
  applications: {
    eyebrow: "Application-specific",
    headline: "One battery does not fit every application.",
    body: "Battery architecture changes with the environment, operating requirements and system it is designed to support.",
    // power.ts POWER_APPLICATIONS — the only applications ReBAT states.
    items: [
      { title: "Mobility", description: "Advanced lithium battery packs for EVs.", image: "/images/products/cinematic/battery.webp", alt: "A ReBAT battery pack", tile: "light" },
      { title: "Energy Storage", description: "Battery Energy Storage Systems (BESS).", image: "/images/partner/power.webp", alt: "Racked battery energy storage hardware with copper busbars in an industrial hall", tile: "dark" },
      { title: "Industrial", description: "Battery packs built for industrial applications.", image: "/images/story/rejected-battery-packs.webp", alt: "A battery pack with busbars and wiring on a workshop floor", tile: "dark" },
    ],
    href: "/partner-with-us/power-with-us",
    cta: "See Power With Us",
  },
  system: {
    eyebrow: "Engineered system",
    headline: "Where energy becomes an engineered system.",
    image: "/images/story/rejected-battery-packs.webp",
    alt: "A battery pack opened to show its cell stack, copper busbars and wiring on a workshop floor",
    note: "Annotations describe what is visible in the photograph. They are not a specification.",
    // Markers sit at percentage positions of the cropped photograph.
    callouts: [
      { title: "Enclosure", description: "The housing that holds the pack together.", x: 42, y: 30 },
      { title: "Cell stack and busbars", description: "Cells arranged and joined by copper conductors.", x: 66, y: 47 },
      { title: "Wiring and connections", description: "How the pack is connected onward.", x: 75, y: 70 },
    ],
  },
  validation: {
    eyebrow: "Engineering + validation",
    headline: "Designed to meet the application.",
    body: "Engineering is only useful when the resulting system meets the requirements it was designed around.",
    steps: ["Requirement", "Design", "Evaluation", "Refinement", "Solution"],
    loop: "Evaluation feeds back into design until the solution meets the requirement.",
  },
  lifecycle: {
    eyebrow: "Part of a larger lifecycle",
    headline: "Designed within a larger battery ecosystem.",
    body: "The battery lifecycle does not end when a battery is designed or deployed. What is designed today can shape what happens to the battery tomorrow.",
    steps: [
      { label: "Battery design", tag: "Solution", current: true },
      { label: "Use", tag: "Products", note: "Battery packs", href: "/products" },
      { label: "Collection", tag: "" },
      { label: "Reverse logistics", tag: "Solution", href: "/solutions/reverse-logistics" },
      { label: "Recovery", tag: "" },
      { label: "Materials", tag: "Products", note: "Recovered materials", href: "/products" },
      { label: "R&D", tag: "Solution", href: "/solutions/r-and-d" },
      { label: "Next application", tag: "" },
    ],
    epr: { text: "Responsibility runs the length of the lifecycle:", label: "EPR", href: "/solutions/epr" },
    images: [
      { src: "/images/story/end-of-life-batteries.webp", alt: "Spent batteries in a collection bin feeding a conveyor", caption: "Collection", pos: "50% 70%" },
      { src: "/images/story/black-mass.webp", alt: "Bags of black mass being fed into a processing line", caption: "Recovery", pos: "50% 60%" },
      { src: "/images/story/battery-materials.webp", alt: "Copper, graphite and metal powders on a concrete surface", caption: "Materials", pos: "50% 70%" },
    ],
  },
  cta: {
    headline: "Have an application in mind?",
    description: "Tell us what you need to power. We'll explore the right battery solution with you.",
    ctaLabel: "Talk to our battery team",
  },
};

// ----------------------------------------------------------------------
// 02 Reverse Logistics
export const REVERSE_LOGISTICS = {
  hero: {
    eyebrow: "Reverse Logistics",
    headline: "Moving batteries back into the resource cycle.",
    description:
      "We help businesses manage the movement of batteries and battery materials from collection through recovery.",
    ctaLabel: "Talk to ReBat",
  },
  challenge: {
    eyebrow: "The challenge",
    lines: [
      "Batteries sit across different locations, in different conditions, at different stages of life.",
      "Their value is not recovered simply by collecting them.",
      "They have to be identified, handled, moved and routed to the right next stage.",
    ],
  },
  who: {
    eyebrow: "Who needs reverse logistics",
    headline: "Anyone whose batteries eventually come back.",
    // content.ts INDUSTRIES_SERVED and materials.ts VALUE_CHAIN_PARTNERS.
    groups: [
      "Automotive OEMs and EV manufacturers",
      "Fleet operators",
      "Battery manufacturers",
      "Pack and system integrators",
      "Electronics manufacturers",
      "Energy storage and renewable energy companies",
      "Battery collection networks",
    ],
  },
  manage: {
    eyebrow: "What we help manage",
    headline: "From the collection centre onward.",
    // Grounded in the factory flow diagram (collection centre: organised OEMs
    // + unorganised scrap dealers; reverse logistics across the nation; the
    // characterisation / test step) and the brochure's hazardous-waste
    // authorisation (collection, transportation, storage, treatment).
    items: [
      { title: "Collection", description: "Batteries and battery waste gathered from organised sources (OEMs) and unorganised ones, such as scrap dealers." },
      { title: "Aggregation", description: "Material brought together at collection centres before it moves on." },
      { title: "Movement", description: "Reverse logistics across the nation, into the ReBAT factory." },
      { title: "Storage", description: "Handled and stored as part of the collection-to-treatment chain." },
      { title: "Assessment", description: "Characterisation and testing at the ReBAT Hitech Lab decides what each input becomes." },
      { title: "Recovery routing", description: "Each input directed to the pathway that suits it: recycling, or refurbishment." },
    ],
  },
  flow: {
    eyebrow: "How the flow works",
    headline: "Seven steps from source to recovery.",
    note: "A way of reading the material flow, mapped to ReBAT's collection-centre-to-factory route.",
    // CONCEPTUAL
    steps: [
      { title: "Source", description: "Where the batteries or material originate." },
      { title: "Collect", description: "Gathered at a collection centre." },
      { title: "Assess", description: "Identified and characterised." },
      { title: "Consolidate", description: "Brought together into movable flows." },
      { title: "Move", description: "Reverse logistics to the factory." },
      { title: "Receive", description: "Received and logged at ReBAT." },
      { title: "Recover", description: "Routed into recycling or refurbishment." },
    ],
  },
  pathways: {
    eyebrow: "Different inputs. Different pathways.",
    headline: "What each input becomes.",
    // materials.ts WHAT_HAPPENS_NEXT
    items: [
      { from: "Usable batteries", to: "Second life" },
      { from: "End-of-life batteries", to: "Material recovery" },
      { from: "Black mass", to: "Critical minerals" },
      { from: "Production scrap", to: "Resource recovery" },
    ],
  },
  traceability: {
    eyebrow: "Traceability",
    headline: "Knowing where material is, and where it went.",
    body: "Visibility matters across the whole movement of battery material. It is what turns a collection into a recovery you can account for.",
    markers: ["Origin", "Movement", "Receipt", "Processing destination", "Recovery outcome"],
  },
  matters: {
    eyebrow: "Why it matters",
    items: ["Controlled movement", "Responsible handling", "Recovery", "Lifecycle visibility", "Resources kept in circulation"],
    reach: {
      // live rebat.in EPR page — to be confirmed by ReBAT.
      body: "A reverse logistics network spanning India, so used batteries reach the recycling facility quickly and safely.",
      stats: [
        { value: "24 Hrs", label: "Tier 1 cities" },
        { value: "48 Hrs", label: "Tier 2 cities" },
      ],
    },
  },
  cta: {
    headline: "Move what still holds value.",
    description: "Talk to ReBat about your battery material flow.",
    ctaLabel: "Talk to ReBat",
  },
};

// ----------------------------------------------------------------------
// 03 EPR
export const EPR = {
  hero: {
    eyebrow: "EPR",
    headline: "Turning battery responsibility into action.",
    description: "Supporting businesses in managing their responsibilities across the battery lifecycle.",
    ctaLabel: "Talk to ReBat",
  },
  meaning: {
    eyebrow: "What EPR means for battery businesses",
    statement:
      "Extended Producer Responsibility extends a producer's responsibility beyond making and selling a product, to what happens once it has been used.",
    // rebat.in EPR + blog: BWMR 2022 mandate.
    body: "For batteries, the Battery Waste Management Rules (BWMR 2022) mandate that manufacturers collect and recycle a significant portion of their batteries after end-of-life. It is a responsibility that runs the length of the battery lifecycle.",
  },
  who: {
    eyebrow: "Who needs EPR support",
    // About docx, "Enable EPR".
    audience: ["Battery producers", "Manufacturers", "Importers", "OEMs", "Other stakeholders"],
    note: "ReBAT provides collection, recycling, documentation and compliance support under the applicable Battery Waste Management framework.",
  },
  pathway: {
    eyebrow: "From responsibility to recovery",
    headline: "The EPR pathway.",
    note: "A conceptual pathway, showing how a responsibility connects to recovery. Each business's route is scoped with them.",
    // CONCEPTUAL
    steps: [
      { title: "Identify", description: "What batteries fall under your responsibility." },
      { title: "Register", description: "Establishing the responsibility formally." },
      { title: "Collect", description: "Bringing end-of-life batteries back." },
      { title: "Route", description: "Moving them to where they can be recovered." },
      { title: "Recover", description: "Recycling and material recovery." },
      { title: "Document", description: "Records of what was collected and recovered." },
      { title: "Report", description: "Showing the responsibility was met." },
    ],
  },
  paperwork: {
    eyebrow: "EPR is more than paperwork",
    headline: "Responsibility becomes meaningful when it connects to what physically happens to the battery.",
    start: "Producer",
    physical: ["Battery", "Collection", "Movement", "Recovery", "Materials"],
    physicalLabel: "What physically happens",
    end: "Documentation and reporting",
  },
  visibility: {
    eyebrow: "Traceability and visibility",
    headline: "A record you can stand behind.",
    body: "Lifecycle records, the movement of material and information about its recovery are what give a responsibility substance. The more clearly a battery's journey can be followed, the more clearly the responsibility can be shown.",
  },
  connect: [
    {
      eyebrow: "EPR + reverse logistics",
      title: "Responsibility needs a route.",
      body: "Collecting batteries and moving them to recovery is where an obligation turns into movement. Reverse logistics is that route.",
      href: "/solutions/reverse-logistics",
      cta: "Explore Reverse Logistics",
    },
    {
      eyebrow: "EPR + recovery",
      title: "Responsibility ends in recovery.",
      body: "What is collected is recycled, and its materials recovered and returned to the supply chain: the physical outcome behind the record.",
      href: "/partner-with-us/materials",
      cta: "See how we recycle",
    },
  ],
  cta: {
    headline: "Need help understanding your battery responsibility pathway?",
    description: "Talk to ReBat about where your batteries stand and where they need to go.",
    ctaLabel: "Talk to ReBat",
  },
};

// ----------------------------------------------------------------------
// 04 R&D
export const RND = {
  hero: {
    eyebrow: "R&D",
    headline: "Where new battery possibilities take shape.",
    description:
      "Exploring materials, processes and technologies that can shape the next generation of battery solutions.",
    ctaLabel: "Talk to our R&D team",
  },
  why: {
    eyebrow: "Why R&D matters",
    // About docx, "Technology Driven".
    statement:
      "Battery recycling requires specialised processes capable of handling different battery formats, chemistries and waste streams.",
    body: "ReBAT focuses on improving process efficiency, material recovery and resource utilisation through technology and continuous innovation.",
  },
  explore: {
    eyebrow: "What we explore",
    headline: "Six areas of focus.",
    note: "Areas of focus for ReBAT's technology work, not a list of established services.",
    items: [
      { title: "Materials", description: "The materials inside batteries and the ones recovered from them." },
      { title: "Chemistry", description: "Different battery formats and chemistries, and how each behaves through recovery." },
      { title: "Processes", description: "From dismantling and separation to hydrometallurgical refining." },
      { title: "Battery technology", description: "Battery architecture, second-life evaluation and application-specific design." },
      { title: "Recovery", description: "Improving material recovery and resource utilisation." },
      { title: "Applications", description: "Mobility, energy storage and industrial use." },
    ],
  },
  method: {
    eyebrow: "From question to possibility",
    headline: "How a question gets explored.",
    note: "The research approach in outline. It describes a method, not a list of active programmes.",
    // CONCEPTUAL
    steps: ["Question", "Research", "Experiment", "Test", "Analyse", "Refine", "Validate"],
  },
  connect: {
    eyebrow: "Materials, processes, products",
    headline: "Research that connects to the rest of ReBAT.",
    steps: [
      { title: "Material research", description: "Understanding what is in a battery and what can be recovered." },
      { title: "Process development", description: "Turning that understanding into a process." },
      { title: "Recovered or engineered material", description: "The material the process delivers." },
      { title: "Battery technology and application", description: "Where the material or the insight is used next." },
    ],
    href: "/products",
    cta: "See our materials",
  },
  environment: {
    eyebrow: "Research environment",
    headline: "Characterised, tested, understood.",
    // content.ts LOOP_NODES: "Characterisation / Test — ReBAT Hitech Lab".
    body: "Characterisation and testing sit inside the ReBAT flow, at the ReBAT Hitech Lab, where each input is understood before it is routed onward.",
    images: [
      { src: "/images/solutions/hero.webp", alt: "A workbench with a battery pack, sample vials, microscopes and test equipment" },
      { src: "/images/story/battery-materials.webp", alt: "Copper, graphite and metal powders laid out on a concrete surface" },
      { src: "/images/products/recovered/nickel.webp", alt: "Recovered nickel material, close up" },
    ],
  },
  useful: {
    eyebrow: "Where research becomes useful",
    items: [
      { title: "Recycling", description: "More efficient, more complete recovery." },
      { title: "Recovered materials", description: "Materials fit for a new life in the supply chain." },
      { title: "Battery design", description: "Better-informed application-specific batteries." },
      { title: "Process development", description: "A recovery process that keeps improving." },
      { title: "New applications", description: "Uses for recovered resources that do not exist yet." },
    ],
  },
  next: {
    eyebrow: "What's next",
    headline: "Initiatives will be published here.",
    body: "No R&D initiatives have been published yet. This space is reserved for them.",
    slots: ["Initiative", "Initiative", "Initiative"],
  },
  cta: {
    headline: "Have a technology or battery challenge worth exploring?",
    description: "Let's talk.",
    ctaLabel: "Talk to our R&D team",
  },
};
