"use client";

import { useEffect, useState } from "react";

interface CodeLine {
  text: string;
  color: string;
}

const codeLines: CodeLine[] = [
  { text: "POST /api/v1/chat", color: "text-emerald-400" },
  { text: "Authorization: Bearer sk_live_•••", color: "text-muted-foreground" },
  { text: "", color: "" },
  { text: '{', color: "text-foreground" },
  { text: '  "agent": "support-fr",', color: "text-amber-400" },
  { text: '  "message": "Bonjour",', color: "text-amber-400" },
  { text: '  "stream": true', color: "text-blue-400" },
  { text: '}', color: "text-foreground" },
];

const responseLine = '{"reply": "Bonjour ! Comment puis-je...';
const statusCodes = ["200 OK", "Streaming SSE ▸"];

export function ApiIllustration() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [showResponse, setShowResponse] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [activeStatus, setActiveStatus] = useState(0);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    // Type code lines one by one
    codeLines.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), 300 + i * 200));
    });

    // Show status
    timers.push(setTimeout(() => setActiveStatus(1), 300 + codeLines.length * 200 + 400));
    timers.push(setTimeout(() => setActiveStatus(2), 300 + codeLines.length * 200 + 800));

    // Show response, typed character by character
    const responseStart = 300 + codeLines.length * 200 + 1200;
    timers.push(setTimeout(() => setShowResponse(true), responseStart));

    for (let c = 0; c <= responseLine.length; c++) {
      timers.push(setTimeout(() => {
        setResponseText(responseLine.slice(0, c));
      }, responseStart + c * 30));
    }

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[360px] rounded-2xl bg-[#0d1117] overflow-hidden font-mono">
      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
      }} />

      <div className="absolute inset-4 flex flex-col text-[11px] leading-relaxed">
        {/* Terminal header */}
        <div className="flex items-center gap-2 pb-3 border-b border-white/10 mb-3">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-[9px] text-white/30 ml-2">curl — api.claudia.ai</span>
        </div>

        {/* Code lines */}
        <div className="flex-1 space-y-0.5">
          {codeLines.map((line, i) => (
            <div
              key={i}
              className={`transition-all duration-300 ease-apple ${
                i < visibleLines ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
              }`}
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {i === 0 && <span className="text-emerald-400/60 mr-2">❯</span>}
              <span className={line.color}>{line.text}</span>
            </div>
          ))}
        </div>

        {/* Status indicators */}
        <div className="pt-3 border-t border-white/10 space-y-1.5">
          {activeStatus >= 1 && (
            <div className="flex items-center gap-2 motion-safe:animate-fade-in-up" style={{ animationFillMode: "both" }}>
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-emerald-400 text-[10px]">{statusCodes[0]}</span>
            </div>
          )}
          {activeStatus >= 2 && (
            <div className="flex items-center gap-2 motion-safe:animate-fade-in-up" style={{ animationFillMode: "both" }}>
              <div className="h-1.5 w-1.5 rounded-full bg-blue-400 motion-safe:animate-pulse-soft" />
              <span className="text-blue-400 text-[10px]">{statusCodes[1]}</span>
            </div>
          )}

          {/* Response */}
          {showResponse && (
            <div className="mt-2 rounded-lg bg-white/5 p-2 motion-safe:animate-fade-in-up" style={{ animationFillMode: "both" }}>
              <span className="text-amber-300 text-[10px]">{responseText}</span>
              <span className="inline-block w-[2px] h-3 bg-amber-300 motion-safe:animate-pulse-soft ml-0.5 align-middle" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
