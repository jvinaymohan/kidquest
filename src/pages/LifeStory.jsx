import { useState } from "react";
import { Link } from "react-router-dom";
import { useLifeExplorerStore } from "../store/useLifeExplorerStore";
import { useAuthStore } from "../store/useAuthStore";
import { upsertLifeExplorerItem } from "../lib/cloud/lifeExplorer";

const STARTERS = [
  "Once upon a time, a curious explorer found a map that glowed…",
  "On a planet far away, two kids built a rocket from cardboard…",
  "The smallest country held the biggest secret…",
];

export default function LifeStory() {
  const addItem = useLifeExplorerStore((s) => s.addItem);
  const stories = useLifeExplorerStore((s) => s.stories());
  const userId = useAuthStore((s) => s.user?.id);
  const [title, setTitle] = useState("My adventure");
  const [body, setBody] = useState(STARTERS[0]);

  async function save() {
    const item = addItem({ type: "story", title, body, shareScope: "private" });
    if (userId) await upsertLifeExplorerItem({ userId, itemType: "story", title, body });
  }

  function exportPdfHint() {
    window.print();
  }

  return (
    <div className="flex flex-col gap-4">
      <Link to="/life" className="text-sm font-bold">
        ← Life Explorer
      </Link>
      <h1 className="font-display text-xl font-extrabold">Story studio</h1>
      <div className="flex flex-wrap gap-2">
        {STARTERS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setBody(s)}
            className="text-xs font-bold px-2 py-1 rounded-pill bg-accent border border-ink/15"
          >
            Starter
          </button>
        ))}
      </div>
      <div className="chunky-card p-4 flex flex-col gap-2 print:shadow-none">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="font-display text-lg font-extrabold border-b-2 border-ink/10 pb-1"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={12}
          className="font-bold text-ink/80 leading-relaxed resize-none focus:outline-none"
        />
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={save} className="chunky-btn bg-primary text-white flex-1 font-extrabold py-2">
          Save story
        </button>
        <button type="button" onClick={exportPdfHint} className="chunky-btn border-2 border-ink/20 flex-1 font-extrabold py-2">
          Print / PDF
        </button>
      </div>
      <ul className="space-y-2">
        {stories.map((s) => (
          <li key={s.id} className="chunky-card p-3">
            <p className="font-display font-extrabold">{s.title}</p>
            <p className="text-sm font-bold text-ink/60 line-clamp-3">{s.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
