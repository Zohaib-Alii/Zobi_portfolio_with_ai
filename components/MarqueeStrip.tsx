"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

function wrap(min: number, max: number, v: number) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

// Giant outline text strip that drifts continuously and speeds up (or
// reverses) with scroll velocity — placed between sections.
export default function MarqueeStrip({
  text,
  baseVelocity = 1.5,
}: {
  text: string;
  baseVelocity?: number;
}) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], {
    clamp: false,
  });
  const directionFactor = useRef(1);

  useAnimationFrame((_, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) directionFactor.current = -1;
    else if (velocityFactor.get() > 0) directionFactor.current = 1;
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  // 4 copies, each 25% of the track — wrap keeps the loop seamless
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  return (
    <div aria-hidden className="overflow-hidden py-8 md:py-12">
      <motion.div style={{ x }} className="flex w-max whitespace-nowrap">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="marquee-text pr-8 font-mono text-6xl font-bold uppercase tracking-tight md:text-8xl"
          >
            {text} ·
          </span>
        ))}
      </motion.div>
    </div>
  );
}
