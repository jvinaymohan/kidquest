import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mascot } from "../components/mascots/Mascot";
import { Button } from "../components/ui/Button";
import { useAuthStore } from "../store/useAuthStore";
import { useAppStore } from "../store/useAppStore";
import { AGE_GROUPS } from "../data/subjects";
import { isSupabaseEnabled } from "../lib/supabaseClient";
import { GoogleSignInButton } from "../components/auth/GoogleSignInButton";
import { isGoogleOAuthEnabled } from "../lib/featureFlags";

const ROLES = [
  { id: "kid", label: "I'm a Kid", emoji: "🧒", description: "Learn, play, earn badges." },
  { id: "parent", label: "I'm a Parent", emoji: "👨‍👩‍👧", description: "Track progress & guide kids." },
  { id: "teacher", label: "I'm a Teacher", emoji: "🧑‍🏫", description: "Create classrooms & assignments." },
];

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState("kid");
  const [kidName, setKidName] = useState("");
  const [ageGroup, setAgeGroup] = useState("adventurer");
  const [email, setEmail] = useState("");
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
      setError("Cloud sync is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
      return;
    }
    if (!acceptedTerms) {
      setError("Please accept the Terms of Use and Privacy Policy.");
      return;
    }
    if (needsParentalConsent && !parentalConsent) {
      setError("Kids under 13 need a parent or guardian to approve this account.");
      return;
    }
    if (!email || !password || !kidName) {
      setError("Fill out all fields to start.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setBusy(true);
    const res = await signUp({ email, password, kidName, ageGroup, role });
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
    <div className="min-h-screen bg-cream flex items-center justify-center px-5 py-10">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-5">
          <Mascot kind="dino" size={72} />
          <h1 className="font-display text-3xl font-extrabold mt-3">Start your adventure</h1>
          <p className="text-sm font-bold text-ink/65 mt-1">
            One free account, all subjects, every device.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="chunky-card p-5 flex flex-col gap-4"
        >
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wide text-ink/55 mb-1">
              I am…
            </div>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`p-2 rounded-chunky border-[3px] text-center text-xs font-bold focus-ring transition ${
                    role === r.id ? "bg-accent border-ink/30" : "bg-white border-ink/15"
                  }`}
                >
                  <div className="text-xl">{r.emoji}</div>
                  <div>{r.label.replace("I'm a ", "")}</div>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-ink/55 font-bold mt-1">
              {ROLES.find((r) => r.id === role)?.description}
            </p>
          </div>

          <label className="flex flex-col gap-1 text-sm font-bold">
            {role === "kid" ? "Your name" : "Child's name (or yours)"}
            <input
              value={kidName}
              onChange={(e) => setKidName(e.target.value)}
              placeholder="e.g. Alex"
              maxLength={20}
              className="px-3 py-3 rounded-chunky border-[3px] border-ink/15 font-display font-bold focus-ring text-base"
              required
            />
          </label>

          {role === "kid" && (
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wide text-ink/55 mb-1">
                Age group
              </div>
              <div className="grid grid-cols-3 gap-2">
                {AGE_GROUPS.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setAgeGroup(g.id)}
                    className={`p-2 rounded-chunky border-[3px] text-center text-xs font-bold focus-ring transition ${
                      ageGroup === g.id ? "bg-accent border-ink/30" : "bg-white border-ink/15"
                    }`}
                  >
                    <div className="text-lg">{g.emoji}</div>
                    <div>{g.label}</div>
                    <div className="text-[10px] text-ink/55">{g.ageRange}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

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
            Create a password
            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="px-3 py-3 rounded-chunky border-[3px] border-ink/15 font-display font-bold focus-ring text-base"
              required
              minLength={6}
            />
          </label>

          <fieldset className="rounded-chunky border-2 border-ink/12 p-3 flex flex-col gap-2">
            <legend className="sr-only">Legal agreements</legend>
            <label className="flex items-start gap-2 text-xs font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 shrink-0"
                required
              />
              <span>
                I agree to the{" "}
                <Link to="/terms" target="_blank" className="text-primary underline">
                  Terms of Use
                </Link>{" "}
                and{" "}
                <Link to="/privacy" target="_blank" className="text-primary underline">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
            {needsParentalConsent && (
              <label className="flex items-start gap-2 text-xs font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={parentalConsent}
                  onChange={(e) => setParentalConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 shrink-0"
                />
                <span>
                  I have permission from a parent or guardian to use KidQuest (required for kids under
                  13).
                </span>
              </label>
            )}
            {(role === "parent" || role === "teacher") && (
              <p className="text-[11px] text-ink/55 pl-6">
                As an adult account, you can manage child progress and must supervise learners you
                invite.
              </p>
            )}
          </fieldset>

          {error && (
            <p className="text-error font-bold text-sm bg-error/10 px-3 py-2 rounded-chunky">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={busy || !acceptedTerms || (needsParentalConsent && !parentalConsent)}
            fullWidth
          >
            {busy ? "Creating account…" : "Create my account"}
          </Button>

          {isGoogleOAuthEnabled && (
            <>
              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-ink/15" />
                <span className="text-[11px] font-bold text-ink/50">or</span>
                <div className="flex-1 h-px bg-ink/15" />
              </div>
              <GoogleSignInButton label="Sign up with Google" />
            </>
          )}

          <div className="text-center text-xs font-bold text-ink/55">
            Already have one?{" "}
            <Link to="/login" className="text-primary font-extrabold">
              Sign in
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
