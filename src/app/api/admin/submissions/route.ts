import { cookies, headers } from "next/headers";
import { ADMIN_SESSION_COOKIE, isValidSessionCookie } from "@/lib/adminAuth";

const DJANGO_API = process.env.RMS_DJANGO_API_URL || "http://localhost:8000/api";

// GET /api/admin/submissions — this site's own /admin panel (see
// src/app/admin/page.tsx) reads the "Contact us" / enquiry submissions
// that have come in through this website via this route. It forwards to
// RMS's internal-only website_contact_list_api using a shared server-side
// token (RMS_INTERNAL_API_TOKEN) — that token, and the RMS host itself,
// never reach the browser.
export async function GET() {
  const jar = await cookies();
  const session = jar.get(ADMIN_SESSION_COOKIE)?.value;
  if (!isValidSessionCookie(session)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.RMS_INTERNAL_API_TOKEN;
  if (!token) {
    return Response.json({ error: "RMS_INTERNAL_API_TOKEN is not configured." }, { status: 500 });
  }

  const h = await headers();
  const host = (h.get("x-forwarded-host") || h.get("host") || "").split(",")[0].trim();
  const slug = process.env.CAREERS_COMPANY_SLUG;

  const params = new URLSearchParams();
  if (host) params.set("website_host", host);
  if (slug) params.set("company_slug", slug);

  try {
    const res = await fetch(`${DJANGO_API}/public/website-contact/list/?${params.toString()}`, {
      headers: { "X-Internal-Token": token },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.success) {
      return Response.json({ error: data?.error || "Could not load submissions." }, { status: res.status || 502 });
    }
    return Response.json(data.data);
  } catch {
    return Response.json({ error: "Could not reach the server. Please try again in a moment." }, { status: 502 });
  }
}
