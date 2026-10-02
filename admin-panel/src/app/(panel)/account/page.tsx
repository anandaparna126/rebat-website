"use client";

import { useState, type FormEvent } from "react";
import { api, type AdminUser } from "@/lib/api";
import { useAdminUser } from "@/components/Shell";
import { useToast } from "@/components/Toast";
import { PageHeader, Spinner } from "@/components/ui";

export default function AccountPage() {
  const { user, setUser } = useAdminUser();
  const toast = useToast();

  const [profile, setProfile] = useState({ first_name: user.first_name, last_name: user.last_name, email: user.email });
  const [savingProfile, setSavingProfile] = useState(false);

  const [pw, setPw] = useState({ current_password: "", new_password: "", confirm: "" });
  const [savingPw, setSavingPw] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);

  async function saveProfile(e: FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    try {
      setUser(await api<AdminUser>("/me/", { method: "PATCH", body: profile }));
      toast("Profile saved");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Save failed", "error");
    } finally {
      setSavingProfile(false);
    }
  }

  async function changePassword(e: FormEvent) {
    e.preventDefault();
    setPwError(null);
    if (pw.new_password !== pw.confirm) {
      setPwError("The new passwords don't match.");
      return;
    }
    setSavingPw(true);
    try {
      await api("/change-password/", {
        method: "POST",
        body: { current_password: pw.current_password, new_password: pw.new_password },
      });
      setPw({ current_password: "", new_password: "", confirm: "" });
      toast("Password changed");
    } catch (err) {
      setPwError(err instanceof Error ? err.message : "Could not change password");
    } finally {
      setSavingPw(false);
    }
  }

  return (
    <>
      <PageHeader title="My account" description={`Signed in as ${user.username}${user.is_superuser ? " (super admin)" : ""}.`} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <form onSubmit={saveProfile} className="card space-y-4 p-5">
          <h2 className="text-sm font-bold text-ink">Profile</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label" htmlFor="first">
                First name
              </label>
              <input id="first" className="field" value={profile.first_name} onChange={(e) => setProfile((p) => ({ ...p, first_name: e.target.value }))} />
            </div>
            <div>
              <label className="label" htmlFor="last">
                Last name
              </label>
              <input id="last" className="field" value={profile.last_name} onChange={(e) => setProfile((p) => ({ ...p, last_name: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input id="email" type="email" className="field" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} />
            <p className="mt-1 text-xs text-grey-600">You can sign in with this email instead of your username.</p>
          </div>
          <button type="submit" className="btn-primary" disabled={savingProfile}>
            {savingProfile && <Spinner />}
            Save profile
          </button>
        </form>

        <form onSubmit={changePassword} className="card space-y-4 p-5">
          <h2 className="text-sm font-bold text-ink">Change password</h2>
          {(
            [
              ["current_password", "Current password", "current-password"],
              ["new_password", "New password", "new-password"],
              ["confirm", "Confirm new password", "new-password"],
            ] as const
          ).map(([key, label, autoComplete]) => (
            <div key={key}>
              <label className="label" htmlFor={key}>
                {label}
              </label>
              <input
                id={key}
                type="password"
                className="field"
                value={pw[key]}
                autoComplete={autoComplete}
                onChange={(e) => setPw((p) => ({ ...p, [key]: e.target.value }))}
                required
              />
            </div>
          ))}
          {pwError && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {pwError}
            </p>
          )}
          <button type="submit" className="btn-primary" disabled={savingPw}>
            {savingPw && <Spinner />}
            Change password
          </button>
        </form>
      </div>
    </>
  );
}
