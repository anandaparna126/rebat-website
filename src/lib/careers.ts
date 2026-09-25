import { headers } from "next/headers";

// Live open jobs from the RMS careers portal, shown on this website only
// while RMS Admin Panel > Careers Portal has "link with your company website"
// switched on for this site's address. Fetched server-side on every request,
// so a job HR opens or closes in Recruitment shows up here immediately.
const DJANGO_API = process.env.RMS_DJANGO_API_URL || "http://localhost:8000/api";

export interface WebsiteJob {
  id: number;
  title: string;
  department: string;
  location: string;
  work_mode: string;
  job_type: string;
  experience_level: string;
  min_experience: number;
  max_experience: number;
  posted_at: string | null;
  deadline: string | null;
  apply_url: string;
}

export interface WebsiteCareers {
  linked: boolean;
  company_name?: string;
  careers_portal_url?: string;
  jobs_url?: string;
  total: number;
  jobs: WebsiteJob[];
}

const NOT_LINKED: WebsiteCareers = { linked: false, total: 0, jobs: [] };

async function fetchCareers(query: string): Promise<WebsiteCareers> {
  try {
    const res = await fetch(`${DJANGO_API}/hrms/recruitment/public/website-careers/?${query}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return NOT_LINKED;
    const body = await res.json();
    const data = body?.data;
    if (!data?.linked) return NOT_LINKED;
    return {
      linked: true,
      company_name: data.company_name,
      careers_portal_url: data.careers_portal_url,
      jobs_url: data.jobs_url,
      total: Number(data.total) || 0,
      jobs: Array.isArray(data.jobs) ? data.jobs : [],
    };
  } catch {
    return NOT_LINKED;
  }
}

export async function getWebsiteCareers(): Promise<WebsiteCareers> {
  const h = await headers();
  const host = (h.get("x-forwarded-host") || h.get("host") || "").split(",")[0].trim();
  if (host) {
    const byHost = await fetchCareers(`website_host=${encodeURIComponent(host)}`);
    if (byHost.linked) return byHost;
  }
  // Optional fallback for visits on an address that isn't the one entered
  // in the Admin Panel (e.g. http://localhost:3003 on the server itself).
  const slug = process.env.CAREERS_COMPANY_SLUG;
  return slug ? fetchCareers(`company_slug=${encodeURIComponent(slug)}`) : NOT_LINKED;
}

export function isHttpUrl(url: string | null | undefined): url is string {
  return typeof url === "string" && /^https?:\/\//i.test(url);
}
