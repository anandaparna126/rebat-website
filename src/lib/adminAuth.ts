import { createHmac, timingSafeEqual } from "crypto";

// Gates /admin (src/app/admin/page.tsx) and its data routes
// (src/app/api/admin/*). A single shared login (env-configured username +
// password, see .env.local) is enough for this — one small company, one
// person checking who messaged the site — rather than building out real
// per-user accounts for a single internal tool.
const SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE_SECONDS = 12 * 60 * 60; // 12 hours

function sessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not set — add it to .env.local.");
  return secret;
}

// Deterministic from the secret (not per-login random), so any server
// instance/restart recognizes the same cookie as long as the secret in
// .env.local hasn't changed — no session store needed for a single shared login.
export function expectedSessionToken(): string {
  return createHmac("sha256", sessionSecret()).update("admin-session").digest("hex");
}

function timingSafeStringEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function checkCredentials(username: string, password: string): boolean {
  const expectedUser = process.env.ADMIN_PANEL_USERNAME || "";
  const expectedPass = process.env.ADMIN_PANEL_PASSWORD || "";
  if (!expectedUser || !expectedPass) return false;
  return timingSafeStringEqual(username || "", expectedUser) && timingSafeStringEqual(password || "", expectedPass);
}

export function isValidSessionCookie(value: string | undefined | null): boolean {
  if (!value) return false;
  try {
    return timingSafeStringEqual(value, expectedSessionToken());
  } catch {
    return false;
  }
}

export const ADMIN_SESSION_COOKIE = SESSION_COOKIE;
export const ADMIN_SESSION_MAX_AGE = SESSION_MAX_AGE_SECONDS;

// Very small in-memory throttle against login brute-forcing — resets on
// every server restart, which is fine for a single-admin internal tool;
// this isn't defending a multi-tenant system.
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 8;

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) return false;
  return entry.count >= MAX_ATTEMPTS;
}

export function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  entry.count += 1;
}

export function clearAttempts(ip: string): void {
  attempts.delete(ip);
}
