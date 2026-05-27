import { COUNTRIES } from "../data/geography/countries";

const NAME_ALIASES = {
  "United States of America": "US",
  "United States": "US",
  "USA": "US",
  "United Kingdom": "GB",
  "UK": "GB",
  "Russia": "RU",
  "Russian Federation": "RU",
  "South Korea": "KR",
  "Korea": "KR",
  "North Korea": "KP",
  "Czechia": "CZ",
  "Czech Republic": "CZ",
  "Ivory Coast": "CI",
  "Côte d'Ivoire": "CI",
  "Dem. Rep. Congo": "CD",
  "Democratic Republic of the Congo": "CD",
  "Congo": "CG",
  "Republic of the Congo": "CG",
  "Tanzania": "TZ",
  "United Republic of Tanzania": "TZ",
  "Vietnam": "VN",
  "Viet Nam": "VN",
  "Laos": "LA",
  "Lao PDR": "LA",
  "Syria": "SY",
  "Syrian Arab Republic": "SY",
  "Iran": "IR",
  "Iran (Islamic Republic of)": "IR",
  "Bolivia": "BO",
  "Venezuela": "VE",
  "Brunei": "BN",
  "Moldova": "MD",
  "Republic of Moldova": "MD",
  "North Macedonia": "MK",
  "Eswatini": "SZ",
  "Swaziland": "SZ",
  "Palestine": "PS",
  "State of Palestine": "PS",
  "Taiwan": "TW",
  "W. Sahara": "EH",
  "Western Sahara": "EH",
};

const nameToCode = new Map();
for (const c of COUNTRIES) {
  nameToCode.set(c.name.toLowerCase(), c.code);
}
for (const [name, code] of Object.entries(NAME_ALIASES)) {
  nameToCode.set(name.toLowerCase(), code);
}

export function isoFromMapName(name) {
  if (!name) return null;
  const direct = nameToCode.get(String(name).trim().toLowerCase());
  if (direct) return direct;
  const found = COUNTRIES.find(
    (c) =>
      c.name.toLowerCase() === name.toLowerCase() ||
      name.toLowerCase().includes(c.name.toLowerCase()) ||
      c.name.toLowerCase().includes(name.toLowerCase())
  );
  return found?.code ?? null;
}

export const MAP_VIEWS = {
  world: { center: [10, 20], scale: 130 },
  Africa: { center: [20, 2], scale: 320 },
  Asia: { center: [95, 35], scale: 280 },
  Europe: { center: [15, 54], scale: 450 },
  Americas: { center: [-75, 8], scale: 220 },
  Oceania: { center: [140, -22], scale: 380 },
};

export function zoomForContinent(continent) {
  return MAP_VIEWS[continent] ?? MAP_VIEWS.world;
}
