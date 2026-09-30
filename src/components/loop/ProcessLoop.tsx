"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Mark } from "@/components/mark/Mark";
import { Reveal } from "@/components/ui/Reveal";
import { LOOP_EDGES, LOOP_NODES } from "@/lib/content";

// "Close the loop" — the ReBAT factory flow rendered as a live isometric
// diorama. Nodes, connections and labels come straight from content.ts
// (LOOP_NODES / LOOP_EDGES) unchanged; everything in this file is
// presentation: where each facility sits on the ground plane, what its
// building looks like, and the material flowing along each road.

/* ---------------------------------------------------------------- */
/* Isometric projection                                              */
/* ---------------------------------------------------------------- */

const U = 80;
const CX = U * Math.cos(Math.PI / 6);
const CY = U / 2;

type Pt = [number, number];
type G2 = [number, number];
type G3 = [number, number, number];

const r1 = (n: number) => Math.round(n * 10) / 10;

function iso(gx: number, gy: number, z = 0): Pt {
  return [(gx - gy) * CX, (gx + gy) * CY - z];
}

function pts(...ps: G3[]) {
  return ps.map(([gx, gy, z]) => iso(gx, gy, z).map(r1).join(",")).join(" ");
}

/* ---------------------------------------------------------------- */
/* Layout (ground-plane grid units)                                  */
/* ---------------------------------------------------------------- */

// No base plate: the whole section is the ground, like an open city map.
// ReBAT's own compound is the centrepiece; the steps that happen inside it
// sit on its real plants (see SITE below). Outside it, the collection
// centre stands across the west road from the Store, and testing, customers
// and used batteries line the road behind the compound, closing the loop
// back round to collection.

// The compound is planned in blueprint units measured off the drone photos,
// then drawn spread out by SPREAD around its front-left corner (the gate
// side): the real layout keeps its proportions but gets room to breathe.
// sx/sy/sp map a blueprint point onto the ground.
const SPREAD = 1.55;
const BP_X = 4.55, BP_Y = 4;
// The driveway between the Chemical Plant and the big shed is drawn wider
// than it really is, so what crosses it (black mass one way, Li/Co/Al/Ni
// the other) reads clearly: everything east of it moves over by this much.
const DRIVE_WIDEN = 1.1;
const sx = (x: number) => BP_X + (x + (x > 9.2 ? DRIVE_WIDEN : 0) - BP_X) * SPREAD;
const sy = (y: number) => BP_Y + (y - BP_Y) * SPREAD;
const sp = (x: number, y: number): G2 => [sx(x), sy(y)];

// The lane through the gate, and where the scrap truck parks inside it.
const IN_Y = sy(2.45);
const TRUCK_STOP: G2 = [sx(5.6), IN_Y];

// The collection centre faces the Store, west of the compound. Two roads
// come into its back side by side, this far either side of its middle:
// cell manufacturing's on the inner lane, customers' on the outer one.
const COLLECT_Y = sy(-1.95);
const BACK_LANE = 0.5;
const CELL_LANE = 1.9 + BACK_LANE, CUSTOMER_LANE = 1.9 - BACK_LANE;

// The middle of the driveway between the Chemical Plant and the big shed.
const DRIVE_MID = (sx(8.52) + sx(9.92)) / 2;
// Cell manufacturing is its own building just outside the compound's back
// wall, straight out of the back gate in the middle of the driveway.
// Customers are further back still, right behind it, so their road runs
// behind cell manufacturing's and no two roads ever cross.
const CELL_X = DRIVE_MID, CELL_Y = sy(-6) - 2.1;
const CUSTOMER_Y = CELL_Y - 2.9;
// A long shed across the front of the compound, from beside the main gate
// to the far end of the Recycling Plant: the Second Life Plant, with
// Testing at its east end, right in front of the Recycling Plant. It stands
// forward of the yard, with the garden between them.
const FRONT_Y0 = 4.8, FRONT_Y1 = 8, FRONT_MID = (FRONT_Y0 + FRONT_Y1) / 2;
const FRONT_X0 = 5.1, FRONT_SPLIT = sx(9.92), FRONT_X1 = sx(12.69);
// The strip between the big sheds and the east wall, where tested packs
// head for the back gate.
const EAST_LANE = (sx(12.69) + sx(13.3)) / 2;
// Where the customer's scooter stops, just short of the collection
// centre's back gate, to hand over the used battery.
const SCOOTER_STOP_Y = COLLECT_Y - 3.8;

const LAYOUT: Record<string, G2> = {
  collection: [1.9, COLLECT_Y],
  factory: TRUCK_STOP,
  characterisation: sp(6.1, 0.77),
  quality: sp(7.65, 0.77),
  extraction: sp(7.65, -1),
  recycling: sp(11.3, -0.4),
  cellmaker: [CELL_X, CELL_Y],
  refurb: [(FRONT_X0 + FRONT_SPLIT) / 2, FRONT_MID],
  packmaker: [(FRONT_X0 + FRONT_SPLIT) / 2, FRONT_MID],
  testing: [(FRONT_SPLIT + FRONT_X1) / 2, FRONT_MID],
  // Behind cell manufacturing and a little to its east, so the tall
  // building doesn't hide the queue or the parked scooter.
  customers: [CELL_X + 3, CUSTOMER_Y],
};

// Road waypoints between the two node centres, so every road runs along
// the ground grid. Inside the compound these are the yard and driveway
// lanes; the truck comes in through the gate on the west wall, and metals
// and tested packs leave through gates in the back wall.
const VIA: Record<string, G2[]> = {
  // The truck leaves the collection centre by its front gate on a single
  // L-shaped road: straight down, then one turn in through the main gate.
  // Used batteries come in by the back gate, off the road behind.
  "collection>factory": [[1.9, IN_Y]],
  // Into the QC Lab on one lane and out on another beside it, so the two
  // directions never share a lane.
  "factory>characterisation": [[sx(5.8), IN_Y], sp(5.8, 0.77)],
  // One lane out of the QC Lab, splitting in the yard: on east into the
  // Recycling Plant, or straight on south into the Second Life Plant.
  "characterisation>recycling": [sp(6.4, 0.77), sp(6.4, 1.8), sp(11.3, 1.8)],
  "characterisation>extraction": [sp(6.1, -1)],
  "characterisation>refurb": [sp(6.4, 0.77), [sx(6.4), FRONT_MID]],
  "recycling>extraction": [sp(11.3, -1)],
  // Li/Co/Ni leave the back end of the Chemical Plant onto the driveway and
  // go straight out the back gate in its middle, into cell manufacturing
  // from the front.
  "extraction>cellmaker": [sp(7.65, -3.75), [CELL_X, sy(-3.75)]],
  // Packs go from the Second Life Plant straight through into Testing, then
  // out its east end, up the east strip, out the back gate and on past cell
  // manufacturing to customers.
  "testing>customers": [[EAST_LANE, FRONT_MID], [EAST_LANE, CUSTOMER_Y]],
  // Used batteries go from customers back to the collection centre on one
  // L-shaped road behind cell manufacturing, into its outer back gate.
  "customers>collection": [[CUSTOMER_LANE, CUSTOMER_Y], [CUSTOMER_LANE, COLLECT_Y]],
  // Batteries out of cell manufacturing take their own L-shaped road in
  // front of that one, into the collection centre's inner back gate.
  "cellmaker>collection": [[CELL_LANE, CELL_Y], [CELL_LANE, COLLECT_Y]],
};

// Where an edge's signpost stands, when the route midpoint would put it
// inside the compound or on top of another road.
const SIGN_AT: Record<string, G2> = {
  "collection>factory": [0.3, (COLLECT_Y + IN_Y) / 2 + 1],
  // Beside the customers' lane where it comes down to the collection
  // centre, low enough to stay clear of the faded top edge.
  "customers>collection": [-0.2, -6.8],
};


// ReBAT's location sign stands here, among the trees west of the
// collection centre, below the section heading.
const MAPS_SIGN_AT: G2 = [-2.7, -2.3];

// Facilities are drawn at this multiple of their base footprint, scaled
// about their own ground centre so the isometric angles stay true.
const S = 2;
// Scenery (trees, turbines, panels, vehicles, people) scale.
const DS = 1.6;

const PEOPLE_COLORS = ["#338572", "#DDB73C", "#338572", "#E6C96D", "#338572"];

/* ---------------------------------------------------------------- */
/* Palette                                                           */
/* ---------------------------------------------------------------- */

type Shade = readonly [top: string, left: string, right: string];

const WALL: Shade = ["#FFFFFF", "#E0EDEA", "#BFD9D3"];
const MINT: Shade = ["#EBF3F1", "#D1E4DF", "#A6CAC1"];
const ROOF: Shade = ["#338572", "#00674F", "#035340"];
const DARK: Shade = ["#338572", "#00674F", "#035340"];
const GOLD: Shade = ["#E6C96D", "#DDB73C", "#DDB73C"];
const GLASS: Shade = ["#D1E4DF", "#A6CAC1", "#80B3A7"];
const EDGE = "rgba(10,36,28,0.14)";
const WIN_L = "#338572";
const WIN_R = "#338572";
const LIT = "#E6C96D";

/* ---------------------------------------------------------------- */
/* Primitives                                                        */
/* ---------------------------------------------------------------- */

function Box({ gx, gy, w, d, z = 0, h, c }: { gx: number; gy: number; w: number; d: number; z?: number; h: number; c: Shade }) {
  const x0 = gx - w / 2, x1 = gx + w / 2, y0 = gy - d / 2, y1 = gy + d / 2, t = z + h;
  return (
    <g stroke={EDGE} strokeWidth={0.6} strokeLinejoin="round">
      <polygon points={pts([x0, y1, z], [x1, y1, z], [x1, y1, t], [x0, y1, t])} fill={c[1]} />
      <polygon points={pts([x1, y0, z], [x1, y1, z], [x1, y1, t], [x1, y0, t])} fill={c[2]} />
      <polygon points={pts([x0, y0, t], [x1, y0, t], [x1, y1, t], [x0, y1, t])} fill={c[0]} />
    </g>
  );
}

// A flat rectangle painted on a box's front-left (+gy) or front-right (+gx)
// face — windows, doors, stripes. a/b run along that face from its centre.
function Panel({ side, gx, gy, w, d, a, b, z1, z2, fill, className }: {
  side: "L" | "R"; gx: number; gy: number; w: number; d: number; a: number; b: number;
  z1: number; z2: number; fill: string; className?: string;
}) {
  const p =
    side === "L"
      ? pts([gx + a, gy + d / 2, z1], [gx + b, gy + d / 2, z1], [gx + b, gy + d / 2, z2], [gx + a, gy + d / 2, z2])
      : pts([gx + w / 2, gy + a, z1], [gx + w / 2, gy + b, z1], [gx + w / 2, gy + b, z2], [gx + w / 2, gy + a, z2]);
  return <polygon points={p} fill={fill} className={className} />;
}

function Wins({ side, gx, gy, w, d, n, z1, z2, glow = true }: {
  side: "L" | "R"; gx: number; gy: number; w: number; d: number; n: number; z1: number; z2: number; glow?: boolean;
}) {
  const len = side === "L" ? w : d;
  const cell = (len - 0.16) / n;
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const a = -len / 2 + 0.08 + i * cell + cell * 0.16;
        const lit = glow && (i + (side === "L" ? 0 : 1) + Math.round(z1)) % 3 === 0;
        return (
          <Panel
            key={i} side={side} gx={gx} gy={gy} w={w} d={d} a={a} b={a + cell * 0.68} z1={z1} z2={z2}
            fill={lit ? LIT : side === "L" ? WIN_L : WIN_R}
          />
        );
      })}
    </>
  );
}

// A roller-shutter gate on a front (L) or right (R) wall.
function Shutter({ side, gx, gy, w, d, a, b, h }: { side: "L" | "R"; gx: number; gy: number; w: number; d: number; a: number; b: number; h: number }) {
  return (
    <>
      <Panel side={side} gx={gx} gy={gy} w={w} d={d} a={a} b={b} z1={0} z2={h} fill="#338572" />
      {[0.25, 0.5, 0.75].map((f) => (
        <Panel key={f} side={side} gx={gx} gy={gy} w={w} d={d} a={a} b={b} z1={h * f - 0.5} z2={h * f} fill="#599C8D" />
      ))}
      <Panel side={side} gx={gx} gy={gy} w={w} d={d} a={a - 0.03} b={b + 0.03} z1={h} z2={h + 2} fill="#E6C96D" />
    </>
  );
}

function Cyl({ gx, gy, r, z = 0, h, side, top = "#FFFFFF", band, dome }: {
  gx: number; gy: number; r: number; z?: number; h: number; side: string; top?: string;
  band?: [number, number]; dome?: string;
}) {
  const [cx, by] = iso(gx, gy, z);
  const ty = by - h;
  const rx = r * CX * Math.SQRT2;
  const ry = r * CY * Math.SQRT2;
  const L = r1(cx - rx), R = r1(cx + rx), RX = r1(rx), RY = r1(ry);
  return (
    <g>
      <path d={`M${L},${r1(ty)} L${L},${r1(by)} A${RX},${RY} 0 0 0 ${R},${r1(by)} L${R},${r1(ty)} Z`} fill={side} stroke={EDGE} strokeWidth={0.6} />
      {band && (
        <path
          d={`M${L},${r1(by - band[0])} A${RX},${RY} 0 0 0 ${R},${r1(by - band[0])} L${R},${r1(by - band[1])} A${RX},${RY} 0 0 1 ${L},${r1(by - band[1])} Z`}
          fill="#DDB73C"
        />
      )}
      {dome ? (
        <path
          d={`M${L},${r1(ty)} A${RX},${r1(rx * 0.85)} 0 0 1 ${R},${r1(ty)} A${RX},${RY} 0 0 1 ${L},${r1(ty)} Z`}
          fill={dome} stroke={EDGE} strokeWidth={0.6}
        />
      ) : (
        <ellipse cx={r1(cx)} cy={r1(ty)} rx={RX} ry={RY} fill={top} stroke={EDGE} strokeWidth={0.6} />
      )}
    </g>
  );
}

function Beacon({ at }: { at: Pt }) {
  return <circle cx={r1(at[0])} cy={r1(at[1])} r={2.6} fill="#E6C96D" />;
}

function Mast({ gx, gy, z, h }: { gx: number; gy: number; z: number; h: number }) {
  const [x, y] = iso(gx, gy, z);
  return (
    <g>
      <line x1={r1(x)} y1={r1(y)} x2={r1(x)} y2={r1(y - h)} stroke="#00674F" strokeWidth={1.6} strokeLinecap="round" />
      <Beacon at={[x, y - h]} />
    </g>
  );
}

// Rooftop HVAC unit — breaks up the large flat roofs.
function Ac({ gx, gy, z }: { gx: number; gy: number; z: number }) {
  return (
    <>
      <Box gx={gx} gy={gy} w={0.18} d={0.16} z={z} h={5} c={WALL} />
      <Panel side="L" gx={gx} gy={gy} w={0.18} d={0.16} a={-0.06} b={0.06} z1={z + 1.2} z2={z + 3.8} fill="#80B3A7" />
    </>
  );
}

// Flat hard-edged shadow falling down-right, the way a flat isometric
// illustration shades its buildings.
function Shadow({ gx, gy, w, d, h }: { gx: number; gy: number; w: number; d: number; h: number }) {
  const a = h / 42, b = h / 140;
  const x0 = gx - w / 2, x1 = gx + w / 2, y0 = gy - d / 2, y1 = gy + d / 2;
  return (
    <polygon
      points={pts([x0, y1, 0], [x0, y0, 0], [x0 + a, y0 - b, 0], [x1 + a, y0 - b, 0], [x1 + a, y1 - b, 0], [x1, y1, 0])}
      fill="#064233" opacity={0.07}
    />
  );
}

function Person({ gx, gy, color }: { gx: number; gy: number; color: string }) {
  const [x, y] = iso(gx, gy);
  return (
    <g>
      <ellipse cx={r1(x + 1.5)} cy={r1(y)} rx={5} ry={2} fill="#064233" opacity={0.14} />
      <rect x={r1(x - 2.4)} y={r1(y - 9)} width={1.8} height={9} rx={0.9} fill="#00674F" />
      <rect x={r1(x + 0.6)} y={r1(y - 9)} width={1.8} height={9} rx={0.9} fill="#00674F" />
      <rect x={r1(x - 3)} y={r1(y - 18)} width={6} height={10} rx={2.6} fill={color} />
      <circle cx={r1(x)} cy={r1(y - 21.5)} r={3} fill="#EEDB9E" />
    </g>
  );
}

// Scales a scenery sprite about its own ground point.
function Scaled({ gx, gy, k, children }: { gx: number; gy: number; k: number; children: ReactNode }) {
  const [ox, oy] = iso(gx, gy).map(r1);
  return <g transform={`translate(${ox} ${oy}) scale(${k}) translate(${-ox} ${-oy})`}>{children}</g>;
}

// A small delivery truck drawn around the ground origin, facing along one
// ground axis, so an <animateMotion> can carry it down a straight road.
function TruckSprite({ axis, dir }: { axis: "x" | "y"; dir: 1 | -1 }) {
  const along = (a: number) => (axis === "x" ? { gx: a, gy: 0 } : { gx: 0, gy: a });
  const size = (l: number, t: number) => (axis === "x" ? { w: l, d: t } : { w: t, d: l });
  const cargo = <Box {...along(-dir * 0.1)} {...size(0.46, 0.22)} z={3} h={13} c={WALL} />;
  const cab = <Box {...along(dir * 0.24)} {...size(0.16, 0.22)} z={3} h={10} c={GOLD} />;
  const cabInFront = dir === 1;
  const s = axis === "x" ? [0.36, 0.14] : [0.14, 0.36];
  // The ReBAT "b" on the container's long side, the one facing the viewer.
  const c = along(-dir * 0.1);
  const [lx, ly] = axis === "x" ? iso(c.gx, 0.11, 9.5) : iso(0.11, c.gy, 9.5);
  const m = axis === "x" ? `matrix(0.866 0.5 0 1 ${r1(lx)} ${r1(ly)})` : `matrix(0.866 -0.5 0 1 ${r1(lx)} ${r1(ly)})`;
  const branded = (
    <>
      {cargo}
      <g transform={m}>
        <g transform="translate(-5 -5)">
          <Mark size={10} color="#599C8D" />
        </g>
      </g>
    </>
  );
  return (
    <g>
      <polygon points={pts([-s[0] + 0.06, -s[1] + 0.02, 0], [s[0] + 0.06, -s[1] + 0.02, 0], [s[0] + 0.06, s[1] + 0.02, 0], [-s[0] + 0.06, s[1] + 0.02, 0])} fill="#064233" opacity={0.12} />
      {cabInFront ? branded : cab}
      {cabInFront ? cab : branded}
    </g>
  );
}

/* ---------------------------------------------------------------- */
/* Facilities                                                        */
/* ---------------------------------------------------------------- */

interface Facility {
  fp: [w: number, d: number, h: number];
  anchorZ: number;
  clearZ: number;
  dx?: number;
  draw: (x: number, y: number) => ReactNode;
}

const FACILITIES: Record<string, Facility> = {
  collection: {
    fp: [1.1, 1.0, 35], anchorZ: 35, clearZ: 38,
    draw: (x, y) => (
      <>
        {/* Two back gates side by side, behind the building: batteries in
            from cell manufacturing (left) and used batteries from customers (right) */}
        {[-0.47, 0, 0.47].map((o) => <Box key={o} gx={x + o} gy={y - 1.5} w={0.06} d={0.06} h={19} c={WALL} />)}
        {[-0.235, 0.235].map((o) => (
          <g key={o}>
            <Box gx={x + o} gy={y - 1.5} w={0.46} d={0.05} z={13} h={6.5} c={["#EEDB9E", "#E6C96D", "#DDB73C"]} />
            <WallText at={[x + o, y - 1.475, 14.6]} side="L" size={4.8}><tspan fill="#FFFFFF">IN</tspan></WallText>
          </g>
        ))}
        <Box gx={x - 0.85} gy={y + 0.3} w={0.26} d={0.26} h={11} c={GOLD} />
        <Box gx={x - 0.85} gy={y + 0.3} w={0.26} d={0.26} z={11} h={11} c={ROOF} />
        <Box gx={x - 0.85} gy={y + 0.62} w={0.26} d={0.26} h={11} c={ROOF} />
        <Box gx={x} gy={y} w={1.1} d={1.0} h={30} c={WALL} />
        <Box gx={x} gy={y} w={1.18} d={1.08} z={30} h={5} c={ROOF} />
        <RoofName at={[x, y + 0.2, 35]} along="x" text="COLLECTION CENTER" fill={NAME_LIGHT} size={7.4} />
        <Ac gx={x - 0.25} gy={y - 0.25} z={35} />
        <Ac gx={x + 0.25} gy={y - 0.25} z={35} />
        {/* Front gate: the truck goes out here */}
        <Shutter side="L" gx={x} gy={y} w={1.1} d={1.0} a={-0.2} b={0.2} h={18} />
        <WallText at={[x, y + 0.5, 21]} side="L" size={5.5}><tspan fill="#338572">OUT</tspan></WallText>
        <Panel side="L" gx={x} gy={y} w={1.1} d={1.0} a={-0.47} b={-0.3} z1={14} z2={22} fill={WIN_L} />
        <Panel side="L" gx={x} gy={y} w={1.1} d={1.0} a={0.3} b={0.47} z1={14} z2={22} fill={LIT} />
        <Wins side="R" gx={x} gy={y} w={1.1} d={1.0} n={1} z1={14} z2={22} />
      </>
    ),
  },
  cellmaker: {
    fp: [0.95, 0.95, 70], anchorZ: 70, clearZ: 78,
    draw: (x, y) => (
      <>
        <Box gx={x} gy={y} w={0.95} d={0.95} h={66} c={MINT} />
        <Box gx={x} gy={y} w={1.0} d={1.0} z={66} h={4} c={ROOF} />
        <Box gx={x + 0.15} gy={y - 0.15} w={0.3} d={0.3} z={70} h={6} c={WALL} />
        <RoofName at={[x, y + 0.3, 70]} along="x" text="CELL MANUFACTURER" fill={NAME_LIGHT} size={5.6} />
        {[8, 19, 30, 41, 52].map((z) => (
          <g key={z}>
            <Wins side="L" gx={x} gy={y} w={0.95} d={0.95} n={3} z1={z} z2={z + 7} />
            <Wins side="R" gx={x} gy={y} w={0.95} d={0.95} n={3} z1={z} z2={z + 7} />
          </g>
        ))}
      </>
    ),
  },
  // Drawn at 70% of the other facilities' size.
  customers: {
    fp: [0.77, 0.49, 24], anchorZ: 24, clearZ: 27,
    draw: (x, y) => (
      <Scaled gx={x} gy={y} k={0.7}>
        {[[-0.48, -0.3], [0.48, -0.3]].map(([ox, oy]) => (
          <Box key={`b${ox}`} gx={x + ox} gy={y + oy} w={0.06} d={0.06} h={30} c={DARK} />
        ))}
        <Box gx={x + 0.4} gy={y - 0.05} w={0.14} d={0.14} h={15} c={ROOF} />
        <Panel side="L" gx={x + 0.4} gy={y - 0.05} w={0.14} d={0.14} a={-0.04} b={0.04} z1={8} z2={12} fill="#FFFFFF" />
        <Box gx={x - 0.1} gy={y + 0.08} w={0.62} d={0.32} z={2} h={7} c={GOLD} />
        <Box gx={x - 0.14} gy={y + 0.08} w={0.32} d={0.28} z={9} h={6} c={GLASS} />
        {[[-0.48, 0.3], [0.48, 0.3]].map(([ox, oy]) => (
          <Box key={`f${ox}`} gx={x + ox} gy={y + oy} w={0.06} d={0.06} h={30} c={DARK} />
        ))}
        <Box gx={x} gy={y - 0.05} w={1.12} d={0.72} z={30} h={4} c={ROOF} />
        <RoofName at={[x, y - 0.05, 34]} along="x" text="CUSTOMERS" fill={NAME_LIGHT} size={13} />
      </Scaled>
    ),
  },
};

const FALLBACK: Facility = {
  fp: [1, 1, 28], anchorZ: 28, clearZ: 32,
  draw: (x, y) => <Box gx={x} gy={y} w={1} d={1} h={28} c={WALL} />,
};

/* ---------------------------------------------------------------- */
/* ReBAT's own site                                                  */
/* ---------------------------------------------------------------- */

// The factory compound, laid out after ReBAT's real site in Bhopal (from
// drone photos): the gate is on the west wall at the front-left corner;
// the long Store runs front-to-back on the left with the Chemical Plant
// attached beside it and the single-storey QC Lab across the front of
// both. A narrow driveway, bridged near the back, separates them from the
// big shed holding the Mechanical Plant (front) and Second Life Plant
// (back). Ground x runs east, y runs south to the front. Plan numbers are
// blueprint units (spread by sx/sy); heights are final pixels (the
// compound is drawn at true scale, not scaled by S).
type Rect = { x0: number; x1: number; y0: number; y1: number };

const sr = (r: Rect): Rect => ({ x0: sx(r.x0), x1: sx(r.x1), y0: sy(r.y0), y1: sy(r.y1) });

const SITE: Rect = { ...sr({ x0: 4.55, x1: 13.3, y0: -6, y1: 4 }), y1: FRONT_Y1 + 0.9 };
const GATE: [number, number] = [sy(2.2), sy(3.1)];
// ReBAT's garden: a lawn under a canopy of trees between the yard and the
// front shed, with a gazebo in the middle. Packs for the Second Life Plant
// cross it on their lane at GARDEN_LANE.
const GARDEN: Rect = { x0: sx(4.55) + 0.2, x1: sx(12.69) - 0.2, y0: 2.95, y1: FRONT_Y0 - 0.25 };
const GARDEN_LANE = sx(6.4);
const HEDGE: Shade = ["#338572", "#00674F", "#035340"];
const GARDEN_TREES: [number, number, number][] = [GARDEN.y0 + 0.4, GARDEN.y1 - 0.4].flatMap((gy, row) =>
  Array.from({ length: Math.floor((GARDEN.x1 - GARDEN.x0 - 0.6) / 1.05) + 1 }, (_, i): [number, number, number] =>
    [GARDEN.x0 + 0.3 + i * 1.05 + (row ? 0.5 : 0), gy, (i + row) % 3 === 2 ? 1 : 0])
    .filter(([gx]) => gx < GARDEN.x1 - 0.2 && Math.abs(gx - GARDEN_LANE) > 0.55
      && Math.abs(gx - (GARDEN.x0 + GARDEN.x1) / 2) > 0.9));
// Openings in the back wall: metals out to cell manufacturing, and tested
// packs out to customers.
const BACK_GATES = [DRIVE_MID, EAST_LANE];


const P = {
  store: sr({ x0: 5, x1: 6.42, y0: -4.24, y1: 0.33 }),
  chem: sr({ x0: 6.42, x1: 8.52, y0: -4.24, y1: 0.33 }),
  qc: sr({ x0: 5.15, x1: 8.52, y0: 0.33, y1: 1.2 }),
  bridge: sr({ x0: 8.52, x1: 9.92, y0: -2.3, y1: -1.4 }),
  // The Recycling Plant takes the whole big shed behind it.
  mech: sr({ x0: 9.92, x1: 12.69, y0: -4.27, y1: 1.5 }),
  // The front shed's two sections.
  sl: { x0: FRONT_X0, x1: FRONT_SPLIT, y0: FRONT_Y0, y1: FRONT_Y1 },
  test: { x0: FRONT_SPLIT, x1: FRONT_X1, y0: FRONT_Y0, y1: FRONT_Y1 },
} satisfies Record<string, Rect>;

// Heights grow with the plan (from the 1.35 spread they were drawn at) so
// the buildings keep their real proportions.
const HK = SPREAD / 1.35;
const H = { store: 85 * HK, chem: 53 * HK, chemRise: 14 * HK, qc: 32 * HK, shed: 67 * HK, shedRise: 8 * HK, front: 44 * HK, frontRise: 13 * HK };

// Which flow steps run in which plant, and where each one's card pins on.
const SITE_NODES: Record<string, { plant: keyof typeof P; pin: G3 }> = {
  factory: { plant: "store", pin: [...sp(5.71, -3.7), H.store] },
  characterisation: { plant: "qc", pin: [...sp(6.1, 0.77), H.qc + 3] },
  quality: { plant: "qc", pin: [...sp(7.65, 0.77), H.qc + 3] },
  extraction: { plant: "chem", pin: [...sp(7.47, -2.3), H.chem + H.chemRise] },
  recycling: { plant: "mech", pin: [...sp(11.3, -0.4), H.shed + H.shedRise] },
  refurb: { plant: "sl", pin: [(FRONT_X0 + FRONT_SPLIT) / 2, FRONT_MID, H.front + H.frontRise] },
  packmaker: { plant: "sl", pin: [(FRONT_X0 + FRONT_SPLIT) / 2, FRONT_MID, H.front + H.frontRise] },
  testing: { plant: "test", pin: [(FRONT_SPLIT + FRONT_X1) / 2, FRONT_MID, H.front + H.frontRise] },
};

// Each plant's highest point, so its card can sit clear above the building.
const PLANT_PEAK: Record<keyof typeof P, number> = {
  store: H.store, chem: H.chem + H.chemRise, qc: H.qc + 3, bridge: 53 * HK,
  mech: H.shed + H.shedRise, sl: H.front + H.frontRise, test: H.front + H.frontRise,
};

// Steps with no card of their own: their label rides on the named step's
// card, since both happen in the same place (quality checks in the QC Lab,
// pack assembly in the refurbished-battery section).
const SHARES_CARD: Record<string, string> = { quality: "characterisation", packmaker: "refurb" };

// A step plus the steps it shares a card with, for hover highlighting.
const cardGroup = (id: string) => [
  id,
  ...(SHARES_CARD[id] ? [SHARES_CARD[id]] : []),
  ...Object.keys(SHARES_CARD).filter((k) => SHARES_CARD[k] === id),
];

const SITE_WALL: Shade = ["#F5F9F8", "#EBF3F1", "#D1E4DF"];
const SHED_WALL: Shade = ["#FFFFFF", "#EBF3F1", "#E0EDEA"];
const CHEM_WALL: Shade = ["#EBF3F1", "#D1E4DF", "#BFD9D3"];
const QC_WALL: Shade = ["#EBF3F1", "#EBF3F1", "#D1E4DF"];
const BRIDGE: Shade = ["#BFD9D3", "#A6CAC1", "#80B3A7"];
const STEEL_BLUE = ["#599C8D", "#338572"] as const;
const SHED_ROOF = ["#EBF3F1", "#E0EDEA"] as const;
const CHEM_ROOF = ["#BFD9D3", "#A6CAC1"] as const;
// The front shed (Second Life Plant and Testing) under a near-black roof.
const SECOND_ROOF = ["#064233", "#083126"] as const;
// Testing shares the front shed but has its own brand-green roof, so it
// reads as a separate building.
const TEST_ROOF = ["#00674F", "#035340"] as const;
// Painted roof names: dark on the pale roofs, white on the darker ones.
const NAME_DARK = "rgba(10,36,28,0.62)", NAME_LIGHT = "rgba(255,255,255,0.92)";

const bx = (r: Rect) => ({ gx: (r.x0 + r.x1) / 2, gy: (r.y0 + r.y1) / 2, w: r.x1 - r.x0, d: r.y1 - r.y0 });

// A patch on a building's front (+y) or right (+x) wall, given in ground
// coordinates along that wall.
function Face({ r, side, a, b, z1, z2, fill, className }: {
  r: Rect; side: "L" | "R"; a: number; b: number; z1: number; z2: number; fill: string; className?: string;
}) {
  const p = side === "L"
    ? pts([a, r.y1, z1], [b, r.y1, z1], [b, r.y1, z2], [a, r.y1, z2])
    : pts([r.x1, a, z1], [r.x1, b, z1], [r.x1, b, z2], [r.x1, a, z2]);
  return <polygon points={p} fill={fill} className={className} />;
}

// A portal-frame shed with its ridge running front-to-back.
function Shed({ r, h, rise, wall, roof }: { r: Rect; h: number; rise: number; wall: Shade; roof: readonly [string, string] }) {
  const xm = (r.x0 + r.x1) / 2, t = h + rise;
  return (
    <g stroke={EDGE} strokeWidth={0.6} strokeLinejoin="round">
      <polygon points={pts([r.x0, r.y1, 0], [r.x1, r.y1, 0], [r.x1, r.y1, h], [xm, r.y1, t], [r.x0, r.y1, h])} fill={wall[1]} />
      <polygon points={pts([r.x1, r.y0, 0], [r.x1, r.y1, 0], [r.x1, r.y1, h], [r.x1, r.y0, h])} fill={wall[2]} />
      <polygon points={pts([r.x0, r.y0, h], [xm, r.y0, t], [xm, r.y1, t], [r.x0, r.y1, h])} fill={roof[0]} />
      <polygon points={pts([xm, r.y0, t], [r.x1, r.y0, h], [r.x1, r.y1, h], [xm, r.y1, t])} fill={roof[1]} />
    </g>
  );
}

// A portal-frame shed with its ridge running east-west (the front shed).
function ShedX({ r, h, rise, wall, roof }: { r: Rect; h: number; rise: number; wall: Shade; roof: readonly [string, string] }) {
  const ym = (r.y0 + r.y1) / 2, t = h + rise;
  return (
    <g stroke={EDGE} strokeWidth={0.6} strokeLinejoin="round">
      <polygon points={pts([r.x0, r.y1, 0], [r.x1, r.y1, 0], [r.x1, r.y1, h], [r.x0, r.y1, h])} fill={wall[1]} />
      <polygon points={pts([r.x1, r.y0, 0], [r.x1, r.y1, 0], [r.x1, r.y1, h], [r.x1, ym, t], [r.x1, r.y0, h])} fill={wall[2]} />
      <polygon points={pts([r.x0, r.y0, h], [r.x1, r.y0, h], [r.x1, ym, t], [r.x0, ym, t])} fill={roof[0]} />
      <polygon points={pts([r.x0, ym, t], [r.x1, ym, t], [r.x1, r.y1, h], [r.x0, r.y1, h])} fill={roof[1]} />
    </g>
  );
}

// Rows of rooftop turbo ventilators — the most recognisable thing about
// the real roofs from above.
function Vents({ r, h, rise, cols, step }: { r: Rect; h: number; rise: number; cols: number[]; step: number }) {
  const xm = (r.x0 + r.x1) / 2, hw = (r.x1 - r.x0) / 2;
  const out: ReactNode[] = [];
  for (let y = r.y0 + step / 2; y < r.y1 - step / 4; y += step) {
    for (const f of cols) {
      const x = r.x0 + f * (r.x1 - r.x0);
      const z = h + rise * (1 - Math.abs(x - xm) / hw);
      out.push(<Cyl key={`${x}:${y}`} gx={x} gy={y} r={0.05} z={z} h={4} side="#BFD9D3" dome="#EBF3F1" />);
    }
  }
  return <>{out}</>;
}

// The ReBAT wordmark painted on a roof, on a white panel. It reads along
// the ridge (toward -y) or along +x, lies on the roof plane centred at
// `at`, and follows a roof that falls by `drop` px per ground unit toward
// +x (0 on a flat roof).
const LOGO = { src: "/logo-source.png", w: 1737, h: 568 };
// Length of the small porch logo (ground units): about the size the name
// reads at on the gate sign.
const GATE_LOGO = 0.7;

// A plant's name painted flat on its roof, in small capitals, centred at
// `at` and reading along the building (`along`); `drop` is how far the roof
// falls per ground unit toward +x (0 on a flat roof).
function RoofName({ at, along, drop = 0, dropY = 0, text, fill, size = 20 }: {
  at: G3; along: "x" | "y"; drop?: number; dropY?: number; text: string; fill: string; size?: number;
}) {
  const R: G2 = along === "y" ? [0, -1] : [1, 0];
  const D: G2 = along === "y" ? [1, 0] : [0, 1];
  const vec = ([dx, dy]: G2) => [((dx - dy) * CX) / U, ((dx + dy) * CY + drop * dx + dropY * dy) / U];
  const [e, f] = iso(...at);
  const m = [...vec(R), ...vec(D), e, f].map((n) => +n.toFixed(4)).join(" ");
  return (
    <text
      transform={`matrix(${m})`} textAnchor="middle" dominantBaseline="central"
      fontSize={size} fontWeight={800} letterSpacing={size * 0.1} fill={fill}
    >
      {text}
    </text>
  );
}

// Where a name sits on a gabled roof: on the slope facing the viewer, in
// the strip between the last row of vents and the eave.
function slopeSpot(r: Rect, h: number, rise: number) {
  const hw = (r.x1 - r.x0) / 2;
  const x = r.x0 + 0.86 * (r.x1 - r.x0);
  return { at: [x, (r.y0 + r.y1) / 2, h + rise * (1 - (x - (r.x0 + hw)) / hw)] as G3, drop: rise / hw };
}

// Where a name sits on the front slope of an east-west ridged roof.
function frontSlopeSpot(r: Rect, h: number, rise: number) {
  const hd = (r.y1 - r.y0) / 2;
  return { at: [(r.x0 + r.x1) / 2, r.y0 + 1.5 * hd, h + rise / 2] as G3, dropY: rise / hd };
}

function RoofLogo({ at, len, along, drop = 0 }: { at: G3; len: number; along: "x" | "y"; drop?: number }) {
  const [cx, cy, cz] = at;
  const t = (len * LOGO.h) / LOGO.w;
  const R: G2 = along === "y" ? [0, -1] : [1, 0];
  const D: G2 = along === "y" ? [1, 0] : [0, 1];
  const vec = ([dx, dy]: G2, k: number) => [(dx - dy) * CX * k, ((dx + dy) * CY + drop * dx) * k];
  const ox = cx - (R[0] * len) / 2 - (D[0] * t) / 2, oy = cy - (R[1] * len) / 2 - (D[1] * t) / 2;
  const [e, f] = iso(ox, oy, cz - drop * (ox - cx));
  const [a, b] = vec(R, len / LOGO.w), [c, d] = vec(D, t / LOGO.h);
  const pad = LOGO.h * 0.16;
  return (
    <g transform={`matrix(${[a, b, c, d, e, f].map((n) => +n.toFixed(4)).join(" ")})`}>
      <rect x={-pad} y={-pad} width={LOGO.w + pad * 2} height={LOGO.h + pad * 2} rx={pad * 1.3} fill="#FFFFFF" stroke="#D1E4DF" strokeWidth={10} />
      <image href={LOGO.src} width={LOGO.w} height={LOGO.h} />
    </g>
  );
}

// Text lying flat on a front (+y) or right (+x) wall.
function WallText({ at, side, size, children }: { at: G3; side: "L" | "R"; size: number; children: ReactNode }) {
  const [x, y] = iso(...at).map(r1);
  const m = side === "L" ? `matrix(0.866 0.5 0 1 ${x} ${y})` : `matrix(0.866 -0.5 0 1 ${x} ${y})`;
  return (
    <text transform={m} fontSize={size} fontWeight={800} textAnchor="middle" letterSpacing={0.5}>
      {children}
    </text>
  );
}

function Plant({ id, active, onHover, children }: {
  id: keyof typeof P; active: string | null; onHover: (id: string | null) => void; children: ReactNode;
}) {
  const nodes = Object.entries(SITE_NODES).filter(([, n]) => n.plant === id).map(([k]) => k);
  return (
    <g
      className="loop-bldg"
      data-active={!!active && nodes.includes(active)}
      onMouseEnter={() => onHover(nodes[0])}
      onMouseLeave={() => onHover(null)}
    >
      {children}
    </g>
  );
}

// The gate guard waits in front of the guard room, walks over to meet the
// scrap truck as it pulls in, and walks back once it leaves — on the
// truck's own clock.
// The main gate: white bars with the ReBAT sign. It slides open along the
// wall just before the scrap truck reaches it and closes again once the
// truck is in, on the truck's clock.
const GATE_OPEN = 1.1;
function MainGate({ animate }: { animate: boolean }) {
  const { loop } = TRUCK_TIME;
  // When the truck's front reaches the gate line: the share of its drive
  // done by the time it crosses the west wall.
  const toGate = screenPath([TRUCK_ROUTE[0], TRUCK_ROUTE[1], [SITE.x0 - 0.5, TRUCK_ROUTE[1][1]]]).len;
  const tGate = (TRUCK_TIME.travel * toGate) / screenPath(TRUCK_ROUTE).len;
  const at = (sec: number) => +(Math.min(Math.max(sec, 0), loop) / loop).toFixed(4);
  const width = GATE[1] - GATE[0];
  const [dx, dy] = [width * CX, -width * CY];
  return (
    <g>
      {animate && (
        <animateTransform
          attributeName="transform" type="translate" dur={`${r1(loop)}s`} repeatCount="indefinite" calcMode="linear"
          values={`0 0;0 0;${r1(dx)} ${r1(dy)};${r1(dx)} ${r1(dy)};0 0;0 0`}
          keyTimes={`0;${at(tGate - GATE_OPEN - 0.3)};${at(tGate - 0.3)};${at(TRUCK_TIME.travel + 0.2)};${at(TRUCK_TIME.travel + 0.2 + GATE_OPEN)};1`}
        />
      )}
      <g stroke="#FFFFFF" strokeWidth={1.4}>
        {Array.from({ length: 16 }, (_, i) => {
          const y = GATE[0] + 0.08 + ((GATE[1] - GATE[0] - 0.16) * i) / 15;
          const [x1, y1] = iso(SITE.x0, y, 1);
          const [, y2] = iso(SITE.x0, y, 27 * HK);
          return <line key={i} x1={r1(x1)} y1={r1(y1)} x2={r1(x1)} y2={r1(y2)} />;
        })}
      </g>
      <polyline points={pts([SITE.x0, GATE[0], 27 * HK], [SITE.x0, GATE[1], 27 * HK])} stroke="#FFFFFF" strokeWidth={2} fill="none" />
      <polygon points={pts([SITE.x0, GATE[0] + 0.14, 8 * HK], [SITE.x0, GATE[1] - 0.14, 8 * HK], [SITE.x0, GATE[1] - 0.14, 22 * HK], [SITE.x0, GATE[0] + 0.14, 22 * HK])} fill="#FFFFFF" stroke="#338572" strokeWidth={0.8} />
      <WallText at={[SITE.x0, (GATE[0] + GATE[1]) / 2, 11 * HK]} side="R" size={13 * HK}>
        <tspan fill="#064233">Re</tspan><tspan fill="#338572">B</tspan><tspan fill="#064233">AT</tspan>
      </WallText>
    </g>
  );
}

function Guard() {
  const { travel, leave, loop } = TRUCK_TIME;
  const at = (sec: number) => +(Math.min(Math.max(sec, 0), loop) / loop).toFixed(4);
  // Stands clear of the guard room and the truck's lane, so the motion
  // layer it's drawn in never needs to pass behind a building.
  const [ax, ay] = iso(sx(4.95), sy(2.75));
  const [bx2, by2] = iso(sx(5.5), sy(3.05));
  return (
    <g>
      <animateMotion
        dur={`${r1(loop)}s`} repeatCount="indefinite" calcMode="linear"
        path={`M${r1(ax)},${r1(ay)} L${r1(bx2)},${r1(by2)}`}
        keyPoints="0;0;1;1;0;0"
        keyTimes={`0;${at(travel - 0.9)};${at(travel + 0.5)};${at(leave)};${at(leave + 1.3)};1`}
      />
      <Scaled gx={0} gy={0} k={DS}><Person gx={0} gy={0} color={PEOPLE_COLORS[0]} /></Scaled>
    </g>
  );
}

function SiteBuildings({ active, onHover }: { active: string | null; onHover: (id: string | null) => void }) {
  const { store, chem, qc, bridge, mech, sl, test } = P;
  const K = SPREAD;
  const wall = (x0: number, y0: number, x1: number, y1: number, k: string) => {
    const t = 0.05;
    return <Box key={k} gx={(x0 + x1) / 2} gy={(y0 + y1) / 2} w={Math.max(x1 - x0, t * 2)} d={Math.max(y1 - y0, t * 2)} h={9 * HK} c={SITE_WALL} />;
  };
  const shedBands = (r: Rect, side: "L" | "R") => {
    const [a, b] = side === "L" ? [r.x0, r.x1] : [r.y0, r.y1];
    return (
      <>
        <Face r={r} side={side} a={a} b={b} z1={H.shed * 0.36} z2={H.shed * 0.55} fill={STEEL_BLUE[side === "L" ? 0 : 1]} />
        <Face r={r} side={side} a={a} b={b} z1={H.shed * 0.63} z2={H.shed * 0.88} fill={STEEL_BLUE[side === "L" ? 0 : 1]} />
      </>
    );
  };
  const [bxq, byq] = iso(...sp(8.1, 0.77), 66 * HK);
  const guard = sr({ x0: 4.62, x1: 5.02, y0: 1.37, y1: 1.87 });
  return (
    <g>
      {/* Boundary wall: back and west (split by the gate) */}
      {[SITE.x0, ...BACK_GATES].map((x, i) => wall(i ? x + 0.5 : x, SITE.y0, BACK_GATES[i] !== undefined ? BACK_GATES[i] - 0.5 : SITE.x1, SITE.y0, `wb${i}`))}
      {BACK_GATES.flatMap((x) => [x - 0.5, x + 0.5]).map((x) => <Box key={x} gx={x} gy={SITE.y0} w={0.15} d={0.15} h={26 * HK} c={SITE_WALL} />)}
      {wall(SITE.x0, SITE.y0, SITE.x0, GATE[0], "ww1")}
      {wall(SITE.x0, GATE[1], SITE.x0, SITE.y1, "ww2")}

      <Plant id="store" active={active} onHover={onHover}>
        <Box {...bx(store)} h={H.store} c={SHED_WALL} />
        <Face r={store} side="L" a={store.x0 + 0.24 * K} b={store.x1 - 0.22 * K} z1={44 * HK} z2={60 * HK} fill={STEEL_BLUE[0]} />
        <Face r={store} side="L" a={store.x0 + 0.24 * K} b={store.x1 - 0.22 * K} z1={65 * HK} z2={80 * HK} fill={STEEL_BLUE[0]} />
        <Vents r={store} h={H.store} rise={0} cols={[0.5]} step={0.62 * K} />
        <RoofName at={[store.x0 + 0.78 * (store.x1 - store.x0), (store.y0 + store.y1) / 2, H.store]} along="y" text="WAREHOUSE" fill={NAME_DARK} />
      </Plant>

      <Plant id="chem" active={active} onHover={onHover}>
        <Shed r={chem} h={H.chem} rise={H.chemRise} wall={CHEM_WALL} roof={CHEM_ROOF} />
        {/* Roller shutter onto the driveway, under its canopy */}
        <Face r={chem} side="R" a={sy(-1.75)} b={sy(-1.05)} z1={0 * HK} z2={21 * HK} fill="#338572" />
        <Face r={chem} side="R" a={sy(-1.75)} b={sy(-1.05)} z1={4 * HK} z2={5 * HK} fill="#599C8D" />
        <Box gx={chem.x1 + 0.12} gy={sy(-1.4)} w={0.24} d={1.1 * K} z={23 * HK} h={3 * HK} c={BRIDGE} />
        <Vents r={chem} h={H.chem} rise={H.chemRise} cols={[0.3, 0.7]} step={0.62 * K} />
        <RoofName {...slopeSpot(chem, H.chem, H.chemRise)} along="y" text="HYDROMETALLURGY PLANT" fill={NAME_LIGHT} />
      </Plant>

      {/* Covered bridge across the driveway */}
      <Box {...bx(bridge)} z={35 * HK} h={18 * HK} c={BRIDGE} />
      <Face r={bridge} side="L" a={bridge.x0} b={bridge.x1} z1={35 * HK} z2={45 * HK} fill={STEEL_BLUE[0]} />

      {/* Water tank on the driveway, beside the chemical plant */}
      <Cyl gx={chem.x1 + 0.2} gy={sy(-0.7)} r={0.12} h={28 * HK} side="url(#loopCylMint)" top="#FFFFFF" dome="#F5F9F8" />

      <Plant id="qc" active={active} onHover={onHover}>
        <Box {...bx(qc)} h={H.qc} c={QC_WALL} />
        <Box gx={bx(qc).gx} gy={bx(qc).gy} w={bx(qc).w + 0.06} d={bx(qc).d + 0.06} z={H.qc} h={3 * HK} c={SITE_WALL} />
        <RoofName at={[sx(7.1), sy(0.95), H.qc + 3 * HK]} along="x" text="QC & INNOVATION LAB" fill={NAME_DARK} />
        {Array.from({ length: 8 }, (_, i) => {
          if (i === 5) return null;
          const a = qc.x0 + (0.14 + i * 0.41) * K;
          return (
            <g key={i}>
              <Face r={qc} side="L" a={a} b={a + 0.3 * K} z1={8 * HK} z2={22 * HK} fill="#FFFFFF" />
              <Face
                r={qc} side="L" a={a + 0.04} b={a + 0.3 * K - 0.04} z1={9.5 * HK} z2={20.5 * HK}
                fill={i === 2 ? LIT : i % 2 ? "#DDB73C" : "#BFD9D3"}
              />
            </g>
          );
        })}
        <Wins side="R" {...bx(qc)} n={2} z1={9 * HK} z2={21 * HK} />
        {/* Entrance portico */}
        <Face r={qc} side="L" a={sx(7.45)} b={sx(7.82)} z1={0 * HK} z2={19 * HK} fill="#064233" />
        {[7.37, 7.9].map((x) => <Box key={x} gx={sx(x)} gy={sy(1.54)} w={0.06} d={0.06} h={23 * HK} c={SITE_WALL} />)}
        <Box gx={sx(7.635)} gy={sy(1.38)} w={0.64 * K} d={0.4 * K} z={23 * HK} h={4 * HK} c={SITE_WALL} />
        <RoofLogo at={[sx(7.635), sy(1.38), 27 * HK + 0.5]} len={GATE_LOGO} along="x" />
        <Ac gx={sx(5.7)} gy={sy(0.6)} z={H.qc + 3} />
        <Ac gx={sx(6.5)} gy={sy(0.62)} z={H.qc + 3} />
        <Cyl gx={sx(8.15)} gy={sy(0.62)} r={0.1} z={H.qc + 3} h={11 * HK} side="#DDB73C" top="#E6C96D" />
        <Mast gx={sx(5.4)} gy={sy(0.55)} z={H.qc + 3} h={24 * HK} />
        <g>
          <circle cx={r1(bxq)} cy={r1(byq)} r={10} fill="#DDB73C" stroke="#FFFFFF" strokeWidth={2} />
          <path d={`M${r1(bxq - 4.5)},${r1(byq)} l3.2,3.5 l6,-6.6`} fill="none" stroke="#FFFFFF" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </Plant>

      <Plant id="mech" active={active} onHover={onHover}>
        <Shed r={mech} h={H.shed} rise={H.shedRise} wall={SHED_WALL} roof={SHED_ROOF} />
        {shedBands(mech, "L")}
        {shedBands(mech, "R")}
        <Face r={mech} side="L" a={sx(12.3)} b={sx(12.5)} z1={0 * HK} z2={11 * HK} fill="#064233" />
        <Face r={mech} side="R" a={sy(-0.15)} b={sy(0.65)} z1={0 * HK} z2={21 * HK} fill="#338572" />
        <Face r={mech} side="R" a={sy(-0.15)} b={sy(0.65)} z1={4 * HK} z2={5 * HK} fill="#599C8D" />
        <Vents r={mech} h={H.shed} rise={H.shedRise} cols={[0.2, 0.45, 0.72]} step={0.64 * K} />
        <RoofName {...slopeSpot(mech, H.shed, H.shedRise)} along="y" text="RECYCLING PLANT" fill={NAME_DARK} />
      </Plant>

      {/* The garden: hedges, a canopy of trees and the gazebo */}
      {[[GARDEN.x0, GARDEN_LANE - 0.3], [GARDEN_LANE + 0.3, GARDEN.x1]].map(([a, b]) => (
        <Box key={a} gx={(a + b) / 2} gy={GARDEN.y1 - 0.06} w={b - a} d={0.12} h={6} c={HEDGE} />
      ))}
      {(() => {
        const gx = (GARDEN.x0 + GARDEN.x1) / 2, gy = (GARDEN.y0 + GARDEN.y1) / 2;
        return (
          <g>
            {[[-0.38, -0.3], [0.38, -0.3], [-0.38, 0.3], [0.38, 0.3]].map(([ox, oy]) => (
              <Box key={`${ox}${oy}`} gx={gx + ox} gy={gy + oy} w={0.06} d={0.06} h={22} c={SITE_WALL} />
            ))}
            <Box gx={gx} gy={gy} w={1.0} d={0.85} z={22} h={4} c={ROOF} />
          </g>
        );
      })()}
      {[...GARDEN_TREES].sort((a, b) => a[0] + a[1] - b[0] - b[1]).map(([gx, gy, kind]) => (
        <Scaled key={`${gx}${gy}`} gx={gx} gy={gy} k={DS}><Tree gx={gx} gy={gy} kind={kind} /></Scaled>
      ))}

      {/* The front shed: Second Life Plant, and Testing in front of the
          Recycling Plant */}
      <Plant id="sl" active={active} onHover={onHover}>
        <ShedX r={sl} h={H.front} rise={H.frontRise} wall={SHED_WALL} roof={SECOND_ROOF} />
        <Face r={sl} side="L" a={sl.x0} b={sl.x1} z1={H.front * 0.62} z2={H.front * 0.8} fill={STEEL_BLUE[0]} />
        {[0.12, 0.3, 0.48, 0.66, 0.84].map((f) => (
          <Face key={f} r={sl} side="L" a={sl.x0 + f * (sl.x1 - sl.x0)} b={sl.x0 + f * (sl.x1 - sl.x0) + 0.55} z1={0} z2={H.front * 0.45} fill="#338572" />
        ))}
        <RoofName {...frontSlopeSpot(sl, H.front, H.frontRise)} along="x" text="SECOND LIFE PLANT" fill={NAME_LIGHT} />
      </Plant>
      <Plant id="test" active={active} onHover={onHover}>
        <ShedX r={test} h={H.front} rise={H.frontRise} wall={SHED_WALL} roof={TEST_ROOF} />
        <Face r={test} side="L" a={test.x0} b={test.x1} z1={H.front * 0.62} z2={H.front * 0.8} fill={STEEL_BLUE[0]} />
        <Face r={test} side="L" a={test.x0 + 0.5} b={test.x0 + 1.1} z1={0} z2={H.front * 0.45} fill="#338572" />
        <Mast gx={test.x1 - 0.5} gy={test.y0 + 0.4} z={H.front} h={24} />
        <RoofName {...frontSlopeSpot(test, H.front, H.frontRise)} along="x" text="TESTING" fill={NAME_LIGHT} />
      </Plant>

      {/* Guard room with its green canopy, beside the gate */}
      <Box {...bx(guard)} h={15 * HK} c={SITE_WALL} />
      <Face r={guard} side="L" a={sx(4.72)} b={sx(4.9)} z1={0 * HK} z2={11 * HK} fill="#035340" />
      <Box {...bx(sr({ x0: 4.58, x1: 5.02, y0: 1.35, y1: 1.97 }))} z={15 * HK} h={2 * HK} c={["#599C8D", "#338572", "#338572"]} />

      {/* The main gate's pillars (the sliding gate itself moves, so it's
          drawn in the motion layer: see MainGate) */}
      <Box gx={SITE.x0} gy={GATE[0]} w={0.15} d={0.15} h={34 * HK} c={SITE_WALL} />
      <Box gx={SITE.x0} gy={GATE[1]} w={0.15} d={0.15} h={34 * HK} c={SITE_WALL} />

      {/* East and front walls */}
      {wall(SITE.x1, SITE.y0, SITE.x1, SITE.y1, "we")}
      {wall(SITE.x0, SITE.y1, SITE.x1, SITE.y1, "wf")}
    </g>
  );
}

/* ---------------------------------------------------------------- */
/* Derived geometry (static — computed once)                          */
/* ---------------------------------------------------------------- */

const NODES = LOOP_NODES.filter((n) => LAYOUT[n.id]);
// Steps that stand as their own building (the ones in the compound don't).
const STANDALONE = NODES.filter((n) => !SITE_NODES[n.id]);

const SITE_POLY = pts([SITE.x0, SITE.y0, 0], [SITE.x1, SITE.y0, 0], [SITE.x1, SITE.y1, 0], [SITE.x0, SITE.y1, 0]);

function screenPath(route: G2[]) {
  const s = route.map(([gx, gy]) => iso(gx, gy));
  let len = 0;
  for (let i = 1; i < s.length; i++) len += Math.hypot(s[i][0] - s[i - 1][0], s[i][1] - s[i - 1][1]);
  return { d: s.map((p, i) => `${i ? "L" : "M"}${r1(p[0])},${r1(p[1])}`).join(" "), len };
}

// Edge-label signpost: planted just in front of the road at its midpoint.
function signAnchor(route: G2[]): Pt {
  const segs = route.slice(1).map((p, i) => ({ a: route[i], b: p, l: Math.hypot(p[0] - route[i][0], p[1] - route[i][1]) }));
  let half = segs.reduce((t, s) => t + s.l, 0) / 2;
  for (const s of segs) {
    if (half <= s.l) {
      const t = half / s.l;
      const mx = s.a[0] + (s.b[0] - s.a[0]) * t;
      const my = s.a[1] + (s.b[1] - s.a[1]) * t;
      const alongX = Math.abs(s.b[0] - s.a[0]) >= Math.abs(s.b[1] - s.a[1]);
      return iso(mx + (alongX ? 0 : 1.8), my + (alongX ? 1.8 : 0));
    }
    half -= s.l;
  }
  return iso(...route[0]);
}

// Splits a route into its stretches outside and inside the compound, so the
// public road and the yard lane can be drawn as separate paths. (Masking one
// path two ways looked the same but made every animation frame repaint.)
function siteRuns(route: G2[]) {
  const inSite = ([x, y]: G2) => x > SITE.x0 && x < SITE.x1 && y > SITE.y0 && y < SITE.y1;
  const runs: { inside: boolean; pts: G2[] }[] = [];
  route.slice(1).forEach((b, i) => {
    const a = route[i];
    const at = (t: number): G2 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    const ts = [0, 1];
    for (const [k, v] of [[0, SITE.x0], [0, SITE.x1], [1, SITE.y0], [1, SITE.y1]] as const) {
      const t = b[k] === a[k] ? -1 : (v - a[k]) / (b[k] - a[k]);
      if (t > 0 && t < 1) ts.push(t);
    }
    ts.sort((p, q) => p - q);
    for (let j = 1; j < ts.length; j++) {
      const inside = inSite(at((ts[j - 1] + ts[j]) / 2));
      const last = runs[runs.length - 1];
      if (last?.inside === inside) last.pts.push(at(ts[j]));
      else runs.push({ inside, pts: [at(ts[j - 1]), at(ts[j])] });
    }
  });
  return runs.map((r) => ({ inside: r.inside, ...screenPath(r.pts) }));
}

const EDGES = LOOP_EDGES.filter((e) => LAYOUT[e.from] && LAYOUT[e.to]).map((e) => {
  const key = `${e.from}>${e.to}`;
  const route: G2[] = [LAYOUT[e.from], ...(VIA[key] ?? []), LAYOUT[e.to]];
  const sign = !e.label ? null : SIGN_AT[key] ? iso(...SIGN_AT[key]) : signAnchor(route);
  const runs = siteRuns(route);
  const crosses = runs.some((r) => r.inside) && runs.some((r) => !r.inside);
  return { ...e, key, ...screenPath(route), sign, runs, crosses };
});

// One batch at a time, in process order, then the whole thing starts over:
//  1. the truck brings scrap from the collection centre in through the main
//     gate and parks while three used cells go into the QC Lab;
//  2. the QC Lab sends one cell each way at once —
//     recycling: to the Mechanical Plant, whose black mass (one sack) goes to
//     the Chemical Plant, whose Li/Co/Al/Ni go to cell manufacturing, which
//     sends a rejected cell back to the collection centre;
//     second life: to the Second Life Plant, whose pack goes to testing and
//     on to customers, whose used cell comes back to the collection centre;
//  3. once both are home, the next truck sets off.
const TRUCK_EDGE = "collection>factory";
const STEP_SPEED = 200, METAL_GAP = 0.8;
// Trips that are slowed down so they can be followed: cells off the truck
// into the QC Lab, the QC Lab to the Second Life Plant and (a longer road)
// to the Recycling Plant, the black-mass sack, and the metals.
const UNLOAD_SECONDS = 3, QC_TO_SECOND_LIFE = 5, QC_TO_RECYCLING = 4, SACK_SECONDS = 4, METAL_SECONDS = 6;
const TRUCK_SPEED = 140, TRUCK_PARK = 3, TRUCK_FADE = 1.2;

// Metal tokens and used cells are drawn a little bigger than the truck's cab.
const ICON_SCALE = 2.25;
// The black-mass sack and ReBAT's packs, scaled up to read alongside them.
const SACK_SCALE = 2, PACK_SCALE = 1.3;
const ELEMENTS = [
  { sym: "Li", fill: "#EBF3F1", ink: "#00674F" },
  { sym: "Co", fill: "#599C8D", ink: "#FFFFFF" },
  { sym: "Ni", fill: "#DDB73C", ink: "#064233" },
];

// Used batteries travel as small cells marked with their chemistry.
const USED_CELLS = [
  { chem: "NMC", fill: "#E6C96D" },
  { chem: "LFP", fill: "#DDB73C" },
];

// Black mass leaves the Mechanical Plant filled into a sack.
function Sack() {
  return (
    <g transform={`scale(${SACK_SCALE})`}>
      <ellipse cy={1} rx={7.5} ry={2.4} fill="#064233" opacity={0.2} />
      <path d="M-6.5,0 C-8.5,-4 -7.5,-10 -3.2,-12.2 L-2.2,-15 L2.2,-15 L3.2,-12.2 C7.5,-10 8.5,-4 6.5,0 Z" fill="#064233" stroke="#599C8D" strokeWidth={1} />
      <path d="M-3.4,-12.6 L3.4,-12.6" stroke="#E6C96D" strokeWidth={1.8} strokeLinecap="round" />
      <rect x={-24} y={-31} width={48} height={12} rx={6} fill="#FFFFFF" stroke="#064233" strokeWidth={0.9} />
      <text y={-22.2} textAnchor="middle" fontSize={8} fontWeight={800} fill="#064233">Black Mass</text>
    </g>
  );
}

// A new battery cell, fresh out of cell manufacturing: an upright
// cylindrical cell in brand green with its label band.
function NewCell() {
  return (
    <g transform={`scale(${ICON_SCALE})`}>
      <ellipse cy={1} rx={8} ry={2.4} fill="#064233" opacity={0.2} />
      <rect x={-6} y={-24} width={12} height={24} rx={2.5} fill="#00674F" stroke="#FFFFFF" strokeWidth={1.1} />
      <rect x={-6} y={-16.5} width={12} height={7} fill="#FFFFFF" opacity={0.92} />
      <text y={-11.3} textAnchor="middle" fontSize={4.6} fontWeight={800} fill="#00674F">CELL</text>
      <rect x={-2.2} y={-26.5} width={4.4} height={2.8} rx={0.8} fill="#DDB73C" />
    </g>
  );
}

// A used cell, lying on its side with its chemistry printed on it.
function UsedCell({ chem, fill }: { chem: string; fill: string }) {
  return (
    <g>
      <ellipse cy={1} rx={10} ry={2.4} fill="#064233" opacity={0.2} />
      <rect x={-11} y={-11} width={20} height={10} rx={4} fill={fill} stroke="#F6EDCE" strokeWidth={1.1} />
      <rect x={9} y={-8} width={2.4} height={4} rx={0.8} fill="#A6CAC1" />
      <text x={-1} y={-3.6} textAnchor="middle" fontSize={6.4} fontWeight={800} fill="#FFFFFF">{chem}</text>
    </g>
  );
}

// A battery pack, from the refurbished section to testing and on to
// customers: branded with the "b" from the ReBAT logo.
function BrandPack() {
  return (
    <g transform={`scale(${PACK_SCALE})`}>
      <ellipse cy={1} rx={14} ry={3.4} fill="#064233" opacity={0.2} />
      <rect x={-8.5} y={-20} width={4.5} height={3} rx={0.8} fill="#00674F" />
      <rect x={4} y={-20} width={4.5} height={3} rx={0.8} fill="#00674F" />
      <rect x={-13.5} y={-17.5} width={27} height={17.5} rx={3} fill="#FFFFFF" stroke="#338572" strokeWidth={1.8} />
      <g transform="translate(-8.3 -16.6)">
        <Mark size={16} color="#599C8D" />
      </g>
    </g>
  );
}

// One piece's trip in the batch: along `d` from fraction `p0` to `p1` of
// the way, between `start` and `end` seconds into the loop, and out of
// sight the rest of the time.
type Step = { key: string; d: string; start: number; end: number; p0: number; p1: number; art: ReactNode };

// The building standing on a step's node, if any, so a piece can be shown
// only from where it leaves one building to where it enters the next.
function nodeRect(id: string): Rect | null {
  if (SITE_NODES[id]) return P[SITE_NODES[id].plant];
  const f = FACILITIES[id];
  if (!f) return null;
  const [gx, gy] = LAYOUT[id];
  const hw = (f.fp[0] * S) / 2, hd = (f.fp[1] * S) / 2;
  return { x0: gx - hw, x1: gx + hw, y0: gy - hd, y1: gy + hd };
}

// How much of a route (as fractions of its screen length) lies between
// leaving the `from` building and entering the `to` building.
function visibleSpan(route: G2[], from: Rect | null, to: Rect | null) {
  const inside = (r: Rect | null, [x, y]: G2) => !!r && x > r.x0 && x < r.x1 && y > r.y0 && y < r.y1;
  let len = 0, first = -1, last = 0;
  route.slice(1).forEach((q, i) => {
    const p = route[i];
    const [sp0, sp1] = [iso(...p), iso(...q)];
    const seg = Math.hypot(sp1[0] - sp0[0], sp1[1] - sp0[1]);
    const n = Math.max(1, Math.ceil(Math.hypot(q[0] - p[0], q[1] - p[1]) / 0.02));
    for (let k = 0; k <= n; k++) {
      const t = k / n;
      const pt: G2 = [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
      if (first < 0 && !inside(from, pt)) first = len + seg * t;
      if (!inside(to, pt)) last = len + seg * t;
    }
    len += seg;
  });
  return { p0: Math.max(0, first) / len, p1: last / len, len };
}

// The truck sets off from the collection centre's front gate (not its
// middle), so it's in view the moment it leaves.
const TRUCK_ROUTE: G2[] = [
  [LAYOUT.collection[0], LAYOUT.collection[1] + (FACILITIES.collection.fp[1] * S) / 2],
  ...(VIA[TRUCK_EDGE] ?? []),
  LAYOUT.factory,
];

// The scooter's ride. From beside the customers it heads for the corner
// where the road turns down to the collection centre, but turns right
// instead, up a road off the edge of the map and out of sight. It turns
// straight round there (no waiting) and comes back down the same road more
// slowly, carrying straight on to the collection centre's back gate, where
// the used battery goes in.
const SCOOTER_SPEED = 190, SCOOTER_BACK_SPEED = 130, SCOOTER_AWAY = 0;
const SCOOTER_CORNER: G2 = [CUSTOMER_LANE, CUSTOMER_Y];
const SCOOTER_EDGE: G2 = [CUSTOMER_LANE, CUSTOMER_Y - 4.5];
const SCOOTER_LEGS = {
  toCorner: screenPath([[LAYOUT.customers[0] - 1.9, CUSTOMER_Y], SCOOTER_CORNER]),
  out: screenPath([SCOOTER_CORNER, SCOOTER_EDGE]),
  back: screenPath([SCOOTER_EDGE, SCOOTER_CORNER, [CUSTOMER_LANE, SCOOTER_STOP_Y]]),
};
const SCOOTER_DROP_ROUTE: G2[] = [[CUSTOMER_LANE, SCOOTER_STOP_Y], [CUSTOMER_LANE, COLLECT_Y], LAYOUT.collection];
// The battery goes in green and has run down to red by the collection centre.
const BATTERY_FRESH = "#00674F", BATTERY_USED = "#E53935";

// The customer's new pack bounces out of the customers' shed and drops into
// the parked scooter's battery bay (on the scooter's right, 1.25x scale).
const SCOOTER_PARK: G2 = [LAYOUT.customers[0] - 1.9, CUSTOMER_Y];
const LOAD_SECONDS = 3;
const LOAD_PATH = (() => {
  const [x0, y0] = iso(LAYOUT.customers[0] - 0.6, CUSTOMER_Y);
  const [px, py] = iso(...SCOOTER_PARK);
  const x1 = px + 14.4, y1 = py - 15;
  const mx = x0 + (x1 - x0) * 0.62, my = y0 + (y1 - y0) * 0.62;
  return `M${r1(x0)},${r1(y0)} Q${r1((x0 + mx) / 2)},${r1(Math.min(y0, my) - 80)} ${r1(mx)},${r1(my)} Q${r1((mx + x1) / 2)},${r1(Math.min(my, y1) - 34)} ${r1(x1)},${r1(y1)}`;
})();

// The run-down battery, lifted out of the scooter into the collection centre.
function UsedScooterBattery() {
  return (
    <g transform="scale(1.6)">
      <ellipse cy={1} rx={9} ry={2.4} fill="#064233" opacity={0.2} />
      <rect x={-8} y={-11} width={16} height={11} rx={2.4} fill={BATTERY_USED} stroke="#FFFFFF" strokeWidth={1.2} />
      <rect x={8} y={-7.5} width={2} height={4} rx={0.6} fill="#064233" />
    </g>
  );
}

// An electric scooter with its rider, side on and facing left (the way it
// rides): a see-through body so the battery under the seat shows.
function Scooter({ battery }: { battery: ReactNode }) {
  const ink = "#064233", shell = "#FFFFFF";
  return (
    <g>
      <ellipse cy={1} rx={22} ry={3.6} fill="#064233" opacity={0.16} />
      {/* wheels */}
      {[-15, 14].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={-7} r={7} fill="#064233" />
          <circle cx={cx} cy={-7} r={3} fill="#EBF3F1" />
        </g>
      ))}
      {/* rear body, floorboard and leg shield: see-through */}
      <path
        d="M-2,-10 L17,-10 C24,-10 25,-19 19,-23 L6,-24 C1,-24 -2,-19 -2,-14 Z"
        fill={shell} fillOpacity={0.3} stroke={ink} strokeWidth={1.4} strokeLinejoin="round"
      />
      <path d="M-11,-10 L-2,-10" stroke={ink} strokeWidth={2.6} strokeLinecap="round" />
      <path
        d="M-11,-10 C-14,-17 -15,-25 -14,-31 L-10,-31 C-10,-24 -8,-16 -6,-11 Z"
        fill={shell} fillOpacity={0.3} stroke={ink} strokeWidth={1.4} strokeLinejoin="round"
      />
      <path d="M-15,-7 L-12,-31" stroke={ink} strokeWidth={2} strokeLinecap="round" />
      <path d="M-12,-31 L-12,-35 M-17,-35 L-8,-35" stroke={ink} strokeWidth={2} strokeLinecap="round" />
      <circle cx={-15} cy={-28} r={2.1} fill="#DDB73C" />
      <rect x={2} y={-28} width={16} height={4} rx={2} fill={ink} />
      {battery}
      {/* the rider */}
      <path d="M9,-29 L-3,-27 L-7,-12" fill="none" stroke="#064233" strokeWidth={4.4} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9,-28 L5,-45" stroke="#338572" strokeWidth={7.5} strokeLinecap="round" />
      <path d="M4,-42 L-10,-35" stroke="#338572" strokeWidth={3.2} strokeLinecap="round" />
      <circle cx={-10.5} cy={-35} r={1.8} fill="#EEDB9E" />
      <circle cx={3.5} cy={-51} r={5} fill="#EEDB9E" />
      <path d="M-1.8,-51 A5.4,5.4 0 0 1 8.8,-51 Z" fill="#00674F" />
    </g>
  );
}

const STORY = (() => {
  const edge = (key: string) => EDGES.find((e) => e.key === key)!;
  const travel = screenPath(TRUCK_ROUTE).len / TRUCK_SPEED;
  const steps: Step[] = [];
  // A piece's trip along an edge, shown only between the buildings; each
  // next trip starts the moment the last one disappears inside.
  const span = (key: string) => {
    const e = edge(key);
    return visibleSpan([LAYOUT[e.from], ...(VIA[key] ?? []), LAYOUT[e.to]], nodeRect(e.from), nodeRect(e.to));
  };
  // `pace` overrides the default speed with a trip time in seconds.
  const move = (key: string, start: number, art: ReactNode, pace?: { seconds: number }, path?: { d: string; len: number }) => {
    const e = edge(key);
    const sp = path ? { p0: 0, p1: 1, len: path.len } : span(key);
    const shown = (sp.p1 - sp.p0) * sp.len;
    // A hand-over inside one shed (Second Life to Testing) has nothing to show.
    if (!pace && shown <= 0) return start;
    const end = start + (pace?.seconds ?? shown / STEP_SPEED);
    steps.push({ key: `${key}#${steps.length}`, d: (path ?? e).d, start, end, p0: sp.p0, p1: sp.p1, art });
    return end;
  };
  const cell = (i: number) => (
    <g transform={`scale(${ICON_SCALE})`}>
      <UsedCell {...USED_CELLS[i]} />
    </g>
  );
  const metal = (el: (typeof ELEMENTS)[number]) => (
    <g transform={`scale(${ICON_SCALE})`}>
      <circle cy={-10} r={10} fill={el.fill} stroke="#FFFFFF" strokeWidth={1.4} />
      <text y={-6.4} textAnchor="middle" fontSize={10} fontWeight={800} fill={el.ink}>{el.sym}</text>
    </g>
  );

  // 1. Unloading: the two cells from the truck into the QC Lab, taking
  // their time.
  let sorted = 0;
  USED_CELLS.forEach((_, i) => {
    sorted = move("factory>characterisation", travel + i * 1.2, cell(i), { seconds: UNLOAD_SECONDS });
  });

  // 2a. Recycling. The sack only crosses the open driveway between the two
  // plants.
  let a = move("characterisation>recycling", sorted, cell(0), { seconds: QC_TO_RECYCLING });
  a = move("recycling>extraction", a, <Sack />, { seconds: SACK_SECONDS }, screenPath([[P.mech.x0, sy(-1)], [P.chem.x1, sy(-1)]]));
  // The moment the black mass is in, Li, Co and Ni come out of the
  // Hydrometallurgy Plant one after another and go out the back gate into
  // cell manufacturing; the moment they're in, a new cell comes out.
  let metals = a;
  ELEMENTS.forEach((el, i) => {
    metals = move("extraction>cellmaker", a + i * METAL_GAP, metal(el), { seconds: METAL_SECONDS });
  });
  a = move("cellmaker>collection", metals, <NewCell />);

  // 2b. Second life.
  let b = move("characterisation>refurb", sorted, cell(1), { seconds: QC_TO_SECOND_LIFE });
  b = move("refurb>testing", b, <BrandPack />);
  b = move("testing>customers", b, <BrandPack />);

  // 2c. The pack bounces into the customer's empty scooter, which rides off
  // with it, the battery wearing down from green to red on the way; the
  // scooter stops at the collection centre's back gate and the used battery
  // goes in.
  steps.push({
    key: "load", d: LOAD_PATH, start: b, end: b + LOAD_SECONDS, p0: 0, p1: 1,
    art: <g transform="scale(0.62)"><BrandPack /></g>,
  });
  const loadAt = b + LOAD_SECONDS;
  const rideStart = loadAt + 0.4;
  const atCorner = rideStart + SCOOTER_LEGS.toCorner.len / SCOOTER_SPEED;
  const atEdge = atCorner + SCOOTER_LEGS.out.len / SCOOTER_SPEED;
  const backAt = atEdge + SCOOTER_AWAY;
  const rideEnd = backAt + SCOOTER_LEGS.back.len / SCOOTER_BACK_SPEED;
  const dropAt = rideEnd + 0.3;
  const drop = visibleSpan(SCOOTER_DROP_ROUTE, null, nodeRect("collection"));
  b = dropAt + ((drop.p1 - drop.p0) * drop.len) / STEP_SPEED;
  steps.push({ key: "drop", d: screenPath(SCOOTER_DROP_ROUTE).d, start: dropAt, end: b, p0: drop.p0, p1: drop.p1, art: <UsedScooterBattery /> });

  // 3. The moment the last battery is in at the collection centre, the loop
  // ends and the next truck is out of the gate.
  return { travel, steps, loop: Math.max(a, b), scooter: { loadAt, rideStart, atCorner, atEdge, backAt, rideEnd, dropAt } };
})();

// The truck's timetable, shared with the gate guard: it drives in
// (arriving at `travel`), parks until `leave`, fades out, and the next one
// sets off when the batch's loop comes round.
const TRUCK_TIME = { travel: STORY.travel, leave: STORY.travel + TRUCK_PARK, loop: STORY.loop };

// The scrap truck: drives in, parks, and fades away; it comes round again
// when the next batch starts. A truck sprite faces one ground axis, so each
// straight stretch of the drive gets its own sprite, shown only while it's
// on it.
function TruckRun({ route }: { route: G2[] }) {
  const { travel, leave, loop } = TRUCK_TIME;
  const at = (sec: number) => +(sec / loop).toFixed(4);
  const timing = { dur: `${r1(loop)}s`, repeatCount: "indefinite" };
  const segs = route.slice(1).map((q, i) => ({ p: route[i], q, ...screenPath([route[i], q]) }));
  const total = segs.reduce((t, g) => t + g.len, 0);
  const spans: [number, number][] = [];
  for (let i = 0, t = 0; i < segs.length; i++) {
    const next = t + (travel * segs[i].len) / total;
    spans.push([t, next]);
    t = next;
  }
  return (
    <>
      {segs.map((g, i) => {
        const [s, end] = spans[i];
        const last = i === segs.length - 1;
        const axis: "x" | "y" = g.p[1] === g.q[1] ? "x" : "y";
        const k = axis === "x" ? 0 : 1;
        return (
          <g key={i} opacity={0}>
            {last ? (
              // Appears the instant it turns in, then fades out over TRUCK_FADE.
              <animate
                {...timing} attributeName="opacity" calcMode="linear"
                values="0;0;1;1;0;0"
                keyTimes={`0;${Math.max(0, at(s) - 0.001)};${at(s)};${at(leave)};${at(leave + TRUCK_FADE)};1`}
              />
            ) : (
              <animate
                {...timing} attributeName="opacity" calcMode="discrete"
                {...(at(s) === 0 ? { values: "1;0", keyTimes: `0;${at(end)}` } : { values: "0;1;0", keyTimes: `0;${at(s)};${at(end)}` })}
              />
            )}
            <animateMotion
              {...timing} calcMode="linear" path={g.d}
              {...(at(s) === 0 ? { keyPoints: "0;1;1", keyTimes: `0;${at(end)};1` } : { keyPoints: "0;0;1;1", keyTimes: `0;${at(s)};${at(end)};1` })}
            />
            <g transform={`scale(${DS})`}>
              <TruckSprite axis={axis} dir={g.q[k] > g.p[k] ? 1 : -1} />
            </g>
          </g>
        );
      })}
    </>
  );
}

// The scooter on its run: parked by the customers with an empty bay until
// the new pack drops in, then off to the corner, right and away off the
// map, back a little later and on to the collection centre's back gate,
// where it hands the battery over and is gone until the next customer. Each
// stretch has its own sprite, facing the way it rides; the battery drains
// green to red over the whole ride.
function ScooterRun() {
  const { loop, scooter } = STORY;
  const at = (sec: number) => +(Math.max(0, Math.min(sec, loop)) / loop).toFixed(4);
  const timing = { dur: `${r1(loop)}s`, repeatCount: "indefinite" };
  const battery = (showAt?: number, hideAt?: number) => (
    <g opacity={showAt === undefined ? 1 : 0}>
      {showAt !== undefined && (
        <animate {...timing} attributeName="opacity" calcMode="discrete" values="0;1" keyTimes={`0;${at(showAt)}`} />
      )}
      {hideAt !== undefined && (
        <animate {...timing} attributeName="opacity" calcMode="discrete" values="1;0" keyTimes={`0;${at(hideAt)}`} />
      )}
      {[{ pad: 2.2, op: 0.35 }, { pad: 0, op: 1 }].map(({ pad, op }) => (
        <rect
          key={pad} x={5 - pad} y={-22 - pad} width={13 + pad * 2} height={10 + pad * 2} rx={2 + pad}
          fill={BATTERY_FRESH} opacity={op} stroke={pad ? "none" : "#FFFFFF"} strokeWidth={1.4}
        >
          <animate
            {...timing} attributeName="fill" calcMode="linear"
            values={`${BATTERY_FRESH};${BATTERY_FRESH};${BATTERY_USED};${BATTERY_USED}`}
            keyTimes={`0;${at(scooter.rideStart)};${at(scooter.rideEnd)};1`}
          />
        </rect>
      ))}
      <rect x={18} y={-19} width={1.8} height={4} fill="#064233" />
    </g>
  );
  const legs = [
    // parked, then off to the corner (facing left)
    { d: SCOOTER_LEGS.toCorner.d, move: [scooter.rideStart, scooter.atCorner], show: "1;1;0;0", showAt: `0;${at(scooter.atCorner)};${at(scooter.atCorner + 0.01)};1`, flip: false, loadAt: scooter.loadAt, hideAt: undefined },
    // right, up to the edge of the map, fading as it goes off (facing right)
    {
      d: SCOOTER_LEGS.out.d, move: [scooter.atCorner, scooter.atEdge], flip: true, loadAt: undefined, hideAt: undefined,
      show: "0;0;1;1;0;0", showAt: `0;${at(scooter.atCorner - 0.01)};${at(scooter.atCorner)};${at(scooter.atEdge - 0.5)};${at(scooter.atEdge)};1`,
    },
    // back down, straight on to the back gate, battery out, gone (facing left)
    {
      d: SCOOTER_LEGS.back.d, move: [scooter.backAt, scooter.rideEnd], flip: false, loadAt: undefined, hideAt: scooter.dropAt,
      show: "0;0;1;1;0;0", showAt: `0;${at(scooter.backAt)};${at(scooter.backAt + 0.5)};${at(scooter.dropAt + 0.05)};${at(scooter.dropAt + 0.45)};1`,
    },
  ];
  return (
    <>
      {legs.map((leg, i) => (
        <g key={i} opacity={i ? 0 : 1}>
          <animate {...timing} attributeName="opacity" calcMode="linear" values={leg.show} keyTimes={leg.showAt} />
          <animateMotion {...timing} calcMode="linear" path={leg.d} keyPoints="0;0;1;1" keyTimes={`0;${at(leg.move[0])};${at(leg.move[1])};1`} />
          <g transform={leg.flip ? "scale(-1.25 1.25)" : "scale(1.25)"}>
            <Scooter battery={battery(leg.loadAt, leg.hideAt)} />
          </g>
        </g>
      ))}
    </>
  );
}

// One piece's timed trip, as drawn.
function StepArt({ st }: { st: Step }) {
  const { loop } = STORY;
  const at = (sec: number) => +(sec / loop).toFixed(4);
  const timing = { dur: `${r1(loop)}s`, repeatCount: "indefinite" };
  return (
    <g opacity={0}>
      <animate {...timing} attributeName="opacity" calcMode="discrete" values="0;1;0" keyTimes={`0;${at(st.start)};${at(st.end)}`} />
      <animateMotion
        {...timing} calcMode="linear" path={st.d}
        keyPoints={`${st.p0.toFixed(4)};${st.p0.toFixed(4)};${st.p1.toFixed(4)};${st.p1.toFixed(4)}`}
        keyTimes={`0;${at(st.start)};${at(st.end)};1`}
      />
      {st.art}
    </g>
  );
}

// The metals go out through the gate in the back wall, so they're drawn
// over the compound (nothing stands in front of their road) instead of in
// the motion layer beneath it, where the wall would hide them.
const OVER_WALL = (st: Step) => st.key.startsWith("extraction>cellmaker");

// The batch, built once: the truck plus every piece's timed trip.
const STORY_ART: ReactNode = (
  <>
    <TruckRun route={TRUCK_ROUTE} />
    <ScooterRun />
    {STORY.steps.filter((st) => !OVER_WALL(st)).map((st) => <StepArt key={st.key} st={st} />)}
  </>
);
const METALS_ART: ReactNode = STORY.steps.filter(OVER_WALL).map((st) => <StepArt key={st.key} st={st} />);

const LABEL_FS = 23, SUB_FS = 18, LABEL_LH = 28, SUB_LH = 23, PAD_X = 20, PAD_Y = 17;
// The plant-name chip on cards for steps inside the compound.
const CHIP_FS = 14, CHIP_H = 26, CHIP_CW = 10.6, CHIP_GAP = 10;
const LABEL_CW = LABEL_FS * 0.56, SUB_CW = SUB_FS * 0.53, MAX_TEXT_W = 250;

function wrap(text: string, charW: number): string[] {
  const lines: string[] = [];
  let cur = "";
  for (const word of text.split(/\s+/)) {
    const next = cur ? `${cur} ${word}` : word;
    if (cur && next.length * charW > MAX_TEXT_W) {
      lines.push(cur);
      cur = word;
    } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines;
}

interface Card {
  id: string; label: string[]; sub: string[]; plant?: string; top: number;
  ax: number; ay: number; x: number; y: number; w: number; h: number;
}

const CARDS: Card[] = (() => {
  const cards = NODES.filter((n) => !SHARES_CARD[n.id]).map((n) => {
    const [gx, gy] = LAYOUT[n.id];
    const f = FACILITIES[n.id] ?? FALLBACK;
    const site = SITE_NODES[n.id];
    // A guest step named the same as its host (quality checks, in the
    // Advanced Innovation & Quality Testing Center) adds nothing to the title.
    const guests = NODES.filter((g) => SHARES_CARD[g.id] === n.id && g.label !== n.label);
    const label = [n.label, ...guests.map((g) => `& ${g.label}`)].flatMap((t) => wrap(t, LABEL_CW));
    const sub = n.sublabel ? wrap(n.sublabel, SUB_CW) : [];
    const plant = site ? n.plant : undefined;
    const chipW = plant ? plant.length * CHIP_CW + 28 : 0;
    const textW = Math.max(chipW - 18, ...label.map((l) => l.length * LABEL_CW), ...sub.map((l) => l.length * SUB_CW));
    const w = Math.max(160, textW + PAD_X * 2 + 18);
    const top = plant ? CHIP_H + CHIP_GAP : 0;
    const h = PAD_Y * 2 + top + label.length * LABEL_LH + (sub.length ? 6 + sub.length * SUB_LH : 0) - 6;
    const [ax, ay] = site ? iso(...site.pin) : iso(gx, gy, f.anchorZ * S);
    // Cards only show on hover, one at a time, always straight above their
    // building: above the roof's highest point on screen (its back corner).
    let clearY = iso(gx, gy, f.clearZ * S)[1];
    if (site) {
      const r = P[site.plant];
      clearY = Math.min(ay, iso(r.x0, r.y0, PLANT_PEAK[site.plant])[1]);
    }
    return { id: n.id, label, sub, plant, top, ax, ay, x: ax - w / 2, y: clearY - 30 - h, w, h };
  });
  return cards;
})();

// The visible window: every facility, label and flow road with some air
// around it. Scenery and city roads run past these edges and get cropped,
// which is what makes it read as a slice of a larger map.
const VIEW = (() => {
  const footprints = STANDALONE.flatMap((n) => {
    const [gx, gy] = LAYOUT[n.id];
    const [w, d] = (FACILITIES[n.id] ?? FALLBACK).fp;
    const hw = (w * S) / 2, hd = (d * S) / 2;
    return [iso(gx - hw, gy + hd), iso(gx + hw, gy - hd), iso(gx + hw, gy + hd)];
  }).concat([iso(SITE.x0, SITE.y1), iso(SITE.x1, SITE.y0), iso(SITE.x1, SITE.y1)]);
  const routePts = LOOP_EDGES.flatMap((e) => [LAYOUT[e.from], ...(VIA[`${e.from}>${e.to}`] ?? []), LAYOUT[e.to]])
    .filter(Boolean)
    .map(([gx, gy]) => iso(gx, gy));
  const xs = [...footprints, ...routePts].map((p) => p[0]).concat(CARDS.flatMap((c) => [c.x, c.x + c.w]));
  const ys = [...footprints, ...routePts].map((p) => p[1]);
  const minX = Math.min(...xs) - 200, maxX = Math.max(...xs) + 200;
  const minY = Math.min(...CARDS.map((c) => c.y)) - 120, maxY = Math.max(...ys) + 110;
  return { minX, minY, w: maxX - minX, h: maxY - minY };
})();

// Customers queueing along the front of the customers building.
const CUSTOMER_QUEUE: [number, number, string][] = Array.from({ length: 7 }, (_, i) => [
  LAYOUT.customers[0] - 1.3 + i * 0.42,
  LAYOUT.customers[1] + 0.95,
  PEOPLE_COLORS[(i * 2 + 1) % PEOPLE_COLORS.length],
]);

// Scenery round the factory: wind turbines and a few clumps of trees on the
// open ground, kept back from the compound wall and off the roads.
// Drawn at DS scale, so hub heights here are pre-scale.
const TURBINES: [gx: number, gy: number, hub: number, speed: number][] = [
  [SITE.x1 + 3.6, -4, 84, 5.5],
  [SITE.x1 + 3.2, 0.5, 90, 8],
  [15, SITE.y1 + 3.4, 90, 7.5],
  [-2.2, -7, 88, 6],
];

function distToSeg([px, py]: G2, [ax, ay]: G2, [bx2, by2]: G2) {
  const dx = bx2 - ax, dy = by2 - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy || 1)));
  return Math.hypot(px - ax - t * dx, py - ay - t * dy);
}

const SCENE_ROADS: G2[][] = [
  ...EDGES.map((e) => [LAYOUT[e.from], ...(VIA[e.key] ?? []), LAYOUT[e.to]]),
  [SCOOTER_CORNER, SCOOTER_EDGE],
];

function openGround(p: G2) {
  const m = 1.5;
  if (p[0] > SITE.x0 - m && p[0] < SITE.x1 + m && p[1] > SITE.y0 - m && p[1] < SITE.y1 + m) return false;
  if (SCENE_ROADS.some((r) => r.slice(1).some((b, i) => distToSeg(p, r[i], b) < 0.9))) return false;
  if (STANDALONE.some((n) => {
    const [gx, gy] = LAYOUT[n.id];
    const [w, d] = (FACILITIES[n.id] ?? FALLBACK).fp;
    return Math.abs(p[0] - gx) < (w * S) / 2 + 1 && Math.abs(p[1] - gy) < (d * S) / 2 + 1.2;
  })) return false;
  if ([...Object.values(SIGN_AT), MAPS_SIGN_AT].some(([gx, gy]) => Math.hypot(p[0] - gx, p[1] - gy) < 1.3)) return false;
  if (TURBINES.some(([gx, gy]) => Math.hypot(p[0] - gx, p[1] - gy) < 1.1)) return false;
  return true;
}

const hash = (a: number, b: number) => {
  const v = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return v - Math.floor(v);
};

function inView(gx: number, gy: number, pad = 60) {
  const [x, y] = iso(gx, gy);
  return x > VIEW.minX - pad && x < VIEW.minX + VIEW.w + pad && y > VIEW.minY - pad && y < VIEW.minY + VIEW.h + pad;
}

// Trees scattered sparsely over the open ground in view, thinned by a
// smooth noise field so they gather into a few clumps rather than a grid.
const TREES: [number, number, number][] = (() => {
  const out: [number, number, number][] = [];
  for (let gx = -14; gx <= 42; gx += 1.05) {
    for (let gy = -26; gy <= 24; gy += 1.05) {
      const p: G2 = [gx + (hash(gx, gy) - 0.5) * 0.7, gy + (hash(gy, gx) - 0.5) * 0.7];
      if (!inView(p[0], p[1])) continue;
      // Thinner still in the top-right and bottom-left corners of the view.
      const [vx, vy] = iso(p[0], p[1]);
      const u = (vx - VIEW.minX) / VIEW.w, v = (vy - VIEW.minY) / VIEW.h;
      if (((u > 0.55 && v < 0.5) || (u < 0.45 && v > 0.5)) && hash(p[1] * 5, p[0] * 3) > 0.35) continue;
      const clump = (Math.sin(p[0] * 0.55) + Math.cos(p[1] * 0.62) + Math.sin((p[0] + p[1]) * 0.31)) / 3;
      if (hash(p[0] * 3, p[1] * 7) > 0.06 + clump * 0.28) continue;
      if (!openGround(p)) continue;
      out.push([r1(p[0] * 100) / 100, r1(p[1] * 100) / 100, hash(p[1], p[0]) > 0.45 ? 0 : 1]);
    }
  }
  return out;
})();

// A tree: round-crowned (kind 0) or a cone (kind 1).
function Tree({ gx, gy, kind }: { gx: number; gy: number; kind: number }) {
  const [x, y] = iso(gx, gy);
  return (
    <g>
      <ellipse cx={r1(x + 5)} cy={r1(y + 1)} rx={12} ry={5} fill="#0A241C" opacity={0.1} />
      <line x1={r1(x)} y1={r1(y)} x2={r1(x)} y2={r1(y - 12)} stroke="#064233" strokeWidth={2.4} strokeLinecap="round" />
      {kind === 0 ? (
        <circle cx={r1(x)} cy={r1(y - 19)} r={11} fill="url(#loopCrown)" />
      ) : (
        <path d={`M${r1(x - 9)},${r1(y - 9)} L${r1(x)},${r1(y - 38)} L${r1(x + 9)},${r1(y - 9)} Z`} fill="url(#loopCone)" />
      )}
    </g>
  );
}

// A wind turbine; its blades turn on their own clock.
function Turbine({ gx, gy, hub, speed }: { gx: number; gy: number; hub: number; speed: number }) {
  const [x, y] = iso(gx, gy).map(r1);
  const hy = r1(y - hub);
  const blade = "M0,0 C4,-9 4,-24 0,-36 C-2.6,-24 -2.6,-9 0,0 Z";
  return (
    <g>
      <ellipse cx={x + 8} cy={y + 1} rx={13} ry={5} fill="#0A241C" opacity={0.1} />
      <polygon points={`${x - 3.4},${y} ${x + 3.4},${y} ${x + 1.4},${hy} ${x - 1.4},${hy}`} fill="url(#loopTower)" stroke="#A6CAC1" strokeWidth={0.8} />
      <g>
        <animateTransform attributeName="transform" type="rotate" from={`0 ${x} ${hy}`} to={`360 ${x} ${hy}`} dur={`${speed}s`} repeatCount="indefinite" />
        {[0, 120, 240].map((a) => (
          <path key={a} d={blade} transform={`translate(${x} ${hy}) rotate(${a})`} fill="#FFFFFF" stroke="#80B3A7" strokeWidth={0.9} />
        ))}
      </g>
      <circle cx={x} cy={hy} r={3.8} fill="#00674F" stroke="#FFFFFF" strokeWidth={1} />
    </g>
  );
}

// Turbines turn all the time, so they're drawn in the motion layer.
const TURBINE_ART: ReactNode = TURBINES.map(([gx, gy, hub, speed], i) => (
  <Scaled key={i} gx={gx} gy={gy} k={DS}><Turbine gx={gx} gy={gy} hub={hub} speed={speed} /></Scaled>
));

// ReBAT's factory on Google Maps, from a white road sign beside the lanes
// into the collection centre, straight across from the section heading.
const REBAT_MAPS =
  "https://www.google.com/maps/place/ReBAT/@23.0774304,77.5641792,17z/data=!4m6!3m5!1s0x397c37b6caf7dc71:0x5d7af117645a91c0!8m2!3d23.0774304!4d77.5641792!16s%2Fg%2F11ltxqr_vg";
function MapsSign() {
  const [x, y] = iso(...MAPS_SIGN_AT).map(r1);
  const w = 300, h = 70, top = y - 52 - h;
  return (
    <a href={REBAT_MAPS} target="_blank" rel="noopener noreferrer" style={{ cursor: "pointer" }}>
      <title>ReBAT, Mandideep Industrial Area, Bhopal: open in Google Maps</title>
      {[-w / 2 + 34, w / 2 - 34].map((dx) => (
        <g key={dx}>
          <ellipse cx={x + dx} cy={y} rx={8} ry={3.2} fill="#064233" opacity={0.18} />
          <line x1={x + dx} y1={y} x2={x + dx} y2={top + h} stroke="#064233" strokeWidth={3} />
        </g>
      ))}
      <rect x={x - w / 2} y={top + 5} width={w} height={h} rx={10} fill="#0A241C" opacity={0.12} />
      <rect x={x - w / 2} y={top} width={w} height={h} rx={10} fill="#FFFFFF" stroke="#064233" strokeWidth={2.5} />
      <g transform={`translate(${x - w / 2 + 30} ${top + h / 2 + 13})`}>
        <path d="M0,0 C-3,-6 -11,-12 -11,-21 A11,11 0 1 1 11,-21 C11,-12 3,-6 0,0 Z" fill="#E53935" />
        <circle cy={-21} r={4.2} fill="#FFFFFF" />
      </g>
      <text x={x - w / 2 + 52} y={top + 30} fontSize={19} fontWeight={700} fill="#0A241C">Mandideep Industrial Area,</text>
      <text x={x - w / 2 + 52} y={top + 54} fontSize={19} fontWeight={700} fill="#0A241C">Bhopal</text>
    </a>
  );
}

type SceneObject = { depth: number; key: string; node: ReactNode };

// Scenery never changes, so its elements are built once: hovering only
// re-renders the buildings, and React skips these subtrees entirely.
const SCENERY: SceneObject[] = [
  ...TREES.map(([gx, gy, kind], i) => ({
    depth: gx + gy, key: `t${i}`,
    node: <Scaled gx={gx} gy={gy} k={DS}><Tree gx={gx} gy={gy} kind={kind} /></Scaled>,
  })),
  ...CUSTOMER_QUEUE.map(([gx, gy, color], i) => ({
    depth: gx + gy, key: `p${i}`,
    node: <Scaled gx={gx} gy={gy} k={DS}><Person gx={gx} gy={gy} color={color} /></Scaled>,
  })),
];

// A facility's label card, pinned to its building by a stem.
function CardArt({ c }: { c: Card }) {
  const stemX = c.ax;
  const bottom = c.y + c.h;
  const tip = bottom + 9, lip = bottom - 0.5;
  return (
    <>
    <line x1={r1(c.ax)} y1={r1(c.ay)} x2={r1(stemX)} y2={r1(bottom)} stroke="#338572" strokeWidth={2} opacity={0.55} />
    <circle cx={r1(c.ax)} cy={r1(c.ay)} r={5} fill="#FFFFFF" stroke="#338572" strokeWidth={2.2} />
    <rect x={r1(c.x)} y={r1(c.y + 6)} width={r1(c.w)} height={r1(c.h)} rx={16} fill="#064233" opacity={0.08} />
    <rect
      x={r1(c.x)} y={r1(c.y)} width={r1(c.w)} height={r1(c.h)} rx={16}
      fill="#FFFFFF" stroke="#338572" strokeWidth={2.4}
    />
    <path d={`M${r1(stemX - 9)},${r1(lip)} L${r1(stemX)},${r1(tip)} L${r1(stemX + 9)},${r1(lip)} Z`} fill="#FFFFFF" />
    {c.plant && (
      <g>
        <rect
          x={r1(c.x + PAD_X)} y={r1(c.y + PAD_Y)} width={r1(c.plant.length * CHIP_CW + 28)} height={CHIP_H} rx={CHIP_H / 2}
          fill="#E0EDEA" stroke="#BFD9D3" strokeWidth={1}
        />
        <text
          x={r1(c.x + PAD_X + 14)} y={r1(c.y + PAD_Y + CHIP_H / 2 + CHIP_FS * 0.36)}
          fontSize={CHIP_FS} fontWeight={700} letterSpacing={1.2} fill="#00674F"
        >
          {c.plant.toUpperCase()}
        </text>
      </g>
    )}
    <circle cx={r1(c.x + PAD_X + 5)} cy={r1(c.y + c.top + PAD_Y + 12)} r={5} fill="#338572" />
    <text x={r1(c.x + PAD_X + 18)} y={r1(c.y + c.top + PAD_Y + 20)} fontSize={LABEL_FS} fontWeight={600} fill="#064233">
      {c.label.map((l, i) => (
        <tspan key={i} x={r1(c.x + PAD_X + 18)} dy={i === 0 ? 0 : LABEL_LH}>
          {l}
        </tspan>
      ))}
    </text>
    {c.sub.length > 0 && (
      <text
        x={r1(c.x + PAD_X + 18)}
        y={r1(c.y + c.top + PAD_Y + 20 + c.label.length * LABEL_LH + 4)}
        fontSize={SUB_FS} fill="#599C8D"
      >
        {c.sub.map((l, i) => (
          <tspan key={i} x={r1(c.x + PAD_X + 18)} dy={i === 0 ? 0 : SUB_LH}>
            {l}
          </tspan>
        ))}
      </text>
    )}
    </>
  );
}

const VIEWBOX = `${r1(VIEW.minX)} ${r1(VIEW.minY)} ${r1(VIEW.w)} ${r1(VIEW.h)}`;

const OFF_SITE_CLIP = `M${r1(VIEW.minX - 400)},${r1(VIEW.minY - 400)} h${r1(VIEW.w + 800)} v${r1(VIEW.h + 800)} h${r1(-VIEW.w - 800)} Z M${SITE_POLY.split(" ").join(" L")} Z`;

/* ---------------------------------------------------------------- */
/* Component                                                         */
/* ---------------------------------------------------------------- */

export function ProcessLoop() {
  const [active, setActive] = useState<string | null>(null);
  const [motion, setMotion] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotion(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const activeIds = active ? cardGroup(active) : [];
  const related = (e: { from: string; to: string }) => !active || activeIds.includes(e.from) || activeIds.includes(e.to);
  const labelOf = (id: string) => LOOP_NODES.find((n) => n.id === id)?.label ?? id;

  const objects: SceneObject[] = [
    {
      depth: (SITE.x0 + SITE.x1) / 2 + (SITE.y0 + SITE.y1) / 2,
      key: "site",
      node: <SiteBuildings active={active} onHover={setActive} />,
    },
    ...STANDALONE.map((n) => {
      const [gx, gy] = LAYOUT[n.id];
      const f = FACILITIES[n.id] ?? FALLBACK;
      const [ox, oy] = iso(gx, gy).map(r1);
      return {
        depth: gx + gy,
        key: n.id,
        node: (
          <g
            className="loop-bldg"
            data-active={active === n.id}
            onMouseEnter={() => setActive(n.id)}
            onMouseLeave={() => setActive(null)}
          >
            <g transform={`translate(${ox} ${oy}) scale(${S}) translate(${-ox} ${-oy})`}>{f.draw(gx, gy)}</g>
          </g>
        ),
      };
    }),
    ...SCENERY,
  ].sort((a, b) => a.depth - b.depth);

  return (
    // Same technique as Description: this wrapper carries the *next*
    // section's color so it shows through the notch left by the
    // rounded-bottom corners below, instead of white.
    <div style={{ background: "linear-gradient(90deg, #e2f0ad, var(--surface-yellow) 55%, var(--surface-mineral))" }}>
      <section
        id="recycle-with-us"
        className="relative overflow-hidden rounded-b-[32px] px-[5vw] pt-20"
        style={{ background: "linear-gradient(180deg, #D1E4DF 0%, #EBF3F1 45%, #F5F9F8 100%)" }}
      >
        <style>{LOOP_CSS}</style>

        <Reveal className="relative z-10 -mb-6">
          <div className="mb-2 text-base font-bold tracking-[0.08em] uppercase" style={{ color: "#338572" }}>Partner with us</div>
          <h2 className="text-5xl font-bold" style={{ color: "#00674F" }}>
            Close the loop
          </h2>
        </Reveal>

        <a className="sr-only" href={REBAT_MAPS} target="_blank" rel="noopener noreferrer">
          ReBAT factory location on Google Maps
        </a>
        <ol className="sr-only">
          {LOOP_EDGES.map((e) => (
            <li key={`${e.from}>${e.to}`}>
              {labelOf(e.from)} to {labelOf(e.to)}
              {e.label ? ` (${e.label.replace("\n", " ")})` : ""}
            </li>
          ))}
        </ol>

        <Reveal>
          <div className="-mx-[5vw] overflow-x-auto">
            {/* Three stacked layers with one viewBox, so a moving parcel only
                repaints the thin middle layer instead of the whole map:
                ground and roads below, what moves in between, and the
                buildings, trees and labels on top. */}
            <div
              className="relative min-w-[1100px]"
              style={{
                maskImage: "linear-gradient(to bottom, transparent 0, #000 7%)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent 0, #000 7%)",
              }}
            >
              <svg viewBox={VIEWBOX} className="block h-auto w-full" aria-hidden="true">
              <defs>
                <radialGradient id="loopLotGlow">
                  <stop offset="0" stopColor="#599C8D" stopOpacity="0.32" />
                  <stop offset="0.6" stopColor="#599C8D" stopOpacity="0.12" />
                  <stop offset="1" stopColor="#599C8D" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="loopCylMint" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#FFFFFF" />
                  <stop offset="0.55" stopColor="#D1E4DF" />
                  <stop offset="1" stopColor="#A6CAC1" />
                </linearGradient>
                <linearGradient id="loopCylEmerald" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#599C8D" />
                  <stop offset="0.55" stopColor="#338572" />
                  <stop offset="1" stopColor="#035340" />
                </linearGradient>
                <linearGradient id="loopCylDark" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#338572" />
                  <stop offset="0.55" stopColor="#00674F" />
                  <stop offset="1" stopColor="#035340" />
                </linearGradient>
                <radialGradient id="loopDome" cx="0.35" cy="0.3" r="0.8">
                  <stop offset="0" stopColor="#FFFFFF" />
                  <stop offset="0.6" stopColor="#BFD9D3" />
                  <stop offset="1" stopColor="#80B3A7" />
                </radialGradient>
                <radialGradient id="loopCrown" cx="0.35" cy="0.3" r="0.75">
                  <stop offset="0" stopColor="#338572" />
                  <stop offset="1" stopColor="#00674F" />
                </radialGradient>
                <linearGradient id="loopCone" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#00674F" />
                  <stop offset="1" stopColor="#035340" />
                </linearGradient>
                <linearGradient id="loopTower" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#FFFFFF" />
                  <stop offset="1" stopColor="#D1E4DF" />
                </linearGradient>
                <clipPath id="loopOffSite">
                  <path d={OFF_SITE_CLIP} clipRule="evenodd" />
                </clipPath>
              </defs>

              {/* ReBAT's compound: yard, QC Lab forecourt, driveway and garden */}
              <g>
                <ellipse
                  cx={r1(iso((SITE.x0 + SITE.x1) / 2, (SITE.y0 + SITE.y1) / 2)[0])}
                  cy={r1(iso((SITE.x0 + SITE.x1) / 2, (SITE.y0 + SITE.y1) / 2)[1])}
                  rx={r1((SITE.x1 - SITE.x0 + SITE.y1 - SITE.y0) * CX * 0.62)}
                  ry={r1((SITE.x1 - SITE.x0 + SITE.y1 - SITE.y0) * CX * 0.36)}
                  fill="url(#loopLotGlow)"
                />
                <polygon points={SITE_POLY} fill="#E0EDEA" stroke="#BFD9D3" strokeWidth={1.5} />
                <polygon points={pts([sx(5.05), sy(1.2), 0], [sx(9), sy(1.2), 0], [sx(9), sy(1.78), 0], [sx(5.05), sy(1.78), 0])} fill="#EEDB9E" />
                <polygon points={pts([P.bridge.x0, sy(-3.9), 0], [P.bridge.x1, sy(-3.9), 0], [P.bridge.x1, sy(1.2), 0], [P.bridge.x0, sy(1.2), 0])} fill="#D1E4DF" />
              </g>

              {/* ReBAT's garden lawn, with the lane across it */}
              <polygon
                points={pts([GARDEN.x0, GARDEN.y0, 0], [GARDEN.x1, GARDEN.y0, 0], [GARDEN.x1, GARDEN.y1, 0], [GARDEN.x0, GARDEN.y1, 0])}
                fill="#80B3A7" stroke="#599C8D" strokeWidth={1.5}
              />

              {/* Facility lots, each with a soft brand glow under it */}
              {STANDALONE.map((n) => {
                const [gx, gy] = LAYOUT[n.id];
                const [bw, bd] = (FACILITIES[n.id] ?? FALLBACK).fp;
                const w = bw * S, d = bd * S, m = 0.7;
                const [cx, cy] = iso(gx, gy);
                const rx = (w + d) * CX * 0.95;
                return (
                  <g key={`lot-${n.id}`}>
                    <ellipse cx={r1(cx)} cy={r1(cy)} rx={r1(rx)} ry={r1(rx * 0.58)} fill="url(#loopLotGlow)" />
                    <polygon
                      points={pts(
                        [gx - w / 2 - m, gy - d / 2 - m, 0], [gx + w / 2 + m, gy - d / 2 - m, 0],
                        [gx + w / 2 + m, gy + d / 2 + m, 0], [gx - w / 2 - m, gy + d / 2 + m, 0],
                      )}
                      fill="#F5F9F8" stroke="#D1E4DF" strokeWidth={1.5}
                    />
                  </g>
                );
              })}

              {/* Flow roads */}
              {/* Full-width outside the compound, narrow yard lanes inside it */}
              {EDGES.map((e) => (
                <g key={`road-${e.key}`} opacity={related(e) ? 1 : 0.35} style={{ transition: "opacity .3s ease" }}>
                  {e.runs.map((r, i) =>
                    r.inside ? (
                      <g key={i}>
                        <path d={r.d} fill="none" stroke="#A6CAC1" strokeWidth={14} strokeLinecap="square" strokeLinejoin="miter" />
                        <path d={r.d} fill="none" stroke="#D1E4DF" strokeWidth={10} strokeLinecap="square" strokeLinejoin="miter" />
                        <path
                          d={r.d} fill="none" stroke={active && related(e) ? "#DDB73C" : "#E6C96D"} strokeWidth={2}
                          strokeDasharray="9 4"
                        />
                      </g>
                    ) : (
                      <g key={i} clipPath={e.crosses ? "url(#loopOffSite)" : undefined}>
                        <path d={r.d} fill="none" stroke="#A6CAC1" strokeWidth={48} strokeLinecap="square" strokeLinejoin="miter" />
                        <path d={r.d} fill="none" stroke="#BFD9D3" strokeWidth={41} strokeLinecap="square" strokeLinejoin="miter" />
                        <path
                          d={r.d} fill="none" stroke={active && related(e) ? "#DDB73C" : "#FFFFFF"} strokeWidth={3}
                          strokeDasharray="14 12"
                        />
                      </g>
                    ),
                  )}
                </g>
              ))}

              {/* The road off the map that the customer's scooter takes */}
              <g>
                <path d={SCOOTER_LEGS.out.d} fill="none" stroke="#A6CAC1" strokeWidth={48} strokeLinecap="square" />
                <path d={SCOOTER_LEGS.out.d} fill="none" stroke="#BFD9D3" strokeWidth={41} strokeLinecap="square" />
                <path d={SCOOTER_LEGS.out.d} fill="none" stroke="#FFFFFF" strokeWidth={3} strokeDasharray="14 12" />
              </g>

              {/* Building shadows */}
              {STANDALONE.map((n) => {
                const [gx, gy] = LAYOUT[n.id];
                const [w, d, h] = (FACILITIES[n.id] ?? FALLBACK).fp;
                return <Shadow key={`sh-${n.id}`} gx={gx} gy={gy} w={w * S} d={d * S} h={h * S} />;
              })}
              {([["store", H.store], ["chem", H.chem], ["qc", H.qc], ["mech", H.shed], ["sl", H.front], ["test", H.front]] as const).map(([k, h]) => {
                const b = bx(P[k]);
                return <Shadow key={`sh-${k}`} gx={b.gx} gy={b.gy} w={b.w} d={b.d} h={h} />;
              })}

              </svg>

              <svg viewBox={VIEWBOX} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
                {/* One batch working its way through the process */}
                {motion && STORY_ART}

                {motion && <Guard />}
                {TURBINE_ART}
                <MainGate animate={motion} />
              </svg>

              <svg viewBox={VIEWBOX} className="absolute inset-0 h-full w-full" aria-hidden="true">
              {/* Buildings, trees, solar field and turbines, back to front */}
              {objects.map((o) => (
                <g key={o.key}>{o.node}</g>
              ))}

              {/* The metals, over the back wall they pass through */}
              {motion && <g style={{ pointerEvents: "none" }}>{METALS_ART}</g>}

              {/* ReBAT's location: the road sign opens the factory in Google Maps */}
              <MapsSign />

              {/* Edge labels: the Reverse Logistics sign on the truck's road */}
              {EDGES.filter((e) => e.sign && e.label).map((e) => {
                const lines = e.label!.split("\n");
                const [x, y] = e.sign!;
                const fs = 18, lh = 22, padX = 16, padY = 11;
                const w = Math.max(...lines.map((l) => l.length)) * fs * 0.55 + padX * 2;
                const h = lines.length * lh + padY * 2 - 3;
                const top = y - 22 - h;
                return (
                  <g
                    key={`sign-${e.key}`} opacity={related(e) ? 1 : 0.35}
                    style={{ transition: "opacity .25s ease", pointerEvents: "none" }}
                  >
                    <ellipse cx={r1(x)} cy={r1(y)} rx={9} ry={4} fill="#064233" opacity={0.18} />
                    <line x1={r1(x)} y1={r1(y)} x2={r1(x)} y2={r1(top + h)} stroke="#064233" strokeWidth={2.2} />
                    <rect x={r1(x - w / 2)} y={r1(top + 5)} width={r1(w)} height={r1(h)} rx={Math.min(15, h / 2)} fill="#064233" opacity={0.12} />
                    <rect x={r1(x - w / 2)} y={r1(top)} width={r1(w)} height={r1(h)} rx={Math.min(15, h / 2)} fill="#064233" />
                    <text x={r1(x)} y={r1(top + padY + 15)} textAnchor="middle" fontSize={fs} fontWeight={600} fill="#FFFFFF">
                      {lines.map((l, i) => (
                        <tspan key={i} x={r1(x)} dy={i === 0 ? 0 : lh}>
                          {l}
                        </tspan>
                      ))}
                    </text>
                  </g>
                );
              })}

              {/* Facility labels: only the hovered building's card is drawn */}
              {CARDS.filter((c) => activeIds.includes(c.id)).map((c) => (
                <g key={`card-${c.id}`} className="loop-card" style={{ pointerEvents: "none" }}>
                  <CardArt c={c} />
                </g>
              ))}
              </svg>

            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

const LOOP_CSS = `
.loop-bldg { transition: transform .35s cubic-bezier(.2,.8,.2,1); cursor: default; }
.loop-bldg[data-active="true"] { transform: translateY(-6px); }
.loop-card { animation: loopFade .25s ease; }
@keyframes loopFade { from { opacity: 0; } to { opacity: 1; } }
`;
