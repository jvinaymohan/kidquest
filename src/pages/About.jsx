import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Heart, Sparkles, Car, Globe2 } from "lucide-react";
import { Mascot } from "../components/mascots/Mascot";
import { Button } from "../components/ui/Button";

export default function About() {
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
        className="chunky-card p-6 text-center relative overflow-hidden bg-gradient-to-br from-accent to-white"
      >
        <div className="text-xs uppercase tracking-wide font-display font-extrabold text-ink/60">
          Our story
        </div>
        <h1 className="font-display text-4xl font-extrabold mt-1">KidQuest was born in a car.</h1>
        <div className="absolute -bottom-2 -right-2 opacity-80">
          <Mascot kind="compass" size={88} />
        </div>
      </motion.section>

      <motion.article
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="chunky-card p-6 leading-relaxed text-ink font-body text-base sm:text-lg space-y-4"
      >
        <p>
          <strong>Vinay</strong> was on a weekend road trip with his child when he
          realized something: the best classroom had always been right there — in
          the questions kids ask, in the world rushing past the window, in
          conversation between a parent and a curious mind.
        </p>
        <p>
          He started writing down everything he taught his own kid. The flags. The
          capitals. The planets. The things you need to know just to feel at home
          in this world. Not for an exam. Just because the world is endlessly
          fascinating.
        </p>
        <p>That weekend, KidQuest was born.</p>
        <p>
          The idea is simple: knowledge should be free. And learning should feel
          like an adventure, not a chore. Everything you earn here — XP, badges,
          ranks — comes from actually knowing things. And every dollar this app
          earns goes toward making that possible for more kids, everywhere.
        </p>
        <p>
          One more dream: to put KidQuest on the Tesla screen. So every road trip
          becomes a classroom.
        </p>
        <p className="text-ink/70 italic">
          Idea by Vinay for Ram, who also contributes to make it easier for kids.
          Built with Cursor. Made for every curious kid on the planet.
        </p>
      </motion.article>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Pillar icon={<Heart className="text-error" />} title="Knowledge is free" body="Core learning is always free. Always." />
        <Pillar icon={<Globe2 className="text-secondary" />} title="Built for the world" body="195 countries, multiple languages, everywhere." />
        <Pillar icon={<Car className="text-primary" />} title="On every screen" body="Phone, tablet, and yes — even Tesla." />
      </section>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="chunky-card p-5 text-center"
      >
        <Sparkles className="text-primary mx-auto" />
        <h2 className="font-display text-2xl font-extrabold mt-2">Want to help shape KidQuest?</h2>
        <p className="text-ink/70 font-bold mt-1">Kids can submit ideas, fun facts, and questions. If we use them, they get a permanent credit in the app.</p>
        <p className="text-xs text-ink/50 font-bold mt-2">(Coming soon in the next release.)</p>
      </motion.section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link to="/impact" className="block">
          <Button variant="ghost" fullWidth>See our mission →</Button>
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

function Pillar({ icon, title, body }) {
  return (
    <div className="chunky-card p-4 flex flex-col items-start gap-2">
      <div className="w-10 h-10 grid place-items-center rounded-full bg-bg border-[2.5px] border-ink/15">
        {icon}
      </div>
      <h3 className="font-display font-extrabold text-lg leading-tight">{title}</h3>
      <p className="text-sm font-bold text-ink/70">{body}</p>
    </div>
  );
}
