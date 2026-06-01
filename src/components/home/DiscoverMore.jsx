import { useState } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";
import {
  BeyondSchoolGrid,
  HomeBottomCta,
  LifeSkillsStrip,
  StatsRow,
  WonderQuote,
} from "../elegant/ElegantSections";

/** Marketing blocks — landing-style content, collapsed on logged-in home */
export function DiscoverMore({ kidName, onComingSoon }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="home-v2-discover-more">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="home-v2-discover-toggle focus-ring w-full flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-display font-extrabold text-white/80"
        aria-expanded={open}
      >
        About KidQuest — for parents
        <ChevronDown
          size={18}
          className={clsx("transition-transform", open && "rotate-180")}
        />
      </button>
      {open && (
        <div className="mt-3 flex flex-col gap-4 home-v2-marketing-block">
          <BeyondSchoolGrid onComingSoon={onComingSoon} />
          <LifeSkillsStrip />
          <WonderQuote />
          <StatsRow />
          <HomeBottomCta kidName={kidName} />
        </div>
      )}
    </section>
  );
}
