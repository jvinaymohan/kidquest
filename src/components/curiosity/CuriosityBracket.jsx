import { motion } from "framer-motion";

export function CuriosityBracket({ bracket }) {
  if (!bracket?.rounds?.length) return null;
  return (
    <div className="rounded-2xl bg-white/80 p-4 ring-1 ring-ink/10">
      <h3 className="font-display font-extrabold text-sm mb-3">{bracket.title}</h3>
      <div className="flex flex-col gap-3">
        {bracket.rounds.map((round, ri) => (
          <motion.div
            key={round.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ri * 0.08 }}
          >
            <p className="text-[10px] font-extrabold uppercase tracking-wide text-ink/45 mb-1.5">
              {round.label}
            </p>
            <ul className="space-y-2">
              {round.matchups.map((m) => (
                <li
                  key={m}
                  className="rounded-xl border-2 border-dashed border-ink/15 px-3 py-2 text-xs font-bold text-ink/75"
                >
                  {m}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
