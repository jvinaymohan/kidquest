# KidQuest — Launch readiness review

**Purpose:** What is **absolutely required** to ship an **alpha invite** (friends, family, small classrooms) — vs what can wait.  
**Review date:** May 2026 · **App version:** `0.2.0-alpha.1`  
**Related:** [PRD.md](./PRD.md) (full vision) · [SMOKE.md](./SMOKE.md) (QA steps) · [ALPHA_TODO.md](./ALPHA_TODO.md) (sprint)

---

## 1. Define “launch” for this review

| Launch type | Audience | Bar |
|-------------|----------|-----|
| **A — Alpha invite** (recommended now) | 20–200 families, 1–2 teachers | Core learn path works; cloud sync; no P0 crashes; basic legal pages; you can support users manually |
| **B — Public beta** | Open signup, marketing | COPPA verifiable consent, privacy policy, moderation for UGC, App Store compliance, load testing |
| **C — Community platform** (PRD) | Crowdsourcing, monetization | Phases 8–10 — **not required** for A or B |

**This doc optimizes for Launch A.** Items marked **BLOCKER** block alpha; **REQUIRED** should ship with alpha; **RECOMMENDED** strong polish; **LATER** post-alpha.

---

## 2. Executive summary

### Ready today

- **Core product:** 5-tab app, onboarding, 7 subjects + multiplication camp (5 phases), Life Explorer, compete modes.
- **Engineering:** Production build passes; Vercel + Supabase architecture; schema idempotent; auth (email, reset, Google code path).
- **Parent/teacher:** PIN settings, classrooms, assignments, digests, CSV export, weak-area hints.
- **Safety basics:** No kid chat; friends via codes; parent consent gate for explorer social; RLS on tables.

### Not ready without your action

| Gap | Why it matters |
|-----|----------------|
| **DB schema not applied** on production DB | Add **Session pooler URL** or paste SQL in Editor — [SUPABASE_PRODUCTION.md](./SUPABASE_PRODUCTION.md) |
| **Manual QA not signed off** | [SMOKE.md](./SMOKE.md) is all unchecked; alpha exit criteria in ROADMAP open |
| **Vercel + Supabase Auth URLs** | Set env vars and redirect URLs — [SUPABASE_PRODUCTION.md](./SUPABASE_PRODUCTION.md) |
| **Google OAuth (optional)** | Hidden until `VITE_ENABLE_GOOGLE_OAUTH=true` after [GOOGLE_AUTH.md](./GOOGLE_AUTH.md) setup |

### Do not block alpha (but don’t oversell)

- Community UGC / moderation queue (Phase 8 PRD)
- Stripe / KidQuest Plus
- Teen mode 13–18
- Live Impact stats, Open Library/TMDB
- Facebook login (still disabled on landing)
- Full i18n beyond EN/ES strings in code

---

## 3. Launch A — absolute requirements (your review list)

### BLOCKER — Infrastructure & data

- [ ] **B1.** Apply `supabase/schema.sql` to production — **you must run** ([SUPABASE_PRODUCTION.md](./SUPABASE_PRODUCTION.md): pooler URL, SQL Editor, or GitHub Action). CLI fails on IPv6-only networks from this machine.
- [ ] **B2.** Vercel **Production** env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` set and redeployed ([SUPABASE_PRODUCTION.md](./SUPABASE_PRODUCTION.md))
- [ ] **B3.** Supabase **Auth** URLs configured ([SUPABASE_PRODUCTION.md](./SUPABASE_PRODUCTION.md))
- [x] **B4.** Password rotated in `.env.local` (never commit)

### BLOCKER — Legal & trust (minimum for kids)

- [x] **B5.** **Privacy Policy** at `/privacy`
- [x] **B6.** **Terms of Use** at `/terms`
- [x] **B7.** Registration: Terms + Privacy checkboxes; parental consent for kid role
- [x] **B8.** Parent PIN: forced change when still default `1234` after unlock

### REQUIRED — Core user journey (must pass once on real devices)

Run [SMOKE.md](./SMOKE.md) on **iOS Safari** + **Chrome Android** + desktop:

- [ ] **R1.** Register (email) → email confirm flow understood (disable confirm in Supabase for alpha OR document “check inbox”)
- [ ] **R2.** Onboard → Home → complete **one lesson** (any subject) → progress persists after refresh
- [ ] **R3.** Multiplication table **7**: Learn → Practice → Drill → Boss (no crash; session summaries)
- [ ] **R4.** Speed run → score on leaderboard when logged in (Compete shows “Supabase live”)
- [ ] **R5.** Parent: create classroom + assignment → kid account in class sees assignment on Home
- [ ] **R6.** Sign out → sign in → progress still on server (cloud sync)

### REQUIRED — Auth (pick what you promise)

- [ ] **R7.** Email/password login reliable on production domain
- [x] **R8.** Google buttons hidden until `VITE_ENABLE_GOOGLE_OAUTH=true` (enable after [GOOGLE_AUTH.md](./GOOGLE_AUTH.md) + test on prod)

### RECOMMENDED — Alpha quality (1–2 days)

- [ ] **Q1.** Full multiplication 1→Legend spot-check on mobile (one table path documented as “hero demo”)
- [ ] **Q2.** Geography map-locate: 5 questions without crash
- [ ] **Q3.** Coaching copy pass: no harsh “wrong” on key kid screens
- [ ] **Q4.** Touch targets: keypad ≥72px (already in `AnswerKeypad`; verify on device)
- [ ] **Q5.** `npm run lint` — fix or waive only non-shipping files
- [ ] **Q6.** Optional: run Playwright smoke after `npm install -D @playwright/test`

### LATER — Post-alpha (do not block invite)

- Community mission submit + moderation (PRD Phase 8)
- Weekly parent email digest
- Multi-child profile switcher UI (`child_profiles` table exists, no UI)
- Stripe / scholarships
- Teen mode
- Facebook OAuth
- App Store / Play Store packages

---

## 4. Feature inventory vs launch need

| Area | Shipped | Launch A need | Notes |
|------|---------|---------------|-------|
| Landing / register / login | ✅ | REQUIRED | Supabase required when env set |
| Google OAuth | Code ✅, config ⬜ | RECOMMENDED | [GOOGLE_AUTH.md](./GOOGLE_AUTH.md) |
| Onboarding + avatar | ✅ | REQUIRED | |
| Home dashboard | ✅ | REQUIRED | Next step, daily challenge, assignments |
| 7 subjects + lessons | ✅ | REQUIRED | At least 1 subject polished |
| Multiplication 1–20 | ✅ | REQUIRED | Hero differentiator |
| Explore / Create / Compete | ✅ v1 | REQUIRED | Not placeholder-empty |
| Life Explorer | ✅ v1 | RECOMMENDED | Map, journals, stories |
| Friends / Daily Duel | ✅ | RECOMMENDED | Needs schema + consent |
| Parent Settings (PIN) | ✅ | REQUIRED for parents | |
| Classrooms / assignments | ✅ | REQUIRED if teachers invited | |
| i18n EN/ES | Partial | LATER | Settings toggle exists |
| PWA / service worker | ✅ shell | LATER | |
| Privacy / Terms pages | ❌ | **BLOCKER** for public URL | |
| UGC / Ideas board | ❌ | LATER (PRD) | |
| Monetization | ❌ | LATER | |

---

## 5. Known technical risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| IPv6-only DB host | High | Use `SUPABASE_DB_POOLER_URL` ([DB_APPLY.md](./DB_APPLY.md)) |
| Supabase off → app local-only | Medium | Never ship production without `VITE_SUPABASE_*` |
| Compete subject boards fall back to **mock peers** | Low | Label “local preview” until cloud has data; OK for alpha |
| Assignments: kid told to “mark complete in Settings” | Low | UX fix post-alpha |
| `child_profiles` no UI | Low | One account per kid for alpha |
| ESLint errors in repo | Low | Build passes; clean before hiring contributors |
| Explorer consent is button-only | Medium | OK for alpha; real COPPA for Launch B |

---

## 6. Alpha exit criteria (from ROADMAP) — sign-off

| Criterion | Status |
|-----------|--------|
| New user: register → onboard → 1 lesson + 1 mul phase → data in Supabase | ⬜ Not verified |
| Speed run on leaderboard when authenticated | ⬜ Not verified |
| Parent classroom + assignment visible to kid | ⬜ Not verified |
| No P0 crashes iOS Safari + Chrome Android | ⬜ Not verified |

**Sign-off owner:** _______________ **Date:** _______________

---

## 7. Suggested order of work (this week)

1. **B1–B4** — DB + Vercel + secrets (half day)  
2. **B5–B7** — Privacy + Terms + register links (half day; can use simple markdown pages in app)  
3. **R1–R6** — Full smoke on phone + Supabase dashboard spot-check (half day)  
4. **R8** — Google: configure OR hide buttons (1 hour)  
5. **Q1–Q4** — Polish pass if time (1 day)  
6. Invite 10 families with known emails for support  

---

## 8. What PRD community vision is NOT for this launch

Defer until **Launch B** or later:

- Contributor portal + moderation queue  
- 50–100 life-skills **missions** (vs existing lessons)  
- 1:1 subscription give-back seats  
- Teen Explorer mode  
- Sponsored packs  

See [PRD.md §8](./PRD.md#8-mvp-scope-prove-safety--engagement).

---

*Update this doc when alpha is signed off; move completed items to ROADMAP “shipped” section.*
