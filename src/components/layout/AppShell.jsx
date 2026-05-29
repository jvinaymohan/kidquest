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

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <OfflineBanner />
      {!hideTop && <TopBar />}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
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
