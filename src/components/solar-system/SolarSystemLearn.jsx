import { PlanetExplorer } from "./PlanetExplorer";
import { ScaleStrip } from "./ScaleStrip";
import { SunMoonPage } from "./SunMoonPage";
import { MissionsTimeline } from "./MissionsTimeline";
import { useLearnTimer } from "../../hooks/useLearnTimer";

export function SolarSystemLearn() {
  useLearnTimer("solar-system");

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm font-bold text-ink/70">
        Blast off and explore — no quiz pressure. Tap planets, compare sizes, and follow humanity&apos;s greatest trips.
      </p>
      <section>
        <h2 className="font-display font-extrabold text-xl mb-3">The planets</h2>
        <PlanetExplorer />
      </section>
      <section>
        <h2 className="font-display font-extrabold text-xl mb-3">How big are they?</h2>
        <ScaleStrip />
      </section>
      <section>
        <h2 className="font-display font-extrabold text-xl mb-3">Sun &amp; Moon</h2>
        <SunMoonPage />
      </section>
      <section>
        <h2 className="font-display font-extrabold text-xl mb-3">Space missions</h2>
        <MissionsTimeline />
      </section>
      <div className="chunky-card p-4 bg-accent/30 text-center">
        <div className="text-2xl">✨</div>
        <p className="font-display font-extrabold text-sm mt-1">Constellations — coming soon for Champions!</p>
      </div>
    </div>
  );
}
