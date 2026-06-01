import { useState } from "react";
import { Share2 } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { buildStreakShareText, shareAchievement } from "../../utils/shareAchievement";

export function ShareStreakButton({ className = "" }) {
  const kidName = useAppStore((s) => s.kidName);
  const currentStreak = useAppStore((s) => s.currentStreak);
  const [feedback, setFeedback] = useState(null);

  async function handleShare() {
    const streak = Math.max(1, currentStreak);
    const result = await shareAchievement({
      text: buildStreakShareText({ kidName, streak }),
      title: "KidQuest Streak",
    });
    if (result.method === "cancel") return;
    if (result.ok) {
      setFeedback(result.method === "copy" ? "Link copied!" : "Shared!");
    } else {
      setFeedback("Tap to try again");
    }
    setTimeout(() => setFeedback(null), 2500);
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`home-v2-share-btn focus-ring ${className}`}
    >
      <Share2 size={16} aria-hidden />
      <span className="font-display text-xs font-extrabold">
        {feedback ?? "Challenge a friend"}
      </span>
    </button>
  );
}
