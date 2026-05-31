import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mascot } from "../components/mascots/Mascot";
import { GoogleSignInButton } from "../components/auth/GoogleSignInButton";
import { isGoogleOAuthEnabled } from "../lib/featureFlags";
import {
  MarketingPrimaryButton,
  MarketingSecondaryButton,
} from "../components/marketing/MarketingShell";

const WORLDS = [
  { emoji: "🌍", name: "Geography", from: "#34d399", to: "#0d9488" },
  { emoji: "🔢", name: "Math", from: "#60a5fa", to: "#2563eb" },
  { emoji: "🪐", name: "Space", from: "#fb923c", to: "#ea580c" },
  { emoji: "📜", name: "History", from: "#fbbf24", to: "#d97706" },
  { emoji: "🎵", name: "Music", from: "#c084fc", to: "#7c3aed" },
  { emoji: "💡", name: "Knowledge", from: "#a3e635", to: "#65a30d" },
];

const PILLARS = [
  { emoji: "🎮", title: "Learn by playing", desc: "Short quests kids actually finish." },
  { emoji: "👨‍👩‍👧", title: "Parents stay in the loop", desc: "Progress, streaks, and goals." },
  { emoji: "🛡️", title: "Safe & ad-free", desc: "Built for families and classrooms." },
];

export default function Landing() {
  return (
    <div className="marketing-page relative min-h-screen overflow-x-hidden">
      <div className="marketing-blob marketing-blob-a" aria-hidden />
      <div className="marketing-blob marketing-blob-b" aria-hidden />
      <div className="marketing-stars" aria-hidden />

      <div className="relative mx-auto flex w-full max-w-lg flex-col items-center px-4 pb-10 pt-8">
        {/* Hero */}
        <motion.section
          className="w-full text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="marketing-badge mx-auto">Free learning for curious kids</p>

          <div className="relative mx-auto mt-6 flex h-32 w-32 items-center justify-center">
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ffe066] via-[#ff9f43] to-[#ff6b6b]"
              animate={{ scale: [1, 1.05, 1], rotate: [0, 3, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative z-10 grid h-24 w-24 place-items-center rounded-full bg-white shadow-xl ring-[5px] ring-white">
              <Mascot kind="rocket" size={64} />
            </div>
          </div>

          <h1 className="mt-6 font-display text-[2.5rem] font-extrabold leading-[1.05] tracking-tight sm:text-[2.85rem]">
            <span className="text-ink">Kid</span>
            <span className="bg-gradient-to-r from-primary via-[#ff8f4a] to-[#3A86FF] bg-clip-text text-transparent">
              Quest
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-[22rem] text-base font-bold leading-snug text-ink/55">
            Explore worlds, earn XP, and master skills — the fun way to learn at home or school.
          </p>
        </motion.section>

        {/* CTAs — centered, simple */}
        <motion.section
          className="mt-8 w-full max-w-sm space-y-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.45 }}
        >
          <MarketingSecondaryButton to="/invite-request">
            ✨ Request an invite
          </MarketingSecondaryButton>
          <MarketingPrimaryButton as="link" to="/register">
            🚀 I have an invite code
          </MarketingPrimaryButton>
          <p className="text-center text-sm font-bold text-ink/50">
            Already in?{" "}
            <Link to="/login" className="text-primary font-extrabold hover:underline focus-ring rounded">
              Sign in
            </Link>
          </p>
          {isGoogleOAuthEnabled && (
            <div className="pt-2">
              <div className="mb-3 flex items-center gap-3">
                <div className="h-px flex-1 bg-ink/10" />
                <span className="text-[10px] font-bold uppercase tracking-wide text-ink/40">or</span>
                <div className="h-px flex-1 bg-ink/10" />
              </div>
              <GoogleSignInButton />
            </div>
          )}
        </motion.section>

        {/* Why KidQuest — 3 simple pillars */}
        <motion.section
          className="mt-10 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <h2 className="text-center font-display text-lg font-extrabold text-ink">Why families love it</h2>
          <div className="mt-4 space-y-3">
            {PILLARS.map((p) => (
              <div key={p.title} className="marketing-card flex items-start gap-3 py-4">
                <span className="text-2xl" aria-hidden>
                  {p.emoji}
                </span>
                <div className="text-left">
                  <p className="font-display text-sm font-extrabold text-ink">{p.title}</p>
                  <p className="text-xs font-semibold text-ink/55">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Worlds preview */}
        <motion.section
          className="mt-10 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <h2 className="text-center font-display text-lg font-extrabold text-ink">Adventures waiting for you</h2>
          <p className="mt-1 text-center text-xs font-bold uppercase tracking-widest text-ink/40">
            6 subjects · one app
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2.5">
            {WORLDS.map((w) => (
              <div
                key={w.name}
                className="flex flex-col items-center justify-center rounded-2xl p-3 text-center shadow-md ring-2 ring-white"
                style={{ background: `linear-gradient(145deg, ${w.from}, ${w.to})` }}
              >
                <span className="text-2xl" aria-hidden>
                  {w.emoji}
                </span>
                <span className="mt-1 font-display text-[11px] font-extrabold text-white drop-shadow-sm">
                  {w.name}
                </span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Mascot friends */}
        <motion.div
          className="mt-8 flex justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {["owl", "robot", "dino", "cat", "panda"].map((kind) => (
            <div
              key={kind}
              className="grid h-11 w-11 place-items-center rounded-full bg-white shadow-md ring-2 ring-white"
            >
              <Mascot kind={kind} size={28} animate={false} />
            </div>
          ))}
        </motion.div>

        <footer className="mt-10 text-center">
          <p className="text-[11px] font-bold text-ink/40">
            By continuing you agree to our{" "}
            <Link to="/terms" className="text-primary underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-primary underline">
              Privacy
            </Link>
            .
          </p>
          <p className="mt-3 text-[11px] font-semibold text-ink/35">
            Invite-only beta · Knowledge should be free
          </p>
        </footer>
      </div>
    </div>
  );
}
