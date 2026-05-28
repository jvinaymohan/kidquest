# Share KidQuest with testers (alpha invite)

Use this checklist when sending the app to friends, family, or a small classroom.

## Your live URLs

| Service | URL |
|---------|-----|
| **App (production)** | https://kidquest-indol.vercel.app |
| **GitHub** | https://github.com/jvinaymohan/kidquest |
| **Supabase dashboard** | https://supabase.com/dashboard/project/cspwbyhhouucmtxrpxwe |

Custom domain (optional): Vercel → Project → **Settings → Domains** (e.g. `kidquest.vercel.app`).

---

## One-time setup (you)

### 1. GitHub

Code on `main` triggers Vercel deploys when connected.

```bash
cd kidquest
git push origin main
```

### 2. Vercel

**Settings → Environment Variables** (Production + Preview):

| Variable | Required |
|----------|----------|
| `VITE_SUPABASE_URL` | `https://cspwbyhhouucmtxrpxwe.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public |
| `VITE_ENABLE_GOOGLE_OAUTH` | `false` for email-only alpha, or `true` after Google setup |

Redeploy: **Deployments → … → Redeploy** (or push to `main`).

### 3. Supabase — database schema

**If `npm run db:apply` fails** (password / IPv6): Dashboard → **SQL Editor** → paste `supabase/schema.sql` → **Run**.

Verify:

```sql
select count(*) from information_schema.tables
where table_schema = 'public';
```

Expect many tables (`friend_links`, `geography_country_progress`, etc.).

### 4. Supabase — auth (required for sign-up)

**Authentication → URL Configuration:**

| Field | Value |
|-------|--------|
| Site URL | `https://kidquest-indol.vercel.app` |
| Redirect URLs | `https://kidquest-indol.vercel.app/auth/callback` |
| | `http://localhost:5173/auth/callback` |

**Authentication → Providers → Email:** For frictionless alpha, turn **off** “Confirm email” (or tell testers to check spam).

### 5. Optional: GitHub Action for schema

Repo secrets: `SUPABASE_DB_POOLER_URL` or `SUPABASE_PROJECT_REF` + `SUPABASE_DB_PASSWORD`  
→ **Actions** → **Apply Supabase schema** → Run workflow.

---

## Message to send testers

> **KidQuest alpha** — free learning app for kids (geography, space, math, and more).
>
> 1. Open **https://kidquest-indol.vercel.app**
> 2. Tap **Start your adventure** → create an account (email) or sign in
> 3. Pick age group + avatar, then explore from **Home**
>
> **Tips:** Use **Learn** vs **Lessons** on Geography/Solar — Learn is explore-only; Lessons are quizzes.  
> Parents: **Settings** → enter PIN (change default `1234` on first unlock).
>
> Feedback welcome: [your email]

---

## Quick smoke test (5 min)

See [ALPHA_QA.md](./ALPHA_QA.md) and [SMOKE.md](./SMOKE.md).

- [ ] Register → onboard → Home
- [ ] Geography → 5 tracks → one quiz
- [ ] Sign out → sign in → progress still there (cloud)

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Blank app after deploy | Check Vercel build logs; confirm `VITE_*` env vars set |
| Auth redirect error | Add production `/auth/callback` in Supabase URL config |
| No leaderboard / assignments | Run `schema.sql` in SQL Editor |
| Google sign-in broken | Set `VITE_ENABLE_GOOGLE_OAUTH=false` or complete [GOOGLE_AUTH.md](./GOOGLE_AUTH.md) |

More: [SUPABASE_PRODUCTION.md](./SUPABASE_PRODUCTION.md) · [LAUNCH_REVIEW.md](./LAUNCH_REVIEW.md)
