"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type ReactNode, type MouseEvent } from "react";

// 3D hover-tilt wrapper with a pointer-following glow border, used for
// project cards.
export default function TiltCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(py, [0, 1], [6, -6]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(px, [0, 1], [-6, 6]), {
    stiffness: 200,
    damping: 20,
  });

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
    ref.current?.style.setProperty("--glow-x", `${e.clientX - rect.left}px`);
    ref.current?.style.setProperty("--glow-y", `${e.clientY - rect.top}px`);
  }

  function handleMouseLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={`group relative ${className}`}
    >
      {/* glow border on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(240px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(139,92,246,0.35), transparent 70%)",
        }}
      />
      <div className="glass relative h-full">{children}</div>
    </motion.div>
  );
}
