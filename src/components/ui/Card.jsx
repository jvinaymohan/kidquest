import clsx from "clsx";
import { motion } from "framer-motion";

export function Card({ children, className, hoverable = false, style, onClick, ...rest }) {
  const Comp = onClick || hoverable ? motion.button : motion.div;
  return (
    <Comp
      onClick={onClick}
      whileHover={hoverable ? { y: -3 } : undefined}
      whileTap={hoverable || onClick ? { y: 1, boxShadow: "2px 2px 0px rgba(0,0,0,0.15)" } : undefined}
      className={clsx(
        "chunky-card text-left p-4",
        (hoverable || onClick) && "focus-ring cursor-pointer",
        className
      )}
      style={style}
      {...rest}
    >
      {children}
    </Comp>
  );
}
