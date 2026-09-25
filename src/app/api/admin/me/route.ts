import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, isValidSessionCookie } from "@/lib/adminAuth";

// GET /api/admin/me — just an auth check, used by AdminPanel.tsx to decide
// whether to show the login form or the dashboard shell, now that /admin
// has more than one section (Messages, Newsroom) each fetching its own data.
export async function GET() {
  const jar = await cookies();
  const session = jar.get(ADMIN_SESSION_COOKIE)?.value;
  if (!isValidSessionCookie(session)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return Response.json({ ok: true });
}
