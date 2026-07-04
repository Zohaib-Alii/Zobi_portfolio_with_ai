export type Project = {
  title: string;
  description: string;
  tags: string[];
  highlight?: string;
  isAI?: boolean;
  featured?: boolean;
  features?: string[];
  askPrompt: string;
  link?: string;
  // drop a screenshot at public/projects/<file> and set this to "/projects/<file>"
  image?: string;
};

export const projects: Project[] = [
  {
    title: "CRehab EMR — Healthcare Platform",
    featured: true,
    link: "https://emr.crehabconsultants.com/",
    description:
      "U.S. healthcare EMR and telehealth platform built at Atompoint — scaled from the very first patient to 660,000+ patients and 9,000+ doctors, with medical scribes, scheduling, patient records, and complete clinical workflows.",
    tags: ["Healthcare", "EMR", "React", "Node.js"],
    highlight: "660k+ patients · 9k+ doctors · live in the U.S.",
    features: ["660k+ patients managed", "9k+ doctors onboard", "Scribes & clinical workflows"],
    askPrompt:
      "Tell me about the CRehab EMR healthcare platform Zohaib built — the one with 660,000+ patients.",
  },
  {
    title: "Darent",
    featured: true,
    link: "https://darent.com/en",
    description:
      "Airbnb-style property rental platform for a Saudi Arabian client. Full-stack development across listings, bookings, payments, and search — built and shipped as part of a remote team at Meezotech.",
    tags: ["MERN", "Next.js", "MongoDB", "Node.js"],
    highlight: "Live in production · Saudi Arabia",
    features: ["Listings & search", "Bookings & payments", "Host dashboards"],
    askPrompt: "Tell me about the Darent project — what did Zohaib build on it?",
  },
  {
    title: "Wakeel.ai",
    featured: true,
    isAI: true,
    link: "https://www.wakeel.ai/",
    description:
      "Legal-tech RAG (Retrieval-Augmented Generation) product built at Atompoint — AI that answers legal questions grounded in real legal documents using vector search.",
    tags: ["RAG", "Vector DB", "OpenAI API", "Next.js"],
    highlight: "AI-powered legal assistant",
    features: ["Document-grounded answers", "Vector search", "Legal Q&A"],
    askPrompt: "Tell me about Wakeel.ai, the legal-tech RAG product Zohaib worked on.",
  },
  {
    title: "SolConnect.ai",
    featured: true,
    isAI: true,
    link: "https://www.solconnect.ai/",
    description:
      "AI-driven platform for the solar industry — intelligence-backed recommendations and automation, built end-to-end with a modern full-stack architecture.",
    tags: ["AI", "Next.js", "Node.js"],
    highlight: "AI for the solar industry",
    features: ["AI recommendations", "Automation flows", "Full-stack build"],
    askPrompt: "What is SolConnect.ai and what did Zohaib build for it?",
  },
  {
    title: "Restaurant Management System",
    featured: true,
    description:
      "Independently built SaaS covering inventory, billing, menu and recipe management with automatic inventory deduction, multi-cashier roles with shift management, and owner/manager dashboards.",
    tags: ["SaaS", "Next.js", "PostgreSQL", "Prisma"],
    highlight: "Paying customer on inventory module",
    features: ["Inventory & billing", "Recipe auto-deduction", "Shift management"],
    askPrompt: "Tell me about the Restaurant Management System Zohaib built.",
  },
  {
    title: "AI Voice Calling Agent",
    description:
      "AI-powered voice agent that handles real phone conversations — automated outreach and support calls with natural, human-like dialogue.",
    tags: ["Vapi", "Voice AI", "Node.js"],
    isAI: true,
    askPrompt: "Tell me about the AI Voice Calling Agent Zohaib built with Vapi.",
  },
  {
    title: "AI Customer Support Agent",
    description:
      "RAG-based support agent that answers customer questions from a company knowledge base with accurate, grounded responses.",
    tags: ["RAG", "Vector DB", "OpenAI API"],
    isAI: true,
    askPrompt: "How does Zohaib's RAG-based customer support agent work?",
  },
  {
    title: "Hotel Kitchen & Inventory SaaS",
    description:
      "Multi-tenant SaaS for hotel clients with a Super Admin layer for onboarding hotels with selectable modules and subscription tiers. Built with Next.js App Router, Supabase, Prisma, and NextAuth.",
    tags: ["Next.js", "Supabase", "Prisma", "Multi-tenant"],
    askPrompt: "Tell me about the Hotel Kitchen & Inventory SaaS Zohaib built.",
  },
];

export type SkillGroup = {
  label: string;
  skills: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    label: "Frontend",
    skills: ["React", "Next.js (App Router)", "Tailwind CSS", "shadcn/ui", "Framer Motion"],
  },
  {
    label: "Backend",
    skills: ["Node.js", "Express", "Prisma ORM", "NextAuth", "REST APIs"],
  },
  {
    label: "Database",
    skills: ["MongoDB", "PostgreSQL", "Supabase"],
  },
  {
    label: "AI & Tools",
    skills: ["OpenAI API", "RAG", "Vapi", "Vector Databases", "Groq", "Whisper"],
  },
  {
    label: "Deployment",
    skills: ["Vercel", "Git & GitHub", "CI/CD"],
  },
];

// flat list for the marquee strip
export const marqueeSkills = [
  "React", "Next.js", "Node.js", "MongoDB", "PostgreSQL", "Express",
  "Tailwind CSS", "Prisma", "Supabase", "OpenAI API", "RAG", "Vapi",
  "Whisper", "Groq", "Vector DBs", "Framer Motion", "GSAP", "Vercel",
];
