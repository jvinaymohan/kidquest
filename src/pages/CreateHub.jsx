import { useMemo } from "react";
import { Link } from "react-router-dom";
import { BookOpen, MapPin, NotebookPen, PencilLine, PenLine, Target } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { useMultiplicationStore } from "../store/useMultiplicationStore";
import { useLifeExplorerStore } from "../store/useLifeExplorerStore";

export default function CreateHub() {
  const lessonsToday = useAppStore((s) => s.lessonsToday);
  const dailyGoal = useAppStore((s) => s.dailyGoal);
  const tableOfDay = useMultiplicationStore((s) => s.tableOfTheDay);
  const itemCount = useLifeExplorerStore((s) => s.items.length);
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
            <p className="text-sm font-bold text-ink/70">Life Explorer — map, journals, and stories.</p>
          </div>
        </div>
      </header>

      <Link to="/life" className="chunky-card p-4 flex items-center gap-3 focus-ring border-[3px] border-geography/30">
        <MapPin className="text-geography" size={24} />
        <div className="flex-1">
          <p className="font-display font-extrabold">Open Life Explorer</p>
          <p className="text-xs font-bold text-ink/60">{itemCount} saved creations</p>
        </div>
      </Link>

      <section className="chunky-card p-4">
        <div className="flex items-center gap-2 mb-2">
          <NotebookPen size={18} className="text-music" />
          <p className="font-display font-extrabold">Quick create</p>
        </div>
        <div className="grid gap-2">
          <Link to="/life/map" className="rounded-chunky border-2 border-ink/15 px-3 py-2 text-sm font-bold flex items-center gap-2">
            <MapPin size={16} /> Drop a map pin
          </Link>
          <Link to="/life/journal/reading" className="rounded-chunky border-2 border-ink/15 px-3 py-2 text-sm font-bold flex items-center gap-2">
            <BookOpen size={16} /> Log a book
          </Link>
          <Link to="/life/journal/movie" className="rounded-chunky border-2 border-ink/15 px-3 py-2 text-sm font-bold">
            🎬 Log a movie
          </Link>
          <Link to="/life/story" className="rounded-chunky border-2 border-ink/15 px-3 py-2 text-sm font-bold flex items-center gap-2">
            <PenLine size={16} /> Write a story
          </Link>
          <Link to="/multiplication/table/7/learn" className="rounded-chunky border-2 border-ink/15 px-3 py-2 text-sm font-bold">
            Build multiplication flashcards
          </Link>
        </div>
      </section>

      <section className="chunky-card p-4 border-[3px] border-success/30 bg-success/10">
        <div className="flex items-center gap-2 mb-2">
          <Target size={18} className="text-success" />
          <p className="font-display font-extrabold">Today&apos;s plan</p>
        </div>
        <p className="text-sm font-bold text-ink/75">
          {done}/{dailyGoal} lessons · Table of the Day: {tableOfDay}×
        </p>
        <p className="text-xs font-bold text-ink/60 mt-1">
          Learn something new, then capture it in Life Explorer.
        </p>
      </section>
    </div>
  );
}
