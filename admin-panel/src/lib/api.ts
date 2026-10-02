// Client for the ReBAT backend's /api/admin/* endpoints (JWT bearer auth).

export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8012").replace(/\/$/, "");
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

const STORAGE_KEY = "rebat_admin_session";

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_superuser: boolean;
  is_active: boolean;
  last_login: string | null;
  date_joined: string;
}

interface Session {
  access: string;
  refresh: string;
  user: AdminUser;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function saveSession(session: Session) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Storage blocked — the session just won't survive a reload.
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

async function parseError(res: Response) {
  const data = await res.json().catch(() => null);
  return new ApiError(data?.error ?? `Request failed (${res.status})`, res.status);
}

export async function login(username: string, password: string): Promise<Session> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/api/admin/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  } catch {
    throw new ApiError("Can't reach the backend server.", 0);
  }
  if (!res.ok) throw await parseError(res);
  const session = (await res.json()) as Session;
  saveSession(session);
  return session;
}

let refreshing: Promise<boolean> | null = null;

async function refreshSession(): Promise<boolean> {
  const session = getSession();
  if (!session) return false;
  // Several requests can 401 at once; share one refresh between them.
  refreshing ??= (async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: session.refresh }),
      });
      if (!res.ok) return false;
      saveSession((await res.json()) as Session);
      return true;
    } catch {
      return false;
    } finally {
      setTimeout(() => (refreshing = null), 0);
    }
  })();
  return refreshing;
}

function redirectToLogin() {
  clearSession();
  if (window.location.pathname !== "/login") {
    window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
  }
}

async function send(path: string, init: RequestInit, retry = true): Promise<Response> {
  const session = getSession();
  const headers = new Headers(init.headers);
  if (session) headers.set("Authorization", `Bearer ${session.access}`);
  let res: Response;
  try {
    res = await fetch(`${API_URL}/api/admin${path}`, { ...init, headers });
  } catch {
    throw new ApiError("Can't reach the backend server.", 0);
  }
  if (res.status === 401 && retry) {
    if (await refreshSession()) return send(path, init, false);
    redirectToLogin();
    throw new ApiError("Session expired. Please log in again.", 401);
  }
  if (!res.ok) throw await parseError(res);
  return res;
}

export async function api<T>(path: string, options: { method?: string; body?: unknown } = {}): Promise<T> {
  const init: RequestInit = { method: options.method ?? "GET" };
  if (options.body !== undefined) {
    init.body = JSON.stringify(options.body);
    init.headers = { "Content-Type": "application/json" };
  }
  const res = await send(path, init);
  return (await res.json()) as T;
}

export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await send("/upload/", { method: "POST", body: form });
  const data = (await res.json()) as { url: string };
  return data.url;
}

/** Downloads an authenticated file response (e.g. the enquiries CSV). */
export async function download(path: string, fallbackName: string) {
  const res = await send(path, { method: "GET" });
  const disposition = res.headers.get("Content-Disposition") ?? "";
  const name = /filename="([^"]+)"/.exec(disposition)?.[1] ?? fallbackName;
  const url = URL.createObjectURL(await res.blob());
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export function logout() {
  clearSession();
  window.location.href = "/login";
}
