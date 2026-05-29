import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mascot } from "../components/mascots/Mascot";
import { Button } from "../components/ui/Button";
import { submitReferralRequest } from "../lib/cloud/invites";
import { isSupabaseEnabled } from "../lib/supabaseClient";

export default function InviteRequest() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [referrerName, setReferrerName] = useState("");
  const [referrerEmail, setReferrerEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!isSupabaseEnabled) {
      setError("Cloud sync is not configured yet.");
      return;
    }
    setBusy(true);
    const res = await submitReferralRequest({ fullName, email, reason, referrerName, referrerEmail });
    setBusy(false);
    if (!res.ok) {
      setError(res.reason || "Could not submit request");
      return;
    }
    setSuccess(true);
    setFullName("");
    setEmail("");
    setReason("");
    setReferrerName("");
    setReferrerEmail("");
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-5 py-10">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-5">
          <Mascot kind="robot" size={72} />
          <h1 className="font-display text-3xl font-extrabold mt-3">Request an invite</h1>
          <p className="text-sm font-bold text-ink/65 mt-1">
            KidQuest is currently invite-only. Tell us why you want in.
          </p>
        </div>

        <form onSubmit={onSubmit} className="chunky-card p-5 flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm font-bold">
            Your name
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="px-3 py-3 rounded-chunky border-[3px] border-ink/15 font-display font-bold focus-ring text-base"
              required
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-bold">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-3 py-3 rounded-chunky border-[3px] border-ink/15 font-display font-bold focus-ring text-base"
              required
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-bold">
            Why do you want to join?
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              minLength={8}
              className="px-3 py-3 rounded-chunky border-[3px] border-ink/15 font-medium focus-ring text-sm resize-none"
              placeholder="A short note about your learner/family/classroom."
              required
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-bold">
            Referrer name (optional)
            <input
              value={referrerName}
              onChange={(e) => setReferrerName(e.target.value)}
              className="px-3 py-3 rounded-chunky border-[3px] border-ink/15 font-display font-bold focus-ring text-base"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-bold">
            Referrer email (optional)
            <input
              type="email"
              value={referrerEmail}
              onChange={(e) => setReferrerEmail(e.target.value)}
              className="px-3 py-3 rounded-chunky border-[3px] border-ink/15 font-display font-bold focus-ring text-base"
            />
          </label>

          {error && <p className="text-error font-bold text-sm bg-error/10 px-3 py-2 rounded-chunky">{error}</p>}
          {success && (
            <p className="text-primary font-bold text-sm bg-primary/10 px-3 py-2 rounded-chunky">
              Request sent. If approved, an admin will share an invite code by email.
            </p>
          )}

          <Button type="submit" disabled={busy} fullWidth>
            {busy ? "Submitting…" : "Submit request"}
          </Button>

          <div className="text-center text-xs font-bold text-ink/55">
            Have an invite code?{" "}
            <Link to="/register" className="text-primary font-extrabold">
              Create account
            </Link>
          </div>
          <div className="text-center text-xs font-bold text-ink/45">
            <Link to="/landing" className="hover:text-ink/70">
              ← Back to landing
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
