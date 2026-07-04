"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { siteConfig } from "@/lib/site-config";

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
      <nav className="mx-auto mt-4 flex max-w-5xl items-center justify-between rounded-full border border-white/10 bg-background/70 px-5 py-3 backdrop-blur-md md:px-8">
        <a href="#" className="font-mono text-sm font-semibold text-white">
          <span className="ai-text">{"<"}</span>
          {siteConfig.shortName.toLowerCase()}
          <span className="ai-text">{" />"}</span>
        </a>

        <ul className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-zinc-400 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="text-zinc-300 md:hidden"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <motion.ul
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-2 max-w-5xl space-y-1 rounded-2xl border border-white/10 bg-background/90 p-4 backdrop-blur-md md:hidden"
        >
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
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
