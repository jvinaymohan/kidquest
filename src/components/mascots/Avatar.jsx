const SKINS = ["#FDE7C8", "#F3C6A0", "#D9A074", "#A5704B", "#6B4423"];
const HAIRS = ["#3A2A18", "#6B3F1D", "#C58A3F", "#E8C16E", "#9B5DE5"];
const OUTFITS = ["#FF6B35", "#4ECDC4", "#FFE66D", "#6BCB77", "#3A86FF"];
const ACCESSORY_GLASSES = [false, true];

export function Avatar({ config = { skin: 1, hair: 1, outfit: 1, accessory: 0 }, size = 96 }) {
  const skin = SKINS[config.skin % SKINS.length];
  const hair = HAIRS[config.hair % HAIRS.length];
  const outfit = OUTFITS[config.outfit % OUTFITS.length];
  const glasses = ACCESSORY_GLASSES[config.accessory % ACCESSORY_GLASSES.length];

  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <rect x="12" y="74" width="76" height="24" rx="12" fill={outfit} stroke="#2D3047" strokeWidth="3" />
      <ellipse cx="50" cy="46" rx="26" ry="28" fill={skin} stroke="#2D3047" strokeWidth="3" />
      <path
        d={`M22 36 Q24 14 50 14 Q76 14 78 36 Q72 28 50 28 Q28 28 22 36 Z`}
        fill={hair}
        stroke="#2D3047"
        strokeWidth="3"
      />
      <circle cx="40" cy="48" r="3" fill="#2D3047" />
      <circle cx="60" cy="48" r="3" fill="#2D3047" />
      <path d="M42 60 Q50 66 58 60" stroke="#2D3047" strokeWidth="3" fill="none" strokeLinecap="round" />
      {glasses && (
        <g stroke="#2D3047" strokeWidth="2.5" fill="none">
          <circle cx="40" cy="48" r="6.5" />
          <circle cx="60" cy="48" r="6.5" />
          <line x1="46.5" y1="48" x2="53.5" y2="48" />
        </g>
      )}
    </svg>
  );
}

export const AVATAR_OPTIONS = {
  skin: SKINS.length,
  hair: HAIRS.length,
  outfit: OUTFITS.length,
  accessory: ACCESSORY_GLASSES.length,
};
