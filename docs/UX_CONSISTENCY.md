# UX consistency — quick wins

Last updated: June 2026 (alpha polish pass)

## Principles

- **Kid play first:** Quest Home, Play, and worlds stay above the fold; parent/marketing copy lives on `/home` (one link) and `/about`.
- **Typography:** Playfair Display + Space Grotesk on marketing (`elegant-page`, landing, about); chunky kid UI elsewhere.
- **FABs:** “Let’s get started” top-right on landing only; feedback bottom-left, lifted above bottom nav on play routes.

## Fixes applied

| Issue | Fix |
|-------|-----|
| Duplicate parent marketing on home | Removed expandable `DiscoverMore`; single “About us” link |
| `/about` required login | Public route; works pre-login and logged-in |
| Curiosity Hub triple chrome | Hide `TopBar` + Quest Home FAB on `/curiosity` |
| Feedback overlapped bottom nav | Dynamic bottom offset on nav-bearing routes |
| Footer links inconsistent | Terms · Privacy · About us on landing, auth shell, legal pages |

## Navigation labels

| Surface | Pattern |
|---------|---------|
| Bottom nav | Home · Explore · **Play!** · Win! · Me |
| Cosmic home header | **Quest Home** eyebrow |
| In-page back (hubs) | `← Home` or parent hub name |
| Floating shortcut | **Quest Home** (learning pages only) |

## Where marketing must NOT appear

Geography, Math, Science, Trivia, Curiosity (detail), Journey, Settings, Profile — no `DiscoverMore`, `BeyondSchoolGrid`, or landing CTAs.

## Follow-ups (not blocking)

- Retire unused `DiscoverMore.jsx` / `ParentPeekBanner.jsx` after confirming no imports.
- Unify hub back labels (`Home` vs hub name) in a shared `PageBack` component.
- Empty states for zero-progress Journey cards.
