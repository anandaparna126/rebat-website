// Real photography of the ReBAT lab, supplied by ReBAT
// (V:\Rebat Photos\QC Lab Photo, 2026-09-25). Captions describe only what is
// visible; no method, standard or sample type is named.

export interface LabPhoto {
  src: string;
  alt: string;
  caption: string;
}

export const LAB = {
  hotplateStirrer: {
    src: "/images/lab/hotplate-stirrer.webp",
    alt: "A glass beaker of clear liquid on a hot plate stirrer beside conical flasks on a lab bench",
    caption: "Sample preparation",
  },
  titration: {
    src: "/images/lab/titration.webp",
    alt: "A technician in a white coat, mask and gloves working at a titration stand on a lab bench",
    caption: "Titration",
  },
  analystAtPc: {
    src: "/images/lab/analyst-at-pc.webp",
    alt: "A technician in a white coat at a computer beside an analytical instrument",
    caption: "Data review",
  },
  pipetting: {
    src: "/images/lab/pipetting.webp",
    alt: "A technician in a white coat, mask and gloves holding a pipette up to the light",
    caption: "Pipetting",
  },
  digestionUnit: {
    src: "/images/lab/digestion-unit.webp",
    alt: "A technician standing beside a large white laboratory instrument with an extraction duct",
    caption: "Laboratory instrument",
  },
  analyserAtPc: {
    src: "/images/lab/analyser-at-pc.webp",
    alt: "A technician at a computer beside an analyser with an automatic sampler",
    caption: "Analysis",
  },
  analyser: {
    src: "/images/lab/analyser.webp",
    alt: "An analytical instrument with an automatic sampler and extraction duct in the lab",
    caption: "Analyser",
  },
} satisfies Record<string, LabPhoto>;

export const LAB_GALLERY: LabPhoto[] = [LAB.hotplateStirrer, LAB.analystAtPc, LAB.digestionUnit];
