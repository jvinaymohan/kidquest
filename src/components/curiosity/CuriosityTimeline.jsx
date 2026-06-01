import { motion } from "framer-motion";

export function CuriosityTimeline({ items }) {
  if (!items?.length) return null;
  return (
    <ol className="relative border-l-2 border-primary/25 pl-5 space-y-4">
      {items.map((item, i) => (
        <motion.li
          key={`${item.year}-${item.label}`}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="relative"
        >
          <span className="absolute -left-[1.35rem] top-1 h-3 w-3 rounded-full bg-primary ring-2 ring-white" />
          <p className="text-xs font-extrabold text-primary">{item.year}</p>
          <p className="font-display font-extrabold text-sm">{item.label}</p>
          {item.detail && <p className="text-xs font-medium text-ink/60 mt-0.5">{item.detail}</p>}
        </motion.li>
      ))}
    </ol>
  );
}
