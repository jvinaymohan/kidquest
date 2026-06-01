import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { TopBar } from "./TopBar";
import { BottomNav } from "./BottomNav";
import { OfflineBanner } from "./OfflineBanner";
import { RouteErrorBoundary } from "./RouteErrorBoundary";
import { useTeslaMode } from "../../hooks/useTeslaMode";

export function AppShell({ hideTop = false, hideBottom = false, flush = false }) {
  useTeslaMode();
  const location = useLocation();
  const isHome = location.pathname === "/home";
  const isLanding = location.pathname === "/landing";
  const cosmicRoute = isHome || isLanding;
  const viewportLocked = isLanding;

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
    </div>
  );
}
