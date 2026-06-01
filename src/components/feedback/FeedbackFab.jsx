import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { FeedbackModal } from "./FeedbackModal";

/** Floating feedback button — available on most screens. */
export function FeedbackFab() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="feedback-fab fixed z-40 left-4 bottom-[max(1rem,env(safe-area-inset-bottom))] w-12 h-12 rounded-full bg-ink text-white shadow-lg grid place-items-center focus-ring border-2 border-white/20"
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
