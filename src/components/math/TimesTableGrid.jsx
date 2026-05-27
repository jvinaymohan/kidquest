import { useState } from "react";

export function TimesTableGrid() {
  const [selected, setSelected] = useState(null);

  const cells = [];
  for (let a = 1; a <= 12; a++) {
    for (let b = 1; b <= 12; b++) {
      cells.push({ a, b, product: a * b });
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-bold text-ink/60">Tap any square to see the equation.</p>
      <div className="grid grid-cols-6 sm:grid-cols-8 gap-1 max-h-[240px] overflow-y-auto no-scrollbar">
        {cells.map(({ a, b, product }) => {
          const key = `${a}-${b}`;
          const active = selected?.a === a && selected?.b === b;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelected({ a, b, product })}
              className={`aspect-square rounded-md text-[10px] font-display font-extrabold border-[2px] focus-ring ${
                active ? "bg-primary text-white border-ink/20" : "bg-white border-ink/10 text-ink/70"
              }`}
            >
              {product}
            </button>
          );
        })}
      </div>
      {selected && (
        <div className="chunky-card p-4 text-center bg-accent/40">
          <div className="font-display text-3xl font-extrabold">
            {selected.a} × {selected.b} = {selected.product}
          </div>
          <DotsVisual groups={selected.a} perGroup={selected.b} />
        </div>
      )}
    </div>
  );
}

function DotsVisual({ groups, perGroup }) {
  const show = Math.min(groups, 6);
  const dots = Math.min(perGroup, 8);
  return (
    <div className="flex flex-wrap justify-center gap-2 mt-3">
      {Array.from({ length: show }).map((_, gi) => (
        <div key={gi} className="flex gap-0.5">
          {Array.from({ length: dots }).map((_, di) => (
            <span key={di} className="w-2 h-2 rounded-full bg-primary" />
          ))}
        </div>
      ))}
      {(groups > 6 || perGroup > 8) && (
        <span className="text-xs font-bold text-ink/50 w-full">+ more groups</span>
      )}
    </div>
  );
}
