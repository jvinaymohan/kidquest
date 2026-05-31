import { useState } from "react";
import { Link } from "react-router-dom";
import { resetPasswordForEmail } from "../lib/cloud/auth";
import { isSupabaseEnabled } from "../lib/supabaseClient";
import {
  MarketingShell,
  MarketingCard,
  MarketingInput,
  inputClass,
  MarketingPrimaryButton,
  MarketingError,
  MarketingSuccess,
} from "../components/marketing/MarketingShell";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!isSupabaseEnabled) {
      setError("Cloud sync is not configured.");
      return;
    }
    if (!email) {
      setError("Enter your email.");
      return;
    }
    setBusy(true);
    const res = await resetPasswordForEmail(email);
    setBusy(false);
    if (!res.ok) {
      setError(res.reason || "Could not send reset email");
      return;
    }
    setSent(true);
  }

  return (
    <MarketingShell
      mascot="owl"
      badge="Password help"
      title="Reset password"
      subtitle="We'll email you a secure link to choose a new password."
      backTo="/login"
      backLabel="Sign in"
    >
      {sent ? (
        <MarketingCard className="text-center">
          <p className="text-3xl" aria-hidden>
            📬
          </p>
          <p className="mt-2 font-display text-lg font-extrabold text-ink">Check your inbox</p>
          <p className="mt-2 text-sm font-semibold text-ink/55">
            If an account exists for <strong>{email}</strong>, you&apos;ll get a reset link shortly.
          </p>
          <Link
            to="/login"
            className="mt-5 inline-block font-display text-sm font-extrabold text-primary hover:underline"
          >
            Back to sign in
          </Link>
        </MarketingCard>
      ) : (
        <MarketingCard>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <MarketingInput label="Email">
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className={inputClass}
                required
              />
            </MarketingInput>
            <MarketingError>{error}</MarketingError>
            <MarketingPrimaryButton type="submit" disabled={busy}>
              {busy ? "Sending…" : "Send reset link"}
            </MarketingPrimaryButton>
          </form>
        </MarketingCard>
      )}
    </MarketingShell>
  );
}
