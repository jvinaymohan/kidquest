# Google Sign-In (Supabase)

KidQuest uses Supabase OAuth for Google login.

## 1. Google Cloud Console

1. Create a project at [Google Cloud Console](https://console.cloud.google.com/).
2. **APIs & Services → Credentials → Create Credentials → OAuth client ID**
3. Application type: **Web application**
4. Authorized JavaScript origins:
   - `http://localhost:5173`
   - `https://YOUR_VERCEL_DOMAIN.vercel.app`
5. Authorized redirect URIs (Supabase handles the callback):
   - `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`

## 2. Supabase Dashboard

1. **Authentication → Providers → Google** → Enable
2. Paste **Client ID** and **Client Secret** from Google
3. **Authentication → URL Configuration**
   - Site URL: `https://YOUR_VERCEL_DOMAIN.vercel.app` (or `http://localhost:5173` for dev)
   - Redirect URLs: add `http://localhost:5173/auth/callback` and production `/auth/callback`

## 3. App routes

- User clicks **Continue with Google** on Landing / Login / Register
- Redirects to Google → Supabase → `/auth/callback`
- If profile has no kid name → `/onboarding` to finish setup
- Else → `/home`

## 4. Show Google buttons in the app

Buttons are **hidden by default** until OAuth is fully configured (launch blocker R8).

Add to `.env.local` and Vercel (Production + Preview):

```env
VITE_ENABLE_GOOGLE_OAUTH=true
```

Redeploy, then test sign-in on your production domain.

## 5. Local dev

```bash
cd kidquest
npm run dev
# Open http://localhost:5173/landing
```

Ensure `.env.local` has `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and (when testing Google) `VITE_ENABLE_GOOGLE_OAUTH=true`.
