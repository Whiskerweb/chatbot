"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

interface CreditsBarProps {
  used: number;
  total: number;
  resetDate?: string;
}

export function CreditsBar({ used, total, resetDate }: CreditsBarProps) {
  const percent = Math.round((used / Math.max(1, total)) * 100);
  const remaining = total - used;

  const colorClass = percent < 60 ? "bg-green-500" : percent < 80 ? "bg-orange-500" : "bg-red-500";

  // Estimate days remaining based on daily average
  const daysInMonth = 30;
  const daysPassed = Math.max(1, new Date().getDate());
  const dailyAvg = used / daysPassed;
  const daysRemaining = dailyAvg > 0 ? Math.round(remaining / dailyAvg) : daysInMonth;

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">Crédits ce mois</h3>
          {percent >= 80 && (
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          )}
        </div>
        <span className="text-sm text-muted-foreground">
          {used.toLocaleString()} / {total.toLocaleString()}
        </span>
      </div>
      <div className="relative">
        <Progress value={percent} className="h-3" />
        <div
          className={cn("absolute inset-y-0 left-0 rounded-full transition-all", colorClass)}
          style={{ width: `${Math.min(100, percent)}%`, height: "100%" }}
        />
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>
          {percent >= 80 ? (
            <Link href="/dashboard/billing" className="text-orange-600 hover:underline font-medium">
              Upgrader votre plan
            </Link>
          ) : (
            `${remaining.toLocaleString()} crédits restants`
          )}
        </span>
        <span>~{daysRemaining} jours restants à ce rythme</span>
      </div>
    </div>
  );
}
