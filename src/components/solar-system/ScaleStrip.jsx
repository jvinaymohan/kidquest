import { useState } from "react";
import { PLANETS } from "../../data/solar-system";

const MAX_KM = 139820;

export function ScaleStrip() {
  const [realistic, setRealistic] = useState(false);

  return (
    <div className="chunky-card p-4">
      <div className="flex items-center justify-between gap-2 mb-3">
        <h3 className="font-display font-extrabold text-lg">Planet sizes</h3>
        <button
          type="button"
          onClick={() => setRealistic((r) => !r)}
          className="text-xs font-display font-extrabold px-3 py-1 rounded-pill border-[2.5px] border-ink/15 bg-bg focus-ring"
        >
          {realistic ? "Easier view" : "Real proportions"}
        </button>
      </div>
      <div className="flex items-end justify-center gap-1 min-h-[100px] flex-wrap">
        {PLANETS.map((p) => {
          const pct = realistic ? (p.diameterKm / MAX_KM) * 100 : Math.max(12, (p.order / 8) * 40 + 20);
          const size = realistic ? `${Math.max(4, pct)}%` : `${pct}px`;
          const w = realistic ? "14%" : `${Math.max(28, pct)}px`;
          return (
            <div key={p.id} className="flex flex-col items-center gap-1" style={{ width: w, maxWidth: 48 }}>
              <div
                className="rounded-full border-[2px] border-ink/20 mx-auto"
                style={{
                  background: p.color,
                  width: realistic ? size : w,
                  height: realistic ? size : w,
                  minWidth: 8,
                  minHeight: 8,
                }}
                title={p.name}
              />
              <span className="text-[9px] font-bold text-ink/60 truncate w-full text-center">{p.name}</span>
            </div>
          );
        })}
      </div>
      <p className="text-xs font-bold text-ink/50 mt-2 text-center">
        Jupiter is huge! {realistic ? "This shows real relative sizes." : "Squished view so you can see every planet."}
      </p>
    </div>
  );
}
