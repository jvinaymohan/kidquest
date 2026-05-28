# KidQuest Initial Alpha To-Do

**Tactical checklist for the current sprint.**  
For the full product vision and phased delivery plan, see **[ROADMAP.md](./ROADMAP.md)**.

Updated: 2026-05-27

## P0 - Must be done before alpha invite

- [x] Stabilize app startup and runtime (dev on :5173)
- [x] Production error boundary per route group
- [x] Smoke checklist: landing → register → home → lesson → multiplication → profile → settings (`docs/SMOKE.md`)
- [x] 5-tab nav (`Learn`, `Explore`, `Create`, `Compete`, `Me`)
- [x] Every tab has complete, non-placeholder content for alpha (Explore/Create/Compete deepened)
- [x] Multiplication core: phases, speed run, SRS, cloud sync
- [ ] Full multiplication 1→Legend journey QA on mobile
- [x] Exit guardrails for timed sessions (drill, boss, speed run)
- [x] Parent dashboard reachable; cloud classrooms + assignments when signed in
- [x] Supabase schema automation (`npm run db:apply`)
- [x] Auth: register, login, roles, profile sync, password reset
- [x] Kid-visible teacher assignments on Home
- [x] Unified `/review` hub + daily challenge on dashboard
- [x] Offline banner when cloud enabled
- [ ] Rotate any exposed database passwords; set GitHub secrets for CI

## P1 - Strongly recommended for alpha quality

- [x] Landing page aligned to mockup (dark hero, mascots, subject grid)
- [x] Dashboard: review card, speed challenge, subject phase grid
- [ ] Social auth (Google) — real OAuth, not disabled shell
- [x] Session-end summaries for Practice/Drill/Boss (`SessionComplete` + Web Audio SFX)
- [ ] Touch targets + coaching copy audit
- [x] Shareable speed-run result card
- [x] Personal best chart (basic)

## P2 - Right after alpha starts

- [x] Web Audio SFX + settings integration (replaces Howler for alpha)
- [x] Deepen Explore / Create / Compete hubs
- [ ] Subject leaderboards from real Supabase aggregates (not mock peers)
- [x] Playwright smoke E2E scaffold (`e2e/smoke.spec.js`, `npm run test:e2e`)

## Moved to ROADMAP (no longer “deferred”)

These are tracked in [ROADMAP.md](./ROADMAP.md) with phase numbers:

- Supabase sync (Phase 0 — largely done)
- Global/class leaderboards (Phase 4)
- Teacher assignments & parent digests (Phase 0/5 — basics done)
- i18n, offline, Tesla mode (Phase 6)
- Life Explorer (Phase 7)
