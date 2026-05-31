# Invite-only onboarding and referral workflow

KidQuest supports invite-only registration with a referral approval queue.

## What this adds

- Public referral request form at `/invite-request`
- Admin queue for referral approvals/rejections
- Admin invite code management with **copy register link** and **copy email text**
- Registration requires a valid active invite code (URL can pre-fill `?code=` and `?email=`)
- Password reset at `/reset-password` (linked from forgot-password emails)
- Invite is consumed automatically during signup via DB trigger

## Setup

1. Apply the latest schema:
   - `npm run db:apply`
   - Or run `supabase/patch-invites-referrals.sql` in Supabase → SQL Editor
2. Confirm at least one admin account exists:
   - In `profiles`, set `role = 'admin'` for your admin user.
3. In **Supabase → Authentication → URL Configuration**, add redirect URLs:
   - `https://kidquest-indol.vercel.app/reset-password`
   - `http://localhost:5173/reset-password` (local dev)
4. Open `/admin` and use:
   - **Referrals** tab to approve/reject requests
   - **Invites** tab to create/manage invite codes

No additional environment variables are required for this feature.

## Admin workflow

1. User submits request from `/invite-request`.
2. Admin reviews in `/admin` → **Referrals**.
3. On approval, click **Approve + issue invite** (invite email text is copied to clipboard).
4. Paste into your email client and send to the requester, or use **Copy register link** / **Copy email text** from the **Invites** tab.
5. Recipient opens the register link (code + email pre-filled), creates a password, and signs in.
6. If they forget their password: `/forgot-password` → email link → `/reset-password`.

## Recipient links (for manual or automated email)

Register (pre-filled):

```
https://kidquest-indol.vercel.app/register?code=KQ-XXXXXXXX&email=user@example.com
```

Sign in:

```
https://kidquest-indol.vercel.app/login?email=user@example.com
```

Reset password:

```
https://kidquest-indol.vercel.app/forgot-password
```

## Notes

- Existing users can sign in at `/login` and reset passwords via `/forgot-password`.
- Invite checks are enforced in two places:
  - pre-check via `validate_invite_code` RPC for user-friendly errors
  - hard enforcement in `handle_new_user()` trigger for safety
- Anonymous referral submissions use `submit_referral_request` RPC (security definer) so RLS cannot block public requests.
