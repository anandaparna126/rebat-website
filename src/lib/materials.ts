// Data for the /partner-with-us/materials deep page — who ReBAT works
// with, the four-stage journey a shipment goes through (reusing the same
// real process footage already used on the homepage, relabeled for this
// audience), what each material stream becomes, and the value beyond
// recycling itself. Copy specified directly by ReBAT.

export const VALUE_CHAIN_PARTNERS: string[] = [
  "OEMs",
  "Battery Manufacturers",
  "Pack & System Integrators",
  "Electronics Manufacturers",
  "Energy & Storage",
  "Collection & Recycling Partners",
];

export interface MaterialsJourneyStage {
  step: number;
  title: string;
  video: string;
}

// Same four real process clips as the homepage's TRANSFORM_STAGES
// (src/lib/story.ts), relabeled for a materials-intake audience — the
// footage doesn't change per page, only the stage names describing it.
export const MATERIALS_JOURNEY: MaterialsJourneyStage[] = [
  { step: 1, title: "Receive & Assess", video: "/videos/story/sorting-grading.mp4" },
  { step: 2, title: "Process & Recover", video: "/videos/story/crushing-grinding.mp4" },
  { step: 3, title: "Refine & Separate", video: "/videos/story/refining-recovering.mp4" },
  { step: 4, title: "Quality & Return", video: "/videos/story/quality-check-assurance.mp4" },
];

export interface MaterialOutcome {
  from: string;
  to: string;
}

export const WHAT_HAPPENS_NEXT: MaterialOutcome[] = [
  { from: "Usable Batteries", to: "Second Life" },
  { from: "End-of-Life Batteries", to: "Material Recovery" },
  { from: "Black Mass", to: "Critical Minerals" },
  { from: "Production Scrap", to: "Resource Recovery" },
];

export const MORE_THAN_RECYCLING: string[] = [
  "Recover Value",
  "Manage Responsibly",
  "Strengthen Material Security",
  "Close the Loop",
  "Reduce Environmental Impact",
];
