import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ArrowUp, ArrowDown } from "lucide-react";
import { AnswerOption } from "./AnswerOption";
import { Flag } from "./Flag";
import { WorldMap } from "../geography/WorldMap";
import { getCountry } from "../../data/geography/countries";
import { Button } from "../ui/Button";

function normalize(s) {
  return String(s ?? "").trim().toLowerCase();
}

export function QuestionCard({ question, onAnswered, ageGroup }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [fillText, setFillText] = useState("");
  const [orderList, setOrderList] = useState([]);
  const advanceTimer = useRef(null);

  useEffect(() => {
    setSelected(null);
    setRevealed(false);
    setIsCorrect(false);
    setFillText("");
    if (question.type === "order") {
      setOrderList(shuffle(question.options));
    } else {
      setOrderList([]);
    }
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, [question]);

  function commit(correct) {
    setIsCorrect(correct);
    setRevealed(true);
    advanceTimer.current = setTimeout(() => onAnswered(correct), correct ? 900 : 1600);
  }

  function handleChoice(opt) {
    if (revealed) return;
    setSelected(opt);
    commit(normalize(opt) === normalize(question.answer));
  }

  function handleYesNo(val) {
    if (revealed) return;
    setSelected(val);
    commit(normalize(val) === normalize(question.answer));
  }

  function handleTF(val) {
    if (revealed) return;
    setSelected(val);
    commit(normalize(val) === normalize(question.answer));
  }

  function handleFill() {
    if (revealed) return;
    commit(normalize(fillText) === normalize(question.answer));
  }

  function moveItem(idx, dir) {
    setOrderList((prev) => {
      const arr = [...prev];
      const ni = idx + dir;
      if (ni < 0 || ni >= arr.length) return arr;
      [arr[idx], arr[ni]] = [arr[ni], arr[idx]];
      return arr;
    });
  }

  function handleOrderSubmit() {
    if (revealed) return;
    const correct =
      orderList.length === question.answer.length &&
      orderList.every((v, i) => normalize(v) === normalize(question.answer[i]));
    commit(correct);
  }

  const content = useMemo(() => {
    switch (question.type) {
      case "yes-no": {
        const opts = ["yes", "no"];
        return (
          <div className="grid grid-cols-2 gap-3">
            {opts.map((o, i) => (
              <AnswerOption
                key={o}
                index={i}
                label={o === "yes" ? "Yes 👍" : "No 👎"}
                onSelect={() => handleYesNo(o)}
                disabled={revealed}
                state={
                  !revealed
                    ? "idle"
                    : normalize(o) === normalize(question.answer)
                    ? "correct"
                    : selected === o
                    ? "wrong"
                    : "dim"
                }
              />
            ))}
          </div>
        );
      }
      case "tf": {
        const opts = ["true", "false"];
        return (
          <div className="grid grid-cols-2 gap-3">
            {opts.map((o, i) => (
              <AnswerOption
                key={o}
                index={i}
                label={o === "true" ? "True ✓" : "False ✗"}
                onSelect={() => handleTF(o)}
                disabled={revealed}
                state={
                  !revealed
                    ? "idle"
                    : normalize(o) === normalize(question.answer)
                    ? "correct"
                    : selected === o
                    ? "wrong"
                    : "dim"
                }
              />
            ))}
          </div>
        );
      }
      case "choice": {
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {question.options.map((opt, i) => (
              <AnswerOption
                key={opt + i}
                index={i}
                label={opt}
                onSelect={() => handleChoice(opt)}
                disabled={revealed}
                state={
                  !revealed
                    ? "idle"
                    : normalize(opt) === normalize(question.answer)
                    ? "correct"
                    : selected === opt
                    ? "wrong"
                    : "dim"
                }
              />
            ))}
          </div>
        );
      }
      case "flag-choice": {
        // Options: array of { code, label }. Answer: the correct code (ISO2).
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {question.options.map((opt, i) => {
              const code = opt.code ?? opt;
              const label = opt.label ?? opt.code ?? opt;
              return (
                <AnswerOption
                  key={code + i}
                  index={i}
                  label={label}
                  media={<Flag code={code} size="md" />}
                  onSelect={() => handleChoice(code)}
                  disabled={revealed}
                  state={
                    !revealed
                      ? "idle"
                      : normalize(code) === normalize(question.answer)
                      ? "correct"
                      : selected === code
                      ? "wrong"
                      : "dim"
                  }
                />
              );
            })}
          </div>
        );
      }
      case "map-locate": {
        const correctCode = String(question.answer).toUpperCase();
        const country = getCountry(correctCode);
        return (
          <div className="flex flex-col gap-3">
            <WorldMap
              zoomTo={question.zoomTo ?? "world"}
              revealCode={revealed ? correctCode : null}
              highlightedCodes={revealed && !isCorrect ? [correctCode] : []}
              interactive={!revealed}
              onCountryClick={(code) => {
                if (revealed) return;
                setSelected(code);
                const ok = String(code).toUpperCase() === correctCode;
                commit(ok);
              }}
            />
            {revealed && country && (
              <div className="chunky-card p-3 text-sm font-bold text-ink/80 bg-accent/30">
                {country.funFact}
              </div>
            )}
          </div>
        );
      }
      case "flag-grid": {
        // Prompt is country name; options are ISO2 codes; user taps the correct flag.
        return (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {question.options.map((code, i) => {
              const state = !revealed
                ? "idle"
                : normalize(code) === normalize(question.answer)
                ? "correct"
                : selected === code
                ? "wrong"
                : "dim";
              const stateRing =
                state === "correct"
                  ? "ring-4 ring-success border-success"
                  : state === "wrong"
                  ? "ring-4 ring-error border-error animate-shake"
                  : state === "dim"
                  ? "opacity-50"
                  : "";
              return (
                <motion.button
                  key={code + i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileTap={revealed ? {} : { y: 1, boxShadow: "2px 2px 0px rgba(0,0,0,0.15)" }}
                  whileHover={revealed ? {} : { y: -2 }}
                  onClick={() => handleChoice(code)}
                  disabled={revealed}
                  aria-label={`Flag ${code}`}
                  className={`bg-white rounded-chunky border-[3px] border-ink/15 shadow-chunky p-3 flex items-center justify-center focus-ring transition-all ${stateRing}`}
                >
                  <Flag code={code} size="xl" rounded />
                </motion.button>
              );
            })}
          </div>
        );
      }
      case "fill": {
        return (
          <div className="flex flex-col gap-3">
            <input
              type="text"
              autoFocus
              value={fillText}
              onChange={(e) => setFillText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fillText && handleFill()}
              placeholder="Type your answer..."
              disabled={revealed}
              className="w-full min-h-[56px] rounded-chunky border-[3px] border-ink/15 shadow-chunky px-4 py-3 font-display font-bold text-xl focus-ring"
            />
            <Button onClick={handleFill} disabled={!fillText || revealed} variant="primary" size="lg" fullWidth>
              Check answer
            </Button>
            {revealed && !isCorrect && (
              <div className="text-center font-display font-bold text-error">
                Correct answer: <span className="underline">{question.answer}</span>
              </div>
            )}
          </div>
        );
      }
      case "order": {
        return (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-ink/70 font-bold">Use the arrows to put these in order.</p>
            <ul className="flex flex-col gap-2">
              {orderList.map((item, i) => (
                <li
                  key={item + i}
                  className="flex items-center gap-2 bg-white rounded-chunky border-[3px] border-ink/15 shadow-chunky px-3 py-2"
                >
                  <span className="font-display font-extrabold text-ink/50 w-6 text-center">{i + 1}.</span>
                  <span className="flex-1 font-bold">{item}</span>
                  <button
                    aria-label="Move up"
                    onClick={() => moveItem(i, -1)}
                    disabled={revealed || i === 0}
                    className="w-9 h-9 grid place-items-center rounded-full border-[2.5px] border-ink/20 bg-bg disabled:opacity-30 focus-ring"
                  >
                    <ArrowUp size={18} />
                  </button>
                  <button
                    aria-label="Move down"
                    onClick={() => moveItem(i, 1)}
                    disabled={revealed || i === orderList.length - 1}
                    className="w-9 h-9 grid place-items-center rounded-full border-[2.5px] border-ink/20 bg-bg disabled:opacity-30 focus-ring"
                  >
                    <ArrowDown size={18} />
                  </button>
                </li>
              ))}
            </ul>
            <Button onClick={handleOrderSubmit} disabled={revealed} fullWidth size="lg">
              Lock it in
            </Button>
            {revealed && !isCorrect && (
              <div className="text-center font-display font-bold text-error text-sm">
                Correct order: {question.answer.join(" → ")}
              </div>
            )}
          </div>
        );
      }
      default:
        return null;
    }
  }, [question, selected, revealed, fillText, orderList, isCorrect]);

  return (
    <div className="flex flex-col gap-4">
      <motion.div
        key={question.prompt}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="chunky-card p-5 text-center bg-white"
      >
        <h3 className="font-display text-2xl font-extrabold leading-tight">{question.prompt}</h3>
      </motion.div>

      {content}

      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 pointer-events-none grid place-items-center z-40`}
          >
            <motion.div
              initial={{ scale: 0.4, rotate: -10 }}
              animate={{ scale: [0.4, 1.15, 1], rotate: [-10, 0] }}
              transition={{ duration: 0.5 }}
              className={`w-32 h-32 rounded-full grid place-items-center shadow-chunkyXl border-[5px] ${
                isCorrect ? "bg-success border-success/60" : "bg-error border-error/60"
              }`}
            >
              {isCorrect ? (
                <Check size={64} className="text-white" strokeWidth={3.5} />
              ) : (
                <X size={64} className="text-white" strokeWidth={3.5} />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  if (a.length > 1 && a.every((v, i) => v === arr[i])) {
    return shuffle(arr);
  }
  return a;
}
