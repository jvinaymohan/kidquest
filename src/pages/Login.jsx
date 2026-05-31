import { useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { isSupabaseEnabled } from "../lib/supabaseClient";
import { GoogleSignInButton } from "../components/auth/GoogleSignInButton";
import { isGoogleOAuthEnabled } from "../lib/featureFlags";
import {
  MarketingShell,
  MarketingCard,
  MarketingInput,
  inputClass,
  MarketingPrimaryButton,
  MarketingError,
} from "../components/marketing/MarketingShell";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(() => searchParams.get("email")?.trim() ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const signIn = useAuthStore((s) => s.signIn);

  const redirectTo = location.state?.from || "/home";
  const passwordUpdated = location.state?.passwordUpdated;
  const fromRegister = location.state?.fromRegister;

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!isSupabaseEnabled) {
      setError("Cloud sync is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
      return;
    }
    if (!email || !password) {
      setError("Enter your email and password.");
      return;
    }
    setBusy(true);
    const res = await signIn({ email, password });
    setBusy(false);
    if (!res.ok) {
      setError(res.reason || "Sign in failed");
      return;
    }
    navigate(redirectTo, { replace: true });
  }

  return (
    <MarketingShell
      mascot="owl"
      badge="Welcome back"
      title="Sign in"
      subtitle="Pick up your quest where you left off."
      backTo="/landing"
      backLabel="Home"
    >
      <MarketingCard>
        {passwordUpdated && (
          <p className="mb-3 rounded-xl bg-success/10 px-3 py-2 text-center text-sm font-bold text-success">
            Password updated. Sign in with your new password.
          </p>
        )}
        {fromRegister && !passwordUpdated && (
          <p className="mb-3 rounded-xl bg-primary/10 px-3 py-2 text-center text-sm font-bold text-primary">
            Check your email to confirm your account, then sign in here.
          </p>
        )}
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
          <MarketingInput label="Password">
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className={inputClass}
              required
            />
          </MarketingInput>

          <MarketingError>{error}</MarketingError>

          <MarketingPrimaryButton type="submit" disabled={busy}>
            {busy ? "Signing in…" : "Sign in →"}
          </MarketingPrimaryButton>

          {isGoogleOAuthEnabled && (
            <>
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-ink/10" />
                <span className="text-[10px] font-bold text-ink/40">OR</span>
                <div className="h-px flex-1 bg-ink/10" />
              </div>
              <GoogleSignInButton />
            </>
          )}

          <p className="text-center text-sm font-bold text-ink/50">
            <Link to="/forgot-password" className="text-primary hover:underline focus-ring">
              Forgot password?
            </Link>
          </p>
          <p className="text-center text-sm font-bold text-ink/50">
            New here?{" "}
            <Link to="/register" className="text-primary font-extrabold hover:underline">
              Create account
            </Link>
          </p>
          <p className="text-center text-xs font-bold text-ink/40">
            <Link to="/admin" className="hover:text-ink/60">
              Admin sign-in
            </Link>
          </p>
        </form>
      </MarketingCard>
    </MarketingShell>
  );
}
