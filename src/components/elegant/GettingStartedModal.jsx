import { useEffect, useId, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { GoogleSignInButton } from "../auth/GoogleSignInButton";
import { isGoogleOAuthEnabled } from "../../lib/featureFlags";
import { GETTING_STARTED_ITEMS } from "./elegantContent";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

function trapFocus(container, e) {
  if (e.key !== "Tab" || !container) return;
  const nodes = [...container.querySelectorAll(FOCUSABLE)].filter(
    (el) => !el.hasAttribute("disabled") && el.offsetParent !== null
  );
  if (nodes.length === 0) return;
  const first = nodes[0];
  const last = nodes[nodes.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

export function GettingStartedModal({ open, onClose }) {
  const titleId = useId();
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.activeElement;
    const panel = panelRef.current;
    const first = panel?.querySelector(FOCUSABLE);
    first?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") trapFocus(panel, e);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      if (prev instanceof HTMLElement) prev.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="landing-gs-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          aria-hidden={!open}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="landing-gs-panel"
            initial={{ y: 48, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 32, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="landing-gs-header">
              <div>
                <h2 id={titleId} className="landing-gs-title">
                  Let&apos;s get started
                </h2>
                <p className="landing-gs-sub">
                  Parents & kids — pick how you&apos;d like to join KidQuest
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="landing-gs-close focus-ring"
                aria-label="Close"
              >
                <X size={18} aria-hidden />
              </button>
            </div>

            <div className="landing-gs-options">
              {GETTING_STARTED_ITEMS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="landing-gs-option focus-ring"
                  onClick={onClose}
                >
                  <span className="landing-gs-option-icon" aria-hidden>
                    {item.icon}
                  </span>
                  <span className="landing-gs-option-text">
                    <span className="landing-gs-option-label">{item.label}</span>
                    <span className="landing-gs-option-sub">{item.sub}</span>
                  </span>
                </Link>
              ))}
            </div>

            {isGoogleOAuthEnabled && (
              <div className="landing-gs-google">
                <div className="landing-google-divider" aria-hidden>
                  <span>or</span>
                </div>
                <GoogleSignInButton />
              </div>
            )}

            <p className="landing-gs-note">100% free · Safe for ages 6–14 · No ads</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
