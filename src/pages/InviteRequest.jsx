import { useState } from "react";
import { Link } from "react-router-dom";
import { submitReferralRequest } from "../lib/cloud/invites";
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
    setSuccess(false);
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
    <MarketingShell
      mascot="robot"
      badge="Join the adventure"
      title="Request an invite"
      subtitle="KidQuest is invite-only. Tell us a bit about your family or class — we’ll review quickly."
      backTo="/landing"
      backLabel="Home"
      wide
    >
      <MarketingCard>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <MarketingInput label="Your name">
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={inputClass}
              placeholder="Parent or teacher name"
              required
            />
          </MarketingInput>
          <MarketingInput label="Email">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="Where we can reach you"
              required
            />
          </MarketingInput>
          <MarketingInput label="Why KidQuest?" hint="A few sentences is perfect.">
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              minLength={8}
              className={`${inputClass} resize-none font-medium`}
              placeholder="e.g. My 8-year-old loves geography and math games…"
              required
            />
          </MarketingInput>
          <MarketingInput label="Who referred you? (optional)">
            <input
              value={referrerName}
              onChange={(e) => setReferrerName(e.target.value)}
              className={inputClass}
              placeholder="Name"
            />
          </MarketingInput>
          <MarketingInput label="Their email (optional)">
            <input
              type="email"
              value={referrerEmail}
              onChange={(e) => setReferrerEmail(e.target.value)}
              className={inputClass}
              placeholder="email@example.com"
            />
          </MarketingInput>

          <MarketingError>{error}</MarketingError>
          <MarketingSuccess>
            {success
              ? "Request sent! If approved, you’ll get an invite code by email."
              : null}
          </MarketingSuccess>

          <MarketingPrimaryButton type="submit" disabled={busy}>
            {busy ? "Sending…" : "Submit request"}
          </MarketingPrimaryButton>

          <p className="text-center text-sm font-bold text-ink/50">
            Already have a code?{" "}
            <Link to="/register" className="text-primary font-extrabold hover:underline">
              Create account
            </Link>
          </p>
        </form>
      </MarketingCard>
    </MarketingShell>
  );
}
