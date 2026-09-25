"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Mark } from "@/components/mark/Mark";
import { AdminShell } from "@/components/admin/AdminShell";

type ViewState = "checking" | "login" | "ready";

export function AdminPanel() {
  const [view, setView] = useState<ViewState>("checking");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/me", { cache: "no-store" });
      setView(res.ok ? "ready" : "login");
    } catch {
      setView("login");
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setLoggingIn(true);
    setLoginError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: data.get("username"), password: data.get("password") }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.error) {
        setLoginError(json?.error || "Invalid username or password.");
        return;
      }
      setView("ready");
    } catch {
      setLoginError("Could not reach the server. Please try again.");
    } finally {
      setLoggingIn(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    setView("login");
  }

  if (view === "checking") {
    return (
      <div className="flex min-h-svh items-center justify-center bg-grey-50">
        <p className="text-sm text-grey-600">Loading…</p>
      </div>
    );
  }

  if (view === "login") {
    return (
      <div className="flex min-h-svh items-center justify-center bg-grey-50 px-6">
        <div className="w-full max-w-[360px] rounded-2xl border border-grey-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex flex-col items-center text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand">
              <Mark size={20} color="white" />
            </span>
            <h1 className="mt-4 text-lg font-bold text-ink">ReBAT admin</h1>
            <p className="mt-1 text-sm text-grey-600">Sign in to manage the website.</p>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <input
              required
              name="username"
              type="text"
              autoComplete="username"
              placeholder="Username"
              className="rounded-full border border-grey-200 bg-white px-5 py-3 text-sm text-ink outline-none focus:border-brand"
            />
            <input
              required
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              className="rounded-full border border-grey-200 bg-white px-5 py-3 text-sm text-ink outline-none focus:border-brand"
            />
            {loginError && <p className="text-sm text-red-600" role="alert">{loginError}</p>}
            <button
              type="submit"
              disabled={loggingIn}
              className="mt-1 rounded-full bg-brand px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loggingIn ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <AdminShell onLogout={handleLogout} />;
}
