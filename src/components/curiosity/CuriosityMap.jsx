export function CuriosityMap({ map }) {
  if (!map?.regions?.length) return null;
  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#e8f4fa] to-white p-4 ring-1 ring-ink/10">
      <h3 className="font-display font-extrabold text-sm mb-3">{map.title}</h3>
      <ul className="space-y-2">
        {map.regions.map((r) => (
          <li key={r.name} className="flex gap-2 text-xs">
            <span className="text-lg" aria-hidden>
              📍
            </span>
            <div>
              <p className="font-display font-extrabold">{r.name}</p>
              <p className="font-medium text-ink/60">{r.note}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
