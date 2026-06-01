import { useNavigate } from "react-router-dom";
import { ChevronLeft, Home } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { Avatar } from "../mascots/Avatar";
import { XPBar } from "../rewards/XPBar";
import { StreakFlame } from "../rewards/StreakFlame";

export function TopBar() {
  const navigate = useNavigate();
  const { kidName, avatarConfig, totalXP, currentStreak } = useAppStore();
  const streakDots = 14;
  const activeDots = Math.min(currentStreak, streakDots);

  return (
    <header className="sticky top-0 z-30 safe-top border-b border-ink/10">
      <div className="bg-mul-dark px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="shrink-0 grid h-10 w-10 place-items-center rounded-xl border-2 border-white/20 text-white focus-ring"
            aria-label="Go back"
          >
            <ChevronLeft size={22} strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="shrink-0 grid h-10 w-10 place-items-center rounded-xl border-2 border-white/20 text-white focus-ring"
            aria-label="Quest Home"
          >
            <Home size={20} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="shrink-0 w-11 h-11 grid place-items-center rounded-full border-[3px] border-white/25 bg-white shadow-chunky focus-ring overflow-hidden"
            aria-label="Open profile"
          >
            <Avatar config={avatarConfig} size={44} />
          </button>
          <div className="min-w-0 flex-1">
            <div className="font-display text-sm leading-none text-white/75 font-bold">Hey</div>
            <div className="font-display text-lg font-extrabold truncate text-white">{kidName || "Friend"}!</div>
          </div>
          <div className="hidden sm:block shrink-0">
            <XPBar totalXP={totalXP} />
          </div>
          <StreakFlame streak={currentStreak} />
        </div>
      </div>
      <div className="bg-mul-dark px-4 pb-3">
        <div className="max-w-2xl mx-auto">
          <div className="text-[11px] font-bold text-white/65 mb-1.5">{currentStreak}-day streak — keep it going!</div>
          <div className="flex gap-1.5">
            {Array.from({ length: streakDots }, (_, i) => {
              const done = i < activeDots;
              const today = i === activeDots && activeDots < streakDots;
              return (
                <span
                  key={i}
                  className={`h-2.5 flex-1 rounded-pill ${
                    done ? "bg-primary" : today ? "bg-mul-gold" : "bg-white/15"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
