import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useAppStore } from "../store/useAppStore";
import { AGE_GROUPS } from "../data/subjects";
import { isSupabaseEnabled } from "../lib/supabaseClient";
import { GoogleSignInButton } from "../components/auth/GoogleSignInButton";
import { isGoogleOAuthEnabled } from "../lib/featureFlags";
import { validateInviteCode } from "../lib/cloud/invites";
import {
  MarketingShell,
  MarketingCard,
  MarketingInput,
  inputClass,
  MarketingPrimaryButton,
  MarketingError,
} from "../components/marketing/MarketingShell";

const ROLES = [
  { id: "kid", label: "Kid", emoji: "🧒" },
  { id: "parent", label: "Parent", emoji: "👨‍👩‍👧" },
  { id: "teacher", label: "Teacher", emoji: "🧑‍🏫" },
];

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState("kid");
  const [kidName, setKidName] = useState("");
  const [ageGroup, setAgeGroup] = useState("adventurer");
  const [email, setEmail] = useState(() => searchParams.get("email")?.trim() ?? "");
  const [inviteCode, setInviteCode] = useState(() => {
    const fromQuery = searchParams.get("code") || searchParams.get("invite");
    return fromQuery?.trim().toUpperCase() ?? "";
  });
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [parentalConsent, setParentalConsent] = useState(false);
  const signUp = useAuthStore((s) => s.signUp);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);

  const needsParentalConsent = role === "kid";

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!isSupabaseEnabled) {
      setError("Cloud sync is not configured.");
      return;
    }
    if (!acceptedTerms) {
      setError("Please accept the Terms and Privacy Policy.");
      return;
    }
    if (needsParentalConsent && !parentalConsent) {
      setError("Kids under 13 need a parent or guardian to approve this account.");
      return;
    }
    if (!email || !password || !kidName || !inviteCode.trim()) {
      setError("Fill out all fields, including your invite code.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    const inviteCheck = await validateInviteCode({ code: inviteCode, email });
    if (!inviteCheck.ok) {
      setError(inviteCheck.reason || "Invite code is invalid.");
      return;
    }
    setBusy(true);
    const res = await signUp({ email, password, kidName, ageGroup, role, inviteCode });
    setBusy(false);
    if (!res.ok) {
      setError(res.reason || "Sign up failed");
      return;
    }
    completeOnboarding({ kidName, ageGroup, role });
    if (res.session) {
      navigate("/onboarding", { replace: true, state: { freshAccount: true } });
    } else {
      navigate("/login", { replace: true, state: { fromRegister: true } });
    }
  }

  return (
    <MarketingShell
      mascot="dino"
      badge="You're invited"
      title="Create account"
      subtitle="Enter your invite code and set up your learner profile in under a minute."
      backTo="/landing"
      backLabel="Home"
      wide
    >
      <MarketingCard>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-ink/50">I am a…</p>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`rounded-xl border-2 py-2.5 text-center transition focus-ring ${
                    role === r.id
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-ink/10 bg-white"
                  }`}
                >
                  <span className="text-xl" aria-hidden>
                    {r.emoji}
                  </span>
                  <span className="mt-0.5 block font-display text-xs font-extrabold">{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          <MarketingInput label={role === "kid" ? "Your name" : "Learner name"}>
            <input
              value={kidName}
              onChange={(e) => setKidName(e.target.value)}
              placeholder="e.g. Alex"
              maxLength={20}
              className={inputClass}
              required
            />
          </MarketingInput>

          {role === "kid" && (
            <div>
              <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-ink/50">Age group</p>
              <div className="grid grid-cols-3 gap-2">
                {AGE_GROUPS.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setAgeGroup(g.id)}
                    className={`rounded-xl border-2 py-2 text-center text-xs font-bold focus-ring ${
                      ageGroup === g.id ? "border-primary bg-primary/10" : "border-ink/10 bg-white"
                    }`}
                  >
                    <span className="text-lg">{g.emoji}</span>
                    <span className="block font-display font-extrabold">{g.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <MarketingInput label="Email">
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              required
            />
          </MarketingInput>

          <MarketingInput label="Invite code" hint="From your approval email.">
            <input
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="KQ-XXXXXX"
              className={`${inputClass} uppercase`}
              required
            />
          </MarketingInput>

          <MarketingInput label="Password" hint="At least 6 characters.">
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

          <fieldset className="space-y-2 rounded-xl bg-ink/[0.03] p-3">
            <label className="flex cursor-pointer items-start gap-2 text-xs font-semibold text-ink/70">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded"
                required
              />
              <span>
                I agree to the{" "}
                <Link to="/terms" target="_blank" className="font-bold text-primary underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link to="/privacy" target="_blank" className="font-bold text-primary underline">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
            {needsParentalConsent && (
              <label className="flex cursor-pointer items-start gap-2 text-xs font-semibold text-ink/70">
                <input
                  type="checkbox"
                  checked={parentalConsent}
                  onChange={(e) => setParentalConsent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded"
                />
                <span>A parent or guardian approves this account (required under 13).</span>
              </label>
            )}
          </fieldset>

          <MarketingError>{error}</MarketingError>

          <MarketingPrimaryButton
            type="submit"
            disabled={busy || !acceptedTerms || (needsParentalConsent && !parentalConsent)}
          >
            {busy ? "Creating…" : "Create my account"}
          </MarketingPrimaryButton>

          {isGoogleOAuthEnabled && (
            <>
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-ink/10" />
                <span className="text-[10px] font-bold text-ink/40">OR</span>
                <div className="h-px flex-1 bg-ink/10" />
              </div>
              <GoogleSignInButton label="Sign in with Google" />
            </>
          )}

          <p className="text-center text-sm font-bold text-ink/50">
            Need an invite?{" "}
            <Link to="/invite-request" className="text-primary font-extrabold hover:underline">
              Request access
            </Link>
          </p>
          <p className="text-center text-sm font-bold text-ink/50">
            Have an account?{" "}
            <Link
              to={email ? `/login?email=${encodeURIComponent(email)}` : "/login"}
              className="text-primary font-extrabold hover:underline"
            >
              Sign in
            </Link>
            {" · "}
            <Link to="/forgot-password" className="text-primary font-extrabold hover:underline">
              Forgot password?
            </Link>
          </p>
        </form>
      </MarketingCard>
    </MarketingShell>
  );
}
