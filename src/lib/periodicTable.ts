// The real, standard periodic table layout — public scientific fact, used
// only to draw the dimmed 118-element background field that our recovered
// materials sit inside. No per-element data beyond symbol + grid position is
// needed here since these cells are decorative context, not interactive.

// One row per period. `null` marks a gap in that period's row (the table's
// real shape, not a rendering shortcut).
export const PERIODIC_GRID: (string | null)[][] = [
  ["H", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "He"],
  ["Li", "Be", null, null, null, null, null, null, null, null, null, null, "B", "C", "N", "O", "F", "Ne"],
  ["Na", "Mg", null, null, null, null, null, null, null, null, null, null, "Al", "Si", "P", "S", "Cl", "Ar"],
  ["K", "Ca", "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Ga", "Ge", "As", "Se", "Br", "Kr"],
  ["Rb", "Sr", "Y", "Zr", "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "In", "Sn", "Sb", "Te", "I", "Xe"],
  ["Cs", "Ba", "La–Lu", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg", "Tl", "Pb", "Bi", "Po", "At", "Rn"],
  ["Fr", "Ra", "Ac–Lr", "Rf", "Db", "Sg", "Bh", "Hs", "Mt", "Ds", "Rg", "Cn", "Nh", "Fl", "Mc", "Lv", "Ts", "Og"],
];

// f-block rows, rendered two rows below the main grid (with one blank
// spacer row between), starting at column 4 — the real table's own layout.
export const LANTHANIDES = ["La", "Ce", "Pr", "Nd", "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb", "Lu"];
export const ACTINIDES = ["Ac", "Th", "Pa", "U", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm", "Md", "No", "Lr"];

export const GRID_COLUMNS = 18;

// Flattened row-major cell list (10 rows x 18 columns = 180 cells) so the
// grid can rely on plain CSS auto-flow instead of manual row/column
// placement per cell. Row 8 is a blank spacer (the real table's own
// convention) before the f-block; the f-block rows start at column 4.
function buildFlatGrid(): (string | null)[] {
  const cells: (string | null)[] = [];
  for (const row of PERIODIC_GRID) cells.push(...row);
  cells.push(...Array(GRID_COLUMNS).fill(null)); // spacer row
  cells.push(...Array(3).fill(null), ...LANTHANIDES);
  cells.push(...Array(3).fill(null), ...ACTINIDES);
  return cells;
}

export const FULL_GRID = buildFlatGrid();

// The 118 real element symbols in atomic-number order (H=1 ... Og=118) —
// public scientific fact, used only to label each cell with its real
// atomic number for an authentic full-table look.
const ELEMENT_ORDER = [
  "H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne",
  "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K", "Ca",
  "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn",
  "Ga", "Ge", "As", "Se", "Br", "Kr", "Rb", "Sr", "Y", "Zr",
  "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "In", "Sn",
  "Sb", "Te", "I", "Xe", "Cs", "Ba", "La", "Ce", "Pr", "Nd",
  "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb",
  "Lu", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg",
  "Tl", "Pb", "Bi", "Po", "At", "Rn", "Fr", "Ra", "Ac", "Th",
  "Pa", "U", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm",
  "Md", "No", "Lr", "Rf", "Db", "Sg", "Bh", "Hs", "Mt", "Ds",
  "Rg", "Cn", "Nh", "Fl", "Mc", "Lv", "Ts", "Og",
];

const ATOMIC_NUMBER_BY_SYMBOL = new Map(ELEMENT_ORDER.map((s, i) => [s, i + 1]));

export function atomicNumberOf(symbol: string): number | undefined {
  return ATOMIC_NUMBER_BY_SYMBOL.get(symbol);
}

// Real chemistry categories (the same convention every standard periodic
// table poster uses) — this is what actually makes the background field
// read as "alive" rather than needing 118 individually sourced photos.
export type ElementCategory =
  | "alkali" | "alkaline" | "transition" | "post-metal" | "metalloid"
  | "nonmetal" | "halogen" | "noble" | "lanthanide" | "actinide" | "unknown";

// Aligned 1:1 with ELEMENT_ORDER above.
const CATEGORY_ORDER: ElementCategory[] = [
  "nonmetal", "noble", "alkali", "alkaline", "metalloid", "nonmetal", "nonmetal", "nonmetal", "halogen", "noble",
  "alkali", "alkaline", "post-metal", "metalloid", "nonmetal", "nonmetal", "halogen", "noble", "alkali", "alkaline",
  "transition", "transition", "transition", "transition", "transition", "transition", "transition", "transition", "transition", "transition",
  "post-metal", "metalloid", "metalloid", "nonmetal", "halogen", "noble", "alkali", "alkaline", "transition", "transition",
  "transition", "transition", "transition", "transition", "transition", "transition", "transition", "transition", "post-metal", "post-metal",
  "metalloid", "metalloid", "halogen", "noble", "alkali", "alkaline", "lanthanide", "lanthanide", "lanthanide", "lanthanide",
  "lanthanide", "lanthanide", "lanthanide", "lanthanide", "lanthanide", "lanthanide", "lanthanide", "lanthanide", "lanthanide", "lanthanide",
  "lanthanide", "transition", "transition", "transition", "transition", "transition", "transition", "transition", "transition", "transition",
  "post-metal", "post-metal", "post-metal", "metalloid", "halogen", "noble", "alkali", "alkaline", "actinide", "actinide",
  "actinide", "actinide", "actinide", "actinide", "actinide", "actinide", "actinide", "actinide", "actinide", "actinide",
  "actinide", "actinide", "actinide", "transition", "transition", "transition", "transition", "transition", "transition", "transition",
  "transition", "transition", "unknown", "unknown", "unknown", "unknown", "unknown", "unknown",
];

const CATEGORY_BY_SYMBOL = new Map(ELEMENT_ORDER.map((s, i) => [s, CATEGORY_ORDER[i]]));

export function categoryOf(symbol: string): ElementCategory {
  return CATEGORY_BY_SYMBOL.get(symbol) ?? "unknown";
}

// Muted pastel tones — visible enough to read as real categories, still
// restrained enough to sit behind the brand-emerald recovered-element tiles
// without competing with them.
export const CATEGORY_COLORS: Record<ElementCategory, string> = {
  alkali: "#e3a08c",
  alkaline: "#e6bd8a",
  transition: "#8fb8cc",
  "post-metal": "#a8bdb4",
  metalloid: "#9bc496",
  nonmetal: "#c7d68f",
  halogen: "#e0cb7c",
  noble: "#b3a0cf",
  lanthanide: "#e3aec4",
  actinide: "#c99bcb",
  unknown: "#c2c6c2",
};
