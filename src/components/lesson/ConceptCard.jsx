import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "../ui/Button";
import { MascotSpeech } from "../mascots/MascotSpeech";

export function ConceptCard({ lesson, subject, onContinue }) {
  const c = lesson.concept;
  return (
    <div className="flex flex-col gap-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="chunky-card p-6 text-center"
        style={{ background: subject.accent }}
      >
        <div className="text-7xl" aria-hidden>
          {c.emoji ?? "✨"}
        </div>
        <h2 className="font-display text-3xl font-extrabold mt-2">{lesson.title}</h2>
        <p className="mt-3 font-body font-bold text-lg leading-snug">{c.text}</p>
      </motion.div>

      {c.funFact && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3 }}
          className="chunky-card p-4 bg-white flex items-start gap-3"
        >
          <Sparkles className="text-primary shrink-0 mt-1" />
          <div>
            <div className="font-display font-extrabold text-primary uppercase text-sm">Fun fact</div>
            <p className="font-body font-bold">{c.funFact}</p>
          </div>
        </motion.div>
      )}

      <MascotSpeech kind={subject.mascotKey} message={`Ready? Let's try a quick quiz!`} />

      <Button size="lg" fullWidth onClick={onContinue}>
        I'm ready! →
      </Button>
    </div>
  );
}
