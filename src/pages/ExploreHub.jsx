import { Compass, Globe, Map, Orbit, Sparkles, BookMarked, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import { subjectProgress } from "../utils/content";

export default function ExploreHub() {
  const ageGroup = useAppStore((s) => s.ageGroup);
  const lessonProgress = useAppStore((s) => s.lessonProgress);
  const geoPct = Math.round(subjectProgress("geography", ageGroup, lessonProgress).masteryPct * 100);
  const solarPct = Math.round(subjectProgress("solar-system", ageGroup, lessonProgress).masteryPct * 100);
  return (
    <div className="flex flex-col gap-4">
      <header className="chunky-card p-4 bg-gradient-to-br from-geography/25 to-white border-[3px] border-geography/40">
        <div className="flex items-center gap-3">
          <Compass className="text-geography" />
          <div>
            <h1 className="font-display text-2xl font-extrabold">Explore</h1>
            <p className="text-sm font-bold text-ink/70">Maps, places, and real-world discovery.</p>
          </div>
        </div>
      </header>

      <Link to="/subject/geography" className="chunky-card p-4 flex items-center justify-between focus-ring">
        <div className="flex items-center gap-3">
          <Globe className="text-geography" />
          <div>
            <p className="font-display font-extrabold">Geography Adventures</p>
            <p className="text-xs font-bold text-ink/60">
              {geoPct}% mastery · flags, capitals, map locator
            </p>
          </div>
        </div>
        <Map className="text-ink/50" size={18} />
      </Link>

      <Link to="/subject/solar-system?tab=learn" className="chunky-card p-4 flex items-center justify-between focus-ring">
        <div className="flex items-center gap-3">
          <Orbit className="text-solar-system" />
          <div>
            <p className="font-display font-extrabold">Solar System Explorer</p>
            <p className="text-xs font-bold text-ink/60">
              {solarPct}% mastery · planets, scale strip, missions
            </p>
          </div>
        </div>
        <Sparkles className="text-ink/50" size={18} />
      </Link>

      <section className="chunky-card p-4">
        <div className="flex items-center gap-2 mb-2">
          <MapPin size={18} className="text-geography" />
          <p className="font-display font-extrabold">Map skills</p>
          <span className="ml-auto text-xs font-bold text-ink/50">{geoPct}%</span>
        </div>
        <p className="text-sm font-bold text-ink/65 mb-3">
          Practice locating countries, capitals, and flags — then log a place in Life Explorer.
        </p>
        <div className="grid gap-2">
          <Link
            to="/subject/geography?tab=locate"
            className="rounded-chunky border-2 border-geography/30 px-3 py-2 text-sm font-bold focus-ring"
          >
            Map locator drill
          </Link>
          <Link
            to="/life"
            className="rounded-chunky border-2 border-ink/15 px-3 py-2 text-sm font-bold flex items-center gap-2 focus-ring"
          >
            <BookMarked size={16} /> Open Life Explorer
          </Link>
        </div>
      </section>

      <Link to="/home" className="text-center text-xs font-bold text-primary py-2 focus-ring rounded">
        ← Back to Learn dashboard
      </Link>
    </div>
  );
}
