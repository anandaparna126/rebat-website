// Real team photography supplied by ReBAT (V:\Rebat Photos\Company People,
// 2026-09-25; huddle/portrait/signage/tankWorker added from V:\Rebat Photos
// \Photo .2 and \Photos\EDIT, 2026-09-30). Captions describe only what is
// visible; no names, roles or headcount are stated.

export interface TeamPhoto {
  src: string;
  alt: string;
  caption: string;
}

export const TEAM = {
  wide: {
    src: "/images/team/team-wide.webp",
    alt: "The ReBAT team in white shirts standing in a V formation on the plant floor, tanks and pipework behind them",
    caption: "The ReBAT team on the plant floor",
  },
  entrance: {
    src: "/images/team/team-entrance.webp",
    alt: "The ReBAT team in hi-vis vests, hard hats and protective suits outside the plant entrance under the ReBAT sign",
    caption: "At the plant entrance",
  },
  hivis: {
    src: "/images/team/team-hivis.webp",
    alt: "Two rows of the ReBAT team in hi-vis vests inside the plant, some standing and some kneeling",
    caption: "Plant team",
  },
  closeup: {
    src: "/images/team/team-closeup.webp",
    alt: "Close group photo of the ReBAT team in hi-vis vests with their arms around each other",
    caption: "Together",
  },
  huddle: {
    src: "/images/team/huddle-review.webp",
    alt: "Three ReBAT staff in hard hats, goggles and masks reviewing data on a tablet on the plant floor",
    caption: "Reviewing the data",
  },
  portrait: {
    src: "/images/team/portrait-greenwall.webp",
    alt: "A ReBAT staff member in a hard hat, arms crossed, portrait against a green living wall",
    caption: "Part of the team",
  },
  signage: {
    src: "/images/team/portrait-signage.webp",
    alt: "A ReBAT staff member in a hard hat standing beneath the illuminated ReBAT sign on a green living wall",
    caption: "Under the ReBAT sign",
  },
  tankWorker: {
    src: "/images/team/worker-tank-branded.webp",
    alt: "A worker in a ReBAT-branded polo shirt and hi-vis vest servicing a processing tank",
    caption: "Hands-on, every shift",
  },
} satisfies Record<string, TeamPhoto>;
