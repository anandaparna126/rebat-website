// Real photography supplied by ReBAT (V:\Rebat Photos\Battey Products,
// 2026-09-25; phone-batteries-macro added from V:\Rebat Photos\Photos\EDIT,
// 2026-09-30). Captions describe only what is visible in each photo; no
// model, chemistry or origin is claimed beyond that.

export interface BatteryPhoto {
  src: string;
  alt: string;
  caption: string;
}

export const PACK_PHOTOS: BatteryPhoto[] = [
  { src: "/images/battery/pack-green-top.webp", alt: "A ReBAT battery pack with a green lid, terminal posts and a grey connector lead", caption: "Pack with connector lead" },
  { src: "/images/battery/pack-green-side.webp", alt: "A large green ReBAT battery pack with two carry handles", caption: "Large-format pack" },
  { src: "/images/battery/pack-black-warm.webp", alt: "A black ReBAT battery pack with red and black leads and a grey connector", caption: "Pack with red and black leads" },
  { src: "/images/battery/pack-black-white.webp", alt: "A black ReBAT battery pack on a white background with a grey twin connector", caption: "Compact pack" },
];

export const TESTING_PHOTOS: BatteryPhoto[] = [
  { src: "/images/battery/testing-cabinet-1.webp", alt: "A blue testing cabinet with shelves of cylindrical cells on charge and discharge trays", caption: "Cell testing cabinet" },
  { src: "/images/battery/testing-cabinet-2.webp", alt: "Close view of cells seated on a cabinet tray with indicator lights", caption: "Channel by channel" },
  { src: "/images/battery/testing-cabinet-3.webp", alt: "A testing cabinet with every shelf loaded with cells", caption: "Cells under test" },
];

export const COLLECTED_PHOTOS: BatteryPhoto[] = [
  {
    src: "/images/battery/phone-batteries-macro.webp",
    alt: "A gloved hand holding a fan of spent phone batteries over a large pile of collected e-waste batteries",
    caption: "Collected phone batteries",
  },
  { src: "/images/battery/cells-pile.webp", alt: "A pile of cylindrical lithium-ion cells in a carton", caption: "Loose cylindrical cells" },
  { src: "/images/battery/modules-stacked.webp", alt: "Stacks of battery modules with green terminal strips, wrapped for handling", caption: "Stacked modules" },
  { src: "/images/battery/cells-crates.webp", alt: "Wooden crates filled with cylindrical cells", caption: "Cells in crates" },
  { src: "/images/battery/modules-pallet.webp", alt: "Rows of battery modules stacked on a pallet", caption: "Modules on a pallet" },
  { src: "/images/battery/cells-prismatic.webp", alt: "Two large prismatic battery cells with terminals", caption: "Prismatic cells" },
  { src: "/images/battery/cells-cylindrical-box.webp", alt: "A carton packed with rows of cylindrical cells", caption: "Boxed cells" },
];

export const COLLECTED_VIDEO = "/videos/story/end-of-life-batteries.mp4";
