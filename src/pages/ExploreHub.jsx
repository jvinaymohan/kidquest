import { Link } from "react-router-dom";
import { Compass, Globe, Orbit } from "lucide-react";
import { HubPageLayout } from "../components/layout/HubPageLayout";

export default function ExploreHub() {
  return (
    <HubPageLayout
      title="Explore"
      subtitle="Maps, places, and space — live now."
      icon={<Compass className="mx-auto text-[#38efc3]" size={36} aria-hidden />}
      headerClassName="border-geography/35"
    >
      <Link to="/subject/geography" className="hub-topic-card focus-ring">
        <Globe className="text-geography shrink-0" size={28} aria-hidden />
        <div className="flex-1 min-w-0">
          <p className="font-display font-extrabold text-white">Geography Adventures</p>
          <p className="text-xs font-bold text-white/55">Flags, capitals, world map</p>
        </div>
        <span className="text-xs font-extrabold text-geography shrink-0">Play →</span>
      </Link>

      <Link
        to="/subject/solar-system?tab=learn"
        className="hub-topic-card focus-ring"
      >
        <Orbit className="text-solar-system shrink-0" size={28} aria-hidden />
        <div className="flex-1 min-w-0">
          <p className="font-display font-extrabold text-white">Solar System Explorer</p>
          <p className="text-xs font-bold text-white/55">Planets, scale, missions</p>
        </div>
        <span className="text-xs font-extrabold text-solar-system shrink-0">Play →</span>
      </Link>

      <div className="hub-glass-panel p-4 text-center">
        <p className="font-display font-extrabold text-white">More explore modes</p>
        <p className="mt-1 text-xs font-bold text-white/55">Life map & field trips — coming soon</p>
      </div>
    </HubPageLayout>
  );
}
