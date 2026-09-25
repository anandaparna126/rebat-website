import { AdminAuthError, requireAdminAndCompanyParams, rmsFetch } from "@/lib/adminApi";

// GET /api/admin/posts — list every post (draft/scheduled/published) for
// the Newsroom section of /admin. POST creates a new one. Both proxy to
// RMS's internal-token-gated website_posts_admin_* endpoints; the token
// and RMS host stay server-side. See src/components/admin/NewsroomPanel.tsx.
export async function GET() {
  let params: URLSearchParams;
  try {
    params = await requireAdminAndCompanyParams();
  } catch (e) {
    if (e instanceof AdminAuthError) return Response.json({ error: "Unauthorized" }, { status: 401 });
    throw e;
  }

  try {
    const res = await rmsFetch(`/public/website-posts/manage/?${params.toString()}`);
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.success) {
      return Response.json({ error: data?.error || "Could not load posts." }, { status: res.status || 502 });
    }
    return Response.json(data.data);
  } catch {
    return Response.json({ error: "Could not reach the server. Please try again in a moment." }, { status: 502 });
  }
}

export async function POST(request: Request) {
  let params: URLSearchParams;
  try {
    params = await requireAdminAndCompanyParams();
  } catch (e) {
    if (e instanceof AdminAuthError) return Response.json({ error: "Unauthorized" }, { status: 401 });
    throw e;
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const res = await rmsFetch(`/public/website-posts/manage/create/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...body,
        website_host: params.get("website_host"),
        company_slug: params.get("company_slug"),
      }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.success) {
      return Response.json({ error: data?.error || "Could not create post." }, { status: res.status || 502 });
    }
    return Response.json(data.data);
  } catch {
    return Response.json({ error: "Could not reach the server. Please try again in a moment." }, { status: 502 });
  }
}
