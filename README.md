# Zohaib Arain — Portfolio

AI-first personal portfolio built with **Next.js (App Router)**, **Tailwind CSS**, **Framer Motion**, **GSAP + Lenis**. Monochrome premium theme where the only colorful element is the AI — an iridescent orb you can literally talk to, in English or Urdu.

## Getting started

```bash
npm install
cp .env.local.example .env.local   # add your Groq key (required), ElevenLabs key (optional)
npm run dev
```

Open http://localhost:3000. Note: the mic needs HTTPS or localhost to work (browser rule).

## The AI

- **Chat + voice console in the hero** — visitors ask about your work by text or voice.
- **Voice pipeline:** browser mic → Groq Whisper-large-v3 (auto-detects Urdu/English) → Groq llama-3.3-70b (replies in the visitor's language, Latin script only) → ElevenLabs TTS (falls back to browser speech synthesis without a key).
- **"Ask AI" buttons on every project card** scroll to the console and auto-ask about that project.
- All keys are server-side only (`app/api/chat`, `app/api/transcribe`, `app/api/tts`).

## Before deploying

1. **GROQ_API_KEY** (required) — free at https://console.groq.com/keys. Powers chat + transcription.
2. **ELEVENLABS_API_KEY** (optional) — free tier at https://elevenlabs.io for premium voice replies.
3. **Resume PDF** — drop it at `public/resume.pdf`.
4. Set the same env vars in Vercel → Project Settings → Environment Variables.

## Structure

- `app/` — layout, page, globals, API routes (`chat`, `transcribe`, `tts`)
- `components/AIConsole.tsx` — the voice/chat console (recording, transcription, TTS, typewriter replies)
- `components/Orb.tsx` — the animated AI orb (idle / listening / thinking / speaking states)
- `components/FloatingOrb.tsx` — mini orb that appears on scroll, returns you to the console
- `components/SmoothScroll.tsx` — Lenis + GSAP ScrollTrigger wiring
- `components/Projects.tsx` — featured showcase rows (with parallax) + project grid
- `lib/` — `site-config.ts`, `data.ts` (projects/skills), `resume-context.ts` (AI system prompt)

## Editing content

- Projects and skills → `lib/data.ts`
- AI's knowledge → `lib/resume-context.ts` (update when your resume changes)
- Links/contact → `lib/site-config.ts`
