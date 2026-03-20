"use client";

import { useEffect, useState } from "react";
import { Shield, Lock, Eye, Check } from "lucide-react";

const checks = [
  { icon: Lock, label: "Chiffrement AES-256", detail: "Au repos & en transit" },
  { icon: Shield, label: "Conformité RGPD", detail: "DPA & droit à l'effacement" },
  { icon: Eye, label: "Privacy-first", detail: "Opt-out par défaut" },
];

export function SecurityIllustration() {
  const [completedChecks, setCompletedChecks] = useState(0);
  const [showShield, setShowShield] = useState(false);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    checks.forEach((_, i) => {
      timers.push(setTimeout(() => setCompletedChecks(i + 1), 800 + i * 700));
    });
    timers.push(setTimeout(() => setShowShield(true), 800 + checks.length * 700 + 400));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[360px] rounded-2xl bg-gradient-to-br from-background via-background to-muted/30 overflow-hidden">
      {/* Hex grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="absolute inset-4 flex flex-col">
        {/* Header */}
        <div className="pb-4 border-b border-border/40">
          <p className="text-xs font-medium">Audit de sécurité</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Vérification automatique en cours...</p>
        </div>

        {/* Security checks */}
        <div className="flex-1 py-4 space-y-3">
          {checks.map((check, i) => {
            const Icon = check.icon;
            const isDone = i < completedChecks;
            const isCurrent = i === completedChecks - 1;

            return (
              <div
                key={check.label}
                className={`rounded-xl border p-3 transition-all duration-500 ease-apple ${
                  isDone
                    ? "bg-emerald-50/50 border-emerald-200/50 dark:bg-emerald-950/20 dark:border-emerald-800/30"
                    : "bg-card border-border/40"
                } ${isCurrent ? "motion-safe:animate-scale-in" : ""}`}
                style={{ animationFillMode: "both" }}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-500 ${
                    isDone ? "bg-emerald-500 text-white" : "bg-muted/60 text-foreground"
                  }`}>
                    {isDone ? (
                      <Check className="h-4 w-4" strokeWidth={2.5} />
                    ) : (
                      <Icon className="h-4 w-4" strokeWidth={1.5} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-medium">{check.label}</p>
                    <p className="text-[10px] text-muted-foreground">{check.detail}</p>
                  </div>
                  {isDone && (
                    <span className="text-[9px] text-emerald-600 font-medium motion-safe:animate-fade-in-up" style={{ animationFillMode: "both" }}>
                      Vérifié
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Shield badge */}
        {showShield && (
          <div className="pt-3 border-t border-border/40 flex items-center justify-center motion-safe:animate-scale-in" style={{ animationFillMode: "both" }}>
            <div className="flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-4 py-2">
              <Shield className="h-4 w-4 text-emerald-600" strokeWidth={2} />
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">Toutes les vérifications passées</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
