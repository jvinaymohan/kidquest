# KidQuest Alpha UX Guide

Production: https://kidquest-indol.vercel.app

## Routes: logged out vs logged in

| Audience | Home route | Purpose |
|----------|------------|---------|
| Visitor (not signed in) | `/landing` | Marketing, invite CTAs, minimal scroll |
| Signed-in kid | `/home` | Daily hub — play, spark, worlds, streak |

Auth entry (`/` or unknown paths) redirects to `/landing` or `/home` based on session.

---

## Parent journey (alpha)

1. **Register** — `/register` (invite code if required).
2. **Onboard child** — `/onboarding` (name, avatar, age band).
3. **Set limits** — Settings → enter Parent PIN → **Screen time limits** (optional daily max minutes), **Age group**, **Curiosity Hub** (region, sensitivity, topic approval).
4. **Monitor** — Settings (PIN) → **Family time** (today total, section breakdown, 7-day bars). Read-only for alpha; data is local to the device.

Default parent PIN is `1234` — change it on first unlock.

---

## Child journey (alpha)

1. **Login** — `/login` (email or Google).
2. **Home** — `/home` (streak/XP header, curiosity spark, quick launch, 3 live worlds).
3. **Pick a world** — Geography, Math, Solar, Science, Trivia, Curiosity, etc.
4. **Learn / quiz** — subject hubs → lessons or mastery sessions.
5. **Journey recap** — `/journey` (My Journey).
6. **Logout** — **Me** tab (`/profile`) → **Sign out**, or Settings (before/after PIN) → Sign out. Confirm: “See you next time, [name]!”

---

## Navigation patterns

- **Bottom nav** — Home (`/home`), Explore, Play (Math), Win, Me.
- **Quest Home** — floating pill on all logged-in pages except `/home`; **Top bar** back + home on learning pages; logo on home scrolls to hub.
- **Pre-login** — marketing stays on `/landing`; no `/home` until signed in.

---

## Screen time (alpha)

- **Tracking** — `useRouteScreenTime` in `AppShell` ticks every 5s per route section (Geography, Math, Multiplication, Science, Trivia, Curiosity, etc.) into `useScreenTimeStore` + `localStorage`.
- **Kid** — gentle “You've explored X min today” on home when ≥ 1 minute.
- **Parent** — Settings (PIN) → **Family time** + optional daily cap field.

---

## What to test (checklist)

- [ ] Logout → lands on `/landing`; login again restores session/progress.
- [ ] **Quest Home** from ≥ 5 routes: Math, Geography, Science, Trivia, Curiosity, Journey, Settings.
- [ ] Bottom nav **Home** always opens `/home`.
- [ ] Logged-in home: no long marketing stack; **Discover more** expands extra content.
- [ ] Visit Geography / Math / Science / Trivia / Curiosity — Family time shows minutes after ~1 min.
- [ ] Parent PIN blocks dashboard; kid cannot change age/limits without PIN.
- [ ] Parent PIN change from default `1234`.
- [ ] Mobile iPhone viewport: home fits with less scroll than before.

---

## Known limitations (alpha)

- Screen time is **per device** (localStorage), not synced to Supabase.
- Daily cap is stored but **not enforced** (monitor-only).
- Per-section caps not implemented.
- Some subjects still “coming soon” on worlds grid.
- Lesson/results routes use minimal chrome; use **Quest Home** float to exit.
- Weekly chart is simple bars, not exportable.

---

## Key files

| Area | Files |
|------|--------|
| Sign out | `src/components/auth/SignOutButton.jsx`, `src/lib/cloud/auth.js` |
| Home nav | `src/components/layout/AppShell.jsx`, `BottomNav.jsx`, `TopBar.jsx` |
| Home UI | `src/pages/Home.jsx`, `src/components/home/DiscoverMore.jsx` |
| Screen time | `src/store/useScreenTimeStore.js`, `src/hooks/useRouteScreenTime.js` |
| Parent UI | `src/pages/Settings.jsx`, `src/components/settings/FamilyTimePanel.jsx` |
