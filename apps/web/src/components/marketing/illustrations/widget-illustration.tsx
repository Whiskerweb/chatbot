"use client";

import { useEffect, useState } from "react";
import { MessageSquare, X, Send } from "lucide-react";

export function WidgetIllustration() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setIsOpen(true), 800);
    const t2 = setTimeout(() => setShowSuggestions(true), 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[360px] rounded-2xl bg-gradient-to-br from-muted/20 via-background to-muted/30 overflow-hidden">
      {/* Fake website background */}
      <div className="absolute inset-4">
        {/* Nav bar mockup */}
        <div className="flex items-center gap-3 pb-3 border-b border-border/30">
          <div className="h-4 w-16 rounded bg-foreground/10" />
          <div className="flex-1" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-2.5 w-10 rounded bg-foreground/5" />
            ))}
          </div>
        </div>

        {/* Content skeleton */}
        <div className="mt-6 space-y-4 px-2">
          <div className="h-5 w-3/4 rounded bg-foreground/5" />
          <div className="h-3 w-full rounded bg-foreground/[0.03]" />
          <div className="h-3 w-5/6 rounded bg-foreground/[0.03]" />
          <div className="h-3 w-2/3 rounded bg-foreground/[0.03]" />
          <div className="grid grid-cols-2 gap-2 mt-6">
            <div className="h-16 rounded-lg bg-foreground/[0.03]" />
            <div className="h-16 rounded-lg bg-foreground/[0.03]" />
          </div>
        </div>
      </div>

      {/* Widget bubble */}
      <div className="absolute bottom-4 right-4">
        {/* Chat window */}
        {isOpen && (
          <div
            className="mb-3 w-56 rounded-2xl bg-card shadow-apple-hover border border-border/50 overflow-hidden motion-safe:animate-scale-in"
            style={{ transformOrigin: "bottom right", animationFillMode: "both" }}
          >
            {/* Widget header */}
            <div className="bg-foreground text-background px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-background/20 flex items-center justify-center">
                  <MessageSquare className="h-3 w-3" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[10px] font-medium">HelloClaudia</p>
                  <p className="text-[8px] opacity-60">Répond en ~5s</p>
                </div>
              </div>
              <X className="h-3.5 w-3.5 opacity-60" strokeWidth={1.5} />
            </div>

            {/* Welcome message */}
            <div className="p-3 space-y-2">
              <div className="bg-muted rounded-xl rounded-bl-md px-3 py-2">
                <p className="text-[10px]">Bonjour 👋 Comment puis-je vous aider ?</p>
              </div>

              {/* Suggested questions */}
              {showSuggestions && (
                <div className="space-y-1.5 motion-safe:animate-fade-in-up" style={{ animationFillMode: "both" }}>
                  {["Quels sont vos tarifs ?", "Comment ça marche ?", "Parler à un humain"].map((q, i) => (
                    <button
                      key={q}
                      className="w-full text-left rounded-lg border border-border/60 px-2.5 py-1.5 text-[9px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="flex items-center gap-2 rounded-lg border border-border/60 px-2.5 py-1.5 mt-2">
                <span className="text-[9px] text-muted-foreground/50 flex-1">Écrivez un message...</span>
                <Send className="h-3 w-3 text-muted-foreground/30" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        )}

        {/* Bubble button */}
        <div className="ml-auto w-11 h-11 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg motion-safe:animate-scale-in cursor-pointer hover:scale-110 transition-transform duration-200">
          <MessageSquare className="h-5 w-5" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}
