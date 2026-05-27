import { Compass, Globe, Map, Orbit, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function ExploreHub() {
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
            <p className="text-xs font-bold text-ink/60">Flags, capitals, map locator, and country explorer</p>
          </div>
        </div>
        <Map className="text-ink/50" size={18} />
      </Link>

      <Link to="/subject/solar-system?tab=learn" className="chunky-card p-4 flex items-center justify-between focus-ring">
        <div className="flex items-center gap-3">
          <Orbit className="text-solar-system" />
          <div>
            <p className="font-display font-extrabold">Solar System Explorer</p>
            <p className="text-xs font-bold text-ink/60">Planet details, scale strip, and mission timeline</p>
          </div>
        </div>
        <Sparkles className="text-ink/50" size={18} />
      </Link>
    </div>
  );
}
