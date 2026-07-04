"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Orb from "./Orb";

// Mini orb that appears once the hero scrolls out of view. Clicking it
// brings the visitor back to the AI console.
export default function FloatingOrb() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function backToConsole() {
    document.getElementById("ai-console")?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => window.dispatchEvent(new Event("focus-ai")), 700);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          aria-label="Talk to my AI"
          onClick={backToConsole}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          className="fixed bottom-5 right-5 z-50"
        >
          <Orb status="idle" size={56} />
          <span className="sr-only">Open AI assistant</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
