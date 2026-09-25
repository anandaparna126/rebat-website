// Data for the /partner-with-us/power-with-us page — an application-led
// battery solutions page, not a product catalogue. Application categories
// are decomposed from BUSINESS_LINES[0]'s own real brochure line ("Advanced
// lithium battery packs for EVs, BESS, and industrial applications.") and
// match the three real `application` values already used on
// RECYCLED_MATERIALS in lib/products.ts — nothing invented beyond what the
// brochure already states. Battery product data itself is reused from
// lib/products.ts (BATTERY_PRODUCT_LINES) rather than duplicated here.

export interface PowerApplication {
  number: string;
  title: string;
  description: string;
}

export const POWER_APPLICATIONS: PowerApplication[] = [
  { number: "01", title: "Mobility", description: "Advanced lithium battery packs for EVs." },
  { number: "02", title: "Energy Storage", description: "Battery Energy Storage Systems (BESS)." },
  { number: "03", title: "Industrial", description: "Battery packs built for industrial applications." },
];

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
