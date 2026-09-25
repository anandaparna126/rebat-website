// Data for the homepage's new "What we take in / How we transform it" story
// blocks — sits between Impact and Products, narratively completing the
// "input -> process -> output" arc (Products already covers the output).
// All media and copy below is real, supplied directly by ReBAT (images:
// V:\Rebat Photos\What We Take In; videos: V:\Rebat Photos\Process Vedios),
// compressed the same way as the rest of the site's assets.

export interface IncomingMaterial {
  number: string;
  name: string;
  description: string;
  image?: string;
  video?: string;
}

// The 7 incoming material/waste streams ReBAT takes in, as specified
// directly by ReBAT.
export const INCOMING_MATERIALS: IncomingMaterial[] = [
  {
    number: "01",
    name: "Production Scrap",
    description: "Battery-production material left over from manufacturing.",
    image: "/images/story/production-scrap.webp",
  },
  {
    number: "02",
    name: "End-of-Life Batteries",
    description: "Batteries that have reached the end of their first useful life.",
    image: "/images/story/end-of-life-batteries.webp",
  },
  {
    number: "03",
    name: "Battery Cells & Modules",
    description: "Cells and modules ready for recovery and material processing.",
    image: "/images/story/battery-cells-modules.webp",
  },
  {
    number: "04",
    name: "Rejected Battery Packs",
    description: "Battery packs that no longer meet their intended use.",
    image: "/images/story/rejected-battery-packs.webp",
  },
  {
    number: "05",
    name: "Black Mass",
    description: "Processed battery material containing valuable recoverable resources.",
    image: "/images/story/black-mass.webp",
  },
  {
    number: "06",
    name: "Battery Materials",
    description: "Battery-related material streams ready for recovery.",
    image: "/images/story/battery-materials.webp",
  },
  {
    number: "07",
    name: "Manufacturing / Process Scrap",
    description: "Industrial material residues with recoverable value.",
    image: "/images/story/manufacturing-process-scrap.webp",
  },
];

export interface TransformStage {
  number: string;
  name: string;
  image?: string;
  video?: string;
}

// The 5-stage homepage summary of ReBAT's transformation process — a
// separate, simplified framing specified directly by ReBAT for this
// section, distinct from the detailed real 10-stage pipeline in
// content.ts's PROCESS_STAGES (used on the value-chain pages).
export const TRANSFORM_STAGES: TransformStage[] = [
  { number: "01", name: "Sorting & Grading", video: "/videos/story/sorting-grading.mp4" },
  { number: "02", name: "Crushing & Grinding", video: "/videos/story/crushing-grinding.mp4" },
  { number: "03", name: "Refining & Recovering", video: "/videos/story/refining-recovering.mp4" },
  { number: "04", name: "Quality Check & Assurance", video: "/videos/story/quality-check-assurance.mp4" },
  // No dedicated footage for this stage — reuses the R&D solutions page's
  // own hero photo (a real workbench with a battery pack, sample vials,
  // microscopes and test equipment) rather than a blank/placeholder tile.
  { number: "05", name: "Research & Development", image: "/images/solutions/hero.webp" },
];
