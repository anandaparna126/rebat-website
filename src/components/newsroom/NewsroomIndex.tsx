"use client";

import { useState } from "react";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { PartnerHero } from "@/components/partner/PartnerHero";
import { Reveal } from "@/components/ui/Reveal";
import { GetInTouch } from "@/components/cta/GetInTouch";
import { NEWSROOM_VISIBLE_CATEGORIES, NEWSROOM_HERO } from "@/lib/content";
import { CATEGORY_STYLE, getReadingTime, type NewsroomArticle } from "@/lib/newsroom";

function ArticleCard({ article, delay }: { article: NewsroomArticle; delay: number }) {
  const style = CATEGORY_STYLE[article.category] ?? CATEGORY_STYLE.Blogs;
  // A real photo card gets white text over a dark scrim regardless of the
  // category's own light/dark tone; only the no-image fallback still keys
  // off the category gradient's own contrast.
  const textClass = article.image || style.light ? "text-white" : "text-ink";
  const mutedClass = article.image || style.light ? "text-white/70" : "text-ink/60";
  return (
    <Reveal delay={delay}>
      <Link
        href={`/newsroom/${article.slug}`}
        className="group relative block h-full overflow-hidden rounded-[24px] p-7 transition-transform duration-300 ease-out hover:-translate-y-1 sm:p-8"
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
          <div className={`text-xs font-medium tracking-[0.1em] uppercase ${mutedClass}`}>{article.category}</div>
          <h3 className={`mt-3 text-xl leading-snug font-bold sm:text-2xl ${textClass}`}>{article.title}</h3>
          <p className={`mt-3 text-sm leading-relaxed ${mutedClass}`}>{article.excerpt}</p>
          <div className={`mt-6 flex items-center gap-3 text-xs ${mutedClass}`}>
            <span>{article.date}</span>
            <span aria-hidden="true">&middot;</span>
            <span>{getReadingTime(article)} min read</span>
            <span className={`ml-auto inline-flex items-center gap-1.5 text-sm font-medium transition-transform duration-300 group-hover:translate-x-1 ${textClass}`}>
              <span aria-hidden="true">&rarr;</span>
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

// The /newsroom page's interactive body. The page itself is a server
// component that fetches `articles` (newest first) from the backend.
export function NewsroomIndex({ articles }: { articles: NewsroomArticle[] }) {
  const [active, setActive] = useState<string>("All");
  const categories = ["All", ...NEWSROOM_VISIBLE_CATEGORIES];
  const sorted = articles;
  const filtered = sorted.filter((a) => active === "All" || a.category === active);

  // The newest article gets a full-width featured treatment — but only in
  // the unfiltered "All" view, where "newest" is a meaningful idea. Once a
  // single category is picked, every match just shows in the grid below.
  const featured = active === "All" ? sorted[0] : null;
  const rest = featured ? filtered.filter((a) => a.slug !== featured.slug) : filtered;
  const featuredStyle = featured ? (CATEGORY_STYLE[featured.category] ?? CATEGORY_STYLE.Blogs) : null;

  return (
    <PageShell hideNav>
      <PartnerHero
        eyebrow={NEWSROOM_HERO.eyebrow}
        headline={NEWSROOM_HERO.headline}
        image="/images/newsroom/hero.webp"
        ctaLabel="Read the latest"
        ctaHref="#newsroom-articles"
      />

      <section id="newsroom-articles" className="bg-white px-[5vw] py-20">
        <Reveal className="mb-10 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                active === cat ? "bg-brand text-white" : "border border-grey-200 bg-white text-grey-600 hover:border-grey-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </Reveal>

        {filtered.length === 0 ? (
          <Reveal key={active} className="animate-[fadeIn_0.3s_ease] rounded-2xl border border-dashed border-grey-200 bg-grey-50 p-14 text-center">
            <p className="text-sm text-grey-600">
              No {active === "All" ? "updates" : active.toLowerCase()} published yet. Check back soon.
            </p>
          </Reveal>
        ) : (
          <div key={active} className="mx-auto max-w-[1100px]">
            {featured && featuredStyle && (
              <Reveal className="mb-6">
                <Link
                  href={`/newsroom/${featured.slug}`}
                  className="group relative block overflow-hidden rounded-[28px] p-10 transition-transform duration-300 ease-out hover:-translate-y-1 sm:p-16"
                  style={featured.image ? undefined : { background: featuredStyle.gradient }}
                >
                  {featured.image && (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={featured.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                      <div
                        className="pointer-events-none absolute inset-0"
                        style={{ background: "linear-gradient(180deg, rgba(10,20,18,0.62) 0%, rgba(10,20,18,0.9) 100%)" }}
                      />
                    </>
                  )}
                  <div className="relative">
                    <div
                      className={`inline-flex items-center gap-2 text-xs font-medium tracking-[0.1em] uppercase ${
                        featured.image || featuredStyle.light ? "text-white/70" : "text-ink/60"
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: featured.image || featuredStyle.light ? "white" : "var(--brand)" }} />
                      Latest &middot; {featured.category}
                    </div>
                    <h2
                      className={`mt-4 max-w-2xl text-3xl leading-[1.15] font-bold sm:text-5xl ${
                        featured.image || featuredStyle.light ? "text-white" : "text-ink"
                      }`}
                    >
                      {featured.title}
                    </h2>
                    <p
                      className={`mt-4 max-w-xl text-base leading-relaxed ${
                        featured.image || featuredStyle.light ? "text-white/80" : "text-ink/70"
                      }`}
                    >
                      {featured.excerpt}
                    </p>
                    <div
                      className={`mt-9 flex flex-wrap items-center gap-4 text-sm ${
                        featured.image || featuredStyle.light ? "text-white/70" : "text-ink/60"
                      }`}
                    >
                      <span>{featured.date}</span>
                      <span aria-hidden="true">&middot;</span>
                      <span>{getReadingTime(featured)} min read</span>
                      <span
                        className={`inline-flex items-center gap-1.5 text-sm font-medium transition-transform duration-300 group-hover:translate-x-1 ${
                          featured.image || featuredStyle.light ? "text-white" : "text-ink"
                        }`}
                      >
                        Read article <span aria-hidden="true">&rarr;</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            )}

            {rest.length > 0 && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {rest.map((article, i) => (
                  <ArticleCard key={article.slug} article={article} delay={i * 0.05} />
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      <GetInTouch />
    </PageShell>
  );
}
