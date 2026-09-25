// Server-only data access for newsroom articles — split out from
// newsroom.ts (which stays client-safe: types + display/formatting
// helpers only) because next/headers can't be imported from a module a
// Client Component also imports (see NewsroomBrowser.tsx).
import { headers } from "next/headers";
import type { NewsroomArticle } from "@/lib/newsroom";

const DJANGO_API = process.env.RMS_DJANGO_API_URL || "http://localhost:8000/api";

async function currentWebsiteHost(): Promise<string> {
  const h = await headers();
  return (h.get("x-forwarded-host") || h.get("host") || "").split(",")[0].trim();
}

function companyQuery(host: string): string {
  const params = new URLSearchParams();
  if (host) params.set("website_host", host);
  const slug = process.env.CAREERS_COMPANY_SLUG;
  if (slug) params.set("company_slug", slug);
  return params.toString();
}

/** Every currently-live article (published, or scheduled and past its
 * time), newest first. */
export async function getPublishedArticles(): Promise<NewsroomArticle[]> {
  try {
    const host = await currentWebsiteHost();
    const res = await fetch(`${DJANGO_API}/public/website-posts/?${companyQuery(host)}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    const body = await res.json();
    const posts = body?.data?.posts;
    return Array.isArray(posts) ? posts : [];
  } catch {
    return [];
  }
}

/** A single live article by slug, or null if it doesn't exist / isn't
 * live yet. */
export async function getPublishedArticle(slug: string): Promise<NewsroomArticle | null> {
  try {
    const host = await currentWebsiteHost();
    const res = await fetch(`${DJANGO_API}/public/website-posts/${encodeURIComponent(slug)}/?${companyQuery(host)}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const body = await res.json();
    return body?.data ?? null;
  } catch {
    return null;
  }
}
