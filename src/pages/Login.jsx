import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mascot } from "../components/mascots/Mascot";
import { Button } from "../components/ui/Button";
import { useAuthStore } from "../store/useAuthStore";
import { isSupabaseEnabled } from "../lib/supabaseClient";
import { GoogleSignInButton } from "../components/auth/GoogleSignInButton";
import { isGoogleOAuthEnabled } from "../lib/featureFlags";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const signIn = useAuthStore((s) => s.signIn);

  const redirectTo = location.state?.from || "/home";

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
    <div className="min-h-screen bg-cream flex items-center justify-center px-5 py-10">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-6">
          <Mascot kind="owl" size={72} />
          <h1 className="font-display text-3xl font-extrabold mt-3">Welcome back!</h1>
          <p className="text-sm font-bold text-ink/65 mt-1">Sign in to continue your adventure.</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="chunky-card p-5 flex flex-col gap-3"
        >
          <label className="flex flex-col gap-1 text-sm font-bold">
            Email
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="px-3 py-3 rounded-chunky border-[3px] border-ink/15 font-display font-bold focus-ring text-base"
              required
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-bold">
            Password
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="px-3 py-3 rounded-chunky border-[3px] border-ink/15 font-display font-bold focus-ring text-base"
              required
            />
          </label>

          {error && (
            <p className="text-error font-bold text-sm bg-error/10 px-3 py-2 rounded-chunky">
              {error}
            </p>
          )}

          <Button type="submit" disabled={busy} fullWidth>
            {busy ? "Signing in…" : "Sign in"}
          </Button>

          {isGoogleOAuthEnabled && (
            <>
              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-ink/15" />
                <span className="text-[11px] font-bold text-ink/50">or</span>
                <div className="flex-1 h-px bg-ink/15" />
              </div>
              <GoogleSignInButton />
            </>
          )}

          <div className="text-center text-xs font-bold text-ink/55 mt-1">
            <Link to="/forgot-password" className="text-ink/55 hover:text-primary">
              Forgot password?
            </Link>
          </div>
          <div className="text-center text-xs font-bold text-ink/55 mt-1">
            New to KidQuest?{" "}
            <Link to="/register" className="text-primary font-extrabold">
              Create an account
            </Link>
          </div>
          <div className="text-center text-xs font-bold text-ink/45 mt-1">
            <Link to="/landing" className="hover:text-ink/70">
              ← Back to landing
            </Link>
          </div>
          <div className="text-center text-[10px] font-bold text-ink/40 mt-2">
            <Link to="/admin" className="hover:text-ink/60">
              Admin sign-in
            </Link>
          </div>
          <p className="text-center text-[10px] font-bold text-ink/45 pt-1">
            <Link to="/privacy" className="underline hover:text-primary">
              Privacy
            </Link>
            {" · "}
            <Link to="/terms" className="underline hover:text-primary">
              Terms
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
