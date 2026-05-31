import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { updatePassword } from "../lib/cloud/auth";
import { isSupabaseEnabled, supabase } from "../lib/supabaseClient";
import {
  MarketingShell,
  MarketingCard,
  MarketingInput,
  inputClass,
  MarketingPrimaryButton,
  MarketingError,
} from "../components/marketing/MarketingShell";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isSupabaseEnabled) {
      setChecking(false);
      return;
    }

    let cancelled = false;

    async function establishRecoverySession() {
      const hash = window.location.hash?.replace(/^#/, "") ?? "";
      if (hash.includes("access_token") || hash.includes("type=recovery")) {
        const { error: sessionError } = await supabase.auth.getSession();
        if (sessionError && !cancelled) {
          setError(sessionError.message);
        }
      }
      const { data } = await supabase.auth.getSession();
      if (!cancelled) {
        setReady(Boolean(data?.session));
        setChecking(false);
      }
    }

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (session && event === "SIGNED_IN")) {
        const hash = window.location.hash ?? "";
        if (event === "PASSWORD_RECOVERY" || hash.includes("type=recovery")) {
          setReady(true);
          setChecking(false);
        }
      }
    });

    establishRecoverySession();

    return () => {
      cancelled = true;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!isSupabaseEnabled) {
      setError("Cloud sync is not configured.");
      return;
    }
    if (!ready) {
      setError("This reset link is invalid or has expired. Request a new one.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    const res = await updatePassword(password);
    setBusy(false);
    if (!res.ok) {
      setError(res.reason || "Could not update password");
      return;
    }
    navigate("/login", { replace: true, state: { passwordUpdated: true } });
  }

  if (checking) {
    return (
      <div className="min-h-screen grid place-items-center marketing-page">
        <p className="font-display text-lg font-extrabold text-ink/60">Verifying reset link…</p>
      </div>
    );
  }

  return (
    <MarketingShell
      mascot="owl"
      badge="Almost done"
      title="Choose a new password"
      subtitle="You opened a secure link from your email. Set a password to sign in anytime."
      backTo="/login"
      backLabel="Sign in"
    >
      {!ready ? (
        <MarketingCard className="text-center space-y-3">
          <p className="font-display text-lg font-extrabold text-ink">Link expired</p>
          <p className="text-sm font-semibold text-ink/55">
            Request a fresh reset email, or sign in if you already set your password.
          </p>
          <Link
            to="/forgot-password"
            className="inline-block font-display text-sm font-extrabold text-primary hover:underline"
          >
            Send reset email
          </Link>
          <MarketingError>{error}</MarketingError>
        </MarketingCard>
      ) : (
        <MarketingCard>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <MarketingInput label="New password" hint="At least 6 characters.">
              <input
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                required
                minLength={6}
              />
            </MarketingInput>
            <MarketingInput label="Confirm password">
              <input
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={inputClass}
                required
                minLength={6}
              />
            </MarketingInput>
            <MarketingError>{error}</MarketingError>
            <MarketingPrimaryButton type="submit" disabled={busy}>
              {busy ? "Saving…" : "Save password"}
            </MarketingPrimaryButton>
          </form>
        </MarketingCard>
      )}
    </MarketingShell>
  );
}
