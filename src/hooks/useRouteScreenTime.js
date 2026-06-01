import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { sectionFromPathname } from "../utils/screenTimeSections";
import { useScreenTimeStore } from "../store/useScreenTimeStore";

const TICK_MS = 5000;

/**
 * Tracks active time per section while the user stays on a route.
 * Mount from AppShell so all logged-in pages are covered.
 */
export function useRouteScreenTime() {
  const location = useLocation();
  const tick = useScreenTimeStore((s) => s.tick);
  const sectionRef = useRef(null);
  const accRef = useRef(0);

  useEffect(() => {
    const section = sectionFromPathname(location.pathname);
    sectionRef.current = section;
    accRef.current = 0;
  }, [location.pathname]);

  useEffect(() => {
    const interval = setInterval(() => {
      const section = sectionRef.current;
      if (!section || document.visibilityState !== "visible") return;
      accRef.current += TICK_MS / 1000;
      if (accRef.current >= 5) {
        const delta = Math.floor(accRef.current);
        accRef.current -= delta;
        tick(section, delta);
      }
    }, TICK_MS);

    return () => {
      clearInterval(interval);
      const section = sectionRef.current;
      if (section && accRef.current >= 1 && document.visibilityState === "visible") {
        tick(section, Math.floor(accRef.current));
      }
      accRef.current = 0;
    };
  }, [tick]);
}
