# KidQuest Alpha Launch Guide

**Version:** `0.2.0-alpha.1`  
**Production:** https://kidquest-indol.vercel.app  
**GitHub:** https://github.com/jvinaymohan/kidquest  
**Supabase project:** `cspwbyhhouucmtxrpxwe`

---

## Alpha scope — what's live vs coming soon

### Live (test in alpha)

| Area | Routes / features |
|------|-------------------|
| **Marketing & auth** | `/landing`, `/register`, `/login`, `/invite-request`, `/forgot-password`, `/reset-password`, `/about`, `/privacy`, `/terms` |
| **Onboarding** | `/onboarding` — kid name, avatar, age band |
| **Home & nav** | `/home` — play CTA, live worlds, journey link; bottom nav (Home, Explore, Play, Win, Me); Quest Home FAB on immersive routes |
| **Math** | `/math` → Math Master, Multiplication Stages, Multiplication Camp |
| | `/math-master`, `/math-master/:op/level/:level` |
| | `/multiplication` — table grid, learn → practice → drill → boss, review, speed run |
| | `/math/stages`, `/math/stages/:stageId` — accuracy + speed mastery |
| **Geography** | `/subject/geography` — 5 tracks, Learn tab, map locator |
| | `/geography/mastery` — tier sessions, wrong-answer facts/map panel |
| **Solar System** | `/subject/solar-system` — lessons + Learn tab |
| **Science** | `/science`, `/science/:topicId` |
| **Trivia** | `/trivia`, `/trivia/:categoryId` |
| **Curiosity Hub** | `/curiosity`, `/curiosity/spark/:id`, `/curiosity/weekly/:id`, `/curiosity/theme/:month` |
| **Journey & profile** | `/journey`, `/profile`, `/settings` (parent PIN, screen time, curiosity controls, level placement) |
| **Review** | `/review`, `/review/geography`, `/multiplication/review` |
| **Share & feedback** | Streak/session share (Web Share API + clipboard); feedback FAB → `submit_app_feedback` RPC |
| **Admin** | `/admin` — dashboard, referrals, invites (admin email only) |

### Coming soon (visible but limited)

- History, Music, General Knowledge, Art worlds on landing/home grids
- Life Explorer (`/life/*`) — exploratory, not alpha-critical
- Daily Duel / Friends leaderboards — mock or thin data
- Screen time daily cap enforcement (tracking only in alpha)
- Cross-device screen time sync

---

## Tester checklist

Run on **iPhone Safari** and **Chrome Android** (plus one desktop browser).

### Parent journey

1. Open `/landing` → **Let's get started** → register with invite code (if required).
2. Complete `/onboarding` for your child.
3. Go to **Me** → **Settings** → enter Parent PIN (`1234` default) → **change PIN** on first unlock.
4. Set **Screen time limit** (optional), **Age group**, **Curiosity Hub** controls (region, sensitivity, cadence).
5. Check **Family time** panel after ~1 minute of kid play (local device only).
6. Sign out from Profile or Settings → confirm landing at `/landing`.

### Child journey

1. Sign in at `/login` (email or Google if enabled).
2. **Home** — tap **Play!**, open a world (Geography, Math, Science, Trivia, Curiosity).
3. Complete one activity in each of 3 worlds (e.g. one geography track lesson, one multiplication practice round, one trivia quiz).
4. Open **Quest Home** from an immersive route (lesson, math stage session).
5. Check **My Journey** (`/journey`) for progress bars.
6. Save a Curiosity spark → verify it appears under **Saved for later**.
7. Tap **Send feedback** (FAB) → submit a short note → confirm success or local fallback message.

### Quick smoke (5 minutes)

- [ ] `/landing` — Einstein quote at top, getting started top-right, About us in footer
- [ ] Bottom nav: all 5 tabs load without crash
- [ ] `/math` → Math Master level loads
- [ ] `/subject/geography` → one track opens
- [ ] `/curiosity` — hub loads (no infinite spinner)
- [ ] Logout → `/landing`

---

## Known limitations

- **Screen time** is per-device (`localStorage`), not synced to Supabase; daily cap is stored but not enforced.
- **Progress** is primarily local; cloud sync depends on Supabase auth + schema being applied.
- **Google OAuth** hidden unless `VITE_ENABLE_GOOGLE_OAUTH=true` and Google/Supabase providers configured.
- **Feedback RPC** may fall back to local storage if RLS or network fails — message explains this.
- **Multiplication Hub / Settings / Profile** use legacy chunky-card layout (cosmic hub refresh in progress per `ALPHA_UX.md`).
- **Geography lesson IDs** use `geo-*-age` pattern — old progress may not carry over.
- Lesson/results routes hide top/bottom nav; use **Quest Home** FAB to exit.

---

## Supabase manual steps

See also [SUPABASE_PRODUCTION.md](./SUPABASE_PRODUCTION.md) and [GOOGLE_AUTH.md](./GOOGLE_AUTH.md).

### Required before alpha testers

1. **Apply schema** — `npm run db:apply` or paste `supabase/schema.sql` in SQL Editor.
2. **Vercel env vars** (Production + Preview):
   - `VITE_SUPABASE_URL` = `https://cspwbyhhouucmtxrpxwe.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = anon public key from Supabase API settings
3. **Auth redirect URLs** (Supabase → Authentication → URL Configuration):
   - Site URL: `https://kidquest-indol.vercel.app`
   - Redirect URLs:
     - `https://kidquest-indol.vercel.app/auth/callback`
     - `http://localhost:5173/auth/callback`
4. **Email provider** — disable confirm-email for frictionless alpha, or tell testers to check inbox.

### Optional (Google sign-in)

- Enable Google provider in Supabase; configure Google Cloud OAuth client.
- Set `VITE_ENABLE_GOOGLE_OAUTH=true` in Vercel.
- Google redirect URI: `https://cspwbyhhouucmtxrpxwe.supabase.co/auth/v1/callback`

### Verify RPCs exist

```sql
select routine_name from information_schema.routines
where routine_schema = 'public'
  and routine_name in ('submit_app_feedback', 'share_achievement');
```

---

## Environment & deployment

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Local dev at http://localhost:5173 |
| `npm run build` | Production build (must pass before deploy) |
| `npm run test:unit` | Unit tests (quiz session, multiplication stages) |
| `npm run lint` | ESLint (fix critical errors in touched files) |

**Deploy:** Push to `main` → Vercel auto-deploys production. Confirm https://kidquest-indol.vercel.app/landing loads.

**Local Supabase:** Copy `.env.example` to `.env.local` with `VITE_SUPABASE_*` vars. Without them, app runs in offline/local-only mode.

---

## Automated verification (maintainers)

```bash
npm run build          # must exit 0
npm run test:unit      # 5 tests pass
npm run lint           # review errors; fix hooks/crashes in touched files
```

Grep for known crash patterns:

- Missing `lucide-react` imports on icon components
- Zustand selectors returning new objects without `useShallow` (see `useCuriosityPreferencesStore.js`)

---

## Related docs

- [ALPHA_UX.md](./ALPHA_UX.md) — navigation patterns, parent/child flows
- [ALPHA_QA.md](./ALPHA_QA.md) — detailed QA checklist
- [ALPHA_TESTERS.md](../ALPHA_TESTERS.md) — quick start for testers
- [SMOKE.md](./SMOKE.md) — developer smoke path
