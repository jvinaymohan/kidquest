# KidQuest Alpha Smoke Checklist

Run after each release candidate. Dev server: `npm run dev` → http://localhost:5173

## Auth & onboarding

- [ ] `/landing` loads; hero + subject grid visible
- [ ] `/register` creates account (or shows clear error if Supabase off)
- [ ] `/login` signs in; forgot password sends reset email (check inbox)
- [ ] Signed-out user redirected to `/landing` on protected routes
- [ ] `/onboarding` completes and lands on `/home`

## Learn tab

- [ ] “Your next step” card navigates to a lesson or multiplication
- [ ] Daily challenge link works; XP once per day
- [ ] Subject tiles open Geography / Solar / Math paths
- [ ] `/review` shows SRS + weak subjects
- [ ] Teacher assignments appear when assigned in Supabase

## Multiplication (full journey sample)

- [ ] Table 7: Learn → Practice → Drill → Boss (session summaries show)
- [ ] Speed run completes; result saves locally + cloud when signed in
- [ ] Review queue drains without console errors

## Explore / Create / Compete

- [ ] `/explore` links to Geography + Solar
- [ ] `/create` shows prompts + daily plan
- [ ] `/compete` speed-run leaderboard (cloud or local preview)

## Parent / settings

- [ ] `/settings` classrooms, assignments, digests when parent/teacher signed in
- [ ] Sound toggle affects SFX

## Resilience

- [ ] Offline banner when network disabled (with Supabase on)
- [ ] Route error boundary shows retry on forced error (optional dev test)

## Build

```bash
npm run build
npm run lint
```

## E2E (optional)

```bash
npm install -D @playwright/test
npx playwright install chromium
npm run test:e2e
```
