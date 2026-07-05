import Reveal from "./ui/Reveal";
import SectionHeading from "./ui/SectionHeading";
import MagneticButton from "./ui/MagneticButton";
import { siteConfig } from "@/lib/site-config";

const socials = [
  {
    label: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
    icon: "M4 6h16v12H4z M4 7l8 6 8-6",
  },
  {
    label: "LinkedIn",
    value: "Connect on LinkedIn",
    href: siteConfig.linkedin,
    icon: "M6 9v8M6 5.5v.01M10 17v-5a2.5 2.5 0 015 0v5M10 9v1.5",
  },
  {
    label: "GitHub",
    value: "See my code",
    href: siteConfig.github,
    icon: "M12 3a9 9 0 00-2.85 17.54c.45.08.62-.2.62-.43v-1.7c-2.5.55-3.03-1.06-3.03-1.06-.41-1.04-1-1.32-1-1.32-.82-.56.06-.55.06-.55.9.06 1.38.93 1.38.93.8 1.38 2.11.98 2.63.75.08-.58.31-.98.57-1.2-2-.23-4.1-1-4.1-4.45 0-.98.35-1.78.93-2.41-.1-.23-.4-1.15.08-2.4 0 0 .76-.24 2.48.92a8.6 8.6 0 014.52 0c1.72-1.16 2.47-.92 2.47-.92.49 1.25.18 2.17.09 2.4.58.63.93 1.43.93 2.41 0 3.47-2.1 4.22-4.11 4.44.32.28.61.83.61 1.67v2.48c0 .24.16.52.62.43A9 9 0 0012 3z",
  },
];

export default function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-24 md:py-32">
      <SectionHeading
        eyebrow="05 — Contact"
        title="Let's build something together"
        description="Open to full-time roles, freelance projects, and collaborations on AI products. My inbox is always open."
      />

      <div className="mb-12 grid gap-4 sm:grid-cols-3">
        {socials.map((social, i) => (
          <Reveal key={social.label} delay={0.08 * i}>
            <a
              href={social.href}
              target={social.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="glass block p-5 transition-colors hover:border-slate-900/30 dark:hover:border-white/30"
            >
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900/5 text-slate-700 dark:bg-white/5 dark:text-zinc-200">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={social.icon} />
                </svg>
              </div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{social.label}</p>
              <p className="mt-0.5 truncate text-xs text-slate-600 dark:text-zinc-400">
                {social.value}
              </p>
            </a>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2} className="flex justify-center">
        <MagneticButton href={siteConfig.resumeUrl} download>
          Download Resume
        </MagneticButton>
      </Reveal>
    </section>
  );
}
