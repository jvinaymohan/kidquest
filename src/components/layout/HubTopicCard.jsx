import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import clsx from "clsx";
import { motion } from "framer-motion";

/** List row / card for hub topic lists on cosmic background */
export function HubTopicCard({
  to,
  onClick,
  as = "link",
  emoji,
  title,
  subtitle,
  accent,
  trailing,
  delay = 0,
  className,
  children,
}) {
  const inner = (
    <>
      {emoji && (
        <span className="text-3xl shrink-0" aria-hidden>
          {emoji}
        </span>
      )}
      <div className="flex-1 min-w-0">
        <p
          className="font-display font-extrabold text-base leading-tight"
          style={accent?.color ? { color: accent.color } : undefined}
        >
          {title}
        </p>
        {subtitle && (
          <p className="text-xs font-medium text-white/55 mt-0.5">{subtitle}</p>
        )}
        {children}
      </div>
      {trailing}
      <ChevronRight className="text-white/25 shrink-0" size={20} aria-hidden />
    </>
  );

  const cardClass = clsx(
    "hub-topic-card w-full text-left",
    className
  );

  const style = accent?.background ? { background: accent.background } : undefined;

  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      {as === "button" ? (
        <button
          type="button"
          onClick={onClick}
          disabled={accent?.disabled}
          className={clsx(cardClass, accent?.disabled && "opacity-55 cursor-not-allowed")}
          style={style}
        >
          {inner}
        </button>
      ) : (
        <Link to={to} className={cardClass} style={style}>
          {inner}
        </Link>
      )}
    </motion.li>
  );
}
