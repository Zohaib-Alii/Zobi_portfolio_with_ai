import { siteConfig } from "@/lib/site-config";

export default function Footer() {
  return (
    <footer className="border-t border-slate-900/10 px-6 py-8 dark:border-white/5">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 text-center sm:flex-row">
        <p className="text-xs text-slate-500 dark:text-zinc-500">
          © {new Date().getFullYear()} {siteConfig.name}. Built with Next.js,
          Tailwind CSS &amp; Framer Motion.
        </p>
        <p className="font-mono text-xs text-slate-500 dark:text-zinc-600">
          {siteConfig.location}
        </p>
      </div>
    </footer>
  );
}
