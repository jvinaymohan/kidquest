const MISSIONS = [
  { year: 1957, name: "Sputnik 1", fact: "First satellite in space!" },
  { year: 1961, name: "Yuri Gagarin", fact: "First human in space." },
  { year: 1969, name: "Apollo 11", fact: "Neil Armstrong walks on the Moon." },
  { year: 1977, name: "Voyager 1", fact: "Launched to explore the outer planets." },
  { year: 1998, name: "ISS", fact: "International Space Station begins assembly." },
  { year: 2021, name: "Perseverance", fact: "Mars rover searches for signs of ancient life." },
  { year: 2022, name: "James Webb", fact: "Powerful telescope sees deep into space." },
];

export function MissionsTimeline() {
  return (
    <div className="flex flex-col gap-2">
      {MISSIONS.map((m) => (
        <div key={m.name} className="chunky-card p-3 flex gap-3 items-center">
          <div className="w-14 shrink-0 font-display font-extrabold text-primary text-lg">{m.year}</div>
          <div>
            <div className="font-display font-extrabold">{m.name}</div>
            <div className="text-xs font-bold text-ink/60">{m.fact}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
