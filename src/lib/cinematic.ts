// Data for the Battery -> Black Mass -> Recovered Materials cinematic
// prototype. All 7 source images share one real canvas size (1408x768,
// confirmed on the actual files), which is what lets them cross-dissolve
// without per-image repositioning.

export const CINEMATIC_BATTERY_IMAGE = "/images/products/cinematic/battery.webp";
export const CINEMATIC_BLACKMASS_IMAGE = "/images/products/cinematic/blackmass.webp";

export interface CinematicMaterial {
  id: string;
  name: string;
  image: string;
  /** Pentagon scatter position, percent offset from center. */
  x: number;
  y: number;
  /** 0-1 stagger order within the separation window (0 = first out). */
  order: number;
}

export const CINEMATIC_MATERIALS: CinematicMaterial[] = [
  { id: "lithium", name: "Lithium", image: "/images/products/cinematic/lithium.webp", x: 0, y: -27, order: 0 },
  { id: "graphite", name: "Graphite", image: "/images/products/cinematic/graphite.webp", x: 31, y: -9, order: 1 },
  { id: "cobalt", name: "Cobalt", image: "/images/products/cinematic/cobalt.webp", x: 19, y: 22, order: 2 },
  { id: "manganese", name: "Manganese", image: "/images/products/cinematic/manganese.webp", x: -19, y: 22, order: 3 },
  { id: "nickel", name: "Nickel", image: "/images/products/cinematic/nickel.webp", x: -31, y: -9, order: 4 },
];

// Scroll choreography, as fractions of the pinned track's total progress —
// mirrors the requested 0-20 / 20-40 / 40-60 / 60-80 / 80-90 / 90-100 plan.
export const CINEMATIC_TIMING = {
  batteryHoldEnd: 0.2,
  breakdownEnd: 0.4,
  blackMassHoldEnd: 0.58,
  separationEnd: 0.78,
  fieldHoldEnd: 0.88,
  lightPeak: 0.96,
};
