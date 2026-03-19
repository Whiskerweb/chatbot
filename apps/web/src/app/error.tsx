"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <h2 className="text-xl font-semibold tracking-tight">Une erreur est survenue</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {error.message || "Quelque chose s'est mal passé."}
        </p>
        <Button onClick={reset} className="mt-6">
          Réessayer
        </Button>
      </div>
    </div>
  );
}
