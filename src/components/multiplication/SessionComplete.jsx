import { useState } from "react";
import { motion } from "framer-motion";
import { Share2 } from "lucide-react";
import { Button } from "../ui/Button";
import { shareAchievement } from "../../utils/shareAchievement";

export function SessionComplete({
  emoji = "🎉",
  title,
  subtitle,
  stats = [],
  primaryLabel = "Continue",
  onPrimary,
  secondaryLabel,
  onSecondary,
  shareText,
  shareTitle = "KidQuest",
}) {
  const [shareFeedback, setShareFeedback] = useState(null);

  async function handleShare() {
    if (!shareText) return;
    const result = await shareAchievement({ text: shareText, title: shareTitle });
    if (result.ok) {
      setShareFeedback(result.method === "copy" ? "Copied!" : "Shared!");
      setTimeout(() => setShareFeedback(null), 2500);
    }
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center gap-4">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="text-6xl"
        aria-hidden
      >
        {emoji}
      </motion.div>
      <h2 className="font-display text-2xl sm:text-3xl font-extrabold leading-tight">{title}</h2>
      {subtitle && <p className="text-sm font-bold text-ink/70 max-w-sm">{subtitle}</p>}
      {stats.length > 0 && (
        <ul className="grid grid-cols-2 gap-2 w-full max-w-xs">
          {stats.map(({ label, value }) => (
            <li key={label} className="chunky-card py-3 px-2">
              <div className="text-[10px] uppercase font-extrabold text-ink/50">{label}</div>
              <div className="font-display text-xl font-extrabold">{value}</div>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-col gap-2 w-full max-w-sm mt-2">
        <Button size="lg" fullWidth onClick={onPrimary}>
          {primaryLabel}
        </Button>
        {shareText && (
          <Button variant="secondary" fullWidth onClick={handleShare}>
            <Share2 size={18} aria-hidden />
            {shareFeedback ?? "Challenge a friend"}
          </Button>
        )}
        {secondaryLabel && onSecondary && (
          <Button variant="ghost" fullWidth onClick={onSecondary}>
            {secondaryLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
