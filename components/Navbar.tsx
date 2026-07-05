"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { siteConfig } from "@/lib/site-config";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#ai-products", label: "AI Products" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-x-0 top-0 z-40"
    >
      <nav className="mx-auto mt-4 flex max-w-5xl items-center justify-between rounded-full border border-slate-900/[0.08] bg-white/70 px-5 py-3 shadow-[0_2px_12px_rgba(30,41,59,0.07)] backdrop-blur-md dark:border-white/10 dark:bg-background/70 dark:shadow-none md:px-8">
        <a href="#" className="font-mono text-sm font-semibold text-slate-900 dark:text-white">
          <span className="ai-text">{"<"}</span>
          {siteConfig.shortName.toLowerCase()}
          <span className="ai-text">{" />"}</span>
        </a>

        <ul className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <ThemeToggle />
          </li>
        </ul>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="text-slate-700 dark:text-zinc-300"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <motion.ul
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-2 max-w-5xl space-y-1 rounded-2xl border border-slate-900/10 bg-white/90 p-4 backdrop-blur-md dark:border-white/10 dark:bg-background/90 md:hidden"
        >
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-900/5 hover:text-slate-900 dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </motion.ul>
      )}
    </motion.header>
  );
}
