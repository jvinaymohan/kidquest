/** Routes that run full-screen without TopBar / BottomNav chrome */
const IMMERSIVE_PREFIXES = ["/lesson/", "/results/"];

const IMMERSIVE_EXACT = new Set([
  "/multiplication/speed-run",
  "/multiplication/results",
]);

/**
 * Logged-in play surfaces use cosmic background + dark bottom nav.
 * Marketing (/landing, /about) sets cosmic separately on Home only in shell.
 */
export function isImmersivePlayRoute(pathname) {
  if (IMMERSIVE_EXACT.has(pathname)) return true;
  return IMMERSIVE_PREFIXES.some((p) => pathname.startsWith(p));
}

export function isCosmicPlayRoute(pathname) {
  return !isImmersivePlayRoute(pathname);
}

export function routeChrome(pathname) {
  const immersive = isImmersivePlayRoute(pathname);
  const isHome = pathname === "/home";

  return {
    immersive,
    isHome,
    cosmic: !immersive,
    showTopBar: !immersive && !isHome,
    /** Floating Quest Home — only when top chrome is hidden (immersive) */
    showQuestHomeFab: immersive,
  };
}
