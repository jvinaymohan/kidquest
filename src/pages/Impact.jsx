import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Heart, BookOpen, School, Gift } from "lucide-react";
import { Button } from "../components/ui/Button";

const BREAKDOWN = [
  { label: "Free access for kids in need", pct: 60, color: "var(--color-primary)", icon: <Gift size={18} /> },
  { label: "Partner education programs",   pct: 25, color: "var(--color-secondary)", icon: <School size={18} /> },
  { label: "App development & content",     pct: 15, color: "var(--color-accent)", icon: <BookOpen size={18} /> },
];

export default function Impact() {
  return (
    <div className="flex flex-col gap-5">
      <Link
        to="/home"
        className="self-start flex items-center gap-1 font-display font-extrabold text-ink/70 focus-ring rounded-pill px-2 py-1"
      >
        <ChevronLeft size={20} /> Home
      </Link>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="chunky-card p-6 text-center bg-gradient-to-br from-accent to-white"
      >
        <Heart className="text-error mx-auto" size={42} />
        <h1 className="font-display text-4xl font-extrabold mt-2">Knowledge is free.</h1>
        <p className="font-display font-extrabold text-xl text-primary mt-1">
          Your support makes it possible.
        </p>
        <p className="text-ink/70 font-bold mt-3 text-sm">
          Every dollar KidQuest earns goes back to helping kids learn — everywhere.
        </p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="chunky-card p-5"
      >
        <h2 className="font-display font-extrabold text-xl">Where the money goes</h2>
        <p className="text-xs font-bold text-ink/60 mt-1">Live numbers will appear here once KidQuest Plus launches.</p>
        <ul className="mt-4 flex flex-col gap-3">
          {BREAKDOWN.map((row, i) => (
            <li key={row.label}>
              <div className="flex items-center justify-between text-sm font-bold">
                <span className="flex items-center gap-2">
                  <span className="w-7 h-7 grid place-items-center rounded-full bg-bg border-[2px] border-ink/15">
                    {row.icon}
                  </span>
                  {row.label}
                </span>
                <span className="font-display font-extrabold">{row.pct}%</span>
              </div>
              <div className="h-3 bg-ink/10 rounded-full overflow-hidden mt-1 border-[2px] border-ink/15">
                <motion.div
                  className="h-full"
                  style={{ background: row.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${row.pct}%` }}
                  transition={{ duration: 0.8, delay: 0.15 + i * 0.1, ease: "easeOut" }}
                />
              </div>
            </li>
          ))}
        </ul>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 sm:grid-cols-3 gap-3"
      >
        <Stat label="Lessons in alpha" value="90" />
        <Stat label="Subjects" value="6" />
        <Stat label="Countries" value="Coming soon: 195" />
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="chunky-card p-5"
      >
        <h2 className="font-display font-extrabold text-xl">Want to help?</h2>
        <ul className="mt-2 text-sm font-bold text-ink/80 list-disc pl-5 space-y-1">
          <li>Share KidQuest with a parent, teacher, or friend.</li>
          <li>Submit a lesson idea or fun fact (coming soon).</li>
          <li>Subscribe to KidQuest Plus when it launches.</li>
          <li>Sponsor free access for a kid via "Support a Kid."</li>
        </ul>
      </motion.section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link to="/about" className="block">
          <Button variant="ghost" fullWidth>Read our story →</Button>
        </Link>
        <Link to="/home" className="block">
          <Button fullWidth>Back to learning</Button>
        </Link>
      </div>

      <footer className="text-center text-xs font-bold text-ink/50 py-2">
        Designed by Vinay. Built with Cursor.
      </footer>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="chunky-card text-center py-3 px-2">
      <div className="text-[10px] uppercase tracking-wide font-display font-extrabold text-ink/60">{label}</div>
      <div className="font-display font-extrabold text-lg mt-1">{value}</div>
    </div>
  );
}
