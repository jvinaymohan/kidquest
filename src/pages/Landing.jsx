import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mascot } from "../components/mascots/Mascot";
import { GoogleSignInButton } from "../components/auth/GoogleSignInButton";
import { isGoogleOAuthEnabled } from "../lib/featureFlags";
import {
  MarketingPrimaryButton,
  MarketingSecondaryButton,
} from "../components/marketing/MarketingShell";

const LIVE_WORLDS = [
  { emoji: "🌍", name: "Geography", from: "#34d399", to: "#0d9488" },
  { emoji: "🔢", name: "Math", from: "#60a5fa", to: "#2563eb" },
  { emoji: "🪐", name: "Space", from: "#fb923c", to: "#ea580c" },
];

const PILLARS = [
  { emoji: "🎮", title: "Play to learn" },
  { emoji: "⭐", title: "Earn points & XP" },
  { emoji: "🛡️", title: "Safe for kids" },
];

export default function Landing() {
  return (
    <div className="marketing-page marketing-fit relative flex h-[100dvh] flex-col overflow-hidden">
      <div className="marketing-blob marketing-blob-a" aria-hidden />
      <div className="marketing-blob marketing-blob-b" aria-hidden />
      <div className="marketing-stars" aria-hidden />

      <div className="relative mx-auto flex h-full w-full max-w-lg flex-col items-center justify-between px-4 py-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
        <motion.section
          className="w-full shrink-0 text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <p className="marketing-badge mx-auto text-[10px]">Free learning for curious kids</p>

          <div className="relative mx-auto mt-3 flex h-24 w-24 items-center justify-center">
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ffe066] via-[#ff9f43] to-[#ff6b6b]"
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative z-10 grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full bg-white shadow-xl ring-4 ring-white">
              <Mascot kind="rocket" size={52} />
            </div>
          </div>

          <h1 className="mt-3 font-display text-[2.1rem] font-extrabold leading-[1.05] tracking-tight sm:text-[2.35rem]">
            <span className="text-ink">Kid</span>
            <span className="bg-gradient-to-r from-primary via-[#ff8f4a] to-[#3A86FF] bg-clip-text text-transparent">
              Quest
            </span>
          </h1>
          <p className="mx-auto mt-2 max-w-[20rem] text-sm font-bold leading-snug text-ink/55">
            Explore worlds, earn points & XP, and master skills — the fun way to learn.
          </p>

          <div className="mt-3 flex justify-center gap-2">
            {PILLARS.map((p) => (
              <span
                key={p.title}
                className="inline-flex items-center gap-1 rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-extrabold text-ink/70 shadow-sm ring-1 ring-white"
              >
                <span aria-hidden>{p.emoji}</span>
                {p.title}
              </span>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="w-full max-w-sm shrink-0 space-y-2.5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.4 }}
        >
          <MarketingSecondaryButton to="/invite-request">✨ Request an invite</MarketingSecondaryButton>
          <MarketingPrimaryButton as="link" to="/register">
            🚀 I have an invite code
          </MarketingPrimaryButton>
          <p className="text-center text-sm font-bold text-ink/50">
            Already in?{" "}
            <Link to="/login" className="font-extrabold text-primary hover:underline focus-ring rounded">
              Sign in
            </Link>
          </p>
          {isGoogleOAuthEnabled && (
            <div className="pt-1">
              <div className="mb-2 flex items-center gap-2">
                <div className="h-px flex-1 bg-ink/10" />
                <span className="text-[10px] font-bold uppercase text-ink/40">or</span>
                <div className="h-px flex-1 bg-ink/10" />
              </div>
              <GoogleSignInButton />
            </div>
          )}
        </motion.section>

        <motion.section
          className="w-full shrink-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-center text-xs font-bold uppercase tracking-widest text-ink/40">Live now</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {LIVE_WORLDS.map((w) => (
              <div
                key={w.name}
                className="flex flex-col items-center justify-center rounded-2xl p-2.5 text-center shadow-md ring-2 ring-white"
                style={{ background: `linear-gradient(145deg, ${w.from}, ${w.to})` }}
              >
                <span className="text-2xl" aria-hidden>
                  {w.emoji}
                </span>
                <span className="mt-0.5 font-display text-[10px] font-extrabold text-white drop-shadow-sm">
                  {w.name}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-center text-[11px] font-bold text-ink/45">
            History, music, trivia & more — coming soon after sign-in
          </p>
        </motion.section>

        <footer className="w-full shrink-0 text-center">
          <p className="text-[10px] font-bold text-ink/40">
            <Link to="/terms" className="text-primary underline">
              Terms
            </Link>
            {" · "}
            <Link to="/privacy" className="text-primary underline">
              Privacy
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
