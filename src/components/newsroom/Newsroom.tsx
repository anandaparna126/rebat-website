"use client";

import { useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { NEWSROOM_VISIBLE_CATEGORIES } from "@/lib/content";
import { CATEGORY_STYLE, getReadingTime, type NewsroomArticle } from "@/lib/newsroom";

const TABS = ["All", ...NEWSROOM_VISIBLE_CATEGORIES] as const;

// Tabbed filter — cylib's "blog" section is a tab switcher (All / Industry
// news / Company news / ...) filtering one chronological feed, not a static
// row of category cards. Shows the site's real published articles (the same
// data as /newsroom); a category with nothing published yet gets one honest
// "Pending" tile instead of an invented preview.
export function Newsroom({ articles }: { articles: NewsroomArticle[] }) {
  const [active, setActive] = useState<(typeof TABS)[number]>("All");
  const visible = active === "All" ? articles : articles.filter((a) => a.category === active);

  return (
    // Pulled up underneath Recognition's rounded-bottom corner via a
    // negative top margin (Recognition stays above it in z-index) — the
    // same structural overlap technique used at every other rounded
    // section boundary on this page, instead of a manually colour-matched
    // wrapper.
    <section id="newsroom" className="relative -mt-10 bg-surface-edit px-[5vw] py-20">
      <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 text-xs font-medium tracking-[0.08em] text-grey-600 uppercase">The ReBAT Edit</div>
          <h2 className="text-3xl font-medium text-ink">Future is already in motion.</h2>
        </div>
        <Link href="/newsroom" className="group hidden shrink-0 items-center gap-1.5 text-sm font-medium text-brand sm:flex">
          Visit the newsroom
          <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
            &rarr;
          </span>
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
        <div key={active} className="w-fit animate-[fadeIn_0.3s_ease] rounded-2xl border border-dashed border-grey-300 bg-white px-8 py-10 text-center">
          <p className="text-sm text-grey-600">No {active.toLowerCase()} published yet.</p>
        </div>
      ) : (
        <div key={active} className="flex animate-[fadeIn_0.3s_ease] gap-4 overflow-x-auto pb-2">
          {visible.map((article) => {
            const style = CATEGORY_STYLE[article.category] ?? CATEGORY_STYLE.Blogs;
            const textClass = article.image || style.light ? "text-white" : "text-ink";
            const mutedClass = article.image || style.light ? "text-white/70" : "text-ink/60";
            return (
              <Link
                key={article.slug}
                href={`/newsroom/${article.slug}`}
                className="group relative flex h-56 w-72 shrink-0 flex-col justify-between overflow-hidden rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1"
                style={article.image ? undefined : { background: style.gradient }}
              >
                {article.image && (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={article.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                    <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,20,18,0.6) 0%, rgba(10,20,18,0.88) 100%)" }} />
                  </>
                )}
                <div className="relative">
                  <div className={`text-[11px] font-medium tracking-[0.08em] uppercase ${mutedClass}`}>{article.category}</div>
                  <h3 className={`mt-2 line-clamp-3 text-base leading-snug font-bold ${textClass}`}>{article.title}</h3>
                </div>
                <div className={`relative flex items-center gap-2.5 text-xs ${mutedClass}`}>
                  <span>{article.date}</span>
                  <span aria-hidden="true">&middot;</span>
                  <span>{getReadingTime(article)} min read</span>
                  <span className={`ml-auto shrink-0 transition-transform duration-300 group-hover:translate-x-1 ${textClass}`} aria-hidden="true">
                    &rarr;
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <Link href="/newsroom" className="group mt-6 flex w-fit items-center gap-1.5 text-sm font-medium text-brand sm:hidden">
        Visit the newsroom
        <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
          &rarr;
        </span>
      </Link>
    </section>
  );
}
