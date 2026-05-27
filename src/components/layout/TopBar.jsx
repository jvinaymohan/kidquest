import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store/useAppStore";
import { Avatar } from "../mascots/Avatar";
import { XPBar } from "../rewards/XPBar";
import { StreakFlame } from "../rewards/StreakFlame";

export function TopBar() {
  const navigate = useNavigate();
  const { kidName, avatarConfig, totalXP, currentStreak } = useAppStore();

  return (
    <header className="sticky top-0 z-30 bg-bg/85 backdrop-blur border-b border-ink/10 px-4 py-3 safe-top">
      <div className="max-w-2xl mx-auto flex items-center gap-3">
        <button
          onClick={() => navigate("/profile")}
          className="shrink-0 w-12 h-12 grid place-items-center rounded-full border-[3px] border-ink/20 bg-white shadow-chunky focus-ring overflow-hidden"
          aria-label="Open profile"
        >
          <Avatar config={avatarConfig} size={48} />
        </button>
        <div className="hidden sm:block min-w-0">
          <div className="font-display text-sm leading-none text-ink/60 font-bold">Hi,</div>
          <div className="font-display text-xl font-extrabold truncate">{kidName || "Friend"}!</div>
        </div>
        <div className="flex-1" />
        <XPBar totalXP={totalXP} />
        <StreakFlame streak={currentStreak} />
      </div>
    </header>
  );
}
