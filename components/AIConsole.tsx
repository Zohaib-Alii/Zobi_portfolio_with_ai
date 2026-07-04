"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Orb, { type OrbStatus } from "./Orb";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What has Zohaib built with AI?",
  "Tell me about Darent",
  "What's his tech stack?",
];

// hardcoded greeting — costs zero API tokens, typed out on page load
const GREETING =
  "Welcome to Zohaib's portfolio! 👋 I'm his AI assistant — ask me anything about his work, projects, or skills. Type below, or tap the orb and just talk to me.";

const STATUS_LABEL: Record<OrbStatus, string> = {
  idle: "Tap the orb and talk — English or Urdu",
  listening: "Listening… pause and I'll answer",
  thinking: "Thinking…",
  speaking: "Speaking… tap orb to end the conversation",
};

// voice-activity tuning
const SPEECH_LEVEL = 0.14; // normalized level that counts as speech
const SILENCE_MS = 5000; // pause length that auto-sends
const NO_SPEECH_MS = 8000; // give up if nothing said at all
const MAX_TURN_MS = 30000; // hard cap per voice turn

// Typewriter reveal for the latest assistant reply.
function TypeText({ text }: { text: string }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    setShown(0);
    const id = setInterval(() => {
      setShown((n) => {
        if (n >= text.length) {
          clearInterval(id);
          return n;
        }
        return n + 2;
      });
    }, 16);
    return () => clearInterval(id);
  }, [text]);
  return <>{text.slice(0, shown)}</>;
}

export default function AIConsole() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<OrbStatus>("idle");
  const [level, setLevel] = useState(0);
  // hands-free mode is opt-in — default is push-to-talk
  const [autoMode, setAutoMode] = useState(false);
  const autoModeRef = useRef(autoMode);
  autoModeRef.current = autoMode;
  // when on, every reply is spoken — even for typed questions and buttons
  const [voiceReplies, setVoiceReplies] = useState(true);
  const voiceRepliesRef = useRef(voiceReplies);
  voiceRepliesRef.current = voiceReplies;

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sendRef = useRef<(text: string, speakBack: boolean) => void>(() => {});
  // true while a hands-free voice conversation is running — after the AI
  // finishes speaking it automatically starts listening again
  const conversationRef = useRef(false);

  useEffect(() => {
    threadRef.current?.scrollTo({
      top: threadRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, status]);

  // greet the visitor shortly after load — no API call involved
  useEffect(() => {
    const id = setTimeout(() => {
      setMessages((prev) =>
        prev.length === 0 ? [{ role: "assistant", content: GREETING }] : prev,
      );
    }, 1200);
    return () => clearTimeout(id);
  }, []);

  // project cards dispatch these to talk to the console from anywhere
  const askedRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    function onAsk(e: Event) {
      const detail = (e as CustomEvent<string>).detail;
      if (!detail) return;
      // guard against duplicate/replayed events — each card question
      // should only ever auto-fire once per page load
      if (askedRef.current.has(detail)) return;
      askedRef.current.add(detail);
      sendRef.current(detail, false);
    }
    function onFocus() {
      inputRef.current?.focus();
    }
    window.addEventListener("ask-ai", onAsk);
    window.addEventListener("focus-ai", onFocus);
    return () => {
      window.removeEventListener("ask-ai", onAsk);
      window.removeEventListener("focus-ai", onFocus);
    };
  }, []);

  function stopSpeaking() {
    audioRef.current?.pause();
    audioRef.current = null;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setStatus("idle");
  }

  function onSpeechEnded() {
    if (conversationRef.current && autoModeRef.current) {
      // hands-free mode: keep the conversation flowing
      startListening();
    } else {
      setStatus("idle");
    }
  }

  async function speak(text: string) {
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (res.status === 200) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;
        setStatus("speaking");
        audio.onended = () => {
          URL.revokeObjectURL(url);
          onSpeechEnded();
        };
        audio.onerror = () => {
          conversationRef.current = false;
          setStatus("idle");
        };
        await audio.play();
        return;
      }
    } catch {
      // fall through to browser TTS
    }
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.onend = onSpeechEnded;
      setStatus("speaking");
      window.speechSynthesis.speak(utterance);
    } else {
      conversationRef.current = false;
      setStatus("idle");
    }
  }

  async function send(text: string, speakBack: boolean) {
    const trimmed = text.trim();
    if (!trimmed || status === "thinking") return;

    const next: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setStatus("thinking");

    try {
      let res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (res.status === 429) {
        // rate-limited — wait out the window and retry once automatically
        await new Promise((r) => setTimeout(r, 6000));
        res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: next }),
        });
      }
      const data = await res.json();
      const reply: string =
        res.ok && data.reply
          ? data.reply
          : data.error ?? "Sorry, something went wrong. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      if (speakBack || voiceRepliesRef.current) {
        await speak(reply);
      } else {
        setStatus("idle");
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't reach the server. Please try again." },
      ]);
      conversationRef.current = false;
      setStatus("idle");
    }
  }
  sendRef.current = (text, speakBack) => {
    conversationRef.current = false;
    void send(text, speakBack);
  };

  function cleanupMic() {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    setLevel(0);
  }

  async function startListening() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      chunksRef.current = [];
      // shared with the analyser loop — records whether real speech happened
      const vad = { hadSpeech: false };
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        cleanupMic();
        const mime = recorder.mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: mime });
        if (!vad.hadSpeech || blob.size < 2000) {
          // pure silence/noise — never send it to Whisper (it hallucinates
          // words like "Nothing." from empty audio). End quietly.
          conversationRef.current = false;
          setStatus("idle");
          return;
        }
        setStatus("thinking");
        const ext = mime.includes("mp4") ? "m4a" : mime.includes("ogg") ? "ogg" : "webm";
        const form = new FormData();
        form.append("file", blob, `recording.${ext}`);
        try {
          const res = await fetch("/api/transcribe", { method: "POST", body: form });
          const data = await res.json();
          if (res.ok && data.text && data.text.trim().length >= 3) {
            await send(data.text, true);
          } else {
            conversationRef.current = false;
            setStatus("idle");
          }
        } catch {
          conversationRef.current = false;
          setStatus("idle");
        }
      };

      // drive the orb with live mic level + detect end-of-speech silence
      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      const buf = new Uint8Array(analyser.frequencyBinCount);
      const startedAt = performance.now();
      let lastLoud = startedAt;
      let hadSpeech = false;

      const loop = () => {
        analyser.getByteFrequencyData(buf);
        const avg = buf.reduce((a, b) => a + b, 0) / buf.length;
        const norm = avg / 140;
        setLevel(norm);

        const now = performance.now();
        if (norm > SPEECH_LEVEL) {
          hadSpeech = true;
          vad.hadSpeech = true;
          lastLoud = now;
        }
        const shouldStop =
          (hadSpeech && now - lastLoud > SILENCE_MS) ||
          (!hadSpeech && now - startedAt > NO_SPEECH_MS) ||
          now - startedAt > MAX_TURN_MS;

        if (shouldStop && recorderRef.current?.state === "recording") {
          recorderRef.current.stop();
          return;
        }
        rafRef.current = requestAnimationFrame(loop);
      };
      loop();

      recorder.start();
      setStatus("listening");
    } catch {
      cleanupMic();
      conversationRef.current = false;
      setStatus("idle");
    }
  }

  async function toggleMic() {
    if (status === "speaking") {
      // ending the conversation
      conversationRef.current = false;
      stopSpeaking();
      return;
    }
    if (status === "listening") {
      // send this turn now (don't wait for the silence timer)
      if (recorderRef.current?.state === "recording") recorderRef.current.stop();
      return;
    }
    if (status !== "idle") return;
    conversationRef.current = true;
    await startListening();
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    conversationRef.current = false;
    send(input, false);
  }

  const lastAssistantIndex = messages.reduce(
    (acc, m, i) => (m.role === "assistant" ? i : acc),
    -1,
  );

  return (
    <div id="ai-console" className="mx-auto w-full max-w-2xl scroll-mt-32">
      {/* orb */}
      <div className="mb-3 flex flex-col items-center">
        <button
          type="button"
          onClick={toggleMic}
          aria-label={STATUS_LABEL[status]}
          className="cursor-pointer transition-transform hover:scale-105"
        >
          <Orb status={status} level={level} size={132} />
        </button>
        <p className="mt-3 font-mono text-xs text-zinc-500">
          {STATUS_LABEL[status]}
        </p>
        {/* mode toggles */}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setAutoMode((v) => !v)}
            aria-pressed={autoMode}
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] transition-colors ${
              autoMode
                ? "border-accent-violet/60 bg-accent-violet/10 text-zinc-200"
                : "border-white/10 text-zinc-500 hover:border-white/25 hover:text-zinc-300"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${autoMode ? "bg-accent-violet" : "bg-zinc-600"}`}
            />
            Auto conversation {autoMode ? "on" : "off"}
          </button>
          <button
            type="button"
            onClick={() => {
              if (voiceReplies && status === "speaking") stopSpeaking();
              setVoiceReplies((v) => !v);
            }}
            aria-pressed={voiceReplies}
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] transition-colors ${
              voiceReplies
                ? "border-accent-cyan/60 bg-accent-cyan/10 text-zinc-200"
                : "border-white/10 text-zinc-500 hover:border-white/25 hover:text-zinc-300"
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              {voiceReplies && <path d="M15.5 8.5a5 5 0 010 7M19 5a9 9 0 010 14" />}
            </svg>
            Voice replies {voiceReplies ? "on" : "off"}
          </button>
        </div>
      </div>

      {/* conversation thread */}
      <AnimatePresence>
        {messages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="overflow-hidden"
          >
            <div
              ref={threadRef}
              data-lenis-prevent
              className="glass mb-4 max-h-72 space-y-3 overflow-y-auto p-4"
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "rounded-br-md bg-white text-zinc-900"
                        : "rounded-bl-md bg-white/[0.06] text-zinc-200"
                    }`}
                  >
                    {msg.role === "assistant" && i === lastAssistantIndex ? (
                      <TypeText text={msg.content} />
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}
              {status === "thinking" && (
                <div className="flex justify-start">
                  <div className="flex gap-1.5 rounded-2xl rounded-bl-md bg-white/[0.06] px-4 py-3">
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1.2, delay: d * 0.2 }}
                        className="h-1.5 w-1.5 rounded-full bg-zinc-400"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* input bar */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] p-2 pl-5 backdrop-blur-md transition-colors focus-within:border-accent-violet/60"
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask my AI anything about my work…"
          aria-label="Ask the AI assistant"
          className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 outline-none"
        />
        <button
          type="button"
          onClick={toggleMic}
          aria-label="Toggle voice input"
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors ${
            status === "listening"
              ? "border-accent-magenta bg-accent-magenta/20 text-accent-magenta"
              : "border-white/15 text-zinc-300 hover:border-white/40"
          }`}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 013 3v6a3 3 0 01-6 0V5a3 3 0 013-3z" />
            <path d="M19 11a7 7 0 01-14 0M12 18v4" />
          </svg>
        </button>
        <button
          type="submit"
          disabled={status === "thinking" || !input.trim()}
          aria-label="Send message"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-zinc-900 transition-opacity disabled:opacity-40"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </form>

      {/* suggestion chips — visible until the visitor asks something */}
      {!messages.some((m) => m.role === "user") && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => sendRef.current(s, false)}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs text-zinc-400 transition-colors hover:border-white/30 hover:text-white"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
