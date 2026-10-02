// Data for the /partner-with-us/power-with-us page: an application-led
// battery page, not a product catalogue. The applications and the pack range
// come from the Battery Pack Range document (see lib/battery-packs.ts); the
// design considerations and deployment stages are ReBAT's own wording.

import { PACK_CATEGORIES } from "@/lib/battery-packs";

export interface PowerApplication {
  number: string;
  title: string;
  description: string;
}

// The application categories the current real pack range covers (see
// lib/battery-packs.ts); the core message for each is the line ReBAT wants
// a buyer in that application to hear.
export const POWER_APPLICATIONS: PowerApplication[] = PACK_CATEGORIES.map((c, i) => ({
  number: String(i + 1).padStart(2, "0"),
  title: c.title,
  description: c.message,
}));

export interface ApplicationFactor {
  title: string;
  description: string;
}

export const APPLICATION_FACTORS: ApplicationFactor[] = [
  { title: "Energy", description: "The energy / runtime requirement." },
  { title: "Power", description: "Peak and continuous power requirements." },
  { title: "Form", description: "Available space and packaging requirements." },
  { title: "Environment", description: "Operating conditions and surroundings." },
  { title: "Integration", description: "How the battery connects to the larger system." },
  { title: "Application", description: "What the battery ultimately needs to power." },
];

export interface DeploymentStage {
  number: string;
  title: string;
  description: string;
}

export const DEPLOYMENT_STAGES: DeploymentStage[] = [
  { number: "01", title: "Understand", description: "Your application, operating conditions and energy requirements." },
  { number: "02", title: "Configure", description: "Battery architecture and specifications aligned to the application." },
  { number: "03", title: "Validate", description: "Performance, safety and integration requirements." },
  { number: "04", title: "Deploy", description: "A battery solution ready for its intended environment." },
];
