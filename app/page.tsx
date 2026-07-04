import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import AIProducts from "@/components/AIProducts";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingOrb from "@/components/FloatingOrb";
import MarqueeStrip from "@/components/MarqueeStrip";
import SmoothScroll from "@/components/SmoothScroll";

export default function Home() {
  return (
    <SmoothScroll>
      <main className="relative overflow-x-clip">
        <div className="bg-noise pointer-events-none fixed inset-0 z-50" />
        <Navbar />
        <Hero />
        <About />
        <Projects />
        <MarqueeStrip text="Darent · Sol.ai · Voice AI · RAG · SaaS" />
        <AIProducts />
        <Skills />
        <MarqueeStrip text="Available for work · Let's build" baseVelocity={-1.5} />
        <Contact />
        <Footer />
        <FloatingOrb />
      </main>
    </SmoothScroll>
  );
}
