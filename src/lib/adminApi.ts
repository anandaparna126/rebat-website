import { cookies, headers } from "next/headers";
import { ADMIN_SESSION_COOKIE, isValidSessionCookie } from "@/lib/adminAuth";

const DJANGO_API = process.env.RMS_DJANGO_API_URL || "http://localhost:8000/api";

export class AdminAuthError extends Error {}

/** Confirms the caller's /admin session cookie, then returns the query
 * string (website_host / company_slug) every RMS "manage" call needs to
 * resolve which company it's acting on — shared by every /api/admin/*
 * route so each one doesn't re-derive it. Throws AdminAuthError (→ 401)
 * when the session cookie is missing or wrong. */
export async function requireAdminAndCompanyParams(): Promise<URLSearchParams> {
  const jar = await cookies();
  const session = jar.get(ADMIN_SESSION_COOKIE)?.value;
  if (!isValidSessionCookie(session)) throw new AdminAuthError();

  const h = await headers();
  const host = (h.get("x-forwarded-host") || h.get("host") || "").split(",")[0].trim();
  const slug = process.env.CAREERS_COMPANY_SLUG;
  const params = new URLSearchParams();
  if (host) params.set("website_host", host);
  if (slug) params.set("company_slug", slug);
  return params;
}

export function internalToken(): string {
  const token = process.env.RMS_INTERNAL_API_TOKEN;
  if (!token) throw new Error("RMS_INTERNAL_API_TOKEN is not configured.");
  return token;
}

export async function rmsFetch(path: string, init?: RequestInit) {
  return fetch(`${DJANGO_API}${path}`, {
    ...init,
    headers: { "X-Internal-Token": internalToken(), ...(init?.headers || {}) },
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
}
