// Data for the Products experience — deliberately data-driven so future
// materials and battery product lines can be added by appending an object,
// not by rewriting components.
//
// No purity/capacity/chemistry/certification/volume claims are invented
// anywhere in here. Where we don't have real ReBAT copy, the field is left
// undefined and the UI treats that as "not shown" rather than filling in a
// placeholder sentence.

export interface RecycledMaterial {
  id: string;
  name: string;
  /** Short chemical-symbol-style tag, e.g. "Li" — purely a visual/editorial
   * device, not a claim about purity or form. */
  tag: string;
  image: string;
  /** CSS object-position for `image` — every photo here is a tall portrait
   * shot cropped into a square/hex frame, so the mound doesn't always sit
   * dead-centre in frame; this lets a slide shift the crop window instead
   * of the default 50% 50% cutting off part of the pile. */
  imagePosition?: string;
  /** The material's own real, described physical colour (brochure-sourced,
   * e.g. lithium compounds = white powder) — never an invented brand hue. */
  color: string;
  /** A solid version of `color`'s more saturated stop — box-shadow/glow
   * can't render a gradient, so this is what the slide's ambient shadow
   * on the page background is tinted with. */
  glow: string;
  /** Which text colour reads on `color` — light materials (lithium) get
   * dark text, dark materials (graphite, black mass) will need light. */
  textOn: "light" | "dark";
  /** Real, brochure-sourced copy only. Omit rather than invent. */
  description?: string;
  application?: "mobility" | "energy-storage" | "industrial";
  /** A short editorial line — the emotional headline for the slide. */
  story?: string;
  /** Real footage only. Omit — never a placeholder/stock video — until
   * ReBAT supplies actual impact footage for this material. */
  video?: string;
  /** A still frame shown before the video loads/plays — avoids a blank
   * flash and gives the browser a lightweight LCP candidate. */
  videoPoster?: string;
}

// Every entry here has a real photo, real brochure-sourced copy, and a real
// video — including Copper now that its real photo exists too. Colours are
// sampled from the actual photos (a few ran different from the brochure's
// own generic colour descriptions — e.g. cobalt reads as a deep red here,
// not pink; manganese a pale blush-tan, not lavender; nickel a vivid teal,
// not green — the real photo is the source of truth over the brochure text
// when the two disagree on something this visual).
export const RECYCLED_MATERIALS: RecycledMaterial[] = [
  {
    id: "black-mass",
    name: "Black Mass",
    tag: "—",
    image: "/images/products/recovered/black-mass.webp",
    // The pile sits lower in this photo (on a petri dish) than the other
    // materials' shots — centring the crop (the default) cut its base off.
    imagePosition: "center 73%",
    color: "linear-gradient(155deg, #2a2a28, #050505)",
    glow: "#2a2a28",
    textOn: "light",
    description:
      "The mixed powder recovered during mechanical processing of end-of-life battery scrap, carrying lithium, cobalt, nickel, manganese and graphite values ahead of chemical refining.",
    story: "From what was lost, we build what comes next.",
    video: "/videos/products/black-mass.mp4",
  },
  {
    id: "graphite",
    name: "Graphite",
    tag: "C",
    image: "/images/products/recovered/graphite.webp",
    color: "linear-gradient(155deg, #3a3a3a, #0d0d0d)",
    glow: "#3a3a3a",
    textOn: "light",
    description: "Recovered graphite concentrate from spent battery anodes, separated out during mechanical processing.",
    story: "Where ideas take shape.",
    video: "/videos/products/graphite.mp4",
  },
  {
    id: "copper",
    name: "Copper",
    tag: "Cu",
    image: "/images/products/recovered/copper.webp",
    color: "linear-gradient(155deg, #6b4a30, #14100d)",
    glow: "#b17d4a",
    textOn: "light",
    description: "Mechanically separated copper recovered from current collectors and internal wiring in battery scrap.",
    story: "The thread that keeps the world connected.",
    video: "/videos/products/copper.mp4",
  },
  {
    id: "cobalt",
    name: "Cobalt",
    tag: "Co",
    image: "/images/products/recovered/cobalt.webp",
    color: "linear-gradient(155deg, #d1481f, #5a1209)",
    glow: "#d1481f",
    textOn: "light",
    description: "Cobalt recovered through hydrometallurgical refining and crystallised as cobalt sulphate.",
    story: "Made to endure.",
    video: "/videos/products/cobalt.mp4",
  },
  {
    id: "nickel",
    name: "Nickel",
    tag: "Ni",
    image: "/images/products/recovered/nickel.webp",
    // The mound sits lower in this particular photo than the other
    // materials' shots — centring the crop (the default) cut its base off.
    imagePosition: "center 70%",
    color: "linear-gradient(155deg, #14d9c4, #0a6b60)",
    glow: "#14d9c4",
    textOn: "light",
    description: "Nickel recovered through hydrometallurgical refining and crystallised as nickel sulphate.",
    story: "Built for more.",
    video: "/videos/products/nickel.mp4",
  },
  {
    id: "lithium",
    name: "Lithium",
    tag: "Li",
    image: "/images/products/recovered/lithium.webp",
    // The pile sits lower in this photo (on a petri dish) than the other
    // materials' shots — centring the crop (the default) cut its base off.
    imagePosition: "center 78%",
    color: "linear-gradient(155deg, #eef2ea, #c7d1c2)",
    glow: "#a9b8a3",
    textOn: "dark",
    description:
      "Lithium carbonate and other lithium compounds recovered through hydrometallurgical refining.",
    application: "mobility",
    story: "One material. Many ways forward.",
    video: "/videos/products/lithium.mp4",
  },
];

export interface TransformationStage {
  key: "material" | "engineered" | "cell" | "battery" | "application";
  /** Small technical numbering label, e.g. "Recovered Material". */
  label: string;
}

// The 5-stage story every material's showcase moves through. Fixed across
// materials so the mechanism (and the 01/05 progress read-out) stays
// consistent as more materials are added.
export const TRANSFORMATION_STAGES: TransformationStage[] = [
  { key: "material", label: "Recovered Material" },
  { key: "engineered", label: "Engineered Material" },
  { key: "cell", label: "Battery Cell" },
  { key: "battery", label: "Battery System" },
  { key: "application", label: "Application" },
];

export const APPLICATION_LABEL: Record<NonNullable<RecycledMaterial["application"]>, string> = {
  mobility: "Mobility",
  "energy-storage": "Energy Storage",
  industrial: "Industrial",
};

export interface BatteryProductLine {
  id: string;
  name: string;
  /** Real, brochure-sourced copy only. Omit rather than invent. */
  description?: string;
  /** Real product footage only. Omit until ReBAT supplies it. */
  video?: string;
  /** A real still photo, shown while there's no video yet (never a stock
   * placeholder). */
  image?: string;
}

// Names only, from the brochure's own "Battery Manufacturing" line — no
// real specs/capacity/chemistry claims exist yet, so `description` stays
// unset (rendered as a "Pending" note) rather than invented. Battery Pack
// has one real product photo already (from the earlier cinematic asset
// batch); Battery Solutions has no real asset at all yet.
export const BATTERY_PRODUCT_LINES: BatteryProductLine[] = [
  { id: "battery-pack", name: "Battery Pack", image: "/images/products/cinematic/battery.webp" },
  { id: "battery-solutions", name: "Battery Solutions" },
];
