"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "./ui/Reveal";
import SectionHeading from "./ui/SectionHeading";
import TiltCard from "./ui/TiltCard";
import { projects, type Project } from "@/lib/data";

function askAI(prompt: string) {
  document
    .getElementById("ai-console")
    ?.scrollIntoView({ behavior: "smooth", block: "center" });
  setTimeout(
    () => window.dispatchEvent(new CustomEvent("ask-ai", { detail: prompt })),
    600,
  );
}

// Browser-frame preview panel for featured projects. Shows a real
// screenshot when project.image is set, otherwise a stylized panel.
function FeaturedVisual({ project }: { project: Project }) {
  const domain = project.link
    ? new URL(project.link).hostname.replace("www.", "")
    : project.title.toLowerCase().replace(/[^a-z]+/g, "") + ".app";

  return (
    <div className="feature-visual glass overflow-hidden">
      {/* browser chrome */}
      <div className="flex items-center gap-2 border-b border-slate-900/10 bg-slate-900/[0.03] px-4 py-2.5 dark:border-white/10 dark:bg-white/[0.03]">
        <span className="h-2.5 w-2.5 rounded-full bg-slate-900/15 dark:bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-900/15 dark:bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-900/15 dark:bg-white/15" />
        <span className="ml-2 flex-1 truncate rounded-full border border-slate-900/10 bg-white/60 px-3 py-1 text-center font-mono text-[10px] text-slate-500 dark:border-white/10 dark:bg-black/30 dark:text-zinc-500">
          {domain}
        </span>
      </div>

      {project.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.image}
          alt={`${project.title} preview`}
          className="aspect-[16/10] w-full object-cover object-top"
        />
      ) : (
        <div className="relative flex aspect-[16/10] items-center justify-center p-6">
          <div
            aria-hidden
            className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-slate-900/[0.04] blur-2xl dark:bg-white/[0.04]"
          />
          <div className="w-full max-w-xs space-y-2.5">
            <div className="rounded-xl border border-slate-900/10 bg-white/70 p-3.5 dark:border-white/10 dark:bg-white/[0.05]">
              <p className="font-mono text-xl font-bold text-slate-900 dark:text-white">
                {project.title
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </p>
              <p className="mt-1 text-xs text-slate-600 dark:text-zinc-400">{project.tags.join(" · ")}</p>
            </div>
            {project.features?.map((f, i) => (
              <div
                key={f}
                className="flex items-center gap-3 rounded-lg border border-slate-900/10 bg-white/60 px-3.5 py-2 dark:border-white/10 dark:bg-white/[0.03]"
                style={{ marginLeft: i * 14 }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-slate-900/40 dark:bg-white/50" />
                <p className="text-xs text-slate-700 dark:text-zinc-300">{f}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);

  // subtle parallax on featured visuals, synced with Lenis via ScrollTrigger
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".feature-visual").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 48 },
          {
            y: -48,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1 },
          },
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24 md:py-32"
    >
      <SectionHeading
        eyebrow="02 — Projects"
        title="Selected work"
        description="Production platforms, SaaS products, and AI tools — for clients and independently. Ask the AI about any of them."
      />

      {/* featured — big alternating rows */}
      <div className="mb-20 space-y-20">
        {featured.map((project, i) => (
          <Reveal key={project.title}>
            <div
              className={`grid items-center gap-8 md:grid-cols-2 md:gap-14 ${
                i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <FeaturedVisual project={project} />
              <div>
                <p className="mb-2 font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-500">
                  Featured
                </p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
                  {project.title}
                </h3>
                <p className="mt-4 leading-relaxed text-slate-600 dark:text-zinc-400">
                  {project.description}
                </p>
                {project.highlight && (
                  <p className="mt-4 font-mono text-xs text-emerald-600 dark:text-emerald-400">
                    ▲ {project.highlight}
                  </p>
                )}
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-slate-900/10 bg-slate-900/5 px-2 py-1 font-mono text-[11px] text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                    >
                      Visit live ↗
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => askAI(project.askPrompt)}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-900/20 px-5 py-2.5 text-sm text-slate-800 transition-colors hover:border-accent-violet/60 hover:text-slate-900 dark:border-white/15 dark:text-zinc-200 dark:hover:text-white"
                  >
                    <span className="ai-text font-medium">Ask AI</span> about this
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* the rest — card grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((project, i) => (
          <Reveal key={project.title} delay={0.08 * (i % 3)}>
            <TiltCard className="h-full">
              <div className="flex h-full flex-col p-6">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {project.title}
                  </h3>
                  {project.isAI && (
                    <span className="ai-text shrink-0 rounded-full border border-slate-900/15 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider dark:border-white/15">
                      AI
                    </span>
                  )}
                </div>

                <p className="flex-1 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
                  {project.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-slate-900/10 bg-slate-900/5 px-2 py-1 font-mono text-[11px] text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex items-center gap-4">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-600 transition-colors hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
                    >
                      Visit ↗
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => askAI(project.askPrompt)}
                    className="text-xs text-slate-500 transition-colors hover:text-slate-900 dark:text-zinc-500 dark:hover:text-white"
                  >
                    Ask AI about this →
                  </button>
                </div>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
