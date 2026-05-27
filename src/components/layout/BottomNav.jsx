import { NavLink } from "react-router-dom";
import { BookOpen, Compass, PencilLine, Trophy, User } from "lucide-react";
import clsx from "clsx";

const ITEMS = [
  { to: "/home", label: "Learn", Icon: BookOpen },
  { to: "/explore", label: "Explore", Icon: Compass },
  { to: "/create", label: "Create", Icon: PencilLine },
  { to: "/compete", label: "Compete", Icon: Trophy },
  { to: "/profile", label: "Me", Icon: User },
];

export function BottomNav() {
  return (
    <nav className="sticky bottom-0 z-30 bg-bg/90 backdrop-blur border-t border-ink/10 px-2 py-2 safe-bottom">
      <ul className="max-w-2xl mx-auto grid grid-cols-5 gap-1.5">
        {ITEMS.map(({ to, label, Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                clsx(
                  "flex flex-col items-center gap-1 py-2 rounded-chunky border-[3px] focus-ring transition min-h-[56px] justify-center",
                  isActive ? "bg-accent border-ink/20 shadow-chunky" : "border-transparent text-ink/70"
                )
              }
            >
              <Icon size={20} strokeWidth={2.5} />
              <span className="text-[10px] font-display font-bold leading-none">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
