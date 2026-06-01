import { motion } from "framer-motion";
import { Mascot } from "../mascots/Mascot";

export function PlacementPrompt({ open, copy, onJump, onEasy, onDismiss }) {
  if (!open || !copy) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 pb-24 sm:items-center">
      <button type="button" className="absolute inset-0 bg-black/55" aria-label="Close" onClick={onDismiss} />
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative w-full max-w-sm rounded-3xl bg-[#1a1060] p-5 text-center shadow-2xl ring-2 ring-white/20"
      >
        <div className="mx-auto grid w-fit place-items-center">
          <Mascot kind="robot" size={72} animate />
        </div>
        <h2 className="mt-3 font-display text-xl font-extrabold text-white">{copy.title}</h2>
        <p className="mt-2 text-sm font-semibold text-white/70">{copy.body}</p>
        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            onClick={onJump}
            className="w-full rounded-2xl bg-gradient-to-r from-[#ff6b6b] to-[#ffd700] py-3 font-display font-extrabold text-white focus-ring"
          >
            {copy.jumpLabel}
          </button>
          <button
            type="button"
            onClick={onEasy}
            className="w-full rounded-2xl bg-white/10 py-3 font-display font-extrabold text-white/90 focus-ring"
          >
            {copy.easyLabel}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export function DowngradePrompt({ open, copy, onAccept, onDismiss }) {
  if (!open || !copy) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 pb-24 sm:items-center">
      <button type="button" className="absolute inset-0 bg-black/55" aria-label="Close" onClick={onDismiss} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-sm rounded-3xl bg-white p-5 text-center shadow-2xl ring-2 ring-primary/20"
      >
        <p className="text-4xl" aria-hidden>
          🌟
        </p>
        <h2 className="mt-2 font-display text-xl font-extrabold text-ink">{copy.title}</h2>
        <p className="mt-2 text-sm font-semibold text-ink/65">{copy.body}</p>
        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            onClick={onAccept}
            className="w-full rounded-2xl bg-primary py-3 font-display font-extrabold text-white focus-ring"
          >
            {copy.actionLabel}
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="w-full rounded-2xl py-2 font-display font-extrabold text-ink/50 focus-ring"
          >
            Keep trying here
          </button>
        </div>
      </motion.div>
    </div>
  );
}
