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
  /** Omitted while a material has no photo yet; UIs show a Pending state. */
  image?: string;
  squareImage?: string;
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
  /** Real, confirmed purity only — omit rather than estimate. */
  purity?: string;
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

// ReBAT's recovered materials, in the order ReBAT lists them. Seven have a
// real photo, brochure-sourced copy and a real video. Aluminium Fraction and
// Steel Fraction are new: they have no photo or video yet, so they show as
// Pending. Their descriptions are general statements about what those
// fractions are in battery recycling (not purity, grade or volume claims) and
// should be reviewed by ReBAT. Colours for the seven are sampled from the
// real photos (cobalt reads deep red, nickel vivid teal,
// not the brochure's generic colours); the two new ones use a
// plain silver / gunmetal metal tone until real photography exists.
export const RECYCLED_MATERIALS: RecycledMaterial[] = [
  {
    id: "black-mass",
    name: "Black Mass",
    tag: "\u2014",
    image: "/images/products/recovered/black-mass.webp",
    squareImage: "/images/products/recovered/black-mass-sq.webp",
    color: "linear-gradient(155deg, #2a2a28, #050505)",
    glow: "#2a2a28",
    textOn: "light",
    description:
      "The mixed powder recovered during mechanical processing of end-of-life battery scrap, carrying lithium, cobalt, nickel, manganese and graphite values ahead of chemical refining.",
    purity: "> 96.45%",
    story: "Recovering value from every cell.",
    video: "/videos/products/black-mass.mp4",
  },
  {
    id: "copper",
    name: "Copper Fraction",
    tag: "Cu",
    image: "/images/products/recovered/copper.webp",
    squareImage: "/images/products/recovered/copper-sq.webp",
    color: "linear-gradient(155deg, #c1502f, #7a2f16)",
    glow: "#c1502f",
    textOn: "light",
    description: "Mechanically separated copper recovered from current collectors and internal wiring in battery scrap.",
    story: "Conducting progress forward.",
    video: "/videos/products/copper.mp4",
  },
  {
    id: "aluminium",
    name: "Aluminium Fraction",
    image: "/images/products/recovered/aluminium.webp",
    squareImage: "/images/products/recovered/aluminium-jar.webp",
    tag: "Al",
    color: "linear-gradient(155deg, #d3d8db, #9aa2a8)",
    glow: "#9aa2a8",
    textOn: "dark",
    description:
      "Aluminium recovered as a separated fraction during mechanical processing of battery scrap, from sources such as cathode foils and pack casings.",
    story: "Lightweight by nature. Valuable by design.",
    video: "/videos/products/aluminium.mp4",
  },
  {
    id: "steel",
    name: "Steel Fraction",
    image: "/images/products/recovered/steel.webp",
    squareImage: "/images/products/recovered/steel-jar.webp",
    tag: "Fe",
    color: "linear-gradient(155deg, #5b6670, #2b323a)",
    glow: "#5b6670",
    textOn: "light",
    description:
      "Steel recovered as a separated fraction during mechanical processing of battery scrap, from sources such as cell cans and pack enclosures.",
    story: "Strength, recovered and renewed.",
    video: "/videos/products/steel.mp4",
  },
  {
    id: "graphite",
    name: "Graphite Concentrate",
    tag: "C",
    image: "/images/products/recovered/graphite.webp",
    squareImage: "/images/products/recovered/graphite-sq.webp",
    color: "linear-gradient(155deg, #3a3a3a, #0d0d0d)",
    glow: "#3a3a3a",
    textOn: "light",
    description: "Recovered graphite concentrate from spent battery anodes, separated out during mechanical processing.",
    story: "The foundation of modern energy.",
    video: "/videos/products/graphite.mp4",
  },
  {
    id: "cobalt",
    name: "Cobalt Sulphate",
    tag: "CoSO\u2084",
    image: "/images/products/recovered/cobalt.webp",
    squareImage: "/images/products/recovered/cobalt-sq.webp",
    color: "linear-gradient(155deg, #c8492f, #7e2417)",
    glow: "#c8492f",
    textOn: "light",
    description: "Cobalt recovered through hydrometallurgical refining and crystallised as cobalt sulphate.",
    purity: "> 99.94%",
    story: "Precision chemistry, recovered.",
    video: "/videos/products/cobalt.mp4",
  },
  {
    id: "nickel",
    name: "Nickel Sulphate",
    tag: "NiSO\u2084",
    image: "/images/products/recovered/nickel.webp",
    squareImage: "/images/products/recovered/nickel-sq.webp",
    color: "linear-gradient(155deg, #3fc2ab, #1f7d6c)",
    glow: "#3fc2ab",
    textOn: "light",
    description: "Nickel recovered through hydrometallurgical refining and crystallised as nickel sulphate.",
    purity: "> 99.94%",
    story: "Powering high-performance chemistry.",
    video: "/videos/products/nickel.mp4",
  },
  {
    id: "lithium",
    name: "Lithium Compounds",
    tag: "Li",
    image: "/images/products/recovered/lithium.webp",
    squareImage: "/images/products/recovered/lithium-sq.webp",
    color: "linear-gradient(155deg, #ffffff, #d8dad9)",
    glow: "#b9bcc0",
    textOn: "dark",
    description: "Lithium carbonate and other lithium compounds recovered through hydrometallurgical refining.",
    purity: "99%",
    application: "mobility",
    story: "One element. Endless potential.",
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
