import { useEffect, useRef } from "react";
import { useAppStore } from "../store/useAppStore";

const TICK_MS = 5000;

export function useLearnTimer(subjectId) {
  const tickLearnTime = useAppStore((s) => s.tickLearnTime);
  const accRef = useRef(0);

  useEffect(() => {
    if (!subjectId) return undefined;

    const interval = setInterval(() => {
      if (document.visibilityState !== "visible") return;
      accRef.current += TICK_MS / 1000;
      if (accRef.current >= 5) {
        const delta = Math.floor(accRef.current);
        accRef.current -= delta;
        tickLearnTime(subjectId, delta);
      }
    }, TICK_MS);

    return () => {
      clearInterval(interval);
      if (accRef.current >= 1 && document.visibilityState === "visible") {
        tickLearnTime(subjectId, Math.floor(accRef.current));
      }
      accRef.current = 0;
    };
  }, [subjectId, tickLearnTime]);
}
