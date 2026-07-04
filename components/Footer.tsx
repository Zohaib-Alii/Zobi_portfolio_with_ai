import { siteConfig } from "@/lib/site-config";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 text-center sm:flex-row">
        <p className="text-xs text-zinc-500">
          © {new Date().getFullYear()} {siteConfig.name}. Built with Next.js,
          Tailwind CSS &amp; Framer Motion.
        </p>
        <p className="font-mono text-xs text-zinc-600">
          {siteConfig.location}
        </p>
      </div>
    </footer>
  );
}
