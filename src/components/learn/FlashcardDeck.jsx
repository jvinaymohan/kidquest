import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/Button";

export function FlashcardDeck({ cards, emptyMessage = "Nothing to show yet." }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!cards?.length) {
    return <p className="text-center font-bold text-ink/60 py-8">{emptyMessage}</p>;
  }

  const card = cards[index];
  const prev = () => {
    setFlipped(false);
    setIndex((i) => (i - 1 + cards.length) % cards.length);
  };
  const next = () => {
    setFlipped(false);
    setIndex((i) => (i + 1) % cards.length);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center text-xs font-bold text-ink/60">
        Card {index + 1} of {cards.length}
      </div>
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="chunky-card min-h-[200px] p-6 flex flex-col items-center justify-center text-center focus-ring w-full"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={flipped ? "back" : "front"}
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: -90 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center gap-3"
          >
            {!flipped ? card.front : card.back}
          </motion.div>
        </AnimatePresence>
        <div className="mt-4 text-xs font-bold text-ink/50">Tap to flip</div>
      </button>
      <div className="flex gap-2">
        <Button variant="ghost" onClick={prev} leftIcon={<ChevronLeft size={18} />}>
          Prev
        </Button>
        <Button variant="ghost" onClick={next} rightIcon={<ChevronRight size={18} />}>
          Next
        </Button>
      </div>
    </div>
  );
}
