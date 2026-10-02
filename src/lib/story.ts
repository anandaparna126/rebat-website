// Data for the homepage's new "What we take in / How we transform it" story
// blocks — sits between Impact and Products, narratively completing the
// "input -> process -> output" arc (Products already covers the output).
// All media and copy below is real, supplied directly by ReBAT (images:
// V:\Rebat Photos\What We Take In and V:\Rebat Photos\Camera Photos,
// 2026-09-30; videos: V:\Rebat Photos\Process Vedios), compressed the same
// way as the rest of the site's assets.

export interface IncomingMaterial {
  number: string;
  name: string;
  description: string;
  image?: string;
  video?: string;
  /** Extra photographs that cycle in the "What we accept" tile on the materials page. */
  gallery?: string[];
}

// The 6 incoming material/waste streams ReBAT takes in, as specified
// directly by ReBAT. "Battery Materials" (formerly 06) was dropped per
// ReBAT's own direction. Names/descriptions are unchanged from before;
// items 01-05 just got new real photos from V:\Rebat Photos\Camera
// Photos, 2026-09-30, in place of the earlier ones.
export const INCOMING_MATERIALS: IncomingMaterial[] = [
  {
    number: "01",
    name: "Production Scrap",
    description: "Production reject or quality scrap materials from manufacturers.",
    image: "/images/story/second-life-cells.webp",
  },
  {
    number: "02",
    name: "End-of-Life Batteries",
    description: "Batteries that have reached the end of their first useful life.",
    image: "/images/story/end-of-life-2-wheeler.webp",
  },
  {
    number: "03",
    name: "Battery Cells & Modules",
    description: "Cells and modules ready for recovery and material processing.",
    image: "/images/story/end-of-life-car-battery.webp",
  },
  {
    number: "04",
    name: "Rejected Batteries",
    description: "Battery packs that no longer meet their intended use.",
    image: "/images/story/rejected-battery-packs-pile.webp",
  },
  {
    number: "05",
    name: "Black Mass",
    description: "Processed battery material containing valuable recoverable resources.",
    image: "/images/story/black-mass-pile.webp",
  },
  {
    number: "06",
    name: "Manufacturing / Process Scrap",
    description: "Industrial material residues with recoverable value.",
    image: "/images/story/exide-materials.webp",
  },
];

export interface TransformStage {
  number: string;
  name: string;
  image?: string;
  video?: string;
  /** Restart the video after this many seconds instead of letting it play
   * to its natural end and native-loop — used for the Crushing & Grinding
   * clip (AI-generated, supplied by the user 2026-09-30), which should
   * only ever show its first 4 seconds. */
  loopSeconds?: number;
}

// The 5-stage homepage summary of ReBAT's transformation process — a
// separate, simplified framing specified directly by ReBAT for this
// section, distinct from the detailed real 10-stage pipeline in
// content.ts's PROCESS_STAGES (used on the value-chain pages).
export const TRANSFORM_STAGES: TransformStage[] = [
  { number: "01", name: "Sorting & Grading", video: "/videos/story/sorting-grading.mp4" },
  { number: "02", name: "Crushing & Grinding", video: "/videos/story/crushing-grinding.mp4", loopSeconds: 4 },
  { number: "03", name: "Refining & Recovering", image: "/images/plant/tank-platform-close.webp", video: "/videos/story/refining-recovering.mp4" },
  { number: "04", name: "Quality Check & Assurance", image: "/images/lab/analyser.webp", video: "/videos/story/quality-check-assurance.mp4" },
  { number: "05", name: "Research & Development", image: "/images/lab/pipetting.webp", video: "/videos/story/research-development.mp4" },
];
