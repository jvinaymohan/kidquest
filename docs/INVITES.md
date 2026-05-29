# Invite-only onboarding and referral workflow

KidQuest now supports invite-only registration with a lightweight referral approval queue.

## What this adds

- Public referral request form at `/invite-request`
- Admin queue for referral approvals/rejections
- Admin invite code management
- Registration now requires a valid active invite code
- Invite is consumed automatically during signup via DB trigger

## Setup

1. Apply the latest schema:
   - `npm run db:apply`
2. Confirm at least one admin account exists:
   - In `profiles`, set `role = 'admin'` for your admin user.
3. Open `/admin` and use:
   - **Referrals** tab to approve/reject requests
   - **Invites** tab to create/manage invite codes

No additional environment variables are required for this feature.

## Admin workflow

1. User submits request from `/invite-request`.
2. Admin reviews in `/admin` → **Referrals**.
3. On approval, click **Approve + issue invite**.
4. Share generated invite code with the requester.
5. Requester registers at `/register` using that code.
6. Signup trigger validates + marks invite as `used`.

## Notes

- Existing users can continue signing in normally.
- Invite checks are enforced in two places:
  - pre-check via `validate_invite_code` RPC for user-friendly errors
  - hard enforcement in `handle_new_user()` trigger for safety
