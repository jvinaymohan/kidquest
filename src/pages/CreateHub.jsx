import { useMemo } from "react";
import { Link } from "react-router-dom";
import { NotebookPen, PencilLine, Target } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { useMultiplicationStore } from "../store/useMultiplicationStore";

export default function CreateHub() {
  const lessonsToday = useAppStore((s) => s.lessonsToday);
  const dailyGoal = useAppStore((s) => s.dailyGoal);
  const tableOfDay = useMultiplicationStore((s) => s.tableOfTheDay);
  const done = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return lessonsToday.date === today ? lessonsToday.count : 0;
  }, [lessonsToday]);

  return (
    <div className="flex flex-col gap-4">
      <header className="chunky-card p-4 bg-gradient-to-br from-music/20 to-white border-[3px] border-music/35">
        <div className="flex items-center gap-3">
          <PencilLine className="text-music" />
          <div>
            <h1 className="font-display text-2xl font-extrabold">Create</h1>
            <p className="text-sm font-bold text-ink/70">Write, reflect, and build your own ideas.</p>
          </div>
        </div>
      </header>

      <section className="chunky-card p-4">
        <div className="flex items-center gap-2 mb-2">
          <NotebookPen size={18} className="text-music" />
          <p className="font-display font-extrabold">Creation Studio</p>
        </div>
        <p className="text-sm font-bold text-ink/65">
          Capture what you learned today and create your own challenges.
        </p>
        <div className="mt-3 grid gap-2">
          <Link to="/subject/geography?tab=learn" className="rounded-chunky border-2 border-ink/15 px-3 py-2 text-sm font-bold">
            Write 3 facts about a country you discovered
          </Link>
          <Link to="/subject/solar-system?tab=learn" className="rounded-chunky border-2 border-ink/15 px-3 py-2 text-sm font-bold">
            Sketch your favorite planet and one mission fact
          </Link>
          <Link to="/multiplication/table/7/learn" className="rounded-chunky border-2 border-ink/15 px-3 py-2 text-sm font-bold">
            Build your own flashcards for a tricky table
          </Link>
        </div>
      </section>

      <section className="chunky-card p-4 border-[3px] border-success/30 bg-success/10">
        <div className="flex items-center gap-2 mb-2">
          <Target size={18} className="text-success" />
          <p className="font-display font-extrabold">Today's Plan</p>
        </div>
        <p className="text-sm font-bold text-ink/75">
          {done}/{dailyGoal} lessons complete. Table of the Day: {tableOfDay}×.
        </p>
        <p className="text-xs font-bold text-ink/60 mt-1">
          Try a short practice + one creative reflection for better retention.
        </p>
      </section>
    </div>
  );
}
