import { NavLink } from "react-router-dom";
import { Compass, Home, Play, Trophy, User } from "lucide-react";
import clsx from "clsx";

const SIDE_ITEMS = [
  { to: "/home", label: "Home", Icon: Home },
  { to: "/explore", label: "Explore", Icon: Compass },
  { to: "/compete", label: "Win!", Icon: Trophy },
  { to: "/profile", label: "Me", Icon: User },
];

export function BottomNav({ cosmic = false }) {
  return (
    <nav
      className={clsx(
        "sticky bottom-0 z-30 px-2 py-2 safe-bottom border-t",
        cosmic
          ? "bg-[#07061a]/95 backdrop-blur-md border-white/10"
          : "bg-bg/90 backdrop-blur border-ink/10"
      )}
    >
      <ul className="mx-auto grid max-w-4xl grid-cols-5 items-end gap-1">
        {SIDE_ITEMS.slice(0, 2).map(({ to, label, Icon }) => (
          <li key={to}>
            <NavItem to={to} label={label} Icon={Icon} cosmic={cosmic} />
          </li>
        ))}

        <li className="flex justify-center">
          <NavLink
            to="/math"
            className={({ isActive }) =>
              clsx(
                "bottom-nav-play focus-ring flex flex-col items-center gap-0.5 rounded-2xl px-4 py-2 transition",
                isActive && "bottom-nav-play-active"
              )
            }
          >
            <span className="bottom-nav-play-icon grid place-items-center rounded-full">
              <Play size={22} fill="currentColor" strokeWidth={0} />
            </span>
            <span className="font-display text-[10px] font-extrabold leading-none">Play!</span>
          </NavLink>
        </li>

        {SIDE_ITEMS.slice(2).map(({ to, label, Icon }) => (
          <li key={to}>
            <NavItem to={to} label={label} Icon={Icon} cosmic={cosmic} />
          </li>
        ))}
      </ul>
    </nav>
  );
}

function NavItem({ to, label, Icon, cosmic }) {
  return (
    <NavLink
      to={to}
      end={to === "/home"}
      className={({ isActive }) =>
        clsx(
          "flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-xl border-[3px] px-1 py-2 transition focus-ring",
          cosmic
            ? isActive
              ? "border-[#ffd700]/50 bg-white/15 text-white shadow-[0_0_12px_rgba(255,215,0,0.25)]"
              : "border-transparent text-white/60"
            : isActive
              ? "border-ink/20 bg-accent text-ink shadow-chunky"
              : "border-transparent text-ink/70"
        )
      }
    >
      <Icon size={20} strokeWidth={2.5} />
      <span className="font-display text-[10px] font-bold leading-none">{label}</span>
    </NavLink>
  );
}
