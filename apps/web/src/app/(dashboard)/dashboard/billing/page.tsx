"use client";

import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditsBar } from "@/components/dashboard/credits-bar";
import { trpc } from "@/lib/trpc";
import { Loader2, ExternalLink, Check } from "lucide-react";
import { useState } from "react";

export default function BillingPage() {
  const usage = trpc.billing.getUsage.useQuery();
  const currentPlan = trpc.billing.getCurrentPlan.useQuery();
  const plans = trpc.billing.getPlans.useQuery();
  const creditLogs = trpc.billing.getCreditLogs.useQuery({ limit: 20 });

  const createCheckout = trpc.billing.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.url) window.location.href = data.url;
    },
  });

  const createPortal = trpc.billing.createPortal.useMutation({
    onSuccess: (data) => {
      if (data.url) window.location.href = data.url;
    },
  });

  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSelectPlan = (slug: string) => {
    if (slug === "FREE") return;
    setLoadingPlan(slug);
    createCheckout.mutate(
      { plan: slug as "STARTER" | "PRO" | "GROWTH" },
      { onSettled: () => setLoadingPlan(null) }
    );
  };

  const handleManageSubscription = () => {
    createPortal.mutate();
  };

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

  const hasSubscription = !!currentPlan.data?.stripeSubId;

  return (
    <div>
      <Header title="Billing" description="Gérez votre abonnement et vos crédits" />
      <div className="p-8 space-y-8">
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
            {hasSubscription ? (
              <Button
                onClick={handleManageSubscription}
                disabled={createPortal.isPending}
                variant="outline"
              >
                {createPortal.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <ExternalLink className="h-4 w-4 mr-2" />
                )}
                Gérer l&apos;abonnement
              </Button>
            ) : (
              <Badge variant="secondary">Plan gratuit</Badge>
            )}
          </CardContent>
        </Card>

        {/* Plan comparison */}
        {plans.data && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {plans.data.map((plan) => {
              const isCurrent = currentPlan.data?.slug === plan.slug;
              const isPopular = plan.slug === "PRO";
              const isFree = plan.slug === "FREE";
              const isLoading = loadingPlan === plan.slug;
              const isDowngrade = !isFree && currentPlan.data?.price && plan.price < currentPlan.data.price;

              return (
                <Card key={plan.slug} className={isPopular ? "ring-2 ring-foreground shadow-apple-hover" : isCurrent ? "ring-2 ring-emerald-500" : ""}>
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
                    <ul className="mt-3 space-y-1 text-left text-xs text-muted-foreground">
                      <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-500 shrink-0" /> {plan.maxAgents} agent{plan.maxAgents > 1 ? "s" : ""}</li>
                      <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-500 shrink-0" /> {plan.maxSources.toLocaleString()} sources</li>
                      <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-500 shrink-0" /> {plan.maxMembers} membre{plan.maxMembers > 1 ? "s" : ""}</li>
                    </ul>
                    {isCurrent ? (
                      <Button className="mt-4 w-full" variant="outline" disabled>
                        Plan actuel
                      </Button>
                    ) : isFree ? (
                      <Button className="mt-4 w-full" variant="outline" disabled>
                        Gratuit
                      </Button>
                    ) : isDowngrade && hasSubscription ? (
                      <Button
                        className="mt-4 w-full"
                        variant="outline"
                        onClick={handleManageSubscription}
                        disabled={createPortal.isPending}
                      >
                        Changer via portail
                      </Button>
                    ) : hasSubscription ? (
                      <Button
                        className="mt-4 w-full"
                        variant="outline"
                        onClick={handleManageSubscription}
                        disabled={createPortal.isPending}
                      >
                        Changer de plan
                      </Button>
                    ) : (
                      <Button
                        className="mt-4 w-full"
                        onClick={() => handleSelectPlan(plan.slug)}
                        disabled={isLoading || createCheckout.isPending}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        Sélectionner
                      </Button>
                    )}
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
                  <div key={log.id} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
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
