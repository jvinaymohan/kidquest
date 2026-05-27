export function PersonalBestChart({ runs }) {
  if (!runs?.length) {
    return (
      <p className="text-sm font-bold text-ink/50 text-center py-4">
        Complete a speed run to see your progress chart!
      </p>
    );
  }

  const maxMs = Math.max(...runs.map((r) => r.totalTimeMs), 1);
  const minMs = Math.min(...runs.map((r) => r.totalTimeMs), maxMs);
  const w = 300;
  const h = 120;
  const pad = 16;
  const points = runs.map((r, i) => {
    const x = pad + (i / Math.max(runs.length - 1, 1)) * (w - pad * 2);
    const y = h - pad - ((r.totalTimeMs - minMs) / Math.max(maxMs - minMs, 1)) * (h - pad * 2);
    return `${x},${y}`;
  });

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-xs mx-auto h-28">
      <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="#D0D7E2" strokeWidth="1.5" />
      <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="#D0D7E2" strokeWidth="1.5" />
      <polyline
        fill="none"
        stroke="#00D4FF"
        strokeWidth="3"
        strokeLinecap="round"
        points={points.join(" ")}
      />
      {runs.map((r, i) => {
        const x = pad + (i / Math.max(runs.length - 1, 1)) * (w - pad * 2);
        const y = h - pad - ((r.totalTimeMs - minMs) / Math.max(maxMs - minMs, 1)) * (h - pad * 2);
        const isBest = r.totalTimeMs === minMs;
        return <circle key={i} cx={x} cy={y} r={isBest ? "5" : "4"} fill={isBest ? "#22C55E" : "#FFD700"} />;
      })}
      <text x={w - pad} y={pad - 2} textAnchor="end" fontSize="9" fill="#64748B">
        Faster
      </text>
      <text x={w - pad} y={h - 2} textAnchor="end" fontSize="9" fill="#64748B">
        Slower
      </text>
    </svg>
  );
}
