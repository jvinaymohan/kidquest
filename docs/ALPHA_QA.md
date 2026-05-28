# KidQuest Alpha QA Checklist

**Version:** `0.2.0-alpha.1`  
**Target:** Geography + Solar System + thin mastery v0 (local only)

Run on **iOS Safari** and **Chrome Android** (plus one desktop browser).

## Setup

- [ ] `npm install` && `npm run dev` — app loads at `http://localhost:5173`
- [ ] `npm run build` — production build succeeds
- [ ] Optional: `.env.local` with Supabase vars for cloud sync smoke

## Onboarding & Home

- [ ] Complete onboarding (name, age group, avatar)
- [ ] Home shows **7 subjects** in grid (Solar System marked bonus if visible)
- [ ] Streak / XP / daily goal visible on Home hero
- [ ] Quick nav: Learn · Explore · Create · Compete

## Geography (Priority 1)

- [ ] `/subject/geography` → **5 track cards** (Continents, Flags, Capitals, Map Locator, Currencies)
- [ ] Hub CTA opens **Learn** tab (Countries + World map browse)
- [ ] Complete one track lesson (concept → quiz)
- [ ] **Map Locator** questions show interactive map; tap country to answer
- [ ] After flag/map answers, geography SRS deck updates (Settings shows country count)
- [ ] Profile → **Geography tracks** section shows 5 progress bars

## Solar System (Priority 2)

- [ ] `/subject/solar-system` → Lessons + **Learn** tab
- [ ] Learn: planet explorer, scale strip, sun/moon, missions timeline load without crash

## Learn mode (cross-cutting)

- [ ] Subject tabs: **Lessons** default, **Learn** secondary
- [ ] Spend 60s in Learn → earn gentle XP (cap respected)
- [ ] Badges `curious_mind` / `armchair_explorer` can unlock (optional)

## Math multiplication (supporting)

- [ ] `/multiplication` hub loads; one table path: Learn → Practice → Drill → Boss
- [ ] Math subject shows school-helpful line + link to camp
- [ ] Math Learn: times table grid + drill

## Mastery v0 (Priority 3 thin)

- [ ] `/review` hub lists Multiplication SRS + Geography SRS
- [ ] After geography quizzes, `/review/geography` may show due capitals (if dates due)
- [ ] Home **Review time** pick when mul/geo due > 0
- [ ] Multiplication review at `/multiplication/review`

## Parent / data

- [ ] Settings → Parent PIN unlock
- [ ] Note visible: geography lesson IDs changed (`geo-*-age`) — old progress may reset
- [ ] Export progress JSON works

## Deploy smoke

- [ ] Vercel preview/production loads `/landing` and `/home` after auth/onboarding
- [ ] `docs/ROADMAP.md` reflects alpha scope vs post-alpha priorities

## Alpha exit criteria

- [ ] 7–10 year old completes **one Map Locator round** without adult help
- [ ] Parent understands **Lessons vs Learn**
- [ ] No P0 crashes on mobile Safari + Chrome
