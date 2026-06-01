# Expanding Geography to 195 Countries

KidQuest ships with **194 UN member countries** in `src/data/geography/countries-slim.json`, plus fun facts in `funFacts.json`.

## Architecture

| Layer | File | Purpose |
|-------|------|---------|
| Country data | `countries-slim.json` + `funFacts.json` | Name, flag, capital, continent, currency, lat/lng |
| Difficulty tiers | `difficulty.js` | TIER_1/2/3 pools by age group |
| Mastery tiers | `mastery.js` | Explorer / Regional / World Master + `SEED_BY_CONTINENT` |
| Question generators | `geography.js` | Flags, capitals, map, continents — all attach `countryCode` |
| Progress | `useGeographyStore.js` | Per-country SM-2 reviews + mastery session stats |
| Wrong-answer UX | `CountryWrongAnswerPanel.jsx` | Flag, facts, map pin on misses |

## Adding countries to Regional tier

Edit `SEED_BY_CONTINENT` in `src/data/geography/mastery.js` — add ISO2 codes (e.g. `"RW"` for Rwanda). Regional sessions sample from seeds first, then fall back to all countries on that continent.

## Adding fun facts

Add entries to `src/data/geography/funFacts.json`:

```json
"RW": "Rwanda is known as the Land of a Thousand Hills."
```

## Full 195-country rollout checklist

1. **Data**: Ensure `countries-slim.json` includes any missing territories you want (Vatican, Palestine, etc.).
2. **Facts**: Batch-add `funFacts.json` entries (start with TIER_1, then per-continent).
3. **Seeds**: Expand `SEED_BY_CONTINENT` to ~40 countries per continent for Regional tier.
4. **World Master**: Already uses full `COUNTRIES` pool — spaced repetition via `recordSRReview` in lessons and mastery sessions.
5. **QA**: Run `npm run build` and smoke-test `/geography/mastery` for each tier.

## Question counts by tier

| Tier | Questions/session | Pool |
|------|-------------------|------|
| Explorer | 10 | TIER_1 (~30 famous countries) |
| Regional | 10 | Seeded countries per continent |
| World Master | 15 | All countries in dataset |

Adjust in `mastery.js` → `GEO_TIERS[].questionCount`.
