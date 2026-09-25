// Newsroom articles now live in RMS (rms_app.models.WebsitePost), written
// and published from this site's own /admin panel (Newsroom section) —
// see src/components/admin/NewsroomPanel.tsx and
// rms_app/views/website_posts_api.py. This file only keeps the shared
// shape/formatting helpers; src/app/newsroom/page.tsx and
// src/app/newsroom/[slug]/page.tsx fetch the actual articles server-side.
//
// The five articles that used to be hardcoded here (migrated from the
// live rebat.in/blogs) were imported as real WebsitePost rows — see
// git history for the original static array — so nothing was lost, they
// just moved from a source file to the database, same as every other
// piece of this site's content that became admin-editable.
//
// Server-side data fetching (getPublishedArticles/getPublishedArticle)
// lives in newsroomApi.ts instead of here, since that needs next/headers
// and this file is imported by client components (NewsroomBrowser.tsx)
// too — see that file's own header comment.

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] }
  | { type: "faq"; items: { q: string; a: string }[] };

export interface NewsroomArticle {
  slug: string;
  title: string;
  author: string;
  category: string;
  excerpt: string;
  body: ArticleBlock[];
  /** ISO datetime — when the post went (or will effectively have gone)
   * live. Used for both display and sorting. */
  publishedAt: string;
}

// rebat.in's own blog images are broken site-wide (every asset path on
// the live site, including their logo, returns a server error rather
// than an image, confirmed via direct HTTP checks). Rather than invent
// stand-in photography, each category gets a real colour treatment
// instead, pulled from the same homepage Impact-panel palette already
// reused for the enquiry modals and the About page's "Our Approach"
// panels — one consistent, honest system instead of a fresh one per
// section.
export const CATEGORY_STYLE: Record<string, { gradient: string; light: boolean }> = {
  "Company Updates": { gradient: "linear-gradient(150deg, #00674F, #00432F)", light: true },
  Announcements: { gradient: "linear-gradient(150deg, #DDB73C, #B8912A)", light: false },
  "Industry News": { gradient: "linear-gradient(150deg, #376F63, #2A5951)", light: true },
  "Milestones & Achievements": { gradient: "linear-gradient(150deg, #00A37D, #00745A)", light: true },
  "Events & Activities": { gradient: "linear-gradient(150deg, #DDD5C4, #EAE4D6)", light: false },
  "New Developments": { gradient: "linear-gradient(150deg, #B9C8C5, #C9D5D2)", light: false },
  Blogs: { gradient: "linear-gradient(150deg, #343A38, #242826)", light: true },
};

const WORDS_PER_MINUTE = 200;

function blockWordCount(block: ArticleBlock): number {
  const count = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
  if (block.type === "p" || block.type === "h2") return count(block.text);
  if (block.type === "list") return block.items.reduce((sum, item) => sum + count(item), 0);
  return block.items.reduce((sum, qa) => sum + count(qa.q) + count(qa.a), 0);
}

/** Real reading time, derived from the article's own word count, not a
 * fabricated number. */
export function getReadingTime(article: { body: ArticleBlock[] }): number {
  const words = article.body.reduce((sum, block) => sum + blockWordCount(block), 0);
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  day: "2-digit",
  month: "short",
  year: "numeric",
});

/** "2026-07-06T00:00:00+05:30" -> "06 Jul, 2026", matching the original
 * hand-written article dates' own formatting. */
export function formatArticleDate(iso: string): string {
  const parts = dateFormatter.formatToParts(new Date(iso));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("day")} ${get("month")}, ${get("year")}`;
}

