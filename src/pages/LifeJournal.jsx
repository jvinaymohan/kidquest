import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useLifeExplorerStore } from "../store/useLifeExplorerStore";
import { useAuthStore } from "../store/useAuthStore";
import { upsertLifeExplorerItem } from "../lib/cloud/lifeExplorer";

const TYPE_MAP = { reading: "reading", movie: "movie", music: "music" };

export default function LifeJournal() {
  const { journalType } = useParams();
  const type = TYPE_MAP[journalType] ?? "reading";
  const addItem = useLifeExplorerStore((s) => s.addItem);
  const entries = useLifeExplorerStore((s) => s.journals(type));
  const userId = useAuthStore((s) => s.user?.id);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const labels = {
    reading: { heading: "Reading journal", placeholder: "Book title", hint: "What did you learn?" },
    movie: { heading: "Movie journal", placeholder: "Movie title", hint: "Favorite scene or fact" },
    music: { heading: "Music journal", placeholder: "Song or artist", hint: "Why you like it" },
  };
  const L = labels[type] ?? labels.reading;

  async function save() {
    if (!title.trim()) return;
    const item = addItem({ type, title, body });
    if (userId) {
      await upsertLifeExplorerItem({ userId, itemType: type, title, body });
    }
    setTitle("");
    setBody("");
  }

  return (
    <div className="flex flex-col gap-4">
      <Link to="/life" className="text-sm font-bold">
        ← Life Explorer
      </Link>
      <h1 className="font-display text-xl font-extrabold">{L.heading}</h1>
      <div className="chunky-card p-4 flex flex-col gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={L.placeholder}
          className="px-3 py-2 rounded-chunky border-2 border-ink/15 font-bold"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={L.hint}
          rows={4}
          className="px-3 py-2 rounded-chunky border-2 border-ink/15 font-bold resize-none"
        />
        <button type="button" onClick={save} className="chunky-btn bg-primary text-white font-extrabold py-2">
          Save entry
        </button>
      </div>
      <ul className="space-y-2">
        {entries.map((e) => (
          <li key={e.id} className="chunky-card p-3">
            <p className="font-display font-extrabold">{e.title}</p>
            {e.body && <p className="text-sm font-bold text-ink/65 mt-1">{e.body}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
