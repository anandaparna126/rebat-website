"use client";

import { useEffect, useState, type ReactNode } from "react";
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
// The main line runs down the screen diagonal; the two process lanes sit
// either side of it; the return leg is a ring road along the bottom.
const LAYOUT: Record<string, G2> = {
  collection: [0, 0],
  factory: [4.2, 0],
  characterisation: [8.4, 0],
  recycling: [13.4, -3.6],
  refurb: [13.4, 3.6],
  extraction: [17.6, -3.6],
  packmaker: [17.6, 3.6],
  quality: [21.8, -3.6],
  testing: [21.8, 3.6],
  cellmaker: [26, -3.6],
  customers: [26, 3.6],
  used: [12.8, 7.4],
};

// Road waypoints between the two node centres, so every road runs along
// the ground grid.
const VIA: Record<string, G2[]> = {
  "characterisation>recycling": [[10.8, 0], [10.8, -3.6]],
  "characterisation>refurb": [[10.8, 0], [10.8, 3.6]],
  "cellmaker>packmaker": [[26, 0], [17.6, 0]],
  "customers>used": [[26, 7.4]],
  "used>collection": [[4.2, 7.4], [4.2, 2.6], [0, 2.6]],
};

// Public roads that aren't part of the flow — they carry the grid out past
// every edge of the section so the site reads as part of a wider map.
const CITY_ROADS: G2[][] = [
  [[-14, 0], [0, 0]],
  [[10.8, 0], [17.6, 0]],
  [[26, 0], [42, 0]],
  [[-14, 7.4], [4.2, 7.4]],
  [[26, 7.4], [42, 7.4]],
  [[4.2, 7.4], [4.2, 24]],
  [[26, 7.4], [26, 24]],
  [[-14, -8.5], [42, -8.5]],
  [[7, -8.5], [7, -24]],
  [[17, -8.5], [17, -24]],
  [[29.5, -8.5], [29.5, -24]],
];

// Facilities are drawn at this multiple of their base footprint, scaled
// about their own ground centre so the isometric angles stay true.
const S = 2;
// Scenery (trees, turbines, panels, vehicles, people) scale.
const DS = 1.6;

const SOLAR_FIELDS: { gx0: number; gy0: number; cols: number; rows: number }[] = [
  { gx0: 0.7, gy0: 3.7, cols: 4, rows: 4 },
  { gx0: 11, gy0: -14.2, cols: 5, rows: 3 },
  { gx0: 31, gy0: 1.4, cols: 3, rows: 4 },
];
const SOLAR: G2[] = SOLAR_FIELDS.flatMap((f) =>
  Array.from({ length: f.cols * f.rows }, (_, i) => [f.gx0 + (i % f.cols) * 0.95, f.gy0 + Math.floor(i / f.cols) * 0.9] as G2),
);

// Drawn at DS scale, so hub heights here are pre-scale.
const TURBINES: [gx: number, gy: number, hub: number, speed: number][] = [
  [9.5, -11.2, 92, 7],
  [13, -11.6, 84, 5.5],
  [16.5, -11.2, 90, 8],
  [20, -11.6, 82, 6.5],
  [23.5, -11.2, 92, 7.5],
  [1.8, 10.8, 90, 6],
  [7.4, 11.2, 84, 8],
  [11.4, 10.6, 92, 5.8],
];

// Vehicles running straight road stretches (they fade in/out at the ends,
// where they drive into a facility or off the edge of the map).
const TRUCKS: { from: G2; to: G2 }[] = [
  { from: [-14, 0.14], to: [0, 0.14] },
  { from: [0, 0], to: [4.2, 0] },
  { from: [42, -8.36], to: [-14, -8.36] },
  { from: [-14, -8.64], to: [42, -8.64] },
  { from: [26, 3.6], to: [26, 7.4] },
  { from: [42, 7.26], to: [4.2, 7.26] },
  { from: [4.2, 7.4], to: [4.2, 2.6] },
  { from: [26, 24], to: [26, 7.54] },
];

const PEOPLE_COLORS = ["#0E7A5E", "#DDB73C", "#2F4A7A", "#F2994A", "#3E7666"];

/* ---------------------------------------------------------------- */
/* Palette                                                           */
/* ---------------------------------------------------------------- */

type Shade = readonly [top: string, left: string, right: string];

const WALL: Shade = ["#FFFFFF", "#E6F2ED", "#C9DFD6"];
const MINT: Shade = ["#EEF9F4", "#D2EDE1", "#AFD8C6"];
const ROOF: Shade = ["#179A78", "#0C6A53", "#084F3E"];
const DARK: Shade = ["#3A5A52", "#28433C", "#1B302B"];
const GOLD: Shade = ["#F2D26B", "#DDB73C", "#B8952A"];
const GLASS: Shade = ["#C8EDE0", "#9ED6C3", "#7DC2AC"];
const EDGE = "rgba(8,60,46,0.12)";
const WIN_L = "#3E7666";
const WIN_R = "#2F5E51";
const LIT = "#F2D26B";

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
            className={lit ? "loop-glow" : undefined}
          />
        );
      })}
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

function Smoke({ at }: { at: Pt }) {
  return (
    <g className="loop-smoke" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={r1(at[0])} cy={r1(at[1] - 4)} r={5} style={{ animationDelay: `${i * 1.1}s` }} />
      ))}
    </g>
  );
}

function Beacon({ at }: { at: Pt }) {
  return <circle cx={r1(at[0])} cy={r1(at[1])} r={2.6} fill="#F2994A" className="loop-blink" />;
}

function Mast({ gx, gy, z, h }: { gx: number; gy: number; z: number; h: number }) {
  const [x, y] = iso(gx, gy, z);
  return (
    <g>
      <line x1={r1(x)} y1={r1(y)} x2={r1(x)} y2={r1(y - h)} stroke="#28433C" strokeWidth={1.6} strokeLinecap="round" />
      <Beacon at={[x, y - h]} />
    </g>
  );
}

// Rooftop HVAC unit — breaks up the large flat roofs.
function Ac({ gx, gy, z }: { gx: number; gy: number; z: number }) {
  return (
    <>
      <Box gx={gx} gy={gy} w={0.18} d={0.16} z={z} h={5} c={WALL} />
      <Panel side="L" gx={gx} gy={gy} w={0.18} d={0.16} a={-0.06} b={0.06} z1={z + 1.2} z2={z + 3.8} fill="#9DBDB1" />
    </>
  );
}

function Tree({ gx, gy, kind }: { gx: number; gy: number; kind: number }) {
  const [x, y] = iso(gx, gy);
  return (
    <g>
      <ellipse cx={r1(x + 5)} cy={r1(y + 1)} rx={12} ry={5} fill="#0A3D2E" opacity={0.08} />
      <line x1={r1(x)} y1={r1(y)} x2={r1(x)} y2={r1(y - 12)} stroke="#7A6446" strokeWidth={2.4} strokeLinecap="round" />
      {kind === 0 ? (
        <circle cx={r1(x)} cy={r1(y - 19)} r={11} fill="url(#loopCrown)" />
      ) : (
        <path d={`M${r1(x - 9)},${r1(y - 9)} L${r1(x)},${r1(y - 38)} L${r1(x + 9)},${r1(y - 9)} Z`} fill="url(#loopCone)" />
      )}
    </g>
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
      fill="#0A3D2E" opacity={0.07}
    />
  );
}

function SolarPanel({ gx, gy }: { gx: number; gy: number }) {
  const w = 0.46, d = 0.34, x0 = gx - w / 2, x1 = gx + w / 2, y0 = gy - d / 2, y1 = gy + d / 2;
  const [mx, my] = iso(gx, gy + 0.1);
  return (
    <g>
      <line x1={r1(mx)} y1={r1(my)} x2={r1(mx)} y2={r1(my - 5)} stroke="#6E8C84" strokeWidth={1.4} />
      <polygon points={pts([x0, y0, 10], [x1, y0, 10], [x1, y1, 4], [x0, y1, 4])} fill="url(#loopSolar)" stroke="#E8F2EE" strokeWidth={0.8} />
      <polyline points={pts([gx, y0, 10], [gx, y1, 4])} fill="none" stroke="#9CC4D3" strokeWidth={0.6} opacity={0.7} />
    </g>
  );
}

function Turbine({ gx, gy, hub, speed }: { gx: number; gy: number; hub: number; speed: number }) {
  const [x, y] = iso(gx, gy);
  const hy = y - hub;
  const blade = `M0,0 C4,-9 4,-24 0,-36 C-2.6,-24 -2.6,-9 0,0 Z`;
  return (
    <g>
      <ellipse cx={r1(x + 8)} cy={r1(y + 1)} rx={13} ry={5} fill="#0A3D2E" opacity={0.1} />
      <polygon
        points={`${r1(x - 3.4)},${r1(y)} ${r1(x + 3.4)},${r1(y)} ${r1(x + 1.4)},${r1(hy)} ${r1(x - 1.4)},${r1(hy)}`}
        fill="url(#loopTower)" stroke="#8FB3A6" strokeWidth={0.8}
      />
      <g className="loop-spin" style={{ transformOrigin: `${r1(x)}px ${r1(hy)}px`, animationDuration: `${speed}s` }}>
        {[0, 120, 240].map((a) => (
          <path key={a} d={blade} transform={`translate(${r1(x)} ${r1(hy)}) rotate(${a})`} fill="#FFFFFF" stroke="#7FA698" strokeWidth={0.9} />
        ))}
      </g>
      <circle cx={r1(x)} cy={r1(hy)} r={3.8} fill="#0E7A5E" stroke="#FFFFFF" strokeWidth={1} />
    </g>
  );
}

function Person({ gx, gy, color }: { gx: number; gy: number; color: string }) {
  const [x, y] = iso(gx, gy);
  return (
    <g>
      <ellipse cx={r1(x + 1.5)} cy={r1(y)} rx={5} ry={2} fill="#0A3D2E" opacity={0.14} />
      <rect x={r1(x - 2.4)} y={r1(y - 9)} width={1.8} height={9} rx={0.9} fill="#2B3A4A" />
      <rect x={r1(x + 0.6)} y={r1(y - 9)} width={1.8} height={9} rx={0.9} fill="#2B3A4A" />
      <rect x={r1(x - 3)} y={r1(y - 18)} width={6} height={10} rx={2.6} fill={color} />
      <circle cx={r1(x)} cy={r1(y - 21.5)} r={3} fill="#E8B98F" />
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
  return (
    <g>
      <polygon points={pts([-s[0] + 0.06, -s[1] + 0.02, 0], [s[0] + 0.06, -s[1] + 0.02, 0], [s[0] + 0.06, s[1] + 0.02, 0], [-s[0] + 0.06, s[1] + 0.02, 0])} fill="#0A3D2E" opacity={0.12} />
      {cabInFront ? cargo : cab}
      {cabInFront ? cab : cargo}
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
        <Box gx={x - 0.85} gy={y + 0.3} w={0.26} d={0.26} h={11} c={GOLD} />
        <Box gx={x - 0.85} gy={y + 0.3} w={0.26} d={0.26} z={11} h={11} c={ROOF} />
        <Box gx={x - 0.85} gy={y + 0.62} w={0.26} d={0.26} h={11} c={ROOF} />
        <Box gx={x} gy={y} w={1.1} d={1.0} h={30} c={WALL} />
        <Box gx={x} gy={y} w={1.18} d={1.08} z={30} h={5} c={ROOF} />
        <Ac gx={x - 0.25} gy={y - 0.25} z={35} />
        <Ac gx={x + 0.25} gy={y - 0.25} z={35} />
        <Panel side="L" gx={x} gy={y} w={1.1} d={1.0} a={-0.2} b={0.2} z1={0} z2={19} fill={WIN_R} />
        <Panel side="L" gx={x} gy={y} w={1.1} d={1.0} a={-0.47} b={-0.3} z1={14} z2={22} fill={WIN_L} />
        <Panel side="L" gx={x} gy={y} w={1.1} d={1.0} a={0.3} b={0.47} z1={14} z2={22} fill={LIT} className="loop-glow" />
        <Wins side="R" gx={x} gy={y} w={1.1} d={1.0} n={3} z1={14} z2={22} />
      </>
    ),
  },
  factory: {
    fp: [1.2, 1.0, 39], anchorZ: 39, clearZ: 80,
    draw: (x, y) => (
      <>
        <Box gx={x} gy={y} w={1.2} d={1.0} h={32} c={WALL} />
        {[-0.4, 0, 0.4].map((o) => (
          <Box key={o} gx={x + o} gy={y} w={0.34} d={1.0} z={32} h={7} c={ROOF} />
        ))}
        <Wins side="L" gx={x} gy={y} w={1.2} d={1.0} n={4} z1={12} z2={22} />
        <Wins side="R" gx={x} gy={y} w={1.2} d={1.0} n={3} z1={12} z2={22} />
        <Cyl gx={x + 0.35} gy={y - 0.3} r={0.09} z={39} h={34} side="url(#loopCylDark)" top="#28433C" band={[22, 27]} />
        <Smoke at={iso(x + 0.35, y - 0.3, 73)} />
      </>
    ),
  },
  characterisation: {
    fp: [1.0, 1.0, 30], anchorZ: 30, clearZ: 64,
    draw: (x, y) => (
      <>
        <Box gx={x} gy={y} w={1.0} d={1.0} h={30} c={MINT} />
        <Panel side="L" gx={x} gy={y} w={1.0} d={1.0} a={-0.42} b={0.42} z1={11} z2={21} fill={GLASS[1]} />
        <Panel side="R" gx={x} gy={y} w={1.0} d={1.0} a={-0.42} b={0.42} z1={11} z2={21} fill={GLASS[2]} />
        <Cyl gx={x - 0.05} gy={y - 0.05} r={0.3} z={30} h={5} side="url(#loopCylMint)" dome="url(#loopDome)" />
        <Mast gx={x + 0.36} gy={y - 0.36} z={30} h={26} />
      </>
    ),
  },
  recycling: {
    fp: [1.0, 0.9, 28], anchorZ: 28, clearZ: 76,
    draw: (x, y) => (
      <>
        <Cyl gx={x - 0.28} gy={y - 0.72} r={0.2} h={38} side="url(#loopCylEmerald)" top="#2FA07F" band={[26, 30]} />
        <Cyl gx={x + 0.28} gy={y - 0.7} r={0.16} h={30} side="url(#loopCylMint)" band={[20, 23]} />
        <Box gx={x} gy={y} w={1.0} d={0.9} h={24} c={WALL} />
        <Box gx={x} gy={y} w={1.06} d={0.96} z={24} h={4} c={ROOF} />
        <Ac gx={x - 0.2} gy={y + 0.18} z={28} />
        <Ac gx={x + 0.22} gy={y + 0.18} z={28} />
        <Wins side="L" gx={x} gy={y} w={1.0} d={0.9} n={3} z1={9} z2={18} />
        <Wins side="R" gx={x} gy={y} w={1.0} d={0.9} n={3} z1={9} z2={18} />
      </>
    ),
  },
  refurb: {
    fp: [1.1, 0.9, 36], anchorZ: 36, clearZ: 40,
    draw: (x, y) => (
      <>
        <Box gx={x} gy={y} w={1.1} d={0.9} h={24} c={WALL} />
        <Box gx={x} gy={y} w={1.16} d={0.96} z={24} h={3} c={ROOF} />
        <Box gx={x - 0.04} gy={y} w={0.56} d={0.3} z={27} h={9} c={GOLD} />
        <Box gx={x + 0.28} gy={y} w={0.07} d={0.13} z={27} h={9} c={DARK} />
        <Panel side="L" gx={x} gy={y} w={1.1} d={0.9} a={-0.18} b={0.18} z1={0} z2={16} fill={WIN_R} />
        <Wins side="R" gx={x} gy={y} w={1.1} d={0.9} n={3} z1={10} z2={18} />
      </>
    ),
  },
  extraction: {
    fp: [1.2, 0.9, 26], anchorZ: 26, clearZ: 96,
    draw: (x, y) => (
      <>
        <Cyl gx={x - 0.4} gy={y - 0.7} r={0.15} h={52} side="url(#loopCylMint)" band={[36, 40]} />
        <Cyl gx={x} gy={y - 0.75} r={0.16} h={60} side="url(#loopCylEmerald)" top="#2FA07F" band={[44, 48]} />
        <Cyl gx={x + 0.4} gy={y - 0.7} r={0.15} h={46} side="url(#loopCylMint)" band={[30, 34]} />
        <Box gx={x} gy={y} w={1.2} d={0.9} h={22} c={WALL} />
        <Box gx={x} gy={y} w={1.26} d={0.96} z={22} h={4} c={ROOF} />
        <Ac gx={x - 0.1} gy={y + 0.18} z={26} />
        <Ac gx={x + 0.32} gy={y + 0.18} z={26} />
        <Wins side="L" gx={x} gy={y} w={1.2} d={0.9} n={4} z1={8} z2={16} />
        <Wins side="R" gx={x} gy={y} w={1.2} d={0.9} n={3} z1={8} z2={16} />
      </>
    ),
  },
  packmaker: {
    fp: [1.3, 1.0, 32], anchorZ: 32, clearZ: 36,
    draw: (x, y) => (
      <>
        <Box gx={x} gy={y} w={1.3} d={1.0} h={30} c={WALL} />
        <Box gx={x} gy={y - 0.2} w={1.1} d={0.16} z={30} h={3} c={GLASS} />
        <Box gx={x} gy={y + 0.2} w={1.1} d={0.16} z={30} h={3} c={GLASS} />
        <Panel side="L" gx={x} gy={y} w={1.3} d={1.0} a={-0.65} b={0.65} z1={24} z2={27} fill={GOLD[1]} />
        <Panel side="R" gx={x} gy={y} w={1.3} d={1.0} a={-0.5} b={0.5} z1={24} z2={27} fill={GOLD[2]} />
        <Wins side="L" gx={x} gy={y} w={1.3} d={1.0} n={5} z1={9} z2={18} />
        <Wins side="R" gx={x} gy={y} w={1.3} d={1.0} n={3} z1={9} z2={18} />
      </>
    ),
  },
  quality: {
    fp: [0.9, 0.9, 28], anchorZ: 28, clearZ: 62, dx: 22,
    draw: (x, y) => {
      const [bx, by] = iso(x, y, 50);
      return (
        <>
          <Box gx={x} gy={y} w={0.9} d={0.9} h={24} c={MINT} />
          <Box gx={x} gy={y} w={0.96} d={0.96} z={24} h={4} c={ROOF} />
          <Ac gx={x + 0.24} gy={y + 0.2} z={28} />
          <Wins side="L" gx={x} gy={y} w={0.9} d={0.9} n={3} z1={9} z2={17} />
          <Wins side="R" gx={x} gy={y} w={0.9} d={0.9} n={3} z1={9} z2={17} />
          <g className="loop-bob">
            <circle cx={r1(bx)} cy={r1(by)} r={11} fill="#DDB73C" stroke="#FFFFFF" strokeWidth={2} />
            <path d={`M${r1(bx - 5)},${r1(by)} l3.5,3.8 l6.5,-7.2`} fill="none" stroke="#FFFFFF" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </>
      );
    },
  },
  testing: {
    fp: [0.9, 0.9, 26], anchorZ: 26, clearZ: 58,
    draw: (x, y) => (
      <>
        <Box gx={x} gy={y} w={0.9} d={0.9} h={22} c={WALL} />
        <Box gx={x} gy={y} w={0.96} d={0.96} z={22} h={4} c={ROOF} />
        <Ac gx={x - 0.18} gy={y + 0.16} z={26} />
        <Wins side="L" gx={x} gy={y} w={0.9} d={0.9} n={3} z1={8} z2={16} />
        <Wins side="R" gx={x} gy={y} w={0.9} d={0.9} n={3} z1={8} z2={16} />
        <Mast gx={x + 0.22} gy={y - 0.22} z={26} h={28} />
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
        {[8, 19, 30, 41, 52].map((z) => (
          <g key={z}>
            <Wins side="L" gx={x} gy={y} w={0.95} d={0.95} n={3} z1={z} z2={z + 7} />
            <Wins side="R" gx={x} gy={y} w={0.95} d={0.95} n={3} z1={z} z2={z + 7} />
          </g>
        ))}
      </>
    ),
  },
  customers: {
    fp: [1.1, 0.7, 34], anchorZ: 34, clearZ: 38,
    draw: (x, y) => (
      <>
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
      </>
    ),
  },
  used: {
    fp: [1.0, 0.9, 36], anchorZ: 36, clearZ: 40,
    draw: (x, y) => (
      <>
        <Box gx={x} gy={y} w={1.0} d={0.9} h={20} c={WALL} />
        <Box gx={x} gy={y} w={1.06} d={0.96} z={20} h={3} c={ROOF} />
        <Box gx={x - 0.22} gy={y - 0.15} w={0.3} d={0.26} z={23} h={9} c={GOLD} />
        <Box gx={x + 0.16} gy={y - 0.15} w={0.3} d={0.26} z={23} h={9} c={DARK} />
        <Box gx={x - 0.22} gy={y + 0.18} w={0.3} d={0.26} z={23} h={9} c={DARK} />
        <Box gx={x - 0.03} gy={y - 0.15} w={0.3} d={0.26} z={32} h={9} c={GOLD} />
        <Panel side="L" gx={x} gy={y} w={1.0} d={0.9} a={-0.16} b={0.16} z1={0} z2={14} fill={WIN_R} />
        <Wins side="R" gx={x} gy={y} w={1.0} d={0.9} n={3} z1={7} z2={14} glow={false} />
      </>
    ),
  },
};

const FALLBACK: Facility = {
  fp: [1, 1, 28], anchorZ: 28, clearZ: 32,
  draw: (x, y) => <Box gx={x} gy={y} w={1} d={1} h={28} c={WALL} />,
};

/* ---------------------------------------------------------------- */
/* Derived geometry (static — computed once)                          */
/* ---------------------------------------------------------------- */

const NODES = LOOP_NODES.filter((n) => LAYOUT[n.id]);

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

const EDGES = LOOP_EDGES.filter((e) => LAYOUT[e.from] && LAYOUT[e.to]).map((e) => {
  const key = `${e.from}>${e.to}`;
  const route: G2[] = [LAYOUT[e.from], ...(VIA[key] ?? []), LAYOUT[e.to]];
  return { ...e, key, ...screenPath(route), sign: e.label ? signAnchor(route) : null };
});

const LABEL_FS = 23, SUB_FS = 18, LABEL_LH = 28, SUB_LH = 23, PAD_X = 20, PAD_Y = 17;
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
  id: string; label: string[]; sub: string[]; depth: number;
  ax: number; ay: number; x: number; y: number; w: number; h: number;
}

const CARDS: Card[] = (() => {
  const cards = NODES.map((n) => {
    const [gx, gy] = LAYOUT[n.id];
    const f = FACILITIES[n.id] ?? FALLBACK;
    const label = wrap(n.label, LABEL_CW);
    const sub = n.sublabel ? wrap(n.sublabel, SUB_CW) : [];
    const textW = Math.max(...label.map((l) => l.length * LABEL_CW), ...sub.map((l) => l.length * SUB_CW));
    const w = Math.max(160, textW + PAD_X * 2 + 18);
    const h = PAD_Y * 2 + label.length * LABEL_LH + (sub.length ? 6 + sub.length * SUB_LH : 0) - 6;
    const [ax, ay] = iso(gx, gy, f.anchorZ * S);
    const clearY = iso(gx, gy, f.clearZ * S)[1];
    return { id: n.id, label, sub, depth: gx + gy, ax, ay, x: ax - w / 2, y: clearY - 30 - h, w, h };
  });
  // Nudge overlapping cards apart: whichever facility sits further back
  // gets lifted, which keeps every card above its own building.
  const byDepth = [...cards].sort((a, b) => a.depth - b.depth);
  const gap = 10;
  for (let iter = 0; iter < 40; iter++) {
    let moved = false;
    for (let i = 0; i < byDepth.length; i++) {
      for (let j = i + 1; j < byDepth.length; j++) {
        const a = byDepth[i], b = byDepth[j];
        const overlap = a.x < b.x + b.w + gap && b.x < a.x + a.w + gap && a.y < b.y + b.h + gap && b.y < a.y + a.h + gap;
        if (overlap) {
          a.y = b.y - a.h - gap;
          moved = true;
        }
      }
    }
    if (!moved) break;
  }
  return cards;
})();

// The visible window: every facility, label and flow road with some air
// around it. Scenery and city roads run past these edges and get cropped,
// which is what makes it read as a slice of a larger map.
const VIEW = (() => {
  const footprints = NODES.flatMap((n) => {
    const [gx, gy] = LAYOUT[n.id];
    const [w, d] = (FACILITIES[n.id] ?? FALLBACK).fp;
    const hw = (w * S) / 2, hd = (d * S) / 2;
    return [iso(gx - hw, gy + hd), iso(gx + hw, gy - hd), iso(gx + hw, gy + hd)];
  });
  const routePts = LOOP_EDGES.flatMap((e) => [LAYOUT[e.from], ...(VIA[`${e.from}>${e.to}`] ?? []), LAYOUT[e.to]])
    .filter(Boolean)
    .map(([gx, gy]) => iso(gx, gy));
  const xs = [...footprints, ...routePts].map((p) => p[0]).concat(CARDS.flatMap((c) => [c.x, c.x + c.w]));
  const ys = [...footprints, ...routePts].map((p) => p[1]);
  const minX = Math.min(...xs) - 150, maxX = Math.max(...xs) + 150;
  const minY = Math.min(...CARDS.map((c) => c.y)) - 120, maxY = Math.max(...ys) + 110;
  return { minX, minY, w: maxX - minX, h: maxY - minY };
})();

function distToSeg(p: G2, a: G2, b: G2) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy || 1)));
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
}

const ALL_ROADS: G2[][] = [
  ...CITY_ROADS,
  ...LOOP_EDGES.map((e) => [LAYOUT[e.from], ...(VIA[`${e.from}>${e.to}`] ?? []), LAYOUT[e.to]]),
];

function inView(gx: number, gy: number, pad = 60) {
  const [x, y] = iso(gx, gy);
  return x > VIEW.minX - pad && x < VIEW.minX + VIEW.w + pad && y > VIEW.minY - pad && y < VIEW.minY + VIEW.h + pad;
}

function clearOfEverything(p: G2, roadGap: number) {
  if (ALL_ROADS.some((r) => r.slice(1).some((b, i) => distToSeg(p, r[i], b) < roadGap))) return false;
  if (NODES.some((n) => {
    const [gx, gy] = LAYOUT[n.id];
    const [w, d] = (FACILITIES[n.id] ?? FALLBACK).fp;
    return Math.abs(p[0] - gx) < (w * S) / 2 + 0.9 && Math.abs(p[1] - gy) < (d * S) / 2 + 1.2;
  })) return false;
  if (SOLAR.some((s) => Math.abs(p[0] - s[0]) < 0.8 && Math.abs(p[1] - s[1]) < 0.75)) return false;
  if (TURBINES.some(([gx, gy]) => Math.hypot(p[0] - gx, p[1] - gy) < 1.1)) return false;
  return true;
}

const hash = (a: number, b: number) => {
  const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

// Trees scattered over every open patch of ground in view, thinned by a
// smooth noise field so they gather into clumps rather than a grid.
const TREES: [number, number, number][] = (() => {
  const out: [number, number, number][] = [];
  for (let gx = -14; gx <= 42; gx += 1.05) {
    for (let gy = -24; gy <= 24; gy += 1.05) {
      const p: G2 = [gx + (hash(gx, gy) - 0.5) * 0.7, gy + (hash(gy, gx) - 0.5) * 0.7];
      if (!inView(p[0], p[1])) continue;
      const clump = (Math.sin(p[0] * 0.55) + Math.cos(p[1] * 0.62) + Math.sin((p[0] + p[1]) * 0.31)) / 3;
      if (hash(p[0] * 3, p[1] * 7) > 0.2 + clump * 0.45) continue;
      if (!clearOfEverything(p, 0.85)) continue;
      out.push([r1(p[0] * 100) / 100, r1(p[1] * 100) / 100, hash(p[1], p[0]) > 0.45 ? 0 : 1]);
    }
  }
  return out;
})();

// A few people around each facility's forecourt.
const PEOPLE: [number, number, string][] = NODES.flatMap((n, i) => {
  const [gx, gy] = LAYOUT[n.id];
  const [w, d] = (FACILITIES[n.id] ?? FALLBACK).fp;
  const fx = gx + (w * S) / 2 + 0.55, fy = gy + (d * S) / 2 + 0.55;
  const spots: G2[] = [[fx, gy + 0.3], [fx + 0.35, gy + 0.65], [gx - 0.4, fy], [gx + 0.05, fy + 0.3]];
  return spots
    .filter((p, j) => (i + j) % 2 === 0 && !ALL_ROADS.some((r) => r.slice(1).some((b, k) => distToSeg(p, r[k], b) < 0.55)))
    .map((p, j) => [p[0], p[1], PEOPLE_COLORS[(i + j) % PEOPLE_COLORS.length]] as [number, number, string]);
});

const TRUCK_RUNS = TRUCKS.map((t, i) => {
  const axis: "x" | "y" = t.from[1] === t.to[1] ? "x" : "y";
  const k = axis === "x" ? 0 : 1;
  const dir: 1 | -1 = t.to[k] > t.from[k] ? 1 : -1;
  const { d, len } = screenPath([t.from, t.to]);
  return { key: `truck${i}`, axis, dir, d, dur: len / 75 };
});

type SceneObject = { depth: number; key: string; node: ReactNode };

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

  const related = (e: { from: string; to: string }) => !active || e.from === active || e.to === active;
  const labelOf = (id: string) => LOOP_NODES.find((n) => n.id === id)?.label ?? id;

  const objects: SceneObject[] = [
    ...NODES.map((n) => {
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
    ...TREES.map(([gx, gy, kind], i) => ({
      depth: gx + gy, key: `t${i}`,
      node: <Scaled gx={gx} gy={gy} k={DS}><Tree gx={gx} gy={gy} kind={kind} /></Scaled>,
    })),
    ...SOLAR.map(([gx, gy], i) => ({
      depth: gx + gy, key: `s${i}`,
      node: <Scaled gx={gx} gy={gy} k={DS}><SolarPanel gx={gx} gy={gy} /></Scaled>,
    })),
    ...TURBINES.map(([gx, gy, hub, speed], i) => ({
      depth: gx + gy, key: `w${i}`,
      node: <Scaled gx={gx} gy={gy} k={DS}><Turbine gx={gx} gy={gy} hub={hub} speed={speed} /></Scaled>,
    })),
    ...PEOPLE.map(([gx, gy, color], i) => ({
      depth: gx + gy, key: `p${i}`,
      node: <Scaled gx={gx} gy={gy} k={DS}><Person gx={gx} gy={gy} color={color} /></Scaled>,
    })),
  ].sort((a, b) => a.depth - b.depth);

  return (
    // Same technique as Description: this wrapper carries the *next*
    // section's color so it shows through the notch left by the
    // rounded-bottom corners below, instead of white.
    <div style={{ background: "linear-gradient(90deg, #e2f0ad, var(--surface-yellow) 55%, var(--surface-mineral))" }}>
      <section
        id="recycle-with-us"
        className="relative overflow-hidden rounded-b-[32px] px-[5vw] pt-20"
        style={{ background: "linear-gradient(180deg, #D7F1E6 0%, #E8F7F0 45%, #F3FBF7 100%)" }}
      >
        <style>{LOOP_CSS}</style>

        <Reveal className="relative z-10 -mb-6">
          <div className="mb-2 text-base font-bold tracking-[0.08em] uppercase" style={{ color: "#0E7A5E" }}>Partner with us</div>
          <h2 className="text-5xl font-bold" style={{ color: "#D9772B" }}>
            Close the loop
          </h2>
        </Reveal>

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
            <svg
              viewBox={`${r1(VIEW.minX)} ${r1(VIEW.minY)} ${r1(VIEW.w)} ${r1(VIEW.h)}`}
              className="block h-auto w-full min-w-[1100px]"
              style={{
                maskImage: "linear-gradient(to bottom, transparent 0, #000 7%)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent 0, #000 7%)",
              }}
              aria-hidden="true"
            >
              <defs>
                <radialGradient id="loopLotGlow">
                  <stop offset="0" stopColor="#34D399" stopOpacity="0.32" />
                  <stop offset="0.6" stopColor="#34D399" stopOpacity="0.12" />
                  <stop offset="1" stopColor="#34D399" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="loopCylMint" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#FFFFFF" />
                  <stop offset="0.55" stopColor="#D6EDE3" />
                  <stop offset="1" stopColor="#A8D3C1" />
                </linearGradient>
                <linearGradient id="loopCylEmerald" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#34A887" />
                  <stop offset="0.55" stopColor="#0E7A5E" />
                  <stop offset="1" stopColor="#075340" />
                </linearGradient>
                <linearGradient id="loopCylDark" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#5B7A72" />
                  <stop offset="0.55" stopColor="#2F4A43" />
                  <stop offset="1" stopColor="#1B302B" />
                </linearGradient>
                <radialGradient id="loopDome" cx="0.35" cy="0.3" r="0.8">
                  <stop offset="0" stopColor="#FFFFFF" />
                  <stop offset="0.6" stopColor="#BFE6D8" />
                  <stop offset="1" stopColor="#86C7B0" />
                </radialGradient>
                <radialGradient id="loopCrown" cx="0.35" cy="0.3" r="0.75">
                  <stop offset="0" stopColor="#6BD9A8" />
                  <stop offset="1" stopColor="#1E8A62" />
                </radialGradient>
                <linearGradient id="loopCone" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#4CC592" />
                  <stop offset="1" stopColor="#177A55" />
                </linearGradient>
                <linearGradient id="loopTower" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#FFFFFF" />
                  <stop offset="1" stopColor="#CFE3DA" />
                </linearGradient>
                <linearGradient id="loopSolar" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#4F8FA8" />
                  <stop offset="1" stopColor="#1E4A5C" />
                </linearGradient>
                <radialGradient id="loopGlow">
                  <stop offset="0" stopColor="#FFF1C2" stopOpacity="1" />
                  <stop offset="0.35" stopColor="#F6D365" stopOpacity="0.6" />
                  <stop offset="1" stopColor="#F6D365" stopOpacity="0" />
                </radialGradient>
                <filter id="loopCardShadow" x="-20%" y="-20%" width="140%" height="160%">
                  <feDropShadow dx="0" dy="6" stdDeviation="7" floodColor="#0A3D2E" floodOpacity="0.14" />
                </filter>
              </defs>

              {/* Facility lots, each with a soft brand glow under it */}
              {NODES.map((n) => {
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
                      fill="#F3FBF7" stroke="#CDE7DC" strokeWidth={1.5}
                    />
                  </g>
                );
              })}

              {/* Public roads (not part of the flow) */}
              {CITY_ROADS.map((r, i) => {
                const { d } = screenPath(r);
                return (
                  <g key={`city-${i}`}>
                    <path d={d} fill="none" stroke="#C3DAD0" strokeWidth={46} strokeLinecap="square" strokeLinejoin="miter" />
                    <path d={d} fill="none" stroke="#DCEBE5" strokeWidth={39} strokeLinecap="square" strokeLinejoin="miter" />
                    <path d={d} fill="none" stroke="#FFFFFF" strokeWidth={2.4} strokeDasharray="14 12" opacity={0.85} />
                  </g>
                );
              })}

              {/* Flow roads */}
              {EDGES.map((e) => (
                <g key={`road-${e.key}`} opacity={related(e) ? 1 : 0.35} style={{ transition: "opacity .3s ease" }}>
                  <path d={e.d} fill="none" stroke="#A9C9BC" strokeWidth={48} strokeLinecap="square" strokeLinejoin="miter" />
                  <path d={e.d} fill="none" stroke="#CBE0D7" strokeWidth={41} strokeLinecap="square" strokeLinejoin="miter" />
                  <path
                    d={e.d} fill="none" stroke={active && related(e) ? "#DDB73C" : "#FFFFFF"} strokeWidth={3}
                    strokeDasharray="14 12" className="loop-flow"
                  />
                </g>
              ))}

              {/* Building shadows */}
              {NODES.map((n) => {
                const [gx, gy] = LAYOUT[n.id];
                const [w, d, h] = (FACILITIES[n.id] ?? FALLBACK).fp;
                return <Shadow key={`sh-${n.id}`} gx={gx} gy={gy} w={w * S} d={d * S} h={h * S} />;
              })}

              {/* Material flowing along each road */}
              {motion &&
                EDGES.map((e) => {
                  const n = Math.max(1, Math.round(e.len / 300));
                  const dur = e.len / 80;
                  return Array.from({ length: n }, (_, k) => (
                    <g key={`p-${e.key}-${k}`} opacity={related(e) ? 1 : 0.25}>
                      <circle r={22} fill="url(#loopGlow)" />
                      <rect x={-11} y={-5.2} width={22} height={10.4} rx={5.2} fill="#F6D365" stroke="#FFF6D8" strokeWidth={1.4} />
                      <animateMotion
                        dur={`${r1(dur)}s`}
                        begin={`-${r1((k * dur) / n)}s`}
                        repeatCount="indefinite"
                        rotate="auto"
                        path={e.d}
                      />
                    </g>
                  ));
                })}

              {/* Delivery trucks */}
              {motion &&
                TRUCK_RUNS.map((t, i) => (
                  <g key={t.key} opacity={0}>
                    <g transform={`scale(${DS})`}>
                      <TruckSprite axis={t.axis} dir={t.dir} />
                    </g>
                    <animateMotion dur={`${r1(t.dur)}s`} begin={`-${r1(i * 1.7)}s`} repeatCount="indefinite" path={t.d} />
                    <animate
                      attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.92;1"
                      dur={`${r1(t.dur)}s`} begin={`-${r1(i * 1.7)}s`} repeatCount="indefinite"
                    />
                  </g>
                ))}

              {/* Buildings, trees, solar field and turbines, back to front */}
              {objects.map((o) => (
                <g key={o.key}>{o.node}</g>
              ))}

              {/* Edge labels */}
              {EDGES.filter((e) => e.sign && e.label).map((e) => {
                const lines = e.label!.split("\n");
                const [x, y] = e.sign!;
                const fs = 18, lh = 22, padX = 16, padY = 11;
                const w = Math.max(...lines.map((l) => l.length)) * fs * 0.55 + padX * 2;
                const h = lines.length * lh + padY * 2 - 3;
                const top = y - 22 - h;
                return (
                  <g key={`sign-${e.key}`} opacity={related(e) ? 1 : 0.4} style={{ transition: "opacity .3s ease" }}>
                    <ellipse cx={r1(x)} cy={r1(y)} rx={9} ry={4} fill="#0A3D2E" opacity={0.18} />
                    <line x1={r1(x)} y1={r1(y)} x2={r1(x)} y2={r1(top + h)} stroke="#0B3B2E" strokeWidth={2.2} />
                    <rect x={r1(x - w / 2)} y={r1(top)} width={r1(w)} height={r1(h)} rx={Math.min(15, h / 2)} fill="#0B3B2E" filter="url(#loopCardShadow)" />
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

              {/* Facility labels */}
              {[...CARDS].sort((a, b) => a.y - b.y).map((c) => {
                const isActive = active === c.id;
                const stemX = Math.min(Math.max(c.ax, c.x + 18), c.x + c.w - 18);
                const bottom = c.y + c.h;
                return (
                  <g
                    key={`card-${c.id}`}
                    onMouseEnter={() => setActive(c.id)}
                    onMouseLeave={() => setActive(null)}
                    opacity={active && !isActive && !EDGES.some((e) => related(e) && (e.from === c.id || e.to === c.id)) ? 0.55 : 1}
                    style={{ transition: "opacity .3s ease" }}
                  >
                    <line x1={r1(c.ax)} y1={r1(c.ay)} x2={r1(stemX)} y2={r1(bottom)} stroke="#0E7A5E" strokeWidth={2} opacity={0.55} />
                    <circle cx={r1(c.ax)} cy={r1(c.ay)} r={5} fill="#FFFFFF" stroke="#0E7A5E" strokeWidth={2.2} />
                    <rect
                      x={r1(c.x)} y={r1(c.y)} width={r1(c.w)} height={r1(c.h)} rx={16}
                      fill="#FFFFFF" stroke={isActive ? "#0E7A5E" : "#D6E9E1"} strokeWidth={isActive ? 2.4 : 1.4}
                      filter="url(#loopCardShadow)"
                    />
                    <path d={`M${r1(stemX - 9)},${r1(bottom - 0.5)} L${r1(stemX)},${r1(bottom + 9)} L${r1(stemX + 9)},${r1(bottom - 0.5)} Z`} fill="#FFFFFF" />
                    <circle cx={r1(c.x + PAD_X + 5)} cy={r1(c.y + PAD_Y + 12)} r={5} fill="#0E7A5E" />
                    <text x={r1(c.x + PAD_X + 18)} y={r1(c.y + PAD_Y + 20)} fontSize={LABEL_FS} fontWeight={600} fill="#1A2321">
                      {c.label.map((l, i) => (
                        <tspan key={i} x={r1(c.x + PAD_X + 18)} dy={i === 0 ? 0 : LABEL_LH}>
                          {l}
                        </tspan>
                      ))}
                    </text>
                    {c.sub.length > 0 && (
                      <text
                        x={r1(c.x + PAD_X + 18)}
                        y={r1(c.y + PAD_Y + 20 + c.label.length * LABEL_LH + 4)}
                        fontSize={SUB_FS} fill="#5F7A73"
                      >
                        {c.sub.map((l, i) => (
                          <tspan key={i} x={r1(c.x + PAD_X + 18)} dy={i === 0 ? 0 : SUB_LH}>
                            {l}
                          </tspan>
                        ))}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

const LOOP_CSS = `
.loop-flow { animation: loopDash 1.2s linear infinite; }
@keyframes loopDash { to { stroke-dashoffset: -26; } }
.loop-bldg { transition: transform .35s cubic-bezier(.2,.8,.2,1); cursor: default; }
.loop-bldg[data-active="true"] { transform: translateY(-6px); }
.loop-smoke circle { fill: #FFFFFF; opacity: 0; transform-box: fill-box; transform-origin: center; animation: loopSmoke 3.3s ease-out infinite; }
.loop-blink { animation: loopBlink 1.8s ease-in-out infinite; }
.loop-glow { animation: loopGlow 4s ease-in-out infinite; }
.loop-bob { transform-box: fill-box; animation: loopBob 3.2s ease-in-out infinite; }
.loop-spin { transform-box: view-box; animation: loopSpin 6s linear infinite; }
@keyframes loopSpin { to { transform: rotate(360deg); } }
@keyframes loopSmoke {
  0% { opacity: 0; transform: translate(0, 0) scale(.5); }
  15% { opacity: .85; }
  100% { opacity: 0; transform: translate(-9px, -38px) scale(1.9); }
}
@keyframes loopBlink { 0%, 100% { opacity: 1; } 50% { opacity: .2; } }
@keyframes loopGlow { 0%, 100% { opacity: 1; } 50% { opacity: .55; } }
@keyframes loopBob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
`;
