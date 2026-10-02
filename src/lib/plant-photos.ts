// Real photography of the ReBAT recovery plant, supplied by ReBAT
// (V:\Rebat Photos\Chemical Plant, 2026-09-25; shredderLine added from
// V:\Rebat Photos\Photo .2, 2026-09-30). Captions describe only what is
// visible; the process itself is not named here.

export interface PlantPhoto {
  src: string;
  alt: string;
  caption: string;
}

export const PLANT = {
  tankPlatformClose: {
    src: "/images/plant/tank-platform-close.webp",
    alt: "Two workers in yellow protective suits and face shields at ReBAT-branded blue tanks",
    caption: "Reaction tanks",
  },
  tankPlatformWide: {
    src: "/images/plant/tank-platform-wide.webp",
    alt: "A raised platform of blue tanks with motorised mixers and two workers in protective suits",
    caption: "Tank platform",
  },
  workerAtTanks: {
    src: "/images/plant/worker-at-tanks.webp",
    alt: "A worker in a yellow protective suit and face shield beside a motor on the processing line",
    caption: "On the line",
  },
  processingLine: {
    src: "/images/plant/processing-line.webp",
    alt: "A row of blue processing tanks with motors and pipework inside the plant",
    caption: "Processing line",
  },
  filterPress: {
    src: "/images/plant/filter-press.webp",
    alt: "Two workers operating a filter press with a green collection hopper",
    caption: "Filter press",
  },
  treatmentUnit: {
    src: "/images/plant/treatment-unit.webp",
    alt: "A worker crouching at a bank of filter housings, gauges and pipework",
    caption: "Treatment and dosing equipment",
  },
  controlPanels: {
    src: "/images/plant/control-panels.webp",
    alt: "A wall of ReBAT-branded control panels with green indicator lights",
    caption: "Control panels",
  },
  workerSample: {
    src: "/images/plant/worker-sample.webp",
    alt: "A worker in protective gear holding a small sample flask of pink liquid beside a motor",
    caption: "Sampling",
  },
  shredderLine: {
    src: "/images/plant/shredder-line.webp",
    alt: "A wide view of the plant's mechanical shredding line, with a dust-collection unit, big bags of processed material and a worker in hi-vis",
    caption: "Shredding & bulk handling",
  },
} satisfies Record<string, PlantPhoto>;

export const PLANT_GALLERY: PlantPhoto[] = [
  PLANT.tankPlatformWide,
  PLANT.processingLine,
  PLANT.filterPress,
  PLANT.controlPanels,
  PLANT.shredderLine,
];
