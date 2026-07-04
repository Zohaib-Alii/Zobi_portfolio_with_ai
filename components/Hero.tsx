"use client";

import { motion } from "framer-motion";
import AIConsole from "./AIConsole";
import { siteConfig } from "@/lib/site-config";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] as const },
  },
};

export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pb-16 pt-28">
      <div className="bg-grid absolute inset-0" aria-hidden />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full"
      >
        <motion.div variants={item} className="mb-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 font-mono text-xs text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            {siteConfig.name} · {siteConfig.title} · {siteConfig.location}
          </span>
        </motion.div>

        <motion.h1
          variants={item}
          className="mx-auto max-w-3xl text-center text-4xl font-bold tracking-tight text-white sm:text-6xl"
        >
          Don&apos;t just read my resume —{" "}
          <span className="ai-text">talk to it</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mx-auto mt-5 max-w-xl text-center text-zinc-400"
        >
          {siteConfig.tagline} My AI knows everything I&apos;ve built — ask it
          by voice or text, in English or Urdu.
        </motion.p>

        <motion.div variants={item} className="mt-10">
          <AIConsole />
        </motion.div>

        <motion.div
          variants={item}
          className="mt-10 flex items-center justify-center gap-6 text-sm"
        >
          <a href="#projects" className="text-zinc-400 transition-colors hover:text-white">
            View work ↓
          </a>
          <span className="text-zinc-700">·</span>
          <a
            href={siteConfig.resumeUrl}
            download
            className="text-zinc-400 transition-colors hover:text-white"
          >
            Download resume
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
