import { useMemo } from "react";

const CONFETTI = [
  { left: "10%", delay: "0s", size: "16px", emoji: "⭐" },
  { left: "25%", delay: "2s", size: "12px", emoji: "✨" },
  { left: "60%", delay: "1s", size: "14px", emoji: "🌟" },
  { left: "80%", delay: "3s", size: "10px", emoji: "💫" },
  { left: "45%", delay: "5s", size: "16px", emoji: "⭐" },
  { left: "70%", delay: "4s", size: "11px", emoji: "✨" },
];

export function SpaceBackground({ reduceMotion = false }) {
  const stars = useMemo(() => {
    return Array.from({ length: 80 }, (_, i) => {
      const size = Math.random() * 3 + 1;
      return {
        id: i,
        size,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 3}s`,
        duration: `${1.5 + Math.random() * 2}s`,
      };
    });
  }, []);

  const anim = reduceMotion ? "" : "home-space-animate";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="home-space-stars absolute inset-0">
        {stars.map((s) => (
          <div
            key={s.id}
            className={`home-space-star ${anim}`}
            style={{
              width: s.size,
              height: s.size,
              left: s.left,
              top: s.top,
              animationDelay: s.delay,
              animationDuration: s.duration,
            }}
          />
        ))}
      </div>

      <div className={`home-space-planet home-space-planet-1 ${anim}`} />
      <div className={`home-space-planet home-space-planet-2 ${anim}`} />
      <div className={`home-space-planet home-space-planet-3 ${anim}`} />
      <div className={`home-space-planet home-space-planet-4 ${anim}`} />
      {!reduceMotion && <div className="home-space-shooting-star" />}

      {CONFETTI.map((c) => (
        <span
          key={`${c.left}-${c.delay}`}
          className={`home-space-confetti ${anim}`}
          style={{ left: c.left, animationDelay: c.delay, fontSize: c.size }}
        >
          {c.emoji}
        </span>
      ))}
    </div>
  );
}
