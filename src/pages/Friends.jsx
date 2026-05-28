import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Copy } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { addFriendByCode, getOrCreateFriendCode, listFriends } from "../lib/cloud/social";
import { isSupabaseEnabled } from "../lib/supabaseClient";

export default function Friends() {
  const userId = useAuthStore((s) => s.user?.id);
  const [myCode, setMyCode] = useState("");
  const [friends, setFriends] = useState([]);
  const [input, setInput] = useState("");
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (!userId) return;
    getOrCreateFriendCode(userId).then(setMyCode);
    listFriends(userId).then(setFriends);
  }, [userId]);

  async function addFriend() {
    setMsg(null);
    const res = await addFriendByCode({ userId, code: input });
    if (!res.ok) {
      setMsg(res.reason);
      return;
    }
    setMsg("Friend added!");
    setFriends(await listFriends(userId));
    setInput("");
  }

  function copyCode() {
    navigator.clipboard?.writeText(myCode);
    setMsg("Code copied!");
  }

  if (!isSupabaseEnabled) {
    return (
      <p className="p-4 text-sm font-bold">
        Sign in with cloud sync to use friends. <Link to="/login" className="text-primary">Sign in</Link>
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Link to="/compete" className="text-sm font-bold">
        ← Compete
      </Link>
      <header className="chunky-card p-4 flex items-center gap-3">
        <Users className="text-primary" />
        <div>
          <h1 className="font-display text-2xl font-extrabold">Friends</h1>
          <p className="text-sm font-bold text-ink/65">Invite with a code — no open chat, just friendly rivalry.</p>
        </div>
      </header>

      <section className="chunky-card p-4">
        <p className="text-xs font-extrabold uppercase text-ink/50">Your invite code</p>
        <div className="flex items-center gap-2 mt-2">
          <code className="flex-1 text-lg font-display font-extrabold tracking-widest">{myCode || "…"}</code>
          <button type="button" onClick={copyCode} className="chunky-btn bg-secondary text-white px-3 py-2">
            <Copy size={16} />
          </button>
        </div>
      </section>

      <section className="chunky-card p-4">
        <p className="text-sm font-bold mb-2">Add a friend&apos;s code</p>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            placeholder="FRIEND CODE"
            className="flex-1 px-3 py-2 rounded-chunky border-2 border-ink/15 font-bold uppercase"
          />
          <button type="button" onClick={addFriend} className="chunky-btn bg-primary text-white px-4 font-extrabold">
            Add
          </button>
        </div>
        {msg && <p className="text-xs font-bold mt-2 text-primary">{msg}</p>}
      </section>

      <section className="chunky-card p-4">
        <h2 className="font-display font-extrabold mb-2">Your friends</h2>
        {friends.length === 0 ? (
          <p className="text-sm font-bold text-ink/55">No friends yet — share your code!</p>
        ) : (
          <ul className="space-y-2">
            {friends.map((f) => (
              <li key={f.id} className="text-sm font-bold flex justify-between">
                <span>{f.name}</span>
                <span className="text-ink/50">{f.ageGroup}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
