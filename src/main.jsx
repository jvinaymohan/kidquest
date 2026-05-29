import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "flag-icons/css/flag-icons.min.css";
import "./index.css";
import App from "./App.jsx";
import { ErrorBoundary } from "./components/layout/ErrorBoundary.jsx";
import { setLocale } from "./lib/i18n";
import { usePreferencesStore } from "./store/usePreferencesStore";

const prefs = usePreferencesStore.getState();
setLocale(prefs.locale);
if (prefs.dyslexiaFont && typeof document !== "undefined") {
  document.documentElement.classList.add("dyslexia-font");
}
if (prefs.lowBandwidth && typeof document !== "undefined") {
  document.documentElement.classList.add("low-bandwidth");
}

if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        reg.update().catch(() => {});
        reg.addEventListener("updatefound", () => {
          const next = reg.installing;
          if (!next) return;
          next.addEventListener("statechange", () => {
            if (next.state === "installed" && navigator.serviceWorker.controller) {
              next.postMessage({ type: "SKIP_WAITING" });
            }
          });
        });
      })
      .catch(() => {});
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      window.location.reload();
    });
  });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
