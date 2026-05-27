import { useState } from "react";
import { PLANETS } from "../../data/solar-system";
import { PlanetDetail } from "./PlanetDetail";

export function PlanetExplorer() {
  const [selectedId, setSelectedId] = useState("earth");
  const selected = PLANETS.find((p) => p.id === selectedId) ?? PLANETS[2];
  const idx = PLANETS.findIndex((p) => p.id === selectedId);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {PLANETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setSelectedId(p.id)}
            className={`shrink-0 flex flex-col items-center gap-1 p-2 rounded-chunky border-[3px] focus-ring min-w-[72px] ${
              selectedId === p.id ? "border-ink/30 bg-white shadow-chunkySm" : "border-ink/10 bg-bg"
            }`}
          >
            <div
              className="w-12 h-12 rounded-full border-[2px] border-ink/20"
              style={{ background: p.color }}
            />
            <span className="font-display font-extrabold text-xs">{p.name}</span>
          </button>
        ))}
      </div>
      <PlanetDetail
        planet={selected}
        onPrev={() => idx > 0 && setSelectedId(PLANETS[idx - 1].id)}
        onNext={() => idx < PLANETS.length - 1 && setSelectedId(PLANETS[idx + 1].id)}
      />
    </div>
  );
}
