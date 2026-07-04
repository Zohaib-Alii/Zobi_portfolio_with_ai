import Reveal from "./ui/Reveal";
import SectionHeading from "./ui/SectionHeading";

const stats = [
  { value: "4+", label: "Years Experience" },
  { value: "660k+", label: "Patients on a platform I helped scale" },
  { value: "5+", label: "AI Products Built" },
];

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-24 md:py-32">
      <SectionHeading eyebrow="01 — About" title="A bit about me" />

      <div className="grid gap-10 md:grid-cols-[1.6fr_1fr]">
        <Reveal>
          <div className="space-y-5 text-zinc-400">
            <p>
              I&apos;m a full stack &amp; AI engineer based in{" "}
              <span className="text-zinc-200">Pakistan</span>, with{" "}
              <span className="text-zinc-200">4 years of experience</span>{" "}
              building AI products, SaaS platforms, and web applications end to
              end — AI agents, automations, dashboards, bookings, and payments.
            </p>
            <p>
              Currently I&apos;m at <span className="text-zinc-200">Meezotech</span>,
              working remotely on <span className="text-zinc-200">Darent</span> —
              an Airbnb-style property rental platform for a Saudi Arabian
              client. Before that, I worked at Atompoint on a U.S. telehealth
              platform and a legal-tech RAG product.
            </p>
            <p>
              Alongside client work, I build my own products — including a
              restaurant management SaaS that already has paying customers.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-3 gap-4 md:grid-cols-1">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={0.1 * i}>
              <div className="glass p-5 text-center md:text-left">
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="mt-1 text-xs text-zinc-400 md:text-sm">
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
