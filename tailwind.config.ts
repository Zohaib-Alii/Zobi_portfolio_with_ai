import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#060608",
        surface: "#0e0e12",
        // iridescent AI accent — reserved for AI elements
        accent: {
          cyan: "#22d3ee",
          violet: "#8b5cf6",
          magenta: "#e879f9",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "ai-gradient":
          "linear-gradient(120deg, #22d3ee 0%, #8b5cf6 50%, #e879f9 100%)",
      },
      keyframes: {
        "pulse-slow": {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "0.7" },
        },
        "orb-spin": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "pulse-slow": "pulse-slow 6s ease-in-out infinite",
        "orb-spin": "orb-spin 7s linear infinite",
        marquee: "marquee 32s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
