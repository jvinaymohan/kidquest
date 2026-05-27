import { motion } from "framer-motion";
import { Star } from "lucide-react";
import clsx from "clsx";

export function StarRating({ value = 0, max = 3, size = 28, animate = false, className }) {
  return (
    <div className={clsx("flex items-center gap-1", className)}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < value;
        return (
          <motion.div
            key={i}
            initial={animate ? { scale: 0, rotate: -45 } : false}
            animate={animate ? { scale: 1, rotate: 0 } : undefined}
            transition={{ delay: animate ? i * 0.18 : 0, type: "spring", stiffness: 260, damping: 14 }}
          >
            <Star
              size={size}
              strokeWidth={2.5}
              className={clsx(filled ? "text-accent" : "text-ink/15")}
              fill={filled ? "currentColor" : "transparent"}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
