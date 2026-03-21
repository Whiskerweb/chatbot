"use client";

import { useEffect, useState, useCallback } from "react";
import { Globe, FileText, Check, Loader2, Search } from "lucide-react";

const PAGES = [
  { path: "/accueil", label: "Page d'accueil" },
  { path: "/tarifs", label: "Tarifs" },
  { path: "/contact", label: "Contact" },
  { path: "/blog", label: "Blog" },
  { path: "/faq", label: "FAQ" },
];

const CYCLE_MS = 8500;

type Phase = "idle" | "scanning" | "indexing" | "done";

export function IndexingIllustration() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [pageStatus, setPageStatus] = useState<("hidden" | "loading" | "done")[]>(
    PAGES.map(() => "hidden")
  );
  const [progress, setProgress] = useState<number[]>(PAGES.map(() => 0));
  const [fadeOut, setFadeOut] = useState(false);

  const runCycle = useCallback(() => {
    const timers: NodeJS.Timeout[] = [];

    // Reset
    setFadeOut(false);
    setPhase("idle");
    setPageStatus(PAGES.map(() => "hidden"));
    setProgress(PAGES.map(() => 0));

    // Phase 1: Button click → scanning
    timers.push(setTimeout(() => setPhase("scanning"), 1000));

    // Phase 2: Start indexing pages one by one
    timers.push(setTimeout(() => setPhase("indexing"), 1800));

    PAGES.forEach((_, i) => {
      const baseDelay = 2000 + i * 900;

      // Show page row (loading)
      timers.push(
        setTimeout(() => {
          setPageStatus((prev) => {
            const n = [...prev];
            n[i] = "loading";
            return n;
          });
        }, baseDelay)
      );

      // Animate progress
      for (let p = 20; p <= 100; p += 20) {
        timers.push(
          setTimeout(() => {
            setProgress((prev) => {
              const n = [...prev];
              n[i] = p;
              return n;
            });
          }, baseDelay + (p / 20) * 120)
        );
      }

      // Mark done
      timers.push(
        setTimeout(() => {
          setPageStatus((prev) => {
            const n = [...prev];
            n[i] = "done";
            return n;
          });
        }, baseDelay + 700)
      );
    });

    // Phase 3: All done
    timers.push(setTimeout(() => setPhase("done"), 6800));

    // Fade out before restart
    timers.push(setTimeout(() => setFadeOut(true), 7800));

    return timers;
  }, []);

  useEffect(() => {
    let timers = runCycle();

    const interval = setInterval(() => {
      timers.forEach(clearTimeout);
      timers = runCycle();
    }, CYCLE_MS);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(interval);
    };
  }, [runCycle]);

  const doneCount = pageStatus.filter((s) => s === "done").length;

  return (
    <div
      className={`relative w-full h-full min-h-[360px] rounded-2xl bg-gradient-to-br from-background via-background to-muted/30 overflow-hidden transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />

      <div className="absolute inset-3 sm:inset-4 flex flex-col">
        {/* ── Browser chrome ── */}
        <div className="rounded-xl bg-card shadow-apple overflow-hidden">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border/40">
            <div className="flex gap-1.5">
              <div className="h-2 w-2 rounded-full bg-red-400/60" />
              <div className="h-2 w-2 rounded-full bg-amber-400/60" />
              <div className="h-2 w-2 rounded-full bg-emerald-400/60" />
            </div>
            {/* URL bar */}
            <div className="flex-1 flex items-center gap-1.5 rounded-md bg-muted/50 px-2.5 py-1">
              <Globe className="h-2.5 w-2.5 text-muted-foreground/60 shrink-0" />
              <span className="text-[10px] text-muted-foreground font-medium tracking-tight">
                helloclaudia.fr
              </span>
            </div>
          </div>

          {/* Page content skeleton */}
          <div className="p-3 space-y-2">
            <div className="h-2 w-3/4 rounded bg-foreground/[0.06]" />
            <div className="h-2 w-1/2 rounded bg-foreground/[0.04]" />
            <div className="h-2 w-2/3 rounded bg-foreground/[0.04]" />
          </div>
        </div>

        {/* ── Indexer button ── */}
        <div className="flex justify-center mt-3">
          <button
            className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-[11px] font-semibold transition-all duration-300 ${
              phase === "idle"
                ? "bg-foreground text-background shadow-sm"
                : phase === "scanning"
                ? "bg-foreground text-background shadow-lg scale-95"
                : "bg-emerald-600 text-white shadow-sm"
            }`}
          >
            {phase === "idle" && (
              <>
                <Search className="h-3 w-3" />
                Indexer
              </>
            )}
            {phase === "scanning" && (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Analyse...
              </>
            )}
            {(phase === "indexing" || phase === "done") && (
              <>
                {phase === "done" ? (
                  <Check className="h-3 w-3" strokeWidth={2.5} />
                ) : (
                  <Loader2 className="h-3 w-3 animate-spin" />
                )}
                {doneCount}/{PAGES.length} pages
              </>
            )}
          </button>
        </div>

        {/* ── Indexed pages list ── */}
        <div className="flex-1 mt-3 space-y-1.5 overflow-hidden">
          {PAGES.map((page, i) => {
            const s = pageStatus[i];
            const p = progress[i];

            if (s === "hidden") return null;

            return (
              <div
                key={page.path}
                className="rounded-lg bg-card shadow-apple px-3 py-2 motion-safe:animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted/60">
                    <FileText className="h-3 w-3 text-muted-foreground" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-mono font-medium text-foreground/80 truncate">
                      {page.path}
                    </p>
                  </div>
                  <div className="shrink-0">
                    {s === "loading" && (
                      <Loader2 className="h-3.5 w-3.5 text-muted-foreground animate-spin" />
                    )}
                    {s === "done" && (
                      <div className="h-4 w-4 rounded-full bg-emerald-500 flex items-center justify-center motion-safe:animate-scale-in">
                        <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                </div>
                {/* Progress bar */}
                {s === "loading" && (
                  <div className="mt-1.5 h-0.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-foreground/25 transition-all duration-200 ease-out"
                      style={{ width: `${p}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Success footer ── */}
        {phase === "done" && (
          <div className="pt-2 border-t border-border/40 motion-safe:animate-fade-in-up" style={{ animationFillMode: "both" }}>
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-emerald-600 font-medium">
                Indexation terminée
              </p>
              <p className="text-[10px] text-muted-foreground">
                {PAGES.length} pages analysées
              </p>
            </div>
            {/* Chunks visualization */}
            <div className="flex gap-0.5 flex-wrap mt-1.5">
              {Array.from({ length: 14 }).map((_, i) => (
                <div
                  key={i}
                  className="h-1.5 rounded-sm bg-emerald-500/20 motion-safe:animate-scale-in"
                  style={{
                    width: `${10 + Math.random() * 20}px`,
                    animationDelay: `${i * 30}ms`,
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
