import { useEffect, useMemo, useState } from "react";
import { Filter, Trophy, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useMultiplicationStore } from "../store/useMultiplicationStore";
import { formatMs } from "../utils/multiplicationScoring";
import { useAppStore } from "../store/useAppStore";
import { fetchSpeedRunLeaderboard } from "../lib/cloud/leaderboard";

const PEERS = [
  { name: "Maya", ageGroup: "adventurer", classroom: "A", score: 49, totalTimeMs: 181000 },
  { name: "Leo", ageGroup: "champion", classroom: "B", score: 50, totalTimeMs: 165000 },
  { name: "Ava", ageGroup: "explorer", classroom: "A", score: 45, totalTimeMs: 210000 },
  { name: "Noah", ageGroup: "adventurer", classroom: "A", score: 47, totalTimeMs: 194000 },
  { name: "Zara", ageGroup: "champion", classroom: "B", score: 50, totalTimeMs: 175000 },
];
const SUBJECT_PEERS = {
  geography: [
    { name: "Maya", ageGroup: "adventurer", classroom: "A", mastery: 78 },
    { name: "Noah", ageGroup: "adventurer", classroom: "A", mastery: 72 },
    { name: "Leo", ageGroup: "champion", classroom: "B", mastery: 84 },
  ],
  "solar-system": [
    { name: "Ava", ageGroup: "explorer", classroom: "A", mastery: 65 },
    { name: "Zara", ageGroup: "champion", classroom: "B", mastery: 88 },
    { name: "Maya", ageGroup: "adventurer", classroom: "A", mastery: 74 },
  ],
  math: [
    { name: "Leo", ageGroup: "champion", classroom: "B", mastery: 82 },
    { name: "Noah", ageGroup: "adventurer", classroom: "A", mastery: 69 },
    { name: "Ava", ageGroup: "explorer", classroom: "A", mastery: 61 },
  ],
};

export default function CompeteHub() {
  const best = useMultiplicationStore((s) => s.bestSpeedRun);
  const kidName = useAppStore((s) => s.kidName || "You");
  const ageGroup = useAppStore((s) => s.ageGroup);
  const [scope, setScope] = useState("global");
  const [cloudRows, setCloudRows] = useState([]);
  const [cloudMode, setCloudMode] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchSpeedRunLeaderboard(scope, { ageGroup })
      .then((res) => {
        if (!mounted) return;
        if (res.cloud) {
          setCloudMode(true);
          setCloudRows(res.rows ?? []);
        } else {
          setCloudMode(false);
          setCloudRows([]);
        }
      })
      .catch(() => {
        if (!mounted) return;
        setCloudMode(false);
        setCloudRows([]);
      });
    return () => {
      mounted = false;
    };
  }, [scope, ageGroup]);

  const rows = useMemo(() => {
    if (cloudMode && cloudRows.length) {
      return cloudRows.slice(0, 8);
    }
    const mine = best
      ? [{ name: kidName, ageGroup, classroom: "A", score: best.score, totalTimeMs: best.totalTimeMs }]
      : [];
    const merged = [...PEERS, ...mine];
    const filtered = merged.filter((r) => {
      if (scope === "age") return r.ageGroup === ageGroup;
      if (scope === "class") return r.classroom === "A";
      return true;
    });
    return filtered
      .sort((a, b) => (b.score - a.score) || (a.totalTimeMs - b.totalTimeMs))
      .slice(0, 8);
  }, [best, kidName, ageGroup, scope, cloudMode, cloudRows]);

  return (
    <div className="flex flex-col gap-4">
      <header className="chunky-card p-4 bg-gradient-to-br from-mul-dark to-math text-white border-[3px] border-mul-electric/45">
        <div className="flex items-center gap-3">
          <Trophy className="text-mul-gold" />
          <div>
            <h1 className="font-display text-2xl font-extrabold">Compete</h1>
            <p className="text-sm font-bold text-white/80">Challenge mode, medals, and leaderboards.</p>
          </div>
        </div>
      </header>

      <Link to="/multiplication/speed-run" className="chunky-card p-4 flex items-center justify-between focus-ring">
        <div className="flex items-center gap-3">
          <Zap className="text-mul-gold" />
          <div>
            <p className="font-display font-extrabold">50-Question Speed Run</p>
            <p className="text-xs font-bold text-ink/60">
              {best ? `Best: ${best.score}/50 in ${formatMs(best.totalTimeMs)}` : "No personal best yet"}
            </p>
          </div>
        </div>
        <span className="text-sm font-display font-extrabold text-math">Play</span>
      </Link>

      <section className="chunky-card p-4">
        <div className="flex items-center gap-2 mb-2">
          <Filter size={16} />
          <h2 className="font-display font-extrabold">Speed Run Leaderboard</h2>
          <span className="ml-auto text-[10px] font-bold text-ink/50">
            {cloudMode ? "Supabase live" : "Local preview"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            ["global", "Global"],
            ["class", "Class"],
            ["age", "Age Group"],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setScope(id)}
              className={`py-2 text-xs rounded-pill border-2 font-bold ${
                scope === id ? "bg-accent border-ink/30" : "bg-white border-ink/15"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <ul className="space-y-2">
          {rows.map((row, i) => (
            <li key={`${row.name}-${i}`} className="flex items-center justify-between text-sm">
              <span className="font-bold">
                #{i + 1} {row.name} <span className="text-ink/50">({row.ageGroup})</span>
              </span>
              <span className="font-display font-extrabold">
                {row.score}/50 · {formatMs(row.totalTimeMs)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="chunky-card p-4">
        <h3 className="font-display font-extrabold mb-2">Subject Challenges</h3>
        <div className="grid gap-2">
          <Link to="/subject/geography" className="rounded-chunky border-2 border-ink/15 px-3 py-2 text-sm font-bold">
            Geography Sprint: 8 map-locate questions
          </Link>
          <Link to="/subject/solar-system" className="rounded-chunky border-2 border-ink/15 px-3 py-2 text-sm font-bold">
            Solar Mission Quiz: 10 rapid-fire planet facts
          </Link>
          <Link to="/subject/math" className="rounded-chunky border-2 border-ink/15 px-3 py-2 text-sm font-bold">
            Math Mixed Drill: lesson challenge ladder
          </Link>
        </div>
      </section>

      <section className="chunky-card p-4">
        <h3 className="font-display font-extrabold mb-2">Subject Leaderboards</h3>
        <div className="grid gap-3">
          {Object.entries(SUBJECT_PEERS).map(([subjectId, list]) => {
            const filtered = list
              .filter((r) => (scope === "age" ? r.ageGroup === ageGroup : scope === "class" ? r.classroom === "A" : true))
              .sort((a, b) => b.mastery - a.mastery)
              .slice(0, 3);
            return (
              <div key={subjectId} className="rounded-chunky border-2 border-ink/10 p-2">
                <p className="text-sm font-display font-extrabold capitalize mb-1">
                  {subjectId.replace("-", " ")}
                </p>
                <ul className="space-y-1">
                  {filtered.map((r, i) => (
                    <li key={`${subjectId}-${r.name}`} className="flex justify-between text-xs font-bold">
                      <span>#{i + 1} {r.name}</span>
                      <span>{r.mastery}% mastery</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
