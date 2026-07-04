import { NextResponse } from "next/server";
import { RESUME_CONTEXT } from "@/lib/resume-context";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
// override via GROQ_MODEL in .env.local — e.g. "moonshotai/kimi-k2-instruct"
const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
// used automatically when the primary model's daily quota runs out —
// separate (much larger) rate-limit pool on the free tier
const FALLBACK_MODEL = "llama-3.1-8b-instant";
// keep the payload bounded: last N turns, each capped in length
// (kept tight — Groq free tier has a tokens-per-minute limit)
const MAX_MESSAGES = 8;
const MAX_MESSAGE_LENGTH = 1500;
// transliteration runs on the small fast model — separate rate-limit pool
const TRANSLIT_MODEL = "llama-3.1-8b-instant";

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Chat is not configured. Missing GROQ_API_KEY." },
      { status: 500 },
    );
  }

  let messages: ChatMessage[];
  try {
    const body = await req.json();
    if (!Array.isArray(body?.messages)) throw new Error("bad payload");
    messages = body.messages
      .filter(
        (m: ChatMessage) =>
          (m?.role === "user" || m?.role === "assistant") &&
          typeof m?.content === "string" &&
          m.content.trim().length > 0,
      )
      .slice(-MAX_MESSAGES)
      .map((m: ChatMessage) => ({
        role: m.role,
        content: m.content.slice(0, MAX_MESSAGE_LENGTH),
      }));
    if (messages.length === 0) throw new Error("empty");
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const payload = (model: string) =>
      JSON.stringify({
        model,
        messages: [
          { role: "system", content: RESUME_CONTEXT },
          ...messages,
          // trailing guard — models tend to mirror the visitor's script, and
          // Urdu script breaks the TTS voice, so re-assert on every turn
          {
            role: "system",
            content:
              "REMINDER: Reply ONLY in Latin (English) letters. If the visitor used Urdu, reply in Roman Urdu written with English letters — NEVER in Urdu/Arabic script. NEVER invent facts, employers, clients, or projects that are not in your instructions.",
          },
        ],
        temperature: 0.65,
        max_tokens: 300,
      });
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };

    let res = await fetch(GROQ_URL, { method: "POST", headers, body: payload(MODEL) });

    // primary model rate-limited (per-minute or daily quota) — fall back to
    // the small model, which has its own much larger quota
    if (res.status === 429) {
      console.warn("Primary model rate-limited, falling back to", FALLBACK_MODEL);
      res = await fetch(GROQ_URL, { method: "POST", headers, body: payload(FALLBACK_MODEL) });
    }

    if (!res.ok) {
      console.error("Groq API error:", res.status, await res.text());
      if (res.status === 429) {
        return NextResponse.json(
          { error: "I'm getting a lot of questions right now — give me a few seconds and ask again." },
          { status: 429 },
        );
      }
      return NextResponse.json(
        { error: "The assistant is unavailable right now. Please try again shortly." },
        { status: 502 },
      );
    }

    const data = await res.json();
    let reply: string = data?.choices?.[0]?.message?.content ?? "";

    // hard enforcement: if the model slipped into Urdu/Arabic script anyway,
    // transliterate to Roman Urdu so the TTS voice can actually speak it
    if (/[؀-ۿ]/.test(reply)) {
      try {
        const fix = await fetch(GROQ_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: TRANSLIT_MODEL,
            messages: [
              {
                role: "system",
                content:
                  "Rewrite the user's text in Roman Urdu using ONLY English/Latin letters. Keep the meaning and tone identical. Output only the rewritten text, nothing else.",
              },
              { role: "user", content: reply },
            ],
            temperature: 0,
            max_tokens: 400,
          }),
        });
        if (fix.ok) {
          const fixed = await fix.json();
          reply = fixed?.choices?.[0]?.message?.content ?? reply;
        }
      } catch {
        // keep the original reply if transliteration fails
      }
    }

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat route error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
