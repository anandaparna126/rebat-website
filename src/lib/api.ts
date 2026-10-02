import { PUBLIC_API_URL } from "@/lib/enquiry";
import { NEWSROOM_ARTICLES, type NewsroomArticle } from "@/lib/newsroom";

// Server-side content fetches for the ReBAT backend (Django, /backend).
// Page renders prefer the internal URL when the site and backend share a
// host, so they don't round-trip through the public network.
const SERVER_API_URL = (process.env.API_INTERNAL_URL ?? PUBLIC_API_URL).replace(/\/$/, "");

/** How long (seconds) a server-rendered page may serve cached backend data
 * before refetching — admin-panel edits show up on the site within this. */
export const CONTENT_REVALIDATE_SECONDS = 30;

export interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  experience: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
}

async function getJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${SERVER_API_URL}${path}`, {
      next: { revalidate: CONTENT_REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(5000),
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return (await res.json()) as T;
  } catch (err) {
    // Logged here, then rethrown so each caller picks its own fallback.
    console.error(`[api] GET ${path} failed:`, err);
    throw err;
  }
}

function sortNewestFirst(articles: NewsroomArticle[]) {
  return [...articles].sort((a, b) => b.sortDate.localeCompare(a.sortDate));
}

/** Published newsroom articles, newest first. Falls back to the articles
 * bundled with the site if the backend can't be reached, so the newsroom
 * never renders empty because of an outage. */
export async function getArticles(): Promise<NewsroomArticle[]> {
  try {
    const data = await getJson<{ results: NewsroomArticle[] }>("/api/articles/");
    return sortNewestFirst(data?.results ?? []);
  } catch {
    return sortNewestFirst(NEWSROOM_ARTICLES);
  }
}

export async function getArticle(slug: string): Promise<NewsroomArticle | null> {
  try {
    return await getJson<NewsroomArticle>(`/api/articles/${encodeURIComponent(slug)}/`);
  } catch {
    return NEWSROOM_ARTICLES.find((a) => a.slug === slug) ?? null;
  }
}

/** Open roles; an empty list (the page's existing "Pending" state) if the
 * backend can't be reached. */
export async function getJobs(): Promise<Job[]> {
  try {
    const data = await getJson<{ results: Job[] }>("/api/jobs/");
    return data?.results ?? [];
  } catch {
    return [];
  }
}
