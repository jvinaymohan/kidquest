import { Link } from "react-router-dom";
import { BookOpen, Film, MapPin, Music, PenLine } from "lucide-react";
import { t } from "../lib/i18n";
import { useLifeExplorerStore } from "../store/useLifeExplorerStore";

const LINKS = [
  { to: "/life/map", icon: MapPin, key: "map", color: "text-geography" },
  { to: "/life/journal/reading", icon: BookOpen, key: "reading", color: "text-primary" },
  { to: "/life/journal/movie", icon: Film, key: "movie", color: "text-solar-system" },
  { to: "/life/journal/music", icon: Music, key: "music", color: "text-music" },
  { to: "/life/story", icon: PenLine, key: "story", color: "text-trivia" },
];

export default function LifeExplorer() {
  const items = useLifeExplorerStore((s) => s.items);

  return (
    <div className="flex flex-col gap-4">
      <header className="chunky-card p-4 bg-gradient-to-br from-geography/20 to-white">
        <h1 className="font-display text-2xl font-extrabold">{t("lifeExplorer.title")}</h1>
        <p className="text-sm font-bold text-ink/65 mt-1">
          Document places, books, movies, music, and stories — your world, your way.
        </p>
        <p className="text-xs font-bold text-ink/45 mt-2">{items.length} creations saved</p>
      </header>

      <div className="grid gap-2">
        {LINKS.map(({ to, icon: Icon, key, color }) => (
          <Link key={to} to={to} className="chunky-card p-4 flex items-center gap-3 focus-ring">
            <Icon className={color} size={22} />
            <span className="font-display font-extrabold">{t(`lifeExplorer.${key}`)}</span>
          </Link>
        ))}
      </div>

      <Link to="/create" className="text-center text-sm font-bold text-primary">
        ← Create hub
      </Link>
    </div>
  );
}
