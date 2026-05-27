# KidQuest Initial Alpha To-Do

Updated: 2026-05-27

## P0 - Must be done before alpha invite

- [ ] Stabilize app startup and runtime
  - [x] Keep dev launch stable on `127.0.0.1:5173`
  - [ ] Add production error boundary fallback screen per route group
  - [ ] Add a simple health checklist (home, one subject, one lesson, multiplication, profile, settings)
- [ ] Finalize kid IA and route consistency
  - [x] 5-tab nav (`Learn`, `Explore`, `Create`, `Compete`, `Me`)
  - [ ] Ensure every tab destination has complete, non-placeholder content for alpha
  - [ ] Ensure back navigation feels consistent from drills/results
- [ ] Multiplication module alpha readiness
  - [x] Core pages + phases + local state + speed run
  - [ ] Remove blocking UX bugs from full 1->5 journey
  - [ ] Add session-end summaries for Learn/Practice/Drill/Boss
  - [ ] Add guardrails for accidental exits during active timed sessions
- [ ] Parent control accessibility
  - [x] Parent dashboard reachable from Me/Profile
  - [ ] Parent unlock-all-tables flow UX polish and copy review
  - [ ] Parent daily-goal messaging tied to multiplication sessions too

## P1 - Strongly recommended for alpha quality

- [ ] Login/onboarding redesign alignment
  - [ ] Match final dark hero + mascot-first composition
  - [ ] Add social auth shell UI states (real auth can remain deferred)
  - [ ] Add pre-signup "what you'll explore" visual proof section
- [ ] Dashboard polish pass
  - [x] Review due interruption card
  - [x] Speed challenge card
  - [ ] Subject cards show clear current phase labels in UI
  - [ ] Add "next best action" copy on each major card
- [ ] UX consistency pass
  - [ ] Touch targets >=48px everywhere, >=72px on numeric keypad
  - [ ] Replace any harsh wording on mistakes with coaching copy
  - [ ] Ensure persistent progress indicators on all practice screens

## P2 - Can ship right after alpha starts

- [ ] Audio system integration (Howler) + settings toggles for effects/music
- [ ] Result share card generation for speed runs
- [ ] Better charting for personal best trend
- [ ] Expand Explore/Create/Compete tabs beyond starter hubs

## Deferred (post-alpha / backend phase)

- [ ] Supabase schema integration and user-level sync
- [ ] Global/class leaderboard filters (age/classroom)
- [ ] Teacher assignment tools and parent digest automation
- [ ] Exportable progress reports
- [ ] Advanced spaced repetition analytics and reminders
