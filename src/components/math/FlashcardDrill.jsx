import { useState, useMemo } from "react";
import { Button } from "../ui/Button";

export function FlashcardDrill() {
  const [tables, setTables] = useState([2, 3, 5]);
  const [a, setA] = useState(2);
  const [b, setB] = useState(3);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState({ right: 0, total: 0 });

  const product = a * b;

  const nextCard = () => {
    const t = tables[Math.floor(Math.random() * tables.length)];
    const t2 = tables[Math.floor(Math.random() * tables.length)];
    setA(t);
    setB(t2);
    setInput("");
    setFeedback(null);
  };

  const toggleTable = (n) => {
    setTables((prev) => {
      if (prev.includes(n)) {
        const next = prev.filter((x) => x !== n);
        return next.length ? next : [n];
      }
      return [...prev, n].sort((x, y) => x - y);
    });
  };

  const check = () => {
    const ok = parseInt(input, 10) === product;
    setFeedback(ok ? "correct" : "wrong");
    setScore((s) => ({ right: s.right + (ok ? 1 : 0), total: s.total + 1 }));
  };

  const tableChips = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-bold text-ink/60">Pick tables to practice (no score pressure).</p>
      <div className="flex flex-wrap gap-1">
        {tableChips.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => toggleTable(n)}
            className={`w-9 h-9 rounded-full font-display font-extrabold text-sm border-[2.5px] focus-ring ${
              tables.includes(n) ? "bg-math text-white border-ink/20" : "bg-white border-ink/15"
            }`}
            style={tables.includes(n) ? { background: "var(--math)" } : undefined}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="chunky-card p-6 text-center">
        <div className="font-display text-4xl font-extrabold">
          {a} × {b} = ?
        </div>
        <input
          type="number"
          inputMode="numeric"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && input && check()}
          className="mt-4 w-32 mx-auto block text-center text-2xl font-display font-extrabold rounded-chunky border-[3px] border-ink/15 py-2 focus-ring"
        />
        {feedback === "correct" && <p className="text-success font-bold mt-2">Yes! 🎉</p>}
        {feedback === "wrong" && (
          <p className="text-error font-bold mt-2">
            It&apos;s {product} — keep going!
          </p>
        )}
        <div className="flex gap-2 mt-4 justify-center">
          <Button onClick={check} disabled={!input}>
            Check
          </Button>
          <Button variant="ghost" onClick={nextCard}>
            Next
          </Button>
        </div>
      </div>
      <p className="text-center text-xs font-bold text-ink/50">
        Practice: {score.right} / {score.total} correct
      </p>
    </div>
  );
}
