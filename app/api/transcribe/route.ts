import { NextResponse } from "next/server";

const GROQ_URL = "https://api.groq.com/openai/v1/audio/transcriptions";
// whisper-large-v3 has the strongest Urdu + English support
const MODEL = "whisper-large-v3";
const MAX_FILE_BYTES = 10 * 1024 * 1024;

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Voice is not configured. Missing GROQ_API_KEY." },
      { status: 500 },
    );
  }

  let file: File | null = null;
  try {
    const form = await req.formData();
    const entry = form.get("file");
    if (entry instanceof File && entry.size > 0 && entry.size <= MAX_FILE_BYTES) {
      file = entry;
    }
  } catch {
    // fall through to the 400 below
  }
  if (!file) {
    return NextResponse.json({ error: "Invalid audio upload." }, { status: 400 });
  }

  try {
    const upstream = new FormData();
    upstream.append("file", file, file.name || "audio.webm");
    upstream.append("model", MODEL);
    upstream.append("response_format", "json");
    // no language pin — Whisper auto-detects Urdu vs English

    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: upstream,
    });

    if (!res.ok) {
      console.error("Groq transcription error:", res.status, await res.text());
      return NextResponse.json(
        { error: "Could not transcribe audio. Please try again." },
        { status: 502 },
      );
    }

    const data = await res.json();
    let text: string = (data?.text ?? "").trim();

    // Whisper writes Urdu in Arabic script and Hindi in Devanagari — the
    // site is Latin-script only, so transliterate to Roman Urdu using the
    // small fast model (separate rate-limit pool from the chat model)
    if (/[؀-ۿऀ-ॿ]/.test(text)) {
      try {
        const fix = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
              {
                role: "system",
                content:
                  "Convert the user's text to Roman Urdu using ONLY English/Latin letters. Keep English words unchanged. Keep the meaning identical. Output only the converted text.",
              },
              { role: "user", content: text },
            ],
            temperature: 0,
            max_tokens: 400,
          }),
        });
        if (fix.ok) {
          const fixed = await fix.json();
          text = (fixed?.choices?.[0]?.message?.content ?? text).trim();
        }
      } catch {
        // keep original transcript if conversion fails
      }
    }

    return NextResponse.json({ text });
  } catch (err) {
    console.error("Transcribe route error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
