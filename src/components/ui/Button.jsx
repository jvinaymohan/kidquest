import { motion } from "framer-motion";
import clsx from "clsx";

const VARIANTS = {
  primary: "bg-primary text-white",
  secondary: "bg-secondary text-white",
  accent: "bg-accent text-ink",
  success: "bg-success text-white",
  error: "bg-error text-white",
  ghost: "bg-white text-ink",
};

const SIZES = {
  sm: "px-4 py-2 text-base",
  md: "px-6 py-3 text-lg",
  lg: "px-8 py-4 text-xl",
  xl: "px-10 py-5 text-2xl",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  leftIcon,
  rightIcon,
  fullWidth,
  type = "button",
  disabled,
  ...rest
}) {
  return (
    <motion.button
      type={type}
      whileTap={{ y: 2, boxShadow: "2px 2px 0px rgba(0,0,0,0.15)" }}
      whileHover={disabled ? {} : { y: -1 }}
      className={clsx(
        "chunky-btn focus-ring",
        VARIANTS[variant],
        SIZES[size],
        fullWidth && "w-full",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      disabled={disabled}
      {...rest}
    >
      {leftIcon}
      <span>{children}</span>
      {rightIcon}
    </motion.button>
  );
}
