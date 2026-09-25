import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  checkCredentials,
  clearAttempts,
  expectedSessionToken,
  isRateLimited,
  recordFailedAttempt,
} from "@/lib/adminAuth";

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  if (isRateLimited(ip)) {
    return Response.json({ error: "Too many attempts. Please wait a few minutes and try again." }, { status: 429 });
  }

  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!checkCredentials(body.username || "", body.password || "")) {
    recordFailedAttempt(ip);
    return Response.json({ error: "Invalid username or password." }, { status: 401 });
  }

  clearAttempts(ip);
  const jar = await cookies();
  jar.set(ADMIN_SESSION_COOKIE, expectedSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });
  return Response.json({ ok: true });
}
