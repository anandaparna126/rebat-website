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

const LAYOUT: Record<string, G2> = {
  collection: [0, 1.5],
  factory: [2.8, 1.5],
  characterisation: [5, 1.5],
  recycling: [7.2, 0],
  refurb: [7.2, 3.2],
  extraction: [10, 0],
  packmaker: [10, 3.2],
  quality: [12.2, 0],
  testing: [12.2, 3.2],
  cellmaker: [14.4, 0],
  customers: [14.4, 3.2],
  used: [7.2, 5.8],
};

// Road waypoints between the two node centres, so every road runs along
// the ground grid — the return leg becomes one ring road around the site.
const VIA: Record<string, G2[]> = {
  "characterisation>recycling": [[6.1, 1.5], [6.1, 0]],
  "characterisation>refurb": [[6.1, 1.5], [6.1, 3.2]],
  "cellmaker>packmaker": [[14.4, 1.6], [10, 1.6]],
  "customers>used": [[14.4, 5.8]],
  "used>collection": [[0, 5.8]],
};

const PLATE = { x0: -1.6, x1: 15.8, y0: -1.4, y1: 6.9, t: 22 };

// Facilities are drawn at this multiple of their base footprint, scaled
// about their own ground centre so the isometric angles stay true.
const S = 1.3;

const TREES: [number, number, number][] = [
  [-1.1, -0.6, 0], [-0.3, -1.0, 1], [1.4, -0.4, 0], [2.1, -0.9, 1], [3.7, 0.1, 0],
  [4.3, -0.6, 1], [5.2, -1.0, 0], [8.6, -1.05, 0], [9.2, -1.1, 1], [11.1, -1.05, 1],
  [13.1, -1.1, 0], [15.3, 1.0, 0], [15.35, 1.8, 1], [15.3, 4.3, 1], [15.35, 6.4, 0],
  [8.5, 2.0, 1], [7.4, 1.6, 0], [11.1, 2.2, 0], [-0.8, 3.2, 1], [-0.9, 4.2, 0],
  [-0.7, 5.1, 1], [4.4, 2.8, 0], [4.7, 3.6, 1], [4.3, 4.6, 0], [0.9, 5.1, 1],
  [5.4, 5.0, 0], [10.6, 5.15, 1], [12.8, 5.2, 0], [8.6, 4.4, 0], [2.4, 6.45, 0],
  [5.5, 6.45, 1], [9.8, 6.5, 0], [12.3, 6.45, 1],
];

// Solar field in the open ground between the main line and the ring road.
const SOLAR: G2[] = [1.35, 1.95, 2.55, 3.15].flatMap((gx) => [2.8, 3.4, 4.0].map((gy) => [gx, gy] as G2));

const TURBINES: [gx: number, gy: number, hub: number, speed: number][] = [
  [9.6, 4.9, 82, 7],
  [11.8, 4.95, 72, 5.5],
  [13.9, 4.95, 78, 8],
];

// Vehicles running straight road stretches (they fade in/out at the ends,
// where they disappear into a facility).
const TRUCKS: { from: G2; to: G2 }[] = [
  { from: [0, 1.5], to: [2.8, 1.5] },
  { from: [14.4, 3.2], to: [14.4, 5.8] },
  { from: [14.4, 5.8], to: [0, 5.8] },
  { from: [0, 5.8], to: [0, 1.5] },
];

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
      return iso(mx + (alongX ? 0 : 1), my + (alongX ? 1 : 0));
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

const LABEL_FS = 16, SUB_FS = 13, LABEL_LH = 20, SUB_LH = 16, PAD_X = 14, PAD_Y = 12;
const LABEL_CW = LABEL_FS * 0.56, SUB_CW = SUB_FS * 0.53, MAX_TEXT_W = 176;

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
    const w = Math.max(116, textW + PAD_X * 2 + 12);
    const h = PAD_Y * 2 + label.length * LABEL_LH + (sub.length ? 4 + sub.length * SUB_LH : 0) - 4;
    const [ax, ay] = iso(gx, gy, f.anchorZ * S);
    const clearY = iso(gx, gy, f.clearZ * S)[1];
    return { id: n.id, label, sub, depth: gx + gy, ax, ay, x: ax - w / 2 + (f.dx ?? 0), y: clearY - 20 - h, w, h };
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

const VIEW = (() => {
  const corners = [
    iso(PLATE.x0, PLATE.y0), iso(PLATE.x1, PLATE.y0), iso(PLATE.x1, PLATE.y1), iso(PLATE.x0, PLATE.y1),
  ];
  const xs = [...corners.map((c) => c[0]), ...CARDS.flatMap((c) => [c.x, c.x + c.w])];
  const ys = [...corners.map((c) => c[1]), ...CARDS.map((c) => c.y)];
  const minX = Math.min(...xs) - 24, maxX = Math.max(...xs) + 24;
  const minY = Math.min(...ys) - 24, maxY = Math.max(...corners.map((c) => c[1])) + PLATE.t + 40;
  return { minX, minY, w: maxX - minX, h: maxY - minY };
})();

const TRUCK_RUNS = TRUCKS.map((t, i) => {
  const axis: "x" | "y" = t.from[1] === t.to[1] ? "x" : "y";
  const k = axis === "x" ? 0 : 1;
  const dir: 1 | -1 = t.to[k] > t.from[k] ? 1 : -1;
  const { d, len } = screenPath([t.from, t.to]);
  return { key: `truck${i}`, axis, dir, d, dur: len / 42 };
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
    ...TREES.map(([gx, gy, kind], i) => ({ depth: gx + gy, key: `t${i}`, node: <Tree gx={gx} gy={gy} kind={kind} /> })),
    ...SOLAR.map(([gx, gy], i) => ({ depth: gx + gy, key: `s${i}`, node: <SolarPanel gx={gx} gy={gy} /> })),
    ...TURBINES.map(([gx, gy, hub, speed], i) => ({
      depth: gx + gy,
      key: `w${i}`,
      node: <Turbine gx={gx} gy={gy} hub={hub} speed={speed} />,
    })),
  ].sort((a, b) => a.depth - b.depth);

  const P = PLATE;

  return (
    // Same technique as Description: this wrapper carries the *next*
    // section's color so it shows through the notch left by the
    // rounded-bottom corners below, instead of white.
    <div style={{ background: "linear-gradient(90deg, #e2f0ad, var(--surface-yellow) 55%, var(--surface-mineral))" }}>
      <section
        id="recycle-with-us"
        className="relative overflow-hidden rounded-b-[32px] px-[5vw] py-20"
        style={{ background: "linear-gradient(90deg, #aaead2, #dff6ed)" }}
      >
        <style>{LOOP_CSS}</style>

        <Reveal className="mb-6">
          <div className="mb-2 text-base font-bold tracking-[0.08em] text-white uppercase">Partner with us</div>
          <h2 className="text-5xl font-bold" style={{ color: "#f2984f" }}>
            Close the loop.
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
          <div className="-mx-[5vw] overflow-x-auto px-[5vw]">
            <svg
              viewBox={`${r1(VIEW.minX)} ${r1(VIEW.minY)} ${r1(VIEW.w)} ${r1(VIEW.h)}`}
              className="mx-auto block h-auto w-full max-w-[1500px] min-w-[1100px]"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="loopPlate" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#FAFEFC" />
                  <stop offset="1" stopColor="#E3F2EC" />
                </linearGradient>
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
                <filter id="loopPlateShadow" x="-10%" y="-10%" width="120%" height="140%">
                  <feGaussianBlur stdDeviation="18" />
                </filter>
              </defs>

              {/* Ground plate */}
              <polygon
                points={pts([P.x0, P.y0, -P.t - 14], [P.x1, P.y0, -P.t - 14], [P.x1, P.y1, -P.t - 14], [P.x0, P.y1, -P.t - 14])}
                fill="#0A3D2E" opacity={0.16} filter="url(#loopPlateShadow)"
              />
              <polygon points={pts([P.x0, P.y1, 0], [P.x1, P.y1, 0], [P.x1, P.y1, -P.t], [P.x0, P.y1, -P.t])} fill="#BFE2D5" />
              <polygon points={pts([P.x1, P.y0, 0], [P.x1, P.y1, 0], [P.x1, P.y1, -P.t], [P.x1, P.y0, -P.t])} fill="#9ED0BD" />
              <polygon points={pts([P.x0, P.y0, 0], [P.x1, P.y0, 0], [P.x1, P.y1, 0], [P.x0, P.y1, 0])} fill="url(#loopPlate)" />
              <g stroke="#FFFFFF" strokeWidth={1} opacity={0.7}>
                {Array.from({ length: Math.floor(P.x1 - P.x0) }, (_, i) => {
                  const gx = Math.ceil(P.x0) + i;
                  const [a, b] = [iso(gx, P.y0), iso(gx, P.y1)];
                  return <line key={`gx${i}`} x1={r1(a[0])} y1={r1(a[1])} x2={r1(b[0])} y2={r1(b[1])} />;
                })}
                {Array.from({ length: Math.floor(P.y1 - P.y0) }, (_, i) => {
                  const gy = Math.ceil(P.y0) + i;
                  const [a, b] = [iso(P.x0, gy), iso(P.x1, gy)];
                  return <line key={`gy${i}`} x1={r1(a[0])} y1={r1(a[1])} x2={r1(b[0])} y2={r1(b[1])} />;
                })}
              </g>

              {/* Building lots */}
              {NODES.map((n) => {
                const [gx, gy] = LAYOUT[n.id];
                const [bw, bd] = (FACILITIES[n.id] ?? FALLBACK).fp;
                const w = bw * S, d = bd * S, m = 0.22;
                return (
                  <polygon
                    key={`lot-${n.id}`}
                    points={pts(
                      [gx - w / 2 - m, gy - d / 2 - m, 0], [gx + w / 2 + m, gy - d / 2 - m, 0],
                      [gx + w / 2 + m, gy + d / 2 + m, 0], [gx - w / 2 - m, gy + d / 2 + m, 0],
                    )}
                    fill="#EBF6F1" stroke="#D5EAE1" strokeWidth={1}
                  />
                );
              })}

              {/* Roads */}
              {EDGES.map((e) => (
                <g key={`road-${e.key}`} opacity={related(e) ? 1 : 0.3} style={{ transition: "opacity .3s ease" }}>
                  <path d={e.d} fill="none" stroke="#B4CFC4" strokeWidth={30} strokeLinejoin="miter" />
                  <path d={e.d} fill="none" stroke="#CFE2DA" strokeWidth={25} strokeLinejoin="miter" />
                  <path
                    d={e.d} fill="none" stroke={active && related(e) ? "#DDB73C" : "#FFFFFF"} strokeWidth={2}
                    strokeDasharray="8 10" className="loop-flow"
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
                  const n = Math.max(1, Math.round(e.len / 230));
                  const dur = e.len / 46;
                  return Array.from({ length: n }, (_, k) => (
                    <g key={`p-${e.key}-${k}`} opacity={related(e) ? 1 : 0.25}>
                      <circle r={14} fill="url(#loopGlow)" />
                      <rect x={-7.5} y={-3.6} width={15} height={7.2} rx={3.6} fill="#F6D365" stroke="#FFF6D8" strokeWidth={1} />
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
                    <TruckSprite axis={t.axis} dir={t.dir} />
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
                const fs = 12.5, lh = 15, padX = 11, padY = 7;
                const w = Math.max(...lines.map((l) => l.length)) * fs * 0.55 + padX * 2;
                const h = lines.length * lh + padY * 2 - 2;
                const top = y - 14 - h;
                return (
                  <g key={`sign-${e.key}`} opacity={related(e) ? 1 : 0.4} style={{ transition: "opacity .3s ease" }}>
                    <ellipse cx={r1(x)} cy={r1(y)} rx={6} ry={3} fill="#0A3D2E" opacity={0.18} />
                    <line x1={r1(x)} y1={r1(y)} x2={r1(x)} y2={r1(top + h)} stroke="#0B3B2E" strokeWidth={1.6} />
                    <rect x={r1(x - w / 2)} y={r1(top)} width={r1(w)} height={r1(h)} rx={Math.min(11, h / 2)} fill="#0B3B2E" filter="url(#loopCardShadow)" />
                    <text x={r1(x)} y={r1(top + padY + 10.5)} textAnchor="middle" fontSize={fs} fontWeight={600} fill="#FFFFFF">
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
                    <line x1={r1(c.ax)} y1={r1(c.ay)} x2={r1(stemX)} y2={r1(bottom)} stroke="#0E7A5E" strokeWidth={1.3} opacity={0.55} />
                    <circle cx={r1(c.ax)} cy={r1(c.ay)} r={3.4} fill="#FFFFFF" stroke="#0E7A5E" strokeWidth={1.6} />
                    <rect
                      x={r1(c.x)} y={r1(c.y)} width={r1(c.w)} height={r1(c.h)} rx={12}
                      fill="#FFFFFF" stroke={isActive ? "#0E7A5E" : "#D6E9E1"} strokeWidth={isActive ? 1.6 : 1}
                      filter="url(#loopCardShadow)"
                    />
                    <path d={`M${r1(stemX - 6)},${r1(bottom - 0.5)} L${r1(stemX)},${r1(bottom + 6)} L${r1(stemX + 6)},${r1(bottom - 0.5)} Z`} fill="#FFFFFF" />
                    <circle cx={r1(c.x + PAD_X + 3.5)} cy={r1(c.y + PAD_Y + 9)} r={3.5} fill="#0E7A5E" />
                    <text x={r1(c.x + PAD_X + 13)} y={r1(c.y + PAD_Y + 14)} fontSize={LABEL_FS} fontWeight={600} fill="#1A2321">
                      {c.label.map((l, i) => (
                        <tspan key={i} x={r1(c.x + PAD_X + 13)} dy={i === 0 ? 0 : LABEL_LH}>
                          {l}
                        </tspan>
                      ))}
                    </text>
                    {c.sub.length > 0 && (
                      <text
                        x={r1(c.x + PAD_X + 13)}
                        y={r1(c.y + PAD_Y + 14 + c.label.length * LABEL_LH + 2)}
                        fontSize={SUB_FS} fill="#5F7A73"
                      >
                        {c.sub.map((l, i) => (
                          <tspan key={i} x={r1(c.x + PAD_X + 13)} dy={i === 0 ? 0 : SUB_LH}>
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
.loop-flow { animation: dash 1.1s linear infinite; }
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
