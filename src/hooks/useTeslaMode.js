import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { usePreferencesStore } from "../store/usePreferencesStore";

export function useTeslaMode() {
  const [params] = useSearchParams();
  const teslaMode = usePreferencesStore((s) => s.teslaMode);
  const setTeslaMode = usePreferencesStore((s) => s.setTeslaMode);

  useEffect(() => {
    if (params.get("tesla") === "true") setTeslaMode(true);
  }, [params, setTeslaMode]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("tesla-mode", teslaMode);
    return () => document.documentElement.classList.remove("tesla-mode");
  }, [teslaMode]);

  return { teslaMode, setTeslaMode };
}
