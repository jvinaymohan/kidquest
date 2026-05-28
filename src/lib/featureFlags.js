/** Set VITE_ENABLE_GOOGLE_OAUTH=true in Vercel / .env.local after Supabase + Google Cloud are configured. */
export const isGoogleOAuthEnabled =
  import.meta.env.VITE_ENABLE_GOOGLE_OAUTH === "true";
