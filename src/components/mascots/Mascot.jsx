import { motion } from "framer-motion";
import clsx from "clsx";

function Owl({ size }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <ellipse cx="50" cy="62" rx="32" ry="34" fill="#A86A2C" />
      <ellipse cx="50" cy="64" rx="22" ry="22" fill="#E8C68C" />
      <circle cx="40" cy="48" r="11" fill="white" />
      <circle cx="60" cy="48" r="11" fill="white" />
      <circle cx="40" cy="48" r="5" fill="#2D3047" />
      <circle cx="60" cy="48" r="5" fill="#2D3047" />
      <circle cx="42" cy="46" r="1.5" fill="white" />
      <circle cx="62" cy="46" r="1.5" fill="white" />
      <polygon points="50,55 46,62 54,62" fill="#FFB347" />
      <path d="M30 32 Q35 22 42 30" stroke="#A86A2C" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M70 32 Q65 22 58 30" stroke="#A86A2C" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="32" cy="86" r="4" fill="#FFB347" />
      <circle cx="68" cy="86" r="4" fill="#FFB347" />
      <rect x="42" y="30" width="16" height="4" rx="2" fill="#2D3047" />
    </svg>
  );
}

function Compass({ size }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <circle cx="50" cy="50" r="40" fill="#2A9D8F" />
      <circle cx="50" cy="50" r="32" fill="#E0F5F2" />
      <circle cx="50" cy="50" r="6" fill="#2D3047" />
      <polygon points="50,20 56,50 50,80 44,50" fill="#FF6B35" stroke="#2D3047" strokeWidth="2" />
      <text x="50" y="18" textAnchor="middle" fontSize="8" fontWeight="800" fill="#2D3047">N</text>
      <text x="50" y="92" textAnchor="middle" fontSize="8" fontWeight="800" fill="#2D3047">S</text>
      <text x="18" y="54" textAnchor="middle" fontSize="8" fontWeight="800" fill="#2D3047">W</text>
      <text x="84" y="54" textAnchor="middle" fontSize="8" fontWeight="800" fill="#2D3047">E</text>
      <circle cx="28" cy="34" r="6" fill="#FFE66D" stroke="#2D3047" strokeWidth="2" />
      <circle cx="26" cy="32" r="1.5" fill="#2D3047" />
      <circle cx="30" cy="32" r="1.5" fill="#2D3047" />
      <path d="M26 36 Q28 38 30 36" stroke="#2D3047" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function Dino({ size }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <ellipse cx="50" cy="60" rx="34" ry="30" fill="#9B5DE5" />
      <ellipse cx="50" cy="55" rx="24" ry="20" fill="#C29FF2" />
      <circle cx="42" cy="48" r="6" fill="white" />
      <circle cx="58" cy="48" r="6" fill="white" />
      <circle cx="42" cy="49" r="3" fill="#2D3047" />
      <circle cx="58" cy="49" r="3" fill="#2D3047" />
      <path d="M44 60 Q50 66 56 60" stroke="#2D3047" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <polygon points="34,38 38,30 42,38" fill="#FF6B35" />
      <polygon points="46,32 50,24 54,32" fill="#FFE66D" />
      <polygon points="58,38 62,30 66,38" fill="#FF6B35" />
      <circle cx="30" cy="74" r="4" fill="#FFE66D" />
      <circle cx="70" cy="68" r="3" fill="#FFE66D" />
      <rect x="22" y="58" width="12" height="6" rx="3" fill="#2D3047" />
      <circle cx="26" cy="61" r="1.5" fill="#FFE66D" />
      <circle cx="30" cy="61" r="1.5" fill="#FFE66D" />
    </svg>
  );
}

function Robot({ size }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <rect x="22" y="36" width="56" height="48" rx="10" fill="#3A86FF" stroke="#2D3047" strokeWidth="3" />
      <rect x="32" y="46" width="36" height="20" rx="4" fill="#E0EBFF" />
      <circle cx="42" cy="56" r="4" fill="#2D3047" />
      <circle cx="58" cy="56" r="4" fill="#2D3047" />
      <circle cx="42" cy="55" r="1.2" fill="white" />
      <circle cx="58" cy="55" r="1.2" fill="white" />
      <rect x="40" y="70" width="20" height="3" rx="1.5" fill="#2D3047" />
      <rect x="44" y="20" width="12" height="14" rx="3" fill="#3A86FF" stroke="#2D3047" strokeWidth="3" />
      <circle cx="50" cy="18" r="4" fill="#FF6B35" stroke="#2D3047" strokeWidth="2" />
      <rect x="16" y="50" width="6" height="22" rx="3" fill="#3A86FF" stroke="#2D3047" strokeWidth="2.5" />
      <rect x="78" y="50" width="6" height="22" rx="3" fill="#3A86FF" stroke="#2D3047" strokeWidth="2.5" />
    </svg>
  );
}

function CatMascot({ size }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <ellipse cx="50" cy="60" rx="30" ry="30" fill="#FB8500" />
      <polygon points="26,34 22,16 40,28" fill="#FB8500" />
      <polygon points="74,34 78,16 60,28" fill="#FB8500" />
      <polygon points="30,30 28,22 36,28" fill="#FFB347" />
      <polygon points="70,30 72,22 64,28" fill="#FFB347" />
      <circle cx="40" cy="54" r="6" fill="white" />
      <circle cx="60" cy="54" r="6" fill="white" />
      <ellipse cx="40" cy="55" rx="2.5" ry="4" fill="#2D3047" />
      <ellipse cx="60" cy="55" rx="2.5" ry="4" fill="#2D3047" />
      <polygon points="50,64 47,68 53,68" fill="#FF6B6B" />
      <path d="M50 68 Q46 74 42 72" stroke="#2D3047" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M50 68 Q54 74 58 72" stroke="#2D3047" strokeWidth="2" fill="none" strokeLinecap="round" />
      <line x1="22" y1="62" x2="34" y2="62" stroke="#2D3047" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="22" y1="66" x2="34" y2="66" stroke="#2D3047" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="66" y1="62" x2="78" y2="62" stroke="#2D3047" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="66" y1="66" x2="78" y2="66" stroke="#2D3047" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function Panda({ size }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <circle cx="28" cy="30" r="10" fill="#2D3047" />
      <circle cx="72" cy="30" r="10" fill="#2D3047" />
      <circle cx="50" cy="58" r="30" fill="white" stroke="#2D3047" strokeWidth="2" />
      <ellipse cx="40" cy="52" rx="7" ry="9" fill="#2D3047" />
      <ellipse cx="60" cy="52" rx="7" ry="9" fill="#2D3047" />
      <circle cx="40" cy="53" r="3" fill="white" />
      <circle cx="60" cy="53" r="3" fill="white" />
      <circle cx="41" cy="54" r="1.2" fill="#2D3047" />
      <circle cx="61" cy="54" r="1.2" fill="#2D3047" />
      <ellipse cx="50" cy="66" rx="4" ry="3" fill="#2D3047" />
      <path d="M46 70 Q50 74 54 70" stroke="#2D3047" strokeWidth="2" fill="none" strokeLinecap="round" />
      <polygon points="50,8 53,18 63,18 55,24 58,34 50,28 42,34 45,24 37,18 47,18" fill="#FFE66D" stroke="#2D3047" strokeWidth="1.5" />
    </svg>
  );
}

const MASCOTS = {
  owl: Owl,
  compass: Compass,
  dino: Dino,
  robot: Robot,
  cat: CatMascot,
  panda: Panda,
};

export function Mascot({ kind = "owl", size = 96, animate = true, className }) {
  const Comp = MASCOTS[kind] ?? Owl;
  return (
    <motion.div
      className={clsx("inline-block", className)}
      animate={animate ? { y: [0, -6, 0], rotate: [-2, 2, -2] } : undefined}
      transition={animate ? { repeat: Infinity, duration: 3.4, ease: "easeInOut" } : undefined}
    >
      <Comp size={size} />
    </motion.div>
  );
}
