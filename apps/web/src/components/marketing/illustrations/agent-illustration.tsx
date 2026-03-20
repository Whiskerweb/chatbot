"use client";

import { useEffect, useState } from "react";
import { Bot, User } from "lucide-react";

const messages = [
  { role: "user" as const, text: "Comment réinitialiser mon mot de passe ?" },
  { role: "bot" as const, text: "Rendez-vous dans Paramètres > Sécurité > Mot de passe, puis cliquez sur « Modifier »." },
  { role: "bot" as const, text: "Source : docs.claudia.ai/securite", isSource: true },
];

export function AgentIllustration() {
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    // Show user message
    timers.push(setTimeout(() => setVisibleMessages(1), 600));
    // Show typing indicator
    timers.push(setTimeout(() => setTyping(true), 1400));
    // Show bot response
    timers.push(setTimeout(() => { setTyping(false); setVisibleMessages(2); }, 2600));
    // Show source citation
    timers.push(setTimeout(() => setVisibleMessages(3), 3200));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[360px] rounded-2xl bg-gradient-to-br from-background via-background to-muted/30 overflow-hidden">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Chat interface mockup */}
      <div className="absolute inset-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-border/40">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-foreground text-background">
            <Bot className="h-4 w-4" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-xs font-medium">Agent Claudia</p>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 motion-safe:animate-pulse-soft" />
              <span className="text-[10px] text-muted-foreground">En ligne — Mode strict</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 py-4 space-y-3 overflow-hidden">
          {messages.map((msg, i) => {
            if (i >= visibleMessages) return null;
            const isUser = msg.role === "user";
            return (
              <div
                key={i}
                className={`flex gap-2 motion-safe:animate-fade-in-up ${isUser ? "justify-end" : "justify-start"}`}
                style={{ animationFillMode: "both" }}
              >
                {!isUser && (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-foreground/10">
                    <Bot className="h-3 w-3 text-foreground" strokeWidth={1.5} />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-[11px] leading-relaxed ${
                    isUser
                      ? "bg-foreground text-background rounded-br-md"
                      : msg.isSource
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 rounded-bl-md font-mono"
                        : "bg-muted text-foreground rounded-bl-md"
                  }`}
                >
                  {msg.isSource && <span className="text-[9px] font-semibold uppercase tracking-wider opacity-60 block mb-0.5">Source</span>}
                  {msg.text}
                </div>
                {isUser && (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
                    <User className="h-3 w-3" strokeWidth={1.5} />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing indicator */}
          {typing && (
            <div className="flex gap-2 items-end motion-safe:animate-fade-in-up" style={{ animationFillMode: "both" }}>
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-foreground/10">
                <Bot className="h-3 w-3 text-foreground" strokeWidth={1.5} />
              </div>
              <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2.5 flex gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-foreground/30 motion-safe:animate-pulse-soft" />
                <div className="h-1.5 w-1.5 rounded-full bg-foreground/30 motion-safe:animate-pulse-soft [animation-delay:0.2s]" />
                <div className="h-1.5 w-1.5 rounded-full bg-foreground/30 motion-safe:animate-pulse-soft [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        {/* Confidence bar */}
        {visibleMessages >= 2 && (
          <div className="mt-auto pt-3 border-t border-border/40 motion-safe:animate-fade-in-up" style={{ animationFillMode: "both" }}>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>Confiance</span>
              <span className="font-medium text-emerald-600">96%</span>
            </div>
            <div className="mt-1 h-1 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-emerald-500 transition-all duration-1000 ease-apple" style={{ width: "96%" }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
