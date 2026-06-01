import { useEffect, useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { BEYOND_SCHOOL_CARDS } from "./elegantContent";
import { LANDING_AREA_FACTS } from "./landingAreaFacts";

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

export function LandingPickAreas({ onGetStarted }) {
  const navigate = useNavigate();
  const session = useAuthStore((s) => s.session);
  const [activeId, setActiveId] = useState(null);
  const titleId = useId();
  const panelRef = useRef(null);

  const activeCard = BEYOND_SCHOOL_CARDS.find((c) => c.id === activeId);
  const activeFacts = activeId ? LANDING_AREA_FACTS[activeId] : null;

  useEffect(() => {
    if (!activeId) return undefined;
    const prev = document.activeElement;
    const panel = panelRef.current;
    const first = panel?.querySelector(FOCUSABLE);
    first?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") setActiveId(null);
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
  }, [activeId]);

  function handleExplore() {
    const path = activeFacts?.explorePath ?? activeCard?.to;
    if (!path) return;
    if (session) {
      navigate(path);
      setActiveId(null);
      return;
    }
    onGetStarted?.();
    setActiveId(null);
  }

  return (
    <section id="pick-area" className="landing-pick-areas" aria-labelledby="pick-area-heading">
      <p className="elegant-section-label">Explore by topic</p>
      <h2 id="pick-area-heading" className="elegant-section-headline">
        Pick an area you want to know more about
      </h2>
      <p className="elegant-section-body landing-pick-sub">
        Tap a topic for fun facts — then start your quest to dive deeper.
      </p>

      <div className="landing-pick-grid">
        {BEYOND_SCHOOL_CARDS.map((card) => {
          const facts = LANDING_AREA_FACTS[card.id];
          return (
            <button
              key={card.id}
              type="button"
              className={`landing-pick-tile ${card.glow} focus-ring`}
              onClick={() => setActiveId(card.id)}
              aria-haspopup="dialog"
            >
              <span className="landing-pick-tile-icon" aria-hidden>
                {facts?.emoji ?? card.icon}
              </span>
              <span className="landing-pick-tile-tag">{card.tag}</span>
              <span className="landing-pick-tile-title">{card.title}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {activeId && activeFacts && (
          <motion.div
            className="landing-area-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveId(null)}
            aria-hidden={!activeId}
          >
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="landing-area-panel"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="landing-area-header">
                <div>
                  <span className="landing-area-emoji" aria-hidden>
                    {activeFacts.emoji}
                  </span>
                  <h3 id={titleId} className="landing-area-title">
                    {activeFacts.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveId(null)}
                  className="landing-gs-close focus-ring"
                  aria-label="Close"
                >
                  <X size={18} aria-hidden />
                </button>
              </div>

              <p className="landing-area-intro">Did you know…</p>
              <ul className="landing-area-facts">
                {activeFacts.facts.map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
              </ul>

              <div className="landing-area-actions">
                {session && activeFacts.explorePath ? (
                  <button type="button" className="elegant-btn-primary focus-ring" onClick={handleExplore}>
                    Go explore →
                  </button>
                ) : (
                  <button type="button" className="elegant-btn-primary focus-ring" onClick={handleExplore}>
                    Let&apos;s get started →
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
