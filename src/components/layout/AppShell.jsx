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
  const viewportLocked = isHome || isLanding;

  return (
    <div className={`min-h-screen flex flex-col ${isHome || isLanding ? "bg-transparent" : "bg-bg"}`}>
      <OfflineBanner />
      {!hideTop && !isHome && <TopBar />}
      <main
        className={`flex-1 overflow-x-hidden ${viewportLocked ? "overflow-hidden" : "overflow-y-auto"}`}
      >
        <div
          className={
            flush || isHome
              ? "w-full max-w-2xl mx-auto"
              : "w-full max-w-2xl mx-auto px-4 py-5"
          }
        >
          <RouteErrorBoundary label={location.pathname}>
            <Outlet />
          </RouteErrorBoundary>
        </div>
      </main>
      {!hideBottom && <BottomNav />}
    </div>
  );
}
