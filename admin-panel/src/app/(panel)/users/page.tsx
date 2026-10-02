"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { api, type AdminUser } from "@/lib/api";
import { timeAgo } from "@/lib/format";
import { useAdminUser } from "@/components/Shell";
import { useToast } from "@/components/Toast";
import { Drawer, ErrorState, Loading, PageHeader, Pill, Spinner, Toggle } from "@/components/ui";

function NewUserForm({ onCreated }: { onCreated: () => void }) {
  const toast = useToast();
  const [form, setForm] = useState({ username: "", email: "", first_name: "", last_name: "", password: "", is_superuser: false });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api("/users/", { method: "POST", body: form });
      toast(`Admin "${form.username}" created`);
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create user");
    } finally {
      setSaving(false);
    }
  }

  const input = (key: "username" | "email" | "first_name" | "last_name" | "password", label: string, type = "text") => (
    <div>
      <label className="label" htmlFor={`new-${key}`}>
        {label}
      </label>
      <input
        id={`new-${key}`}
        type={type}
        className="field"
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        required={key === "username" || key === "password"}
        autoComplete={key === "password" ? "new-password" : "off"}
      />
    </div>
  );

  return (
    <form onSubmit={submit} className="space-y-4">
      {input("username", "Username")}
      {input("email", "Email", "email")}
      <div className="grid grid-cols-2 gap-3">
        {input("first_name", "First name")}
        {input("last_name", "Last name")}
      </div>
      {input("password", "Password", "password")}
      <p className="text-xs text-grey-600">At least 8 characters, not too common or entirely numeric.</p>
      <Toggle
        checked={form.is_superuser}
        onChange={(v) => setForm((f) => ({ ...f, is_superuser: v }))}
        label="Super admin (can manage other admins)"
      />
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <button type="submit" className="btn-primary w-full" disabled={saving}>
        {saving && <Spinner />}
        Create admin
      </button>
    </form>
  );
}

export default function UsersPage() {
  const { user: me } = useAdminUser();
  const toast = useToast();
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const load = useCallback(() => {
    setError(null);
    api<{ results: AdminUser[] }>("/users/")
      .then((d) => setUsers(d.results))
      .catch((err) => setError(err.message));
  }, []);

  useEffect(load, [load]);

  if (!me.is_superuser) return <ErrorState message="Only a super admin can manage admin users." />;

  async function update(u: AdminUser, body: Record<string, unknown>, message: string) {
    try {
      await api(`/users/${u.id}/`, { method: "PATCH", body });
      toast(message);
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Update failed", "error");
    }
  }

  async function resetPassword(u: AdminUser) {
    const password = prompt(`New password for ${u.username}:`);
    if (!password) return;
    await update(u, { password }, `Password updated for ${u.username}`);
  }

  async function remove(u: AdminUser) {
    if (!confirm(`Remove admin "${u.username}"? They will no longer be able to sign in.`)) return;
    try {
      await api(`/users/${u.id}/`, { method: "DELETE" });
      toast("Admin removed");
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Delete failed", "error");
    }
  }

  return (
    <>
      <PageHeader
        title="Admin users"
        description="People who can sign in to this admin panel."
        actions={
          <button className="btn-primary" onClick={() => setAdding(true)}>
            + Add admin
          </button>
        }
      />

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : !users ? (
        <Loading />
      ) : (
        <div className="card divide-y divide-grey-100">
          {users.map((u) => {
            const isMe = u.id === me.id;
            return (
              <div key={u.id} className="flex flex-wrap items-center gap-4 p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 font-bold text-brand uppercase">
                  {u.username.slice(0, 1)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 font-semibold text-ink">
                    {u.username}
                    {isMe && <span className="text-xs font-normal text-grey-600">(you)</span>}
                    {u.is_superuser && <Pill on>Super admin</Pill>}
                    {!u.is_active && <Pill on={false}>Disabled</Pill>}
                  </div>
                  <div className="text-xs text-grey-600">
                    {[u.first_name && `${u.first_name} ${u.last_name}`.trim(), u.email].filter(Boolean).join(" · ") || "—"}
                    {" · "}
                    {u.last_login ? `last login ${timeAgo(u.last_login)}` : "never signed in"}
                  </div>
                </div>
                {!isMe && (
                  <div className="flex flex-wrap gap-2">
                    <button className="btn-secondary" onClick={() => resetPassword(u)}>
                      Reset password
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() =>
                        update(u, { is_superuser: !u.is_superuser }, u.is_superuser ? "Super admin removed" : "Made super admin")
                      }
                    >
                      {u.is_superuser ? "Remove super admin" : "Make super admin"}
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => update(u, { is_active: !u.is_active }, u.is_active ? "Admin disabled" : "Admin enabled")}
                    >
                      {u.is_active ? "Disable" : "Enable"}
                    </button>
                    <button className="btn-danger" onClick={() => remove(u)}>
                      Remove
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Drawer open={adding} onClose={() => setAdding(false)} title="Add admin">
        <NewUserForm
          onCreated={() => {
            setAdding(false);
            load();
          }}
        />
      </Drawer>
    </>
  );
}
