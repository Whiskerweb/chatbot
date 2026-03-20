"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

interface CreditsBarProps {
  used: number;
  total: number;
  resetDate?: string;
}

export function CreditsBar({ used, total }: CreditsBarProps) {
  const percent = Math.round((used / Math.max(1, total)) * 100);
  const remaining = total - used;

  const daysPassed = Math.max(1, new Date().getDate());
  const dailyAvg = used / daysPassed;
  const daysRemaining = dailyAvg > 0 ? Math.round(remaining / dailyAvg) : 30;

  return (
    <div className="rounded-2xl bg-card shadow-apple p-4 sm:p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-xs sm:text-sm font-medium">Crédits ce mois</h3>
          {percent >= 80 && (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-50">
              <AlertTriangle className="h-3 w-3 text-amber-600" />
            </div>
          )}
        </div>
        <span className="text-xs sm:text-sm text-muted-foreground">
          {used.toLocaleString()} / {total.toLocaleString()}
        </span>
      </div>
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted/60">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            percent < 60 ? "bg-emerald-500" : percent < 80 ? "bg-amber-500" : "bg-red-500"
          )}
          style={{ width: `${Math.min(100, percent)}%` }}
        />
      </div>
      <div className="mt-2.5 flex justify-between text-[10px] sm:text-xs text-muted-foreground">
        <span>
          {percent >= 80 ? (
            <Link href="/dashboard/billing" className="text-amber-600 hover:underline font-medium">
              Upgrader votre plan
            </Link>
          ) : (
            `${remaining.toLocaleString()} crédits restants`
          )}
        </span>
        <span>~{daysRemaining} jours restants</span>
      </div>
    </div>
  );
}
