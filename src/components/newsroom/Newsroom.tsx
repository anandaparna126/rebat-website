"use client";

import { useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { NEWSROOM_CATEGORIES } from "@/lib/content";
import { CATEGORY_STYLE, formatArticleDate, type NewsroomArticle } from "@/lib/newsroom";

const TABS = ["All", ...NEWSROOM_CATEGORIES] as const;

// Tabbed filter — cylib's "blog" section is a tab switcher (All / Industry
// news / Company news / ...) filtering one horizontally-scrollable feed of
// the real published articles (fetched server-side in app/page.tsx), not a
// static row of empty category cards.
export function Newsroom({ articles }: { articles: NewsroomArticle[] }) {
  const [active, setActive] = useState<(typeof TABS)[number]>("All");
  const sorted = [...articles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const visible = active === "All" ? sorted : sorted.filter((a) => a.category === active);

  return (
    <section id="newsroom" className="bg-surface-edit px-[5vw] py-20">
      <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 text-xs font-medium tracking-[0.08em] text-grey-600 uppercase">The ReBAT Edit</div>
          <h2 className="text-3xl font-medium text-ink">What&rsquo;s happening. What&rsquo;s next.</h2>
        </div>
        <Link href="/newsroom" className="text-sm font-medium text-brand hover:underline">
          View all &rarr;
        </Link>
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

      {visible.length === 0 ? (
        <div key={active} className="animate-[fadeIn_0.3s_ease] rounded-xl border border-dashed border-grey-200 bg-white p-14 text-center">
          <div className="mb-2 text-[11px] font-medium tracking-[0.06em] text-grey-400 uppercase">Pending</div>
          <p className="text-sm text-grey-600">
            No {active === "All" ? "updates" : active.toLowerCase()} published yet. Check back soon.
          </p>
        </div>
      ) : (
        <div key={active} className="flex animate-[fadeIn_0.3s_ease] gap-5 overflow-x-auto pb-2">
          {visible.map((article) => {
            const style = CATEGORY_STYLE[article.category] ?? CATEGORY_STYLE.Blogs;
            return (
              <Link
                key={article.slug}
                href={`/newsroom/${article.slug}`}
                className="group flex h-[21rem] w-72 shrink-0 flex-col overflow-hidden rounded-2xl border border-grey-200 bg-white transition-transform duration-300 hover:-translate-y-1 sm:w-80"
              >
                <div className="flex h-32 shrink-0 items-end p-5" style={{ background: style.gradient }}>
                  <span className={`text-xs font-medium tracking-[0.1em] uppercase ${style.light ? "text-white/80" : "text-ink/60"}`}>
                    {article.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="text-xs text-grey-500">{formatArticleDate(article.publishedAt)}</div>
                  <h3 className="mt-2 line-clamp-2 text-base font-semibold text-ink">{article.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm text-grey-600">{article.excerpt}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-medium text-brand transition-transform duration-300 group-hover:translate-x-1">
                    Read more <span aria-hidden="true">&rarr;</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
