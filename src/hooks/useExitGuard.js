import { useEffect } from "react";

export function useExitGuard(enabled, message = "Leave this session? Your progress in this round may be lost.") {
  useEffect(() => {
    if (!enabled) return undefined;
    const onBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = message;
      return message;
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [enabled, message]);
}

export function confirmExit(message = "Leave this session? Your progress in this round may be lost.") {
  return window.confirm(message);
}
