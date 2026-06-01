import { useMemo } from "react";

export function ElegantBackground({ reduceMotion = false }) {
  const stars = useMemo(() => {
    return Array.from({ length: 120 }, (_, i) => {
      const size = Math.random() * 2.5 + 0.5;
      return {
        id: i,
        size,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: `${1.5 + Math.random() * 2.5}s`,
        delay: `${Math.random() * 4}s`,
      };
    });
  }, []);

  const anim = reduceMotion ? "" : "elegant-animate";

  return (
    <div className="elegant-canvas-bg pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className={`elegant-orb elegant-orb-1 ${anim}`} />
      <div className={`elegant-orb elegant-orb-2 ${anim}`} />
      <div className={`elegant-orb elegant-orb-3 ${anim}`} />
      <div className="elegant-starfield absolute inset-0">
        {stars.map((s) => (
          <div
            key={s.id}
            className={`elegant-star ${anim}`}
            style={{
              width: s.size,
              height: s.size,
              left: s.left,
              top: s.top,
              animationDuration: s.duration,
              animationDelay: s.delay,
            }}
          />
        ))}
      </div>
    </div>
  );
}
