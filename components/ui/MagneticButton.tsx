"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, type ReactNode, type MouseEvent } from "react";

// Button that gently follows the cursor while hovered, with a glow that
// tracks the pointer position.
export default function MagneticButton({
  children,
  href,
  variant = "primary",
  download,
}: {
  children: ReactNode;
  href: string;
  variant?: "primary" | "ghost";
  download?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 18 });
  const springY = useSpring(y, { stiffness: 200, damping: 18 });

  function handleMouseMove(e: MouseEvent<HTMLAnchorElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left - rect.width / 2) * 0.25);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.25);
    ref.current?.style.setProperty("--glow-x", `${e.clientX - rect.left}px`);
    ref.current?.style.setProperty("--glow-y", `${e.clientY - rect.top}px`);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const base =
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3 text-sm font-medium transition-colors";
  const styles =
    variant === "primary"
      ? "bg-slate-900 text-white hover:bg-slate-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      : "border border-slate-900/20 text-slate-800 hover:border-slate-900/40 dark:border-white/15 dark:text-zinc-200 dark:hover:border-white/30";

  return (
    <motion.a
      ref={ref}
      href={href}
      download={download}
      className={`${base} ${styles}`}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.97 }}
    >
      {/* cursor-tracking glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            variant === "primary"
              ? "radial-gradient(120px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(0,0,0,0.08), transparent 70%)"
              : "radial-gradient(120px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(255,255,255,0.15), transparent 70%)",
        }}
      />
      <span className="relative z-10">{children}</span>
    </motion.a>
  );
}
