"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSession, login } from "@/lib/api";
import { Mark } from "@/components/Mark";
import { Spinner } from "@/components/ui";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next");
  const destination = next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (getSession()) router.replace(destination);
  }, [router, destination]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(username.trim(), password);
      router.replace(destination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card w-full max-w-sm space-y-5 p-8">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand">
          <Mark size={24} color="white" />
        </span>
        <div>
          <h1 className="text-lg leading-tight font-bold text-ink">ReBAT Admin</h1>
          <p className="text-xs text-grey-600">Sign in to manage the website</p>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="username">
          Username or email
        </label>
        <input
          id="username"
          className="field"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoFocus
        />
      </div>
      <div>
        <label className="label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          className="field"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <button type="submit" className="btn-primary w-full py-2.5" disabled={busy}>
        {busy && <Spinner />}
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-deep px-4">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
