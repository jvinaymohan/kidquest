# KidQuest

A global, gamified learning adventure for kids ages 4–14 — History, Geography, Music, Math, General Knowledge, Trivia, and Solar System — with a full **Multiplication Mastery** camp (tables 1×–20×), parent/teacher tools, and cloud-backed progress.

> **Stack:** React (Vite) · Tailwind CSS · Framer Motion · Zustand · React Router v6 · Supabase (Auth + Postgres)  
> **Deploy:** Vercel (frontend) · Supabase (backend) · Docker (optional self-host)

📋 **[Product PRD →](docs/PRD.md)** — community vision, safety, monetization, MVP scope.  
📋 **[Engineering roadmap →](docs/ROADMAP.md)** — phases 0–10, shipped features, delivery timeline.

---

## What KidQuest is

KidQuest is built around five kid-facing tabs:

| Tab | Purpose |
|-----|---------|
| **Learn** | Dashboard, subject progress, review due, speed-run challenge |
| **Explore** | Geography map learning, Solar System explorer |
| **Create** | Creative prompts and “today’s plan” (expanding to Life Explorer) |
| **Compete** | Speed-run leaderboard, subject challenges |
| **Me** | Profile, badges, streaks, parent dashboard link |

**Roles:** Kid, Parent, and Teacher accounts (email/password). Progress syncs to Supabase when configured.

**Mastery model:** Learn → Practice → Speed Drill → Boss Battle → Legend (multiplication is fully implemented; other subjects use lesson stars + progressive unlock today).

---

## Highlights (current build)

- **7 learning areas** — History, Geography, Music, Math, General Knowledge, Trivia, plus bonus **Solar System**
- **Geography** — 194 countries, interactive world map, map-locate quizzes, learn/browse mode
- **Multiplication Mastery** — 400 facts (1×1–20×20), 5 phases per table, SM-2 review, 50-question speed run, shareable result cards
- **3 age groups** — Explorer (4–6), Adventurer (7–10), Champion (11–14)
- **Gamification** — XP, named levels, streaks, badges, subject ranks, confetti
- **Auth & cloud** — Register, login, profiles, lesson + multiplication sync, classrooms, assignments, leaderboards
- **Parent zone** — PIN-protected dashboard, digests, CSV export, classroom tools
- **Kid UX** — Dark game header, mascot-led design, encouraging wrong-answer copy

---

## Quick start

```bash
cd kidquest
npm install --legacy-peer-deps
cp .env.example .env.local   # add your Supabase keys (see below)
npm run dev
```

Open **http://localhost:5173** → `/landing` → register or sign in.

### Environment variables (`.env.local`)

```env
# Frontend (required for cloud features)
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Database schema apply (npm run db:apply) — never commit real passwords
SUPABASE_PROJECT_REF=YOUR_PROJECT_REF
SUPABASE_DB_PASSWORD=your_database_password
```

### Useful scripts

| Command | What it does |
|---------|----------------|
| `npm run dev` | Local dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build on :4173 |
| `npm run db:apply` | Apply `supabase/schema.sql` to your Supabase project |
| `npm run lint` | ESLint |

---

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Apply schema (automated — no SQL editor copy-paste):

   ```bash
   npm run db:apply
   ```

   Uses `SUPABASE_PROJECT_REF` + `SUPABASE_DB_PASSWORD` from `.env.local`. Idempotent — safe to re-run after schema changes.

3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env.local` and Vercel.
4. **Auth → Email:** disable “Confirm email” for frictionless alpha, or keep it for production.
5. **Google sign-in:** enable Google provider and redirect URLs — full steps in [`docs/GOOGLE_AUTH.md`](docs/GOOGLE_AUTH.md).

**CI:** Add `SUPABASE_DB_URL` (or ref + password) as GitHub secrets. Pushes to `main` that touch `supabase/schema.sql` run [`.github/workflows/supabase-schema.yml`](.github/workflows/supabase-schema.yml).

**Schema includes:** profiles, user_stats, lesson_progress, multiplication progress, geography/solar progress, life_explorer_items, friends, daily_duels, user_preferences, child_profiles, subject_mastery_leaderboard view, classrooms, assignments, parent_digests, speed_run_results + leaderboard view, RLS, new-user trigger.

---

## Deploy to Vercel

1. Push to GitHub and import at [vercel.com/new](https://vercel.com/new).
2. Settings:
   - **Build:** `npm run build`
   - **Output:** `dist`
   - **Install:** `npm install --legacy-peer-deps`
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for Production, Preview, and Development.

`vercel.json` provides SPA rewrites, asset caching, and security headers.

**Verify after deploy:** register → onboard → play multiplication → check Supabase tables → Compete tab shows “Supabase live” leaderboard.

---

## Docker (optional)

```bash
docker compose up --build    # http://localhost:8080
# or
docker build -t kidquest:latest .
docker run --rm -p 8080:80 kidquest:latest
```

---

## Project structure

```
kidquest/
├── docs/
│   ├── PRD.md               # Product requirements (community platform vision)
│   ├── MODERATION.md        # UGC & child-safety policy
│   ├── ROADMAP.md           # Engineering roadmap (phases 0–10)
│   ├── ALPHA_TODO.md        # Tactical alpha checklist
│   └── UX_REDESIGN_V1.md     # UX architecture rules
├── supabase/
│   └── schema.sql           # Database schema (apply via npm run db:apply)
├── scripts/
│   └── apply-schema.mjs     # Automated schema runner
├── src/
│   ├── pages/               # Landing, Home, Subject, Lesson, Multiplication*, Settings…
│   ├── components/          # UI, quiz, multiplication, geography map, mascots
│   ├── store/               # useAppStore, useMultiplicationStore, useAuthStore
│   ├── lib/cloud/           # auth, progress sync, leaderboard, classrooms
│   └── data/                # Subject JSON + geography + solar + multiplication
├── Dockerfile
├── docker-compose.yml
└── vercel.json
```

---

## Learning model

1. **Concept** — Short explanation + emoji + fun fact  
2. **Quiz** — Multiple choice, fill-in, true/false, ordering, map-locate (geography)  
3. **Feedback** — Instant, encouraging coaching  
4. **Results** — Stars, XP, badges, level-up  
5. **Mastery** — Progressive unlock; multiplication uses explicit 5-phase journey per table  

**Multiplication routes:** `/multiplication`, `/multiplication/table/:n`, learn/practice/drill/boss, `/multiplication/review`, `/multiplication/speed-run`, `/multiplication/results`.

---

## Adding content

Edit JSON under `src/data/` (see existing `history.json`, `geography/`, `math/`, etc.). Lesson shape:

```json
{
  "id": "math-adv-006",
  "title": "Negative Numbers",
  "concept": { "text": "…", "emoji": "🌡️", "funFact": "…" },
  "questions": [
    { "type": "choice", "prompt": "…", "options": ["A", "B"], "answer": "A" }
  ]
}
```

Question types: `yes-no`, `choice`, `fill`, `tf`, `order`, plus `map-locate` for geography.

---

## Parent & teacher zone

**Settings** (`/settings`) — PIN default `1234` (change in-app).

When signed in with Supabase:

- Create/join **classrooms** with shareable codes  
- **Assignments** with due dates and subject templates  
- **Daily digest** log + **CSV export** (lessons + multiplication tables)  
- Daily goals, age group, sound, time-per-subject, progress reset  

---

## Roadmap at a glance

| Phase | Focus |
|-------|--------|
| **0 — Alpha (now)** | Stable deploy, auth, core Math/Geo/Solar QA |
| **1 — Hardening** | Audio, session summaries, E2E tests, password reset |
| **2 — Mastery engine** | 5-phase geography/solar; unified review hub |
| **3 — Accounts** | OAuth, COPPA, multi-child, moderation |
| **4 — Social** | Friends, duels, real subject leaderboards |
| **5 — Parent/Teacher** | Email digests, class heatmaps, PDF exports |
| **6 — Global Edition** | i18n, PWA, offline, Tesla mode, a11y |
| **7 — Life Explorer** | Personal map, journals, stories, Create tab |
| **8–9 — Community & scale** | Contributions, subscriptions, native apps |

Details, status columns, and success metrics: **[docs/ROADMAP.md](docs/ROADMAP.md)**

---

## Design & accessibility

- **Fonts:** Baloo 2 (display) + Nunito (body)  
- **UI:** Chunky cards, thick borders, spring animations, phase colors (Learn=green … Legend=gold)  
- **Targets:** ≥48px tap targets; focus rings; encouraging error copy  
- **Goals:** WCAG AA and dyslexia-friendly font (planned — Phase 6)  

---

## License & credits

Designed by Vinay · Built with Cursor · Knowledge is free.

For tactical tasks this week, see [docs/ALPHA_TODO.md](docs/ALPHA_TODO.md).
