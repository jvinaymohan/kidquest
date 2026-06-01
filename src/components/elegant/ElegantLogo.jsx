import { Mascot } from "../mascots/Mascot";

export function ElegantLogo({ size = 110, reduceMotion = false, mascotSize = 44 }) {
  const ringClass = reduceMotion ? "elegant-logo-static" : "elegant-logo-ring";
  const innerClass = reduceMotion ? "elegant-logo-core-static" : "elegant-logo-core";

  return (
    <div className="elegant-hero-logo relative" style={{ width: size, height: size }}>
      <div className={ringClass} style={{ width: size, height: size }}>
        <div
          className={`${innerClass} grid place-items-center`}
          style={{ width: size - 14, height: size - 14 }}
        >
          <Mascot kind="rocket" size={mascotSize} animate={!reduceMotion} />
        </div>
      </div>
      {!reduceMotion && (
        <>
          <span className="elegant-logo-spark elegant-spark-a" aria-hidden>
            ⭐
          </span>
          <span className="elegant-logo-spark elegant-spark-b" aria-hidden>
            ✨
          </span>
          <span className="elegant-logo-spark elegant-spark-c" aria-hidden>
            💫
          </span>
        </>
      )}
    </div>
  );
}
