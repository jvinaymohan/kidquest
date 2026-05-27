import { motion } from "framer-motion";
import { Mascot } from "../mascots/Mascot";

const MASCOTS = ["owl", "compass", "dino", "robot", "cat", "panda"];

export function FloatingMascots() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
      {MASCOTS.map((m, i) => (
        <motion.div
          key={m}
          className="absolute"
          style={{
            left: `${(i * 18) % 90}%`,
            top: `${10 + ((i * 27) % 70)}%`,
          }}
          animate={{
            y: [0, -14, 0],
            x: [0, 8, 0],
            rotate: [-6, 6, -6],
          }}
          transition={{ duration: 5 + i * 0.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
        >
          <Mascot kind={m} size={64} animate={false} />
        </motion.div>
      ))}
    </div>
  );
}
