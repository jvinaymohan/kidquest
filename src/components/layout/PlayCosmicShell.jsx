import clsx from "clsx";
import { useReducedMotion } from "framer-motion";
import { ElegantBackground } from "../elegant/ElegantBackground";

/** Dark cosmic canvas shared by logged-in play routes (matches Quest Home). */
export function PlayCosmicShell({ children, className }) {
  const reduce = useReducedMotion();

  return (
    <div className={clsx("elegant-page relative flex flex-col gap-4", className)}>
      <ElegantBackground reduceMotion={reduce} />
      <div className="relative z-10 flex flex-col gap-4">{children}</div>
    </div>
  );
}
