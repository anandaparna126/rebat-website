// Data for the /partner-with-us/source-from-us page — a B2B sourcing page,
// not a product catalogue. Who can source from ReBAT, the four-step way we
// scope a requirement, and the recovery-journey stages. Copy specified
// directly by ReBAT; material data itself is reused from lib/products.ts
// rather than duplicated here.

export const SOURCE_AUDIENCE: string[] = [
  "Battery & Cell Manufacturers",
  "Material & Chemical Processors",
  "Component Manufacturers",
  "Electronics & Technology Companies",
  "Energy & Storage Companies",
  "Industrial Manufacturers",
  "Research & Development",
];

export interface SourcingRequirementStep {
  number: string;
  title: string;
  question: string;
}

export const SOURCING_REQUIREMENTS: SourcingRequirementStep[] = [
  { number: "01", title: "Material", question: "What material are you looking for?" },
  { number: "02", title: "Specification", question: "What grade, purity or form do you require?" },
  { number: "03", title: "Application", question: "Where will the material be used?" },
  { number: "04", title: "Supply Requirement", question: "What quantity and supply frequency do you need?" },
];

export interface RecoveredApplication {
  materialId: string;
  application: string;
}

// Pairs a material (by id, looked up against RECYCLED_MATERIALS for its
// real photo) with the one real application line ReBAT gave for it — only
// the four materials that line exists for, not all seven.
export const RECOVERED_APPLICATIONS: RecoveredApplication[] = [
  { materialId: "lithium", application: "Energy & Technology" },
  { materialId: "copper", application: "Electrical & Industrial Systems" },
  { materialId: "nickel", application: "Advanced Metals & Infrastructure" },
  { materialId: "graphite", application: "Engineered Materials & Technology" },
];

export interface SourcingJourneyStage {
  number: string;
  title: string;
}

export const SOURCING_JOURNEY: SourcingJourneyStage[] = [
  { number: "01", title: "Tell us what you need" },
  { number: "02", title: "We understand your requirement" },
  { number: "03", title: "Material & specification alignment" },
  { number: "04", title: "Sample / quality validation" },
  { number: "05", title: "Supply & delivery" },
];
