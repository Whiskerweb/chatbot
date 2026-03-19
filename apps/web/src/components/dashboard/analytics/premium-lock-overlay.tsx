"use client";

import { Button } from "@/components/ui/button";
import { Lock, Sparkles } from "lucide-react";
import Link from "next/link";

export function PremiumLockOverlay() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-[6px] bg-background/60">
      <div className="text-center space-y-4 max-w-sm mx-auto px-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-950 dark:to-amber-900">
          <Lock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold tracking-tight">
            Analyses IA avancées
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Catégorisation automatique des questions par IA pour identifier les tendances et optimiser votre base de connaissances.
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/dashboard/billing">
            <Sparkles className="h-4 w-4" />
            Passer au plan Starter
          </Link>
        </Button>
      </div>
    </div>
  );
}
