# KidQuest Roadmap

Alpha **0.2.0-alpha.1** focuses on Geography (feature testbed), Solar System (scale proof), Learn Mode, and Math multiplication. Everything below is planned after alpha feedback.

## Shipped in Alpha 0.2

- 194-country geography data (continents, flags, capitals, currencies, **map locator**)
- Flag-icons + interactive world map (`react-simple-maps`)
- **Learn** tab on Geography, Solar System, and Math (Lessons tab default)
- Solar System bonus subject + exploration UI (planets, scale, sun/moon, missions)
- Multiplication lessons + times-table Learn tools
- Learn-time XP (capped) + Curious Mind / Armchair Explorer badges
- About, Impact, monthly themes, named levels, subject ranks

## Priority 3 — Progress & Mastery Engine (full)

- SM-2 spaced repetition per country/item (`easeFactor`, `interval`, `nextReviewDate`)
- 5-stage mastery: Introduce → Practice → Review → Master → Legend
- `/review` session page + **Review Time** card on Home
- Per-track geography ranks; continent unlock progression (home continent first)
- World Map of Knowledge on Profile
- Champion hot/cold map feedback + distance on wrong pins

## Priority 4 — Social Competition & Collaboration

- Friends (username / QR), Daily Duel, Subject Showdown, Team Quests
- Global, friend, and classroom leaderboards (Supabase Realtime)
- Shareable rank cards, subject certificates

## Priority 5 — Parent & Teacher Dashboards

- Parent: progress reports, weekly digest, goals, weak-area highlights
- Teacher: classrooms, assignments, class progress export (PDF)
- Enhanced Parent Zone beyond PIN settings

## Priority 6 — Accounts & Beta Rollout

- Supabase Auth (email, Google, Facebook)
- Cloud progress sync, multi-child profiles
- COPPA parent consent for under-13 sharing
- Invited beta cohort

## Priority 7 — Global Expansion

- `react-i18next` (EN, ES, FR, HI, PT, AR + RTL)
- PWA + service worker + offline geography tracks
- Tesla mode layout (`?tesla=true`, large touch targets)
- Low-bandwidth lazy loading audit
- Accessibility (WCAG AA, dyslexia-friendly font option)

## Phase 9 — Life Explorer Module

- Personal world map with place pins (visited / dream / home)
- Reading journal (Open Library), Movie journal (TMDB), Music journal (MusicBrainz)
- Story editor, book builder, PDF export
- AI story starter (Claude API)
- My KidQuest Website (private / link / class sharing)
- Bottom nav: Learn | Explore | Create | Me

## Deferred polish

- 50+ badge catalog, sound (Howler.js), Ideas Board, contributor credits
- Constellations (Champion), NASA planet imagery
- KidQuest Plus / Classroom subscriptions, Impact live counters
