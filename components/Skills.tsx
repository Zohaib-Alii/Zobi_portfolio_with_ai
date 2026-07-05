import Reveal from "./ui/Reveal";
import SectionHeading from "./ui/SectionHeading";
import { skillGroups, marqueeSkills } from "@/lib/data";

export default function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-24 md:py-32">
      <SectionHeading
        eyebrow="04 — Skills"
        title="Technologies I work with"
      />

      {/* infinite tech marquee */}
      <Reveal className="marquee-mask mb-14 overflow-hidden">
        <div className="flex w-max animate-marquee gap-3 hover:[animation-play-state:paused]">
          {[...marqueeSkills, ...marqueeSkills].map((skill, i) => (
            <span
              key={`${skill}-${i}`}
              className="whitespace-nowrap rounded-full border border-slate-900/10 bg-white/60 px-5 py-2 font-mono text-sm text-slate-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400"
            >
              {skill}
            </span>
          ))}
        </div>
      </Reveal>

      <div className="space-y-8">
        {skillGroups.map((group, i) => (
          <Reveal key={group.label} delay={0.06 * i}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:gap-8">
              <h3 className="w-32 shrink-0 font-mono text-sm uppercase tracking-wider text-slate-500 dark:text-zinc-500">
                {group.label}
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-slate-900/10 bg-white/60 px-4 py-1.5 text-sm text-slate-800 transition-colors hover:border-slate-900/40 hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-200 dark:hover:border-white/40 dark:hover:bg-white/[0.08]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
