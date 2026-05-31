import { Link, useNavigate } from "react-router-dom";
import { Globe, Orbit } from "lucide-react";
export default function ExploreHub() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4">
      <header className="chunky-card border-[3px] border-geography/40 bg-gradient-to-br from-geography/25 to-white p-4">
        <h1 className="font-display text-2xl font-extrabold">Explore</h1>
        <p className="text-sm font-bold text-ink/70">Maps, places, and space — live now.</p>
      </header>

      <Link to="/subject/geography" className="chunky-card flex items-center justify-between p-4 focus-ring">
        <div className="flex items-center gap-3">
          <Globe className="text-geography" />
          <div>
            <p className="font-display font-extrabold">Geography Adventures</p>
            <p className="text-xs font-bold text-ink/60">Flags, capitals, world map</p>
          </div>
        </div>
        <span className="text-xs font-extrabold text-geography">Play →</span>
      </Link>

      <Link
        to="/subject/solar-system?tab=learn"
        className="chunky-card flex items-center justify-between p-4 focus-ring"
      >
        <div className="flex items-center gap-3">
          <Orbit className="text-solar-system" />
          <div>
            <p className="font-display font-extrabold">Solar System Explorer</p>
            <p className="text-xs font-bold text-ink/60">Planets, scale, missions</p>
          </div>
        </div>
        <span className="text-xs font-extrabold text-solar-system">Play →</span>
      </Link>

      <div className="chunky-card p-4 text-center">
        <p className="font-display font-extrabold text-ink">More explore modes</p>
        <p className="mt-1 text-xs font-bold text-ink/55">Life map & field trips — coming soon</p>
      </div>

      <button
        type="button"
        onClick={() => navigate("/home")}
        className="text-sm font-display font-extrabold text-primary focus-ring"
      >
        ← Back to Home
      </button>
    </div>
  );
}
