import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Share2 } from "lucide-react";
import { getCuriosityCard, getAllCuriosityCards } from "../data/curiosity";
import { useAppStore } from "../store/useAppStore";
import { useCuriosityStore } from "../store/useCuriosityStore";
import {
  contentForBand,
  ageGroupToBand,
  selectMonthlyTheme,
} from "../utils/curiosity";
import { useCuriosityPrefs } from "../store/useCuriosityPreferencesStore";
import { monthKey } from "../utils/curiosity/calendar";
import {
  CuriositySummary,
  CuriosityDetailModules,
} from "../components/curiosity/CuriosityDetailModules";
import { buildSessionShareText, shareAchievement } from "../utils/shareAchievement";
import { Button } from "../components/ui/Button";

export default function CuriosityDetail({ variant = "spark" }) {
  const { id, month } = useParams();
  const navigate = useNavigate();
  const ageGroup = useAppStore((s) => s.ageGroup);
  const kidName = useAppStore((s) => s.kidName);
  const band = ageGroupToBand(ageGroup);
  const prefs = useCuriosityPrefs();

  const card = useMemo(() => {
    if (variant === "theme") {
      const targetMonth = month ?? monthKey();
      const monthly = getAllCuriosityCards().filter((c) => c.type === "monthly");
      const match = monthly.find((c) => {
        const from = c.activeFrom?.slice(0, 7);
        const until = c.activeUntil?.slice(0, 7);
        if (!from || !until) return false;
        return targetMonth >= from && targetMonth <= until;
      });
      return match ?? selectMonthlyTheme(monthly, prefs, { ageGroup });
    }
    return getCuriosityCard(id);
  }, [variant, id, month, prefs, ageGroup]);

  const cardId = card?.id;
  const saved = useCuriosityStore((s) => cardId != null && (s.savedIds ?? []).includes(cardId));
  const toggleSaved = useCuriosityStore((s) => s.toggleSaved);
  const recordQuiz = useCuriosityStore((s) => s.recordQuiz);
  const markCompleted = useCuriosityStore((s) => s.markCompleted);
  const [shareMsg, setShareMsg] = useState(null);

  if (!card) {
    return (
      <div className="p-6 text-center">
        <p className="font-display font-extrabold">This curiosity card isn&apos;t available.</p>
        <Link to="/curiosity" className="text-primary font-bold mt-2 inline-block">
          Back to hub
        </Link>
      </div>
    );
  }

  const content = contentForBand(card, band);
  const gradient = card.visual?.gradient ?? "from-[#667eea] to-[#764ba2]";
  const backLabel = variant === "weekly" ? "Weekly" : variant === "theme" ? "Theme" : "Spark";

  async function onShare() {
    const text = buildSessionShareText({
      kidName,
      title: `discovered something cool: ${card.title}`,
      detail: card.hook,
    });
    const res = await shareAchievement({ text, title: "KidQuest Curiosity" });
    setShareMsg(res.ok ? "Shared!" : "Copy link from invite anytime");
    setTimeout(() => setShareMsg(null), 2000);
  }

  return (
    <div className="flex flex-col gap-4 pb-8">
      <button
        type="button"
        onClick={() => navigate("/curiosity")}
        className="self-start flex items-center gap-1 font-display font-extrabold text-ink/70 focus-ring rounded-pill px-2 py-1"
      >
        <ChevronLeft size={20} /> Curiosity Hub
      </button>

      <header className={`rounded-3xl p-5 bg-gradient-to-br ${gradient} text-white`}>
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/70">
          {backLabel}
        </p>
        <span className="text-5xl mt-2 block" aria-hidden>
          {card.visual?.emoji}
        </span>
        <h1 className="mt-2 font-display text-2xl font-extrabold leading-tight">{card.title}</h1>
        <p className="mt-2 text-sm font-bold text-white/85">{card.hook}</p>
      </header>

      {content ? (
        <CuriositySummary content={content} />
      ) : (
        <p className="rounded-2xl bg-white/80 p-4 text-sm font-bold text-ink/70 ring-1 ring-ink/[0.08]">
          This card is still being prepared for your age band. Check back soon or try another spark!
        </p>
      )}

      <CuriosityDetailModules
        card={card}
        content={content}
        saved={saved}
        onToggleSave={() => toggleSaved(card.id)}
        onQuizComplete={(score) => {
          recordQuiz(card.id, score);
          markCompleted(card.id);
        }}
      />

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="button" variant="secondary" fullWidth leftIcon={<Share2 size={18} />} onClick={onShare}>
          Tell a friend what I learned
        </Button>
        {shareMsg && <p className="text-xs font-bold text-center text-success">{shareMsg}</p>}
      </div>
    </div>
  );
}
