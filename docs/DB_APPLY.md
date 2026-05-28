# Apply database schema (`npm run db:apply`)

## Error: `ECONNREFUSED` on an IPv6 address

Supabase’s **direct** host (`db.PROJECT_REF.supabase.co`) is often **IPv6-only**. Many home/office networks block or don’t route IPv6, so the connection is refused.

### Fix A — Session pooler URL (best)

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project  
2. **Project Settings** → **Database** → **Connection string**  
3. Mode: **Session pooler** (port **5432**)  
4. Copy the **URI** (looks like  
   `postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres`)  
5. Add to `kidquest/.env.local`:

```env
SUPABASE_DB_POOLER_URL=postgresql://postgres.cspwbyhhouucmtxrpxwe:YOUR_PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres
```

6. Run:

```bash
npm run db:apply
```

Use your real password; if it contains `#` or `@`, keep the whole URL in quotes in `.env.local`.

### Fix B — SQL Editor (no CLI)

1. Dashboard → **SQL Editor** → New query  
2. Paste the contents of `supabase/schema.sql`  
3. **Run** (idempotent — safe to re-run)

### Fix C — IPv4 add-on

Dashboard → **Database** → enable **IPv4** add-on if your plan includes it, then retry `npm run db:apply`.

## Error: `password authentication failed`

Reset the database password under **Project Settings → Database**, update `SUPABASE_DB_PASSWORD` or `SUPABASE_DB_POOLER_URL` in `.env.local`, and retry.
