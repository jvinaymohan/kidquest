# UX consistency — layout & navigation

Last updated: June 2026 (cosmic play shell pass)

## Principles

- **Kid play first:** Quest Home, Play, and worlds stay above the fold; parent/marketing copy lives on `/home` (one link) and `/about`.
- **Typography:** Playfair Display (`elegant-serif`) for hub titles; Space Grotesk (`font-display`) for UI on play routes; Nunito/Baloo on legacy light cards inside quizzes.
- **One cosmic canvas:** Logged-in play routes share `ElegantBackground` + `body.cosmic-route` — not plain navy blocks or orphan light pages.
- **FABs:** “Let’s get started” top-right on landing only; feedback bottom-left, lifted above bottom nav on play routes.

## Canonical logged-in layout

| Layer | Component | Notes |
|-------|-----------|--------|
| Body | `body.cosmic-route` | Set by `AppShell` via `routeChrome()` for all non-immersive play routes |
| Background | `ElegantBackground` in `PlayCosmicShell` / `HubPageLayout` | Same starfield as Quest Home |
| Top chrome | `TopBar` | Back, Quest Home, profile, XP, streak strip — **except** `/home` (custom HUD) |
| Hub header | `HubPageLayout` | Glass header (`hub-glass-header`); no inline `← Home` |
| Topic rows | `HubTopicCard` | Glass / accent cards (`hub-topic-card`) |
| Bottom | `BottomNav cosmic={true}` | Dark bar on all play routes |
| Immersive | Lesson / results / speed-run | `hideTop hideBottom`; Quest Home FAB only |

Route logic lives in `src/utils/playRoutes.js`.

## Navigation labels

| Surface | Pattern |
|---------|---------|
| Bottom nav | Home · Explore · **Play!** · Win! · Me |
| Cosmic home header | **Quest Home** eyebrow |
| TopBar | Chevron back · Home icon · profile |
| Hub pages | **No** duplicate `← Home` text links |
| Immersive sessions | Floating **Quest Home** FAB |

## Hub pages using `HubPageLayout`

- `/curiosity`, `/science`, `/trivia`, `/math`
- `/explore`, `/journey`
- Add new subject hubs here — do not roll custom back links or plain `elegant-page` wrappers.

## Where marketing must NOT appear

Geography, Math, Science, Trivia, Curiosity (detail), Journey, Settings, Profile — no `DiscoverMore`, `BeyondSchoolGrid`, or landing CTAs.

## Fixes applied (June 2026)

| Issue | Fix |
|-------|-----|
| Curiosity Hub plain navy + `← Home` | `HubPageLayout` + TopBar; glass spark cards |
| Light bottom nav on dark page | `BottomNav cosmic` on all play routes |
| Curiosity hid TopBar / FAB | Removed `isCuriosityHub` exceptions in `AppShell` |
| Inconsistent hub back links | Removed inline `← Home`; TopBar only |
| Duplicate Quest Home | FAB only when TopBar hidden (immersive) |

## Follow-ups (not blocking)

- Migrate `MathMasteryHub`, `MultiplicationHub`, `ReviewHub`, `CompeteHub` to `HubPageLayout` headers.
- Retire unused `DiscoverMore.jsx` / `ParentPeekBanner.jsx` after confirming no imports.
- Empty states for zero-progress Journey cards.
