"use client";

import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditsBar } from "@/components/dashboard/credits-bar";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

export default function BillingPage() {
  const usage = trpc.billing.getUsage.useQuery();
  const currentPlan = trpc.billing.getCurrentPlan.useQuery();
  const plans = trpc.billing.getPlans.useQuery();
  const creditLogs = trpc.billing.getCreditLogs.useQuery({ limit: 20 });

  if (usage.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const actionLabels: Record<string, string> = {
    MESSAGE_AI: "Message IA",
    INDEXING: "Indexation",
    REINDEX: "Ré-indexation",
    SYNC: "Synchronisation",
    EXPORT: "Export",
    WEBHOOK: "Webhook",
    TRANSLATION: "Traduction",
    AI_SUGGESTION: "Suggestion IA",
  };

  return (
    <div>
      <Header title="Billing" description="Gérez votre abonnement et vos crédits" />
      <div className="p-6 space-y-6">
        <CreditsBar
          used={usage.data?.creditsUsed ?? 0}
          total={usage.data?.creditsTotal ?? 100}
        />

        {/* Current Plan */}
        <Card>
          <CardHeader><CardTitle>Plan actuel</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{currentPlan.data?.name ?? "Free"}</p>
              <p className="text-sm text-muted-foreground">
                {(currentPlan.data?.creditsPerMonth ?? 100).toLocaleString()} crédits/mois
                &bull; {currentPlan.data?.maxAgents ?? 1} agent(s)
                &bull; {(currentPlan.data?.maxSources ?? 30).toLocaleString()} sources
              </p>
            </div>
            <Button>Changer de plan</Button>
          </CardContent>
        </Card>

        {/* Plan comparison */}
        {plans.data && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {plans.data.map((plan) => {
              const isCurrent = currentPlan.data?.slug === plan.slug;
              const isPopular = plan.slug === "PRO";
              return (
                <Card key={plan.slug} className={isPopular ? "border-primary shadow-md" : isCurrent ? "border-green-500" : ""}>
                  <CardContent className="p-6 text-center">
                    {isPopular && <Badge className="mb-2">Populaire</Badge>}
                    {isCurrent && <Badge variant="success" className="mb-2">Actuel</Badge>}
                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">{plan.price}$</span>
                      <span className="text-muted-foreground">/mois</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {plan.creditsPerMonth.toLocaleString()} crédits/mois
                    </p>
                    <Button className="mt-4 w-full" variant={isCurrent ? "outline" : "default"} disabled={isCurrent}>
                      {isCurrent ? "Plan actuel" : "Sélectionner"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Credit History */}
        <Card>
          <CardHeader><CardTitle>Historique de consommation</CardTitle></CardHeader>
          <CardContent>
            {creditLogs.data?.items && creditLogs.data.items.length > 0 ? (
              <div className="space-y-2">
                {creditLogs.data.items.map((log) => (
                  <div key={log.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-32">
                        {new Date(log.createdAt).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <Badge variant="secondary">{actionLabels[log.action] ?? log.action}</Badge>
                    </div>
                    <span className="text-sm font-medium">-{log.credits}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                Aucune consommation enregistrée pour le moment.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
