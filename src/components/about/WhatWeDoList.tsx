"use client";

import { useState } from "react";
import { ABOUT_WHAT_WE_DO } from "@/lib/content";

const IMAGES: { src: string; alt: string }[] = [
  { src: "/images/battery/modules-pallet.webp", alt: "Rows of battery modules stacked on a pallet" },
  { src: "/images/plant/processing-line.webp", alt: "A row of blue processing tanks with motors and pipework inside the plant" },
  { src: "/images/products/recovered/cobalt.webp", alt: "Recovered cobalt material, close up" },
  { src: "/images/battery/pack-green-side.webp", alt: "A large green ReBAT battery pack with two carry handles" },
  { src: "/images/plant/control-panels.webp", alt: "A wall of ReBAT-branded control panels with green indicator lights" },
];

// Five capabilities as one compact selector: only the chosen one opens its
// description, and a photograph beside it follows the selection.
export function WhatWeDoList() {
  const [active, setActive] = useState(0);

  return (
    <div className="mx-auto grid max-w-[1328px] gap-10 lg:grid-cols-2 lg:gap-20">
      <div className="relative aspect-[4/3] overflow-hidden bg-grey-100 lg:order-2 lg:aspect-[4/5]">
        {IMAGES.map((img, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={img.src}
            src={img.src}
            alt={active === i ? img.alt : ""}
            aria-hidden={active !== i}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${active === i ? "opacity-100" : "opacity-0"}`}
          />
        ))}
      </div>

      <ol className="border-t border-grey-300 lg:order-1">
        {ABOUT_WHAT_WE_DO.map((item, i) => {
          const open = active === i;
          return (
            <li key={item.title} className="border-b border-grey-300">
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-expanded={open}
                className="flex w-full items-baseline gap-6 py-5 text-left"
              >
                <span className="text-sm font-medium text-grey-400 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span
                  className={`text-3xl leading-[1.1] font-medium transition-colors duration-300 sm:text-5xl ${open ? "text-ink" : "text-grey-400"}`}
                >
                  {item.title}
                </span>
              </button>
              {open && <p className="max-w-[52ch] pb-6 pl-12 text-base leading-relaxed text-grey-600 sm:pl-14">{item.description}</p>}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
