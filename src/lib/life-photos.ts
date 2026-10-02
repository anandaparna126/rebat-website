// Real photography supplied by ReBAT (V:\Rebat Photos\Company Photos,
// 2026-09-26). Captions describe only what is visible.

export interface LifePhoto {
  src: string;
  alt: string;
  caption: string;
}

export const LIFE = {
  campus: {
    src: "/images/life/campus-aerial.webp",
    alt: "An aerial view of the ReBAT plant, with blue and white industrial sheds and a landscaped forecourt",
    caption: "The ReBAT campus",
  },
  reception: {
    src: "/images/life/reception.webp",
    alt: "The ReBAT reception desk in front of a green living wall with the ReBAT sign",
    caption: "Reception",
  },
  lab: {
    src: "/images/life/lab-technician.webp",
    alt: "A technician in a white shirt handling a sample at a laboratory bench",
    caption: "In the lab",
  },
  plant: {
    src: "/images/life/plant-worker.webp",
    alt: "A worker in a yellow protective suit and face shield at the processing line",
    caption: "On the line",
  },
} satisfies Record<string, LifePhoto>;
