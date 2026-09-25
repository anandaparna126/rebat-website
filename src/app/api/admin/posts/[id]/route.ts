import { AdminAuthError, requireAdminAndCompanyParams, rmsFetch } from "@/lib/adminApi";

async function proxy(id: string, init?: RequestInit) {
  const params = await requireAdminAndCompanyParams();
  const res = await rmsFetch(`/public/website-posts/manage/${id}/?${params.toString()}`, init);
  const data = await res.json().catch(() => null);
  return { res, data };
}

function errorResponse(e: unknown, fallback: string, status: number) {
  if (e instanceof AdminAuthError) return Response.json({ error: "Unauthorized" }, { status: 401 });
  return Response.json({ error: fallback }, { status });
}

// GET/PUT/DELETE /api/admin/posts/:id — a single post, for the Newsroom
// editor in /admin. Proxies to RMS's internal-token-gated
// website_posts_admin_detail_api.
export async function GET(_request: Request, ctx: RouteContext<"/api/admin/posts/[id]">) {
  const { id } = await ctx.params;
  try {
    const { res, data } = await proxy(id);
    if (!res.ok || !data?.success) {
      return Response.json({ error: data?.error || "Could not load the post." }, { status: res.status || 502 });
    }
    return Response.json(data.data);
  } catch (e) {
    return errorResponse(e, "Could not reach the server. Please try again in a moment.", 502);
  }
}

export async function PUT(request: Request, ctx: RouteContext<"/api/admin/posts/[id]">) {
  const { id } = await ctx.params;
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  try {
    const { res, data } = await proxy(id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok || !data?.success) {
      return Response.json({ error: data?.error || "Could not save the post." }, { status: res.status || 502 });
    }
    return Response.json(data.data);
  } catch (e) {
    return errorResponse(e, "Could not reach the server. Please try again in a moment.", 502);
  }
}

export async function DELETE(_request: Request, ctx: RouteContext<"/api/admin/posts/[id]">) {
  const { id } = await ctx.params;
  try {
    const { res, data } = await proxy(id, { method: "DELETE" });
    if (!res.ok || !data?.success) {
      return Response.json({ error: data?.error || "Could not delete the post." }, { status: res.status || 502 });
    }
    return Response.json(data.data);
  } catch (e) {
    return errorResponse(e, "Could not reach the server. Please try again in a moment.", 502);
  }
}
