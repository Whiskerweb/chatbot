"use client";

import { useEffect, useState } from "react";
import { FileText, Globe, Database, Check, Loader2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SourceItem {
  icon: LucideIcon;
  label: string;
  pages: string;
  color: string;
}

const sources: SourceItem[] = [
  { icon: Globe, label: "site-web.com", pages: "142 pages", color: "bg-blue-500" },
  { icon: FileText, label: "guide-produit.pdf", pages: "38 pages", color: "bg-amber-500" },
  { icon: Database, label: "Notion — FAQ", pages: "67 entrées", color: "bg-foreground" },
];

export function SourcesIllustration() {
  const [progress, setProgress] = useState<number[]>([0, 0, 0]);
  const [status, setStatus] = useState<("idle" | "loading" | "done")[]>(["idle", "idle", "idle"]);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    sources.forEach((_, i) => {
      // Start loading
      timers.push(setTimeout(() => {
        setStatus(prev => { const n = [...prev]; n[i] = "loading"; return n; });
      }, 400 + i * 800));

      // Progress ticks
      for (let p = 20; p <= 100; p += 20) {
        timers.push(setTimeout(() => {
          setProgress(prev => { const n = [...prev]; n[i] = p; return n; });
        }, 400 + i * 800 + (p / 20) * 200));
      }

      // Complete
      timers.push(setTimeout(() => {
        setStatus(prev => { const n = [...prev]; n[i] = "done"; return n; });
      }, 400 + i * 800 + 1200));
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[360px] rounded-2xl bg-gradient-to-br from-background via-background to-muted/30 overflow-hidden">
      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />

      <div className="absolute inset-4 flex flex-col">
        {/* Header */}
        <div className="pb-4 border-b border-border/40">
          <p className="text-xs font-medium">Sources indexées</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Pipeline RAG — Chunking + Embedding</p>
        </div>

        {/* Source items */}
        <div className="flex-1 py-4 space-y-3">
          {sources.map((source, i) => {
            const Icon = source.icon;
            const s = status[i];
            const p = progress[i];

            return (
              <div
                key={source.label}
                className="rounded-xl bg-card shadow-apple p-3 motion-safe:animate-fade-in-up"
                style={{ animationDelay: `${i * 200}ms`, animationFillMode: "both" }}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${source.color} text-white`}>
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium truncate">{source.label}</p>
                    <p className="text-[10px] text-muted-foreground">{source.pages}</p>
                  </div>
                  <div className="shrink-0">
                    {s === "idle" && <div className="h-5 w-5 rounded-full border border-border" />}
                    {s === "loading" && <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />}
                    {s === "done" && (
                      <div className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center motion-safe:animate-scale-in">
                        <Check className="h-3 w-3 text-white" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                </div>
                {/* Progress bar */}
                {s !== "idle" && (
                  <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ease-apple ${
                        s === "done" ? "bg-emerald-500" : "bg-foreground/30"
                      }`}
                      style={{ width: `${p}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Chunk visualization */}
        {status[2] === "done" && (
          <div className="pt-3 border-t border-border/40 motion-safe:animate-fade-in-up" style={{ animationFillMode: "both" }}>
            <p className="text-[10px] text-muted-foreground mb-2">Chunks vectorisés</p>
            <div className="flex gap-1 flex-wrap">
              {Array.from({ length: 18 }).map((_: unknown, i: number) => (
                <div
                  key={i}
                  className="h-2 rounded-sm bg-foreground/10 motion-safe:animate-scale-in"
                  style={{
                    width: `${12 + Math.random() * 24}px`,
                    animationDelay: `${i * 40}ms`,
                    animationFillMode: "both",
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
