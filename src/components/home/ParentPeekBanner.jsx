import { useState } from "react";
import { Link } from "react-router-dom";
import { Share2 } from "lucide-react";
import { buildInviteUrl, shareAchievement } from "../../utils/shareAchievement";

/** Slim parent-facing strip — does not crowd the kid hub. */
export function ParentPeekBanner({ kidName }) {
  const [shareMsg, setShareMsg] = useState(null);

  async function handleShare() {
    const text = `${kidName || "My kid"} loves learning on KidQuest — curious worlds, streaks, and zero ads. Want an invite?`;
    const result = await shareAchievement({ text, url: buildInviteUrl("parent-share") });
    if (result.ok && result.method === "copy") {
      setShareMsg("Link copied!");
      setTimeout(() => setShareMsg(null), 2500);
    }
  }

  return (
    <section className="home-v2-parent-peek" aria-label="For parents">
      <Link to="/curiosity" className="home-v2-parent-teaser focus-ring">
        <span className="text-xl" aria-hidden>
          🔭
        </span>
        <span className="min-w-0 flex-1 text-left">
          <span className="block font-display text-xs font-extrabold text-white">
            Why KidQuest?
          </span>
          <span className="block text-[10px] font-bold text-white/50">
            Peek at today&apos;s curiosity spark →
          </span>
        </span>
      </Link>
      <button
        type="button"
        onClick={handleShare}
        className="home-v2-parent-share focus-ring"
        title="Share KidQuest with a friend"
      >
        <Share2 size={16} aria-hidden />
        <span className="sr-only sm:not-sr-only sm:text-[10px] sm:font-bold">
          {shareMsg ?? "Share"}
        </span>
      </button>
    </section>
  );
}
