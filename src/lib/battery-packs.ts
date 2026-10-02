// The ReBAT battery pack range shown on the site. The first 3 packs are
// real, photographed units ReBAT supplied (V:\Rebat Photos\Real Battery
// Details, 2026-09-28); specs come from what is actually readable, and a
// field simply doesn't appear for a pack where it isn't confirmed, rather
// than being invented:
// - 12.8V 30Ah: a labelled product photo (Model RBT-1230) with a full
//   printed spec sheet.
// - 51.2V 105Ah: chemistry, full charge/discharge voltage and protection
//   board are confirmed by ReBAT directly. Its product photo (supplied
//   2026-09-30) has "105AH" printed directly on the case, matching the
//   105Ah figure used here.
// - 60V 30Ah: only the voltage and capacity are confirmed (the supplied
//   photo shows no nameplate); it ships in both CAN and UART variants,
//   shown as one "CAN / UART" comms value.
//
// The 4th pack, 51.2V 45Ah (EV 2W Fleet, "ReBAT Core 45"), has its specs
// sourced from ReBAT's own "Battery Pack Range" positioning document
// (Battery_Product_Copy.docx, supplied 2026-09-30) rather than a
// photographed nameplate; its product photo (supplied separately,
// 2026-09-30) carries no printed capacity label. Its comms is listed in
// that document as "[CAN / UART]" in brackets (their own placeholder
// notation for not-yet-confirmed), so — consistent with the 105Ah pack's
// own comms field — it's left unset here rather than stated as fact.
//
// None of the 4 packs is tied to an application category unless ReBAT
// confirmed one.

export const BATTERY_RANGE = {
  eyebrow: "Battery pack range",
  tagline: "Lithium power, built for Indian work.",
};

export interface BatteryPack {
  id: string;
  /** Short label used in navigation and specs. */
  name: string;
  categoryId?: string;
  /** Branded product name shown as the primary heading in the pack carousels. */
  productName: string;
  headline: string;
  description: string;
  voltage: string;
  capacity: string;
  energy: string;
  /** Only set where ReBAT has confirmed a protocol — a single value ("CAN")
   * or, where a pack ships in both, a combined one ("CAN / UART"). */
  comms?: string;
  /** A photograph of this exact model. */
  image?: string;
  /** Additional confirmed specs, read directly off the pack's own nameplate. */
  specs?: { label: string; value: string }[];
}

export interface PackCategory {
  id: string;
  title: string;
  /** The core message for this application. */
  message: string;
}

export const PACK_CATEGORIES: PackCategory[] = [
  { id: "solar-street-light", title: "Solar Street Light", message: "Every night, every season, no site visits." },
  { id: "ev-2w-low-speed", title: "EV 2W Low Speed", message: "A 60V pack for low-speed electric two-wheelers." },
  { id: "ev-2w-fleet", title: "EV 2W Fleet", message: "Uptime, cost per km, battery data." },
];

export const BATTERY_PACKS: BatteryPack[] = [
  {
    id: "12v-30ah",
    name: "12.8V 30Ah",
    categoryId: "solar-street-light",
    productName: "ReBAT Spark 30",
    headline: "Every night. Every season. No maintenance.",
    description: "ReBAT Spark 30 is a compact and efficient battery solution designed to deliver reliable power in applications requiring dependable energy storage. With its 12V, 30Ah configuration, it offers a practical balance of performance, portability, and energy efficiency.",
    voltage: "12.8V",
    capacity: "30Ah",
    energy: "0.38 kWh",
    image: "/images/battery/pack-12v-30ah.webp",
    specs: [
      { label: "Model", value: "RBT-1230" },
      { label: "Chemistry", value: "LiFePO4" },
      { label: "Operating Voltage", value: "10\u201314.6V" },
      { label: "Charging/Discharging Current", value: "6A (max 15A)" },
    ],
  },
  {
    id: "60v-30ah",
    name: "60V 30Ah",
    categoryId: "ev-2w-low-speed",
    productName: "ReBAT Voltis 30",
    headline: "A 60V pack for low-speed electric two-wheelers.",
    description: "ReBAT Voltis 30 is a high-voltage battery engineered for applications that demand efficient power delivery and consistent performance. Its 60V, 30Ah configuration makes it suitable for modern electric mobility and high-performance power applications.",
    voltage: "60V",
    capacity: "30Ah",
    energy: "1.80 kWh",
    image: "/images/battery/pack-60v-30ah.webp",
    comms: "CAN / UART",
  },
  {
    id: "51v-45ah",
    name: "51.2V 45Ah",
    categoryId: "ev-2w-fleet",
    productName: "ReBAT Core 45",
    headline: "Built for kilometres, not weekends.",
    description: "ReBAT Core 45 is a reliable and efficient energy-storage solution designed for applications requiring a balance of power, performance, and runtime. With its 51.2V, 45Ah configuration, it delivers consistent energy while offering a compact and practical solution for modern power and mobility applications.",
    voltage: "51.2V",
    capacity: "45Ah",
    energy: "2.30 kWh",
    image: "/images/battery/pack-51v-45ah.webp",
  },
  {
    id: "51v-105ah",
    name: "51.2V 105Ah",
    productName: "ReBAT Titan 105",
    headline: "51.2V 105Ah lithium pack.",
    description: "ReBAT Titan 105 is a high-capacity energy solution built for applications requiring extended runtime and dependable power. With a 51.2V, 105Ah configuration, it combines substantial energy storage with reliable performance for demanding power requirements.",
    voltage: "51.2V",
    capacity: "105Ah",
    energy: "5.38 kWh",
    image: "/images/battery/pack-51v-105ah.webp",
    specs: [
      { label: "Chemistry", value: "LFP (LiFePO4)" },
      { label: "Full Charge Voltage", value: "58.4V" },
      { label: "Full Discharge Voltage", value: "44.8V" },
      { label: "Protection Circuit Board", value: "Yes" },
    ],
  },
];

export function categoryOf(pack: BatteryPack): PackCategory | undefined {
  return PACK_CATEGORIES.find((c) => c.id === pack.categoryId);
}

export function packsIn(categoryId: string): BatteryPack[] {
  return BATTERY_PACKS.filter((p) => p.categoryId === categoryId);
}

/** Packs not tied to one of the current application categories. */
export function uncategorizedPacks(): BatteryPack[] {
  return BATTERY_PACKS.filter((p) => !p.categoryId);
}

// ----------------------------------------------------------------------
// Testing and quality control.
export const TESTING = {
  eyebrow: "Testing and quality control",
  headline: "Every cell tested. Every pack proven.",
  body: "A battery is only as good as its weakest cell. That's why we test every cell before it enters production, check quality at every stage of assembly, age every pack, and run a final end-of-line test on the BMS and battery before it leaves our factory. Nothing ships on trust, only on test results.",
  stages: [
    {
      title: "Cell IQC",
      summary: "Every incoming cell is tested before it enters production.",
      checks: ["Open circuit voltage (OCV)", "Internal resistance (IR)", "Capacity", "Self-discharge"],
    },
    {
      title: "In-process QC",
      summary: "Quality checks at every stage of assembly, not just at the end.",
      checks: ["Cell grading and matching", "Check at each build stage", "Stage sign-off before moving on"],
    },
    {
      title: "Aging test",
      summary: "Packs are held and cycled to catch early failures before dispatch.",
      checks: ["Charge-discharge cycling", "Voltage stability check", "Weak packs rejected"],
    },
    {
      title: "EOL test",
      summary: "Final end-of-line test on BMS and battery before it ships.",
      checks: ["BMS protection and function", "Communication (CAN/UART)", "Full pack performance"],
    },
  ],
  meaning: {
    title: "What each test means for you",
    items: [
      { test: "OCV and IR check", result: "Only healthy, matched cells go into a pack, so every cell works evenly and the pack lasts longer." },
      { test: "Capacity test", result: "The Ah on the label is the Ah you get." },
      { test: "Self-discharge test", result: "Weak cells are removed, so the battery holds charge in storage and on the pole." },
      { test: "Aging test", result: "Early failures happen in our factory, not in your field, vehicle or home." },
      { test: "EOL test", result: "Every BMS protection and every pack is verified before dispatch." },
    ],
  },
  strip: [
    "100% cell testing (OCV, IR, Capacity, Self-discharge)",
    "QC at every stage",
    "Aging tested",
    "EOL tested",
  ],
};
