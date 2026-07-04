import Reveal from "./ui/Reveal";
import SectionHeading from "./ui/SectionHeading";
import { projects } from "@/lib/data";

const capabilities = [
  {
    title: "RAG Pipelines",
    description:
      "Retrieval-Augmented Generation systems that ground LLM answers in real knowledge bases using vector databases.",
    icon: "M4 6h16M4 10h16M4 14h10M4 18h6",
  },
  {
    title: "Voice AI Agents",
    description:
      "AI agents that hold natural phone conversations — outreach, booking, and support calls built on Vapi.",
    icon: "M12 18.5a6.5 6.5 0 006.5-6.5M12 18.5A6.5 6.5 0 015.5 12M12 18.5V21M9 3.5h6v6a3 3 0 01-6 0v-6z",
  },
  {
    title: "LLM Integrations",
    description:
      "Production integrations with the OpenAI API and modern LLM tooling — chat, extraction, and automation flows.",
    icon: "M9.75 3.5l-6 6 6 6M14.25 8.5l6 6-6 6",
  },
];

export default function AIProducts() {
  const aiProjects = projects.filter((p) => p.isAI);

  return (
    <section id="ai-products" className="relative scroll-mt-24 py-24 md:py-32">
      {/* accent wash to visually separate the differentiator section */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-violet/[0.04] to-transparent"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="03 — AI Products"
          title="Building with AI"
          description="Beyond traditional full-stack work, I design and ship AI-powered products end-to-end — from voice agents to RAG-based assistants."
        />

        <div className="mb-14 grid gap-6 md:grid-cols-3">
          {capabilities.map((cap, i) => (
            <Reveal key={cap.title} delay={0.1 * i}>
              <div className="glass h-full p-6">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-accent-violet">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={cap.icon} />
                  </svg>
                </div>
                <h3 className="mb-2 font-semibold text-white">{cap.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-400">
                  {cap.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="glass flex flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6 py-5">
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              Shipped
            </span>
            {aiProjects.map((p) => (
              <span key={p.title} className="text-sm font-medium text-zinc-300">
                {p.title}
              </span>
            ))}
            <span className="ai-text text-sm font-medium">
              + the voice assistant on this site
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
