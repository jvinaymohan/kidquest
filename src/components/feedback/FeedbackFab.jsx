import { useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { FeedbackModal } from "./FeedbackModal";

const BOTTOM_NAV_ROUTES = new Set([
  "/home",
  "/explore",
  "/compete",
  "/profile",
  "/math",
  "/journey",
  "/review",
  "/settings",
  "/impact",
]);

/** Floating feedback button — available on most screens. */
export function FeedbackFab() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const aboveBottomNav =
    BOTTOM_NAV_ROUTES.has(pathname) ||
    pathname.startsWith("/subject/") ||
    pathname.startsWith("/science") ||
    pathname.startsWith("/trivia") ||
    pathname.startsWith("/math-master") ||
    pathname.startsWith("/multiplication") ||
    pathname.startsWith("/geography/") ||
    pathname.startsWith("/curiosity/");

  const bottomStyle = aboveBottomNav
    ? { bottom: "calc(4.75rem + env(safe-area-inset-bottom))" }
    : { bottom: "max(1rem, env(safe-area-inset-bottom))" };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={bottomStyle}
        className="feedback-fab fixed z-40 left-4 w-12 h-12 rounded-full bg-ink text-white shadow-lg grid place-items-center focus-ring border-2 border-white/20"
        aria-label="Send feedback"
        title="Send feedback"
      >
        <MessageCircle size={22} strokeWidth={2.5} />
      </button>
      <AnimatePresence>
        {open && <FeedbackModal open={open} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
