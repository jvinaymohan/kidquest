import { NavLink } from "react-router-dom";
import { Home, User, Settings as SettingsIcon } from "lucide-react";
import clsx from "clsx";

const ITEMS = [
  { to: "/home", label: "Home", Icon: Home },
  { to: "/profile", label: "Profile", Icon: User },
  { to: "/settings", label: "Parent", Icon: SettingsIcon },
];

export function BottomNav() {
  return (
    <nav className="sticky bottom-0 z-30 bg-bg/85 backdrop-blur border-t border-ink/10 px-3 py-2 safe-bottom">
      <ul className="max-w-2xl mx-auto grid grid-cols-3 gap-2">
        {ITEMS.map(({ to, label, Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                clsx(
                  "flex flex-col items-center gap-1 py-2 rounded-chunky border-[3px] focus-ring transition",
                  isActive ? "bg-accent border-ink/20 shadow-chunky" : "border-transparent text-ink/70"
                )
              }
            >
              <Icon size={22} strokeWidth={2.5} />
              <span className="text-xs font-display font-bold">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
