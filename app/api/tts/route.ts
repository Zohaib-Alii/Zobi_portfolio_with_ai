import { NextResponse } from "next/server";

// Default: "George" — premade voice, available on the free tier via API
// (library voices like Rachel return 402 for free accounts). Override via env.
const DEFAULT_VOICE_ID = "JBFqnCBsd6RMkjVDRZzb";
const MAX_TTS_CHARS = 800;

export async function POST(req: Request) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  // 204 tells the client to fall back to browser speech synthesis
  if (!apiKey) return new NextResponse(null, { status: 204 });

  let text: string;
  try {
    const body = await req.json();
    if (typeof body?.text !== "string" || !body.text.trim()) throw new Error();
    text = body.text.slice(0, MAX_TTS_CHARS);
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const voiceId = process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID;

  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_64`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      },
    );

    if (!res.ok) {
      console.error("ElevenLabs error:", res.status, await res.text());
      // graceful degrade: client falls back to browser TTS
      return new NextResponse(null, { status: 204 });
    }

    const audio = await res.arrayBuffer();
    return new NextResponse(audio, {
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch (err) {
    console.error("TTS route error:", err);
    return new NextResponse(null, { status: 204 });
  }
}
