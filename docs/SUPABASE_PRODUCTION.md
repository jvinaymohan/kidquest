# Supabase production setup (launch blockers B1–B4, B3)

Project ref: **`cspwbyhhouucmtxrpxwe`**

## B1 — Apply database schema

Your network may be **IPv6-only** to `db.cspwbyhhouucmtxrpxwe.supabase.co`. Use **one** of these:

### Option A — Session pooler (CLI)

1. Supabase Dashboard → **Project Settings** → **Database** → **Connection string**
2. Mode: **Session pooler** (port **5432**)
3. Copy the URI into `kidquest/.env.local`:

```env
SUPABASE_DB_POOLER_HOST=aws-1-us-east-2.pooler.supabase.com
SUPABASE_PROJECT_REF=cspwbyhhouucmtxrpxwe
SUPABASE_DB_PASSWORD=your_database_password
```

Or paste the full URI (replace `[YOUR-PASSWORD]` with the real **database password**, not the anon key):

```env
SUPABASE_DB_POOLER_URL=postgresql://postgres.cspwbyhhouucmtxrpxwe:YOUR_PASSWORD@aws-1-us-east-2.pooler.supabase.com:5432/postgres
```

4. Run:

```bash
cd kidquest
npm run db:apply
```

### Password not working in `.env.local`?

Common fixes:

1. **Save the file** — `Cmd+S` / `Ctrl+S`. Commands read from disk; unsaved editor tabs still show the new password but `npm run db:apply` uses the old one.
2. **Correct filename** — `kidquest/.env.local` (not `.enc.local`).
3. **Correct secret** — Dashboard → **Project Settings** → **Database** → **Database password** (not anon key, not `service_role`).
4. **After reset** — copy the password from the reset dialog immediately (shown once).
5. **Or paste full URI** — Connection string → Session pooler → reveal URI → one line:
   `SUPABASE_DB_POOLER_URL=postgresql://postgres.cspwbyhhouucmtxrpxwe:...@aws-1-us-east-2.pooler.supabase.com:5432/postgres`
6. **Verify** — `npm run db:ping` (must print `✓ Connected` before `npm run db:apply`).

### Option B — SQL Editor (always works)

1. Dashboard → **SQL Editor** → New query
2. Paste entire file: `kidquest/supabase/schema.sql`
3. Click **Run** (idempotent — safe to re-run)

### Option C — GitHub Actions (after push to `main`)

Add repository secrets:

- `SUPABASE_DB_POOLER_URL` (preferred), **or**
- `SUPABASE_PROJECT_REF` + `SUPABASE_DB_PASSWORD`

Then: **Actions** → **Apply Supabase schema** → **Run workflow**

---

## B2 — Vercel environment variables

In Vercel → Project → **Settings** → **Environment Variables** (Production + Preview):

| Variable | Value |
|----------|--------|
| `VITE_SUPABASE_URL` | `https://cspwbyhhouucmtxrpxwe.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | From Supabase → Settings → API → anon public |
| `VITE_ENABLE_GOOGLE_OAUTH` | `true` only after [GOOGLE_AUTH.md](./GOOGLE_AUTH.md) is complete (omit or `false` for email-only alpha) |

Redeploy after saving.

---

## B3 — Auth redirect URLs

Supabase → **Authentication** → **URL Configuration**:

| Field | Value |
|-------|--------|
| **Site URL** | `https://YOUR_VERCEL_DOMAIN` (e.g. `https://kidquest.vercel.app`) |
| **Redirect URLs** | `https://YOUR_VERCEL_DOMAIN/auth/callback` |
| | `http://localhost:5173/auth/callback` |

For local dev, keep localhost in the list.

**Email auth:** Authentication → **Providers** → Email — disable “Confirm email” for frictionless alpha, or keep it and tell testers to check inbox.

---

## B4 — Google OAuth (optional but recommended)

See [GOOGLE_AUTH.md](./GOOGLE_AUTH.md).

Google Cloud redirect URI must include:

`https://cspwbyhhouucmtxrpxwe.supabase.co/auth/v1/callback`

---

## B8 — Parent PIN

The app **forces a new Parent PIN** when the default `1234` is still in use after unlocking Settings. Change it on first parent/teacher unlock.

---

## Verify schema applied

In SQL Editor:

```sql
select table_name from information_schema.tables
where table_schema = 'public'
order by table_name;
```

You should see `life_explorer_items`, `friend_links`, `daily_duels`, `geography_country_progress`, etc.
