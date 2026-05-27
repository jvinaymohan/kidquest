import { PLANETS } from "../../data/solar-system";

export function PlanetDetail({ planet, onPrev, onNext }) {
  if (!planet) return null;
  const idx = PLANETS.findIndex((p) => p.id === planet.id);

  return (
    <div className="chunky-card p-5" style={{ borderColor: planet.color, borderWidth: 4 }}>
      <div className="flex items-center gap-4">
        <div
          className="w-20 h-20 rounded-full shadow-chunky border-[3px] border-ink/20 shrink-0"
          style={{ background: planet.color }}
        />
        <div>
          <div className="text-xs font-bold text-ink/50 uppercase">{planet.order} from the Sun</div>
          <h3 className="font-display text-3xl font-extrabold">{planet.name}</h3>
          <p className="text-sm font-bold text-ink/60 capitalize">{planet.type}</p>
        </div>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-2 text-sm font-bold">
        <Stat label="Day" value={planet.dayLength} />
        <Stat label="Year" value={planet.yearLength} />
        <Stat label="Moons" value={String(planet.moons)} />
        <Stat label="Size" value={`${planet.diameterKm.toLocaleString()} km`} />
      </dl>
      <p className="mt-3 font-bold text-ink/80">{planet.funFact}</p>
      <p className="mt-2 text-sm font-bold text-primary">{planet.feature}</p>
      <div className="mt-4 flex justify-between gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={idx <= 0}
          className="px-4 py-2 rounded-pill font-display font-extrabold text-sm border-[2.5px] border-ink/15 disabled:opacity-40 focus-ring"
        >
          ← Prev
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={idx >= PLANETS.length - 1}
          className="px-4 py-2 rounded-pill font-display font-extrabold text-sm border-[2.5px] border-ink/15 disabled:opacity-40 focus-ring"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-bg rounded-chunky p-2 border-[2px] border-ink/10">
      <dt className="text-[10px] uppercase text-ink/50">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
