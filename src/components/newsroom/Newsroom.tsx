"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { NEWSROOM_CATEGORIES } from "@/lib/content";

const TABS = ["All", ...NEWSROOM_CATEGORIES] as const;

// Tabbed filter — cylib's "blog" section is a tab switcher (All / Industry
// news / Company news / ...) filtering one chronological feed, not a static
// row of category cards.
export function Newsroom() {
  const [active, setActive] = useState<(typeof TABS)[number]>("All");
  const visible = active === "All" ? NEWSROOM_CATEGORIES : NEWSROOM_CATEGORIES.filter((c) => c === active);

  return (
    <section id="newsroom" className="bg-surface-edit px-[5vw] py-20">
      <Reveal className="mb-6">
        <div className="mb-2 text-xs font-medium tracking-[0.08em] text-grey-600 uppercase">The ReBAT Edit</div>
        <h2 className="text-3xl font-medium text-ink">What&rsquo;s happening. What&rsquo;s next.</h2>
      </Reveal>

      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              active === tab ? "bg-brand text-white" : "bg-white text-grey-600 border border-grey-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div key={active} className="flex animate-[fadeIn_0.3s_ease] gap-4 overflow-x-auto pb-2">
        {visible.map((cat) => (
          <div
            key={cat}
            className="flex h-40 w-56 shrink-0 flex-col justify-between rounded-xl border border-dashed border-grey-200 bg-white p-5 transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="text-[11px] font-medium tracking-[0.06em] text-grey-400 uppercase">Pending</div>
            <div className="text-sm font-medium text-ink">{cat}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
