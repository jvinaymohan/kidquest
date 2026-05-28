import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mascot } from "../components/mascots/Mascot";
import { Button } from "../components/ui/Button";
import { resetPasswordForEmail } from "../lib/cloud/auth";
import { isSupabaseEnabled } from "../lib/supabaseClient";

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
    <div className="min-h-screen bg-cream flex items-center justify-center px-5 py-10">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-6">
          <Mascot kind="owl" size={72} />
          <h1 className="font-display text-3xl font-extrabold mt-3">Reset password</h1>
          <p className="text-sm font-bold text-ink/65 mt-1">
            We&apos;ll email you a link to choose a new password.
          </p>
        </div>

        {sent ? (
          <div className="chunky-card p-5 text-center">
            <p className="font-bold text-success">Check your inbox!</p>
            <p className="text-sm font-bold text-ink/65 mt-2">
              If an account exists for {email}, you&apos;ll get a reset link shortly.
            </p>
            <Link to="/login" className="inline-block mt-4 text-primary font-extrabold text-sm">
              Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="chunky-card p-5 flex flex-col gap-3">
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
            {error && (
              <p className="text-error font-bold text-sm bg-error/10 px-3 py-2 rounded-chunky">{error}</p>
            )}
            <Button type="submit" disabled={busy} fullWidth>
              {busy ? "Sending…" : "Send reset link"}
            </Button>
            <div className="text-center text-xs font-bold text-ink/45">
              <Link to="/login" className="hover:text-ink/70">
                ← Back to sign in
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
