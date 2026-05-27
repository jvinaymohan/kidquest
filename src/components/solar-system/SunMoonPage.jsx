const CARDS = [
  { emoji: "☀️", title: "The Sun is a star", body: "A giant ball of hot gas that gives Earth light and warmth. Without it, nothing could live here!" },
  { emoji: "🌙", title: "The Moon orbits Earth", body: "The Moon goes around us about once a month. It does not make its own light — it reflects sunlight!" },
  { emoji: "🌊", title: "Tides", body: "The Moon's gravity pulls on oceans and makes tides rise and fall twice a day." },
  { emoji: "🌑", title: "Moon phases", body: "We see different shapes because sunlight hits different parts of the Moon as it moves." },
  { emoji: "🌘", title: "Eclipses", body: "A solar eclipse happens when the Moon blocks the Sun. A lunar eclipse is when Earth's shadow covers the Moon." },
];

export function SunMoonPage() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {CARDS.map((c) => (
        <div key={c.title} className="chunky-card p-4 bg-bg">
          <div className="text-3xl mb-2">{c.emoji}</div>
          <h4 className="font-display font-extrabold text-lg">{c.title}</h4>
          <p className="text-sm font-bold text-ink/70 mt-1">{c.body}</p>
        </div>
      ))}
    </div>
  );
}
