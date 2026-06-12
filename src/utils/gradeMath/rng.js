/** Deterministic RNG from string seed — stable question banks in tests. */
export function rngFromString(seed) {
  let h = 2166136261;
  const s = String(seed);
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randInt(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function pick(rng, arr) {
  return arr[randInt(rng, 0, arr.length - 1)];
}

export function shuffle(rng, arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(rng, 0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
