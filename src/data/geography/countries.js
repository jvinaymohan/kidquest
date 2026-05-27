import countriesSlim from "./countries-slim.json";
import funFacts from "./funFacts.json";

// We use the simpler 5-region model from world-countries (Africa, Americas,
// Asia, Europe, Oceania) rather than the strict 7-continent split — easier
// for kids to learn.
export const CONTINENTS = ["Africa", "Americas", "Asia", "Europe", "Oceania"];

function pickPrimaryCurrency(currencies) {
  if (!currencies || typeof currencies !== "object") return null;
  const keys = Object.keys(currencies);
  if (!keys.length) return null;
  const code = keys[0];
  const { name, symbol } = currencies[code] || {};
  return { code, name: name || code, symbol: symbol || "" };
}

export const COUNTRIES = countriesSlim.map((c) => ({
  code: c.cca2,
  iso2: c.cca2,
  iso3: c.cca3,
  name: c.name,
  continent: c.region,
  subregion: c.subregion,
  capital: c.capital,
  currency: pickPrimaryCurrency(c.currencies),
  latlng: c.latlng,
  flag: c.flag,
  funFact: funFacts[c.cca2] || `${c.name} is in ${c.subregion || c.region}.`,
}));

const BY_CODE = Object.fromEntries(COUNTRIES.map((c) => [c.code, c]));

export function getCountry(code) {
  return BY_CODE[code];
}

export function countriesIn(continent) {
  return COUNTRIES.filter((c) => c.continent === continent);
}

// Deterministic RNG so quiz generation is repeatable per seed.
function mulberry32(seed) {
  let t = seed | 0;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function rngFromString(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return mulberry32(h);
}

export function sampleN(arr, n, rng) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}
