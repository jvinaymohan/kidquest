import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { MedalDisplay } from "../components/multiplication/MedalDisplay";
import { ConfettiBlast } from "../components/rewards/ConfettiBlast";
import { Button } from "../components/ui/Button";
import { useAppStore } from "../store/useAppStore";
import { useAuthStore } from "../store/useAuthStore";
import { useMultiplicationStore } from "../store/useMultiplicationStore";
import { formatMs, medalForRun, xpForSpeedRun } from "../utils/multiplicationScoring";
import { MOTIVATIONAL } from "../data/multiplication/tables";
import { createSpeedRunCardDataUrl, downloadDataUrl } from "../utils/generateResultCard";
import { submitSpeedRunToCloud } from "../lib/cloud/leaderboard";

export default function MultiplicationResults() {
  const { state } = useLocation();
  const results = state?.results;
  const speedRuns = useMultiplicationStore((s) => s.speedRuns);
  const grantXP = useAppStore((s) => s.grantXP);
  const grantBadge = useAppStore((s) => s.grantBadge);
  const kidName = useAppStore((s) => s.kidName);
  const ageGroup = useAppStore((s) => s.ageGroup);
  const userId = useAuthStore((s) => s.user?.id);
  const granted = useRef(false);

  const xp = results ? xpForSpeedRun(results.score, results.accuracy) : 0;

  useEffect(() => {
    if (!results || granted.current) return;
    granted.current = true;
    grantXP(xp);
    submitSpeedRunToCloud({
      userId,
      kidName,
      ageGroup,
      score: results.score,
      totalTimeMs: results.totalTimeMs,
      accuracyPct: results.accuracy,
    }).catch(() => {});
    if (results.score === 50 && results.totalTimeMs < 180000) {
      grantBadge("mul_flawless");
    }
    if (results.score === 50) {
      grantBadge("mul_lightning");
    }
    if (results.totalTimeMs < 120000 && results.score >= 45) {
      grantBadge("mul_speed_demon");
    }
  }, [results, grantXP, grantBadge, xp, kidName, ageGroup, userId]);

  if (!results) {
    return (
      <div className="p-6 text-center">
        <p>No results to show.</p>
        <Link to="/multiplication">
          <Button className="mt-4">Back to camp</Button>
        </Link>
      </div>
    );
  }

  const medalInfo = medalForRun(results.score, results.totalTimeMs);
  const prevBest = speedRuns.length > 1 ? speedRuns[speedRuns.length - 2] : null;
  const isPB =
    !prevBest ||
    results.score > prevBest.score ||
    (results.score === prevBest.score && results.totalTimeMs < prevBest.totalTimeMs);
  const pbDelta =
    isPB && prevBest ? Math.round((prevBest.totalTimeMs - results.totalTimeMs) / 1000) : 0;

  async function shareResultCard() {
    const dataUrl = createSpeedRunCardDataUrl({
      kidName,
      score: results.score,
      totalTimeMs: results.totalTimeMs,
      medalLabel: medalInfo.label,
    });
    if (navigator.share && navigator.canShare) {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], "kidquest-speed-run.png", { type: "image/png" });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "My KidQuest Speed Run",
          text: `${kidName || "I"} scored ${results.score}/50 in ${formatMs(results.totalTimeMs)}!`,
          files: [file],
        });
        return;
      }
    }
    downloadDataUrl("kidquest-speed-run.png", dataUrl);
  }

  return (
    <div className="flex flex-col gap-5 p-4 pb-10">
      {medalInfo.medal === "gold" && <ConfettiBlast />}
      <MedalDisplay medal={medalInfo.medal} label={medalInfo.label} emoji={medalInfo.emoji} />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
        <div className="font-display text-4xl font-extrabold">{results.score}/50</div>
        <div className="text-lg font-bold text-ink/70">{formatMs(results.totalTimeMs)}</div>
        <div className="text-sm font-bold text-ink/50">
          {Math.round(results.accuracy)}% accuracy · +{xp} XP
        </div>
      </motion.div>

      {isPB && pbDelta > 0 && (
        <p className="text-center font-display font-extrabold text-math">
          {MOTIVATIONAL.personalBest(pbDelta)}
        </p>
      )}

      {medalInfo.medal === "gold" && (
        <p className="text-center font-extrabold">{MOTIVATIONAL.gold}</p>
      )}
      {results.totalTimeMs < 120000 && results.score >= 45 && (
        <p className="text-center text-sm font-bold">{MOTIVATIONAL.under2min}</p>
      )}

      {results.wrong?.length > 0 && (
        <section className="chunky-card p-4">
          <h3 className="font-display font-extrabold mb-2">Wrong answers</h3>
          <ul className="text-sm font-bold space-y-1">
            {results.wrong.map((w) => (
              <li key={w.factId}>
                {w.multiplicand}×{w.multiplier} = {w.product} (you said {w.given ?? "—"})
              </li>
            ))}
          </ul>
          <p className="text-xs text-ink/60 mt-2">{MOTIVATIONAL.reviewWrong}</p>
        </section>
      )}

      {results.slowest?.length > 0 && (
        <section className="chunky-card p-4">
          <h3 className="font-display font-extrabold mb-2">Slowest (practice these!)</h3>
          <ul className="text-sm font-bold space-y-1">
            {results.slowest.map((w) => (
              <li key={w.factId}>
                {w.multiplicand}×{w.multiplier} — {(w.responseMs / 1000).toFixed(1)}s
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="chunky-card p-4 bg-mul-dark/5 text-center text-xs font-bold text-ink/60">
        Trained on KidQuest · kidquest.app
        <br />
        {kidName} · {results.score}/50 · {formatMs(results.totalTimeMs)}
      </div>

      <div className="flex flex-col gap-2">
        <Button variant="secondary" className="w-full" onClick={shareResultCard}>
          Share Result Card
        </Button>
        <Link to="/multiplication/speed-run">
          <Button className="w-full">Retry</Button>
        </Link>
        <Link to="/multiplication">
          <Button variant="ghost" className="w-full">
            Back to Training
          </Button>
        </Link>
      </div>
    </div>
  );
}
