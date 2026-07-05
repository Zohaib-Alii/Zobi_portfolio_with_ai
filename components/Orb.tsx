"use client";

import { motion } from "framer-motion";

export type OrbStatus = "idle" | "listening" | "thinking" | "speaking";

// per-bar multipliers so the waveform looks organic
const BARS = [
  { mult: 0.5, delay: 0 },
  { mult: 0.85, delay: 0.15 },
  { mult: 1, delay: 0.3 },
  { mult: 0.8, delay: 0.45 },
  { mult: 0.55, delay: 0.6 },
];

// The AI orb — the only colorful element on the site. Floats gently,
// shows a live waveform so visitors instantly know it talks, and reacts
// to the voice pipeline states.
export default function Orb({
  status,
  level = 0,
  size = 128,
}: {
  status: OrbStatus;
  level?: number;
  size?: number;
}) {
  const barMax = size * 0.28;

  return (
    <motion.div
      className="relative"
      style={{ width: size, height: size }}
      animate={{ y: [0, -size * 0.05, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <div
        aria-hidden
        className={`orb-halo absolute inset-0 animate-orb-spin ${
          status === "thinking" ? "opacity-90" : "opacity-75 dark:opacity-60"
        }`}
        style={{ animationDuration: status === "thinking" ? "1.6s" : "7s" }}
      />
      <motion.div
        className="orb-core absolute inset-[8%]"
        animate={{ scale: status === "listening" ? 1 + Math.min(level, 1) * 0.25 : [1, 1.04, 1] }}
        transition={
          status === "listening"
            ? { duration: 0.1 }
            : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
        }
      />

      {/* waveform bars — the "I talk" signal */}
      <div className="absolute inset-0 flex items-center justify-center gap-[4%]">
        {BARS.map((bar, i) =>
          status === "listening" ? (
            <span
              key={i}
              className="w-[4.5%] rounded-full bg-white/90 transition-[height] duration-100"
              style={{ height: size * 0.06 + Math.min(level, 1) * barMax * bar.mult }}
            />
          ) : (
            <motion.span
              key={i}
              className="w-[4.5%] rounded-full bg-white/80"
              animate={{
                height:
                  status === "speaking"
                    ? [size * 0.07, barMax * bar.mult, size * 0.07]
                    : status === "thinking"
                      ? [size * 0.05, size * 0.05]
                      : [size * 0.06, size * 0.13 * (0.6 + bar.mult), size * 0.06],
              }}
              transition={{
                duration: status === "speaking" ? 0.55 : 1.8,
                repeat: Infinity,
                delay: bar.delay,
                ease: "easeInOut",
              }}
            />
          ),
        )}
      </div>

      {/* idle invitation ripple + speaking ripple */}
      {(status === "idle" || status === "speaking") && (
        <motion.div
          aria-hidden
          className="absolute inset-[8%] rounded-full border border-white/25"
          animate={{ scale: [1, 1.45], opacity: [0.5, 0] }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            repeatDelay: status === "idle" ? 2.2 : 0,
            ease: "easeOut",
          }}
        />
      )}
    </motion.div>
  );
}
