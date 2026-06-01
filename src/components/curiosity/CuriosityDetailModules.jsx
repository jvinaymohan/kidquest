import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, BookmarkCheck, ChevronDown, MessageCircle, FlaskConical, HelpCircle, Hand } from "lucide-react";
import { AnswerOption } from "../quiz/AnswerOption";
import { CuriosityTimeline } from "./CuriosityTimeline";
import { CuriosityBracket } from "./CuriosityBracket";
import { CuriosityMap } from "./CuriosityMap";

function Section({ id, icon, title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="rounded-2xl bg-white ring-1 ring-ink/[0.08] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-4 py-3 text-left focus-ring"
        aria-expanded={open}
      >
        <span className="text-primary">{icon}</span>
        <span className="flex-1 font-display font-extrabold text-sm">{title}</span>
        <ChevronDown className={`text-ink/40 transition-transform ${open ? "rotate-180" : ""}`} size={18} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 text-sm font-medium text-ink/75">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export function CuriositySummary({ content }) {
  if (!content) return null;
  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#f8f4ff] to-white p-4 ring-1 ring-ink/[0.08]">
      <p className="text-sm font-bold text-ink/80 leading-relaxed">{content.summary}</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl bg-primary/5 p-3">
          <p className="text-[10px] font-extrabold uppercase tracking-wide text-primary">Why it matters</p>
          <p className="text-xs font-medium text-ink/70 mt-1">{content.whyItMatters}</p>
        </div>
        <div className="rounded-xl bg-accent/30 p-3">
          <p className="text-[10px] font-extrabold uppercase tracking-wide text-ink/50">What you can learn</p>
          <p className="text-xs font-medium text-ink/70 mt-1">{content.learn}</p>
        </div>
      </div>
    </div>
  );
}

export function CuriosityQuizSection({ questions, onComplete }) {
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [picked, setPicked] = useState(null);

  if (!questions?.length) return null;
  const q = questions[index];

  function pick(opt) {
    if (revealed) return;
    const ok = opt === q.answer;
    setPicked(opt);
    setRevealed(true);
    const nextCorrect = correct + (ok ? 1 : 0);
    setTimeout(() => {
      if (index + 1 >= questions.length) {
        setCorrect(nextCorrect);
        setDone(true);
        onComplete?.({ correct: nextCorrect, total: questions.length });
      } else {
        setCorrect(nextCorrect);
        setIndex((i) => i + 1);
        setRevealed(false);
        setPicked(null);
      }
    }, ok ? 800 : 1400);
  }

  if (done) {
    return (
      <Section id="quiz" icon={<HelpCircle size={18} />} title="Quiz Me — done!" defaultOpen>
        <p className="font-display font-extrabold text-primary">
          You got {correct}/{questions.length}!
        </p>
      </Section>
    );
  }

  return (
    <Section id="quiz" icon={<HelpCircle size={18} />} title="Quiz Me" defaultOpen={false}>
      <p className="font-display font-extrabold text-sm mb-2">
        {index + 1}/{questions.length}: {q.question}
      </p>
      <div className="flex flex-col gap-2">
        {q.options.map((opt, i) => {
          let state = "idle";
          if (revealed) {
            if (opt === q.answer) state = "correct";
            else if (opt === picked) state = "wrong";
            else state = "dim";
          }
          return (
            <AnswerOption key={opt} label={opt} index={i} state={state} disabled={revealed} onSelect={() => pick(opt)} />
          );
        })}
      </div>
      {revealed && q.explanation && (
        <p className="mt-2 text-xs font-bold text-ink/60">{q.explanation}</p>
      )}
    </Section>
  );
}

export function CuriosityDetailModules({
  card,
  content,
  saved,
  onToggleSave,
  onQuizComplete,
}) {
  return (
    <div className="flex flex-col gap-3">
      <Section id="learn" icon={<FlaskConical size={18} />} title="Learn More" defaultOpen={false}>
        <ul className="space-y-3">
          {(card.learnMore ?? []).map((item) => (
            <li key={item.title}>
              <p className="font-display font-extrabold text-ink">{item.title}</p>
              <p className="text-xs mt-0.5">{item.body}</p>
            </li>
          ))}
        </ul>
        {card.timeline && (
          <div className="mt-4">
            <CuriosityTimeline items={card.timeline} />
          </div>
        )}
        {card.map && (
          <div className="mt-4">
            <CuriosityMap map={card.map} />
          </div>
        )}
        {card.sportsBracket && (
          <div className="mt-4">
            <CuriosityBracket bracket={card.sportsBracket} />
          </div>
        )}
      </Section>

      {card.tryItYourself && (
        <Section id="try" icon={<Hand size={18} />} title="Try It Yourself">
          <p className="font-display font-extrabold">{card.tryItYourself.title}</p>
          <ol className="mt-2 list-decimal list-inside space-y-1 text-xs">
            {card.tryItYourself.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </Section>
      )}

      <CuriosityQuizSection questions={card.quiz} onComplete={onQuizComplete} />

      <Section id="grownup" icon={<MessageCircle size={18} />} title="Ask a Grown-Up">
        <ul className="space-y-2">
          {(card.askGrownUp ?? []).map((prompt) => (
            <li key={prompt} className="rounded-xl bg-[#fff9e6] px-3 py-2 text-xs font-bold text-ink/75">
              {prompt}
            </li>
          ))}
        </ul>
      </Section>

      <button
        type="button"
        onClick={onToggleSave}
        className={`flex items-center justify-center gap-2 rounded-2xl border-[3px] px-4 py-3 font-display font-extrabold text-sm focus-ring ${
          saved
            ? "border-primary bg-primary/10 text-primary"
            : "border-ink/15 bg-white text-ink/70"
        }`}
      >
        {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        {saved ? "Saved for later" : "Save for later"}
      </button>
    </div>
  );
}
