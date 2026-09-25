"use client";

import { Reveal } from "@/components/ui/Reveal";
import { LOOP_EDGES, LOOP_NODES, type LoopNode } from "@/lib/content";

const DIAGRAM_W = 1460;
const DIAGRAM_H = 320;
// Must match the node box's own w-[150px] below — connector lines (and
// their midpoint labels) anchor to this real right edge. This used to be
// a stale 70 (half of an older, narrower box width), which put the anchor
// INSIDE the box instead of at its edge — for closely-spaced nodes like
// Collection Center -> ReBAT Factory, that put the "Reverse Logistics"
// label pill right on top of the Collection Center box instead of in the
// gap between them.
const NODE_WIDTH = 150;

function nodeById(id: string): LoopNode {
  const node = LOOP_NODES.find((n) => n.id === id);
  if (!node) throw new Error(`Unknown loop node: ${id}`);
  return node;
}

export function ProcessLoop() {
  return (
    // Same technique as Description: this wrapper carries the *next*
    // section's color so it shows through the notch left by the
    // rounded-bottom corners below, instead of white. Right-hand stop
    // updated to Impact's new editorial-composition base (surface-mineral)
    // when Impact moved off its old flat surface-yellow background.
    <div style={{ background: "linear-gradient(90deg, #e2f0ad, var(--surface-yellow) 55%, var(--surface-mineral))" }}>
      <section
        id="recycle-with-us"
        className="relative overflow-hidden rounded-b-[32px] px-[5vw] py-20"
        style={{ background: "linear-gradient(90deg, #aaead2, #dff6ed)" }}
      >
        <Reveal className="mb-10">
          <div className="mb-2 text-base font-bold tracking-[0.08em] text-white uppercase">
            Partner with us
          </div>
          <h2 className="text-5xl font-bold" style={{ color: "#f2984f" }}>
            Close the loop.
          </h2>
        </Reveal>

        <div className="overflow-x-auto">
          <div className="relative" style={{ width: DIAGRAM_W, height: DIAGRAM_H + 20 }}>
            <svg
              viewBox={`0 0 ${DIAGRAM_W} ${DIAGRAM_H}`}
              width={DIAGRAM_W}
              height={DIAGRAM_H}
              className="absolute inset-0"
            >
              <defs>
                <marker id="loopArrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                  <path d="M0,0 L8,4 L0,8 Z" fill="var(--brand)" />
                </marker>
              </defs>
              {LOOP_EDGES.map((edge, i) => {
                const from = nodeById(edge.from);
                const to = nodeById(edge.to);
                const x1 = from.x + NODE_WIDTH;
                const y1 = from.y + 16;
                const x2 = to.x;
                const y2 = to.y + 16;
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="var(--brand)"
                    strokeWidth="1.5"
                    strokeDasharray="5 4"
                    markerEnd="url(#loopArrow)"
                    className="animate-[dash_1.2s_linear_infinite]"
                  />
                );
              })}
              {/* Edge labels (e.g. "Reverse Logistics", "Black Mass") — a
                  small pill at the midpoint of each labelled connection,
                  drawn in a second pass so the dashed lines never overlap
                  the text. Width is a rough per-character estimate since
                  SVG can't measure text without a live DOM. A label may
                  contain "\n" to wrap onto a second line (e.g. "Reverse
                  Logistics\nAcross the Nation") rather than widening into
                  neighbouring nodes. */}
              {LOOP_EDGES.map((edge, i) => {
                if (!edge.label) return null;
                const from = nodeById(edge.from);
                const to = nodeById(edge.to);
                const mx = (from.x + NODE_WIDTH + to.x) / 2;
                const my = (from.y + 16 + to.y + 16) / 2;
                const lines = edge.label.split("\n");
                const lineHeight = 11;
                const w = Math.max(...lines.map((line) => line.length * 5.4)) + 12;
                const h = lines.length * lineHeight + 7;
                const firstLineY = my - ((lines.length - 1) * lineHeight) / 2 + 3;
                return (
                  <g key={`label-${i}`}>
                    <rect x={mx - w / 2} y={my - h / 2} width={w} height={h} rx={Math.min(9, h / 2)} fill="var(--grey-50)" />
                    <text x={mx} y={firstLineY} textAnchor="middle" fontSize="9" fontWeight="600" fill="var(--brand-deep)">
                      {lines.map((line, li) => (
                        <tspan key={li} x={mx} dy={li === 0 ? 0 : lineHeight}>
                          {line}
                        </tspan>
                      ))}
                    </text>
                  </g>
                );
              })}
            </svg>

            {LOOP_NODES.map((node) => (
              <div
                key={node.id}
                className="absolute flex w-[150px] flex-col justify-center rounded-lg border border-grey-200 bg-grey-50 px-3 py-2"
                style={{ left: node.x, top: node.y }}
              >
                <div className="text-[11px] font-semibold text-ink">{node.label}</div>
                {node.sublabel && (
                  <div className="mt-0.5 text-[10px] leading-tight text-grey-600">{node.sublabel}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
