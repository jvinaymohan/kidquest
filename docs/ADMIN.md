# KidQuest Admin & Feedback

Operations guide for the app owner: user counts, password resets, and parent/kid feedback.

## One-time Supabase setup

1. Open **Supabase → SQL Editor** and run the **Admin + APP FEEDBACK** section at the bottom of `supabase/schema.sql` (or re-run the full file if this is a fresh project).
2. Promote your account to admin (replace with your email):

```sql
update public.profiles
set role = 'admin', email = 'you@example.com'
where id = (
  select id from auth.users where email = 'you@example.com' limit 1
);
```

3. Optional but recommended: set `VITE_ADMIN_EMAILS` on Vercel (and `.env.local`) to a comma-separated allowlist of emails that may use `/admin` even if `role = admin` is set. Example:

```env
VITE_ADMIN_EMAILS=you@example.com
```

If the allowlist is empty, any profile with `role = admin` can access the dashboard.

## Using the admin dashboard

1. Sign in at `/login` (link: **Admin sign-in** → `/admin` redirects to login if needed).
2. Open **`/admin`** or **Home → Admin** / **Settings → KidQuest Admin** (only visible to admins).
3. **Users & passwords** — total registrations, search users, **Send reset email** (Supabase magic link).
4. **Feedback** — inbox from the floating **💬** button app-wide. Use **Suggest fix** for checklist-style next steps (not automatic code changes). Update status and admin notes.

## App-wide feedback (parents & kids)

- Floating button bottom-right on every route (including landing/login when not in a fullscreen lesson).
- Categories: general, bug, idea, password help, praise, other.
- Logged-in users: tied to `user_id`; guests must enter email (anon insert).
- Data table: `public.app_feedback`.

Encourage families: *“Tap the chat bubble anytime something is confusing or awesome.”*

## Password help flow

1. User chooses **Password / login help** in feedback and includes their email.
2. Admin opens feedback → **Send reset email** or finds user under **Users**.
3. Confirm **Supabase Auth → URL Configuration**: Site URL = production URL, redirect URLs include `/auth/callback` and `/login`.

## Security notes

- Users cannot set `role = admin` themselves (RLS).
- `is_admin()` is `security definer` and used for admin RLS policies.
- Do not commit real emails or DB passwords to git.

## Local development

With Supabase env vars set, feedback goes to `app_feedback`. Without Supabase, feedback is stored in `localStorage` only (`kidquest-local-feedback`) for UI testing.
