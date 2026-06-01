import { useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Home } from "lucide-react";
import { TopBar } from "./TopBar";
import { BottomNav } from "./BottomNav";
import { OfflineBanner } from "./OfflineBanner";
import { RouteErrorBoundary } from "./RouteErrorBoundary";
import { useTeslaMode } from "../../hooks/useTeslaMode";
import { useRouteScreenTime } from "../../hooks/useRouteScreenTime";

export function AppShell({ hideTop = false, hideBottom = false, flush = false }) {
  useTeslaMode();
  useRouteScreenTime();
  const location = useLocation();
  const isHome = location.pathname === "/home";
  const isLanding = location.pathname === "/landing";
  const cosmicRoute = isHome || isLanding;
  const viewportLocked = isLanding;
  const showQuestHome = !isHome && !isLanding;

  useEffect(() => {
    document.body.classList.toggle("cosmic-route", cosmicRoute);
    return () => document.body.classList.remove("cosmic-route");
  }, [cosmicRoute]);

  const mainWrapClass = flush || isHome
    ? "w-full"
    : "w-full max-w-2xl mx-auto px-4 py-5 md:max-w-3xl lg:max-w-4xl";

  return (
    <div className={`min-h-screen flex flex-col ${cosmicRoute ? "bg-transparent" : "bg-bg"}`}>
      <OfflineBanner />
      {!hideTop && !isHome && <TopBar />}
      <main
        className={`flex-1 overflow-x-hidden ${viewportLocked ? "overflow-hidden" : "overflow-y-auto"}`}
      >
        <div className={mainWrapClass}>
          <RouteErrorBoundary label={location.pathname}>
            <Outlet />
          </RouteErrorBoundary>
        </div>
      </main>
      {!hideBottom && <BottomNav cosmic={isHome} />}

      {showQuestHome && (
        <Link
          to="/home"
          className="fixed right-3 z-40 flex items-center gap-1.5 rounded-full border-2 border-white/25 bg-[#1a1060]/95 px-3 py-2 font-display text-[11px] font-extrabold text-white shadow-lg backdrop-blur-md focus-ring safe-bottom"
          style={{ bottom: hideBottom ? "calc(0.75rem + env(safe-area-inset-bottom))" : "calc(4.75rem + env(safe-area-inset-bottom))" }}
          aria-label="Quest Home"
        >
          <Home size={16} strokeWidth={2.5} />
          Quest Home
        </Link>
      )}
    </div>
  );
}
