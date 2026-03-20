"use client";

import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditsBar } from "@/components/dashboard/credits-bar";
import { trpc } from "@/lib/trpc";
import {
  Loader2, ExternalLink, Check, Zap, ArrowRight,
  Sparkles, Shield, Users, Globe, BarChart3, Bot,
  MessageSquare, Crown, Rocket, Star,
} from "lucide-react";
import { useState } from "react";

// Advantages to highlight for each plan upgrade path
const upgradeAdvantages: Record<string, { icon: React.ReactNode; label: string; description: string }[]> = {
  FREE_TO_STARTER: [
    { icon: <Zap className="h-4 w-4" />, label: "3 000 crédits/mois", description: "30x plus de crédits pour vos conversations" },
    { icon: <Bot className="h-4 w-4" />, label: "3 agents", description: "Créez des chatbots spécialisés par usage" },
    { icon: <MessageSquare className="h-4 w-4" />, label: "Live Chat", description: "Prenez le relais en temps réel sur les conversations" },
    { icon: <BarChart3 className="h-4 w-4" />, label: "Analytics IA", description: "Comprenez ce que vos visiteurs demandent" },
  ],
  FREE_TO_PRO: [
    { icon: <Zap className="h-4 w-4" />, label: "15 000 crédits/mois", description: "150x plus de crédits qu'en gratuit" },
    { icon: <Sparkles className="h-4 w-4" />, label: "Modèles premium", description: "Accès à Claude Opus, GPT-4o et Grok" },
    { icon: <Shield className="h-4 w-4" />, label: "White Label", description: "Supprimez la marque HelloClaudia" },
    { icon: <Globe className="h-4 w-4" />, label: "BYOK & API", description: "Utilisez vos propres clés API" },
  ],
  STARTER_TO_PRO: [
    { icon: <Zap className="h-4 w-4" />, label: "15 000 crédits/mois", description: "5x plus de crédits pour scaler" },
    { icon: <Sparkles className="h-4 w-4" />, label: "Modèles premium", description: "Claude Opus, GPT-4o, Grok pour des réponses plus précises" },
    { icon: <Shield className="h-4 w-4" />, label: "White Label", description: "Votre marque, votre chatbot" },
    { icon: <Bot className="h-4 w-4" />, label: "10 agents", description: "Un agent par département ou par produit" },
  ],
  STARTER_TO_GROWTH: [
    { icon: <Rocket className="h-4 w-4" />, label: "50 000 crédits/mois", description: "Volume massif pour les entreprises" },
    { icon: <Users className="h-4 w-4" />, label: "15 membres", description: "Toute votre équipe sur la plateforme" },
    { icon: <Globe className="h-4 w-4" />, label: "Domaine personnalisé", description: "claudia.votredomaine.com" },
    { icon: <Crown className="h-4 w-4" />, label: "Support prioritaire", description: "Réponse garantie sous 2h" },
  ],
  PRO_TO_GROWTH: [
    { icon: <Rocket className="h-4 w-4" />, label: "50 000 crédits/mois", description: "3x plus de crédits pour la croissance" },
    { icon: <Users className="h-4 w-4" />, label: "15 membres", description: "Collaborez avec toute votre équipe" },
    { icon: <Globe className="h-4 w-4" />, label: "Domaine personnalisé", description: "Accès via votre propre domaine" },
    { icon: <Crown className="h-4 w-4" />, label: "Support prioritaire", description: "Accompagnement dédié" },
  ],
};

function getUpgradeKey(currentSlug: string, targetSlug: string): string {
  return `${currentSlug}_TO_${targetSlug}`;
}

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
  const currentSlug = currentPlan.data?.slug ?? "FREE";

  // Determine the recommended next plan
  const getNextPlan = (): string | null => {
    if (currentSlug === "FREE") return "STARTER";
    if (currentSlug === "STARTER") return "PRO";
    if (currentSlug === "PRO") return "GROWTH";
    return null;
  };

  const nextPlanSlug = getNextPlan();
  const nextPlan = plans.data?.find((p) => p.slug === nextPlanSlug);
  const upgradeKey = nextPlanSlug ? getUpgradeKey(currentSlug, nextPlanSlug) : null;
  const advantages = upgradeKey ? upgradeAdvantages[upgradeKey] : null;

  return (
    <div>
      <Header title="Billing" description="Gérez votre abonnement et vos crédits" />
      <div className="px-4 pb-6 sm:px-6 md:px-8 space-y-6 sm:space-y-8">
        <CreditsBar
          used={usage.data?.creditsUsed ?? 0}
          total={usage.data?.creditsTotal ?? 100}
        />

        {/* Current Plan */}
        <Card>
          <CardHeader><CardTitle>Plan actuel</CardTitle></CardHeader>
          <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xl sm:text-2xl font-bold">{currentPlan.data?.name ?? "Free"}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">
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
                className="w-full sm:w-auto"
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

        {/* Upgrade CTA - Smart contextual banner */}
        {nextPlan && advantages && (
          <Card className="relative overflow-hidden border-2 border-foreground/10 bg-gradient-to-br from-background via-background to-muted/30">
            {/* Decorative gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-blue-500 to-emerald-500" />
            <CardContent className="p-5 sm:p-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                {/* Left: Message + advantages */}
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                      <h3 className="text-lg sm:text-xl font-semibold">
                        Passez au plan {nextPlan.name}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground max-w-lg">
                      {currentSlug === "FREE"
                        ? "Débloquez tout le potentiel de votre chatbot IA avec des fonctionnalités avancées et plus de crédits."
                        : currentSlug === "STARTER"
                        ? "Accédez aux modèles IA les plus performants et personnalisez entièrement votre expérience."
                        : "Passez à la vitesse supérieure avec un volume massif et des fonctionnalités entreprise."}
                    </p>
                  </div>

                  {/* Advantages grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {advantages.map((adv, i) => (
                      <div key={i} className="flex items-start gap-3 rounded-xl bg-card/80 border border-border/50 p-3 sm:p-4 transition-all hover:shadow-sm">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-foreground/5 text-foreground">
                          {adv.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium">{adv.label}</p>
                          <p className="text-xs text-muted-foreground">{adv.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Price + CTA */}
                <div className="lg:text-center lg:min-w-[200px] flex flex-col items-start lg:items-center gap-3">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-bold">{nextPlan.price}$</span>
                      <span className="text-muted-foreground text-sm">/mois</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {nextPlan.creditsPerMonth.toLocaleString()} crédits inclus
                    </p>
                  </div>
                  {hasSubscription ? (
                    <Button
                      onClick={handleManageSubscription}
                      disabled={createPortal.isPending}
                      size="lg"
                      className="w-full sm:w-auto gap-2 rounded-xl"
                    >
                      {createPortal.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ArrowRight className="h-4 w-4" />
                      )}
                      Passer au {nextPlan.name}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleSelectPlan(nextPlan.slug)}
                      disabled={loadingPlan === nextPlan.slug || createCheckout.isPending}
                      size="lg"
                      className="w-full sm:w-auto gap-2 rounded-xl"
                    >
                      {loadingPlan === nextPlan.slug ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Rocket className="h-4 w-4" />
                      )}
                      Commencer avec {nextPlan.name}
                    </Button>
                  )}
                  <p className="text-[11px] text-muted-foreground">
                    Sans engagement &bull; Annulable à tout moment
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Plan comparison */}
        {plans.data && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Comparer les plans</h2>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {plans.data.map((plan) => {
                const isCurrent = currentPlan.data?.slug === plan.slug;
                const isPopular = plan.slug === "PRO";
                const isFree = plan.slug === "FREE";
                const isLoading = loadingPlan === plan.slug;
                const isDowngrade = !isFree && currentPlan.data?.price && plan.price < currentPlan.data.price;
                const isRecommended = plan.slug === nextPlanSlug;

                return (
                  <Card
                    key={plan.slug}
                    className={
                      isRecommended
                        ? "ring-2 ring-foreground shadow-apple-hover relative"
                        : isCurrent
                        ? "ring-2 ring-emerald-500 relative"
                        : isPopular
                        ? "ring-1 ring-foreground/20 relative"
                        : "relative"
                    }
                  >
                    <CardContent className="p-5 sm:p-6 text-center">
                      <div className="flex justify-center gap-2 mb-2 min-h-[24px]">
                        {isRecommended && !isCurrent && (
                          <Badge className="text-[10px]">Recommandé</Badge>
                        )}
                        {isPopular && !isRecommended && !isCurrent && (
                          <Badge className="text-[10px]">Populaire</Badge>
                        )}
                        {isCurrent && (
                          <Badge variant="success" className="text-[10px]">Actuel</Badge>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold">{plan.name}</h3>
                      <div className="mt-2">
                        <span className="text-2xl sm:text-3xl font-bold">{plan.price}$</span>
                        <span className="text-muted-foreground text-sm">/mois</span>
                      </div>
                      <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
                        {plan.creditsPerMonth.toLocaleString()} crédits/mois
                      </p>
                      <ul className="mt-3 space-y-1.5 text-left text-xs text-muted-foreground">
                        <li className="flex items-center gap-1.5">
                          <Check size={12} className="text-emerald-500 shrink-0" />
                          {plan.maxAgents} agent{plan.maxAgents > 1 ? "s" : ""}
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Check size={12} className="text-emerald-500 shrink-0" />
                          {plan.maxSources.toLocaleString()} sources
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Check size={12} className="text-emerald-500 shrink-0" />
                          {plan.maxMembers} membre{plan.maxMembers > 1 ? "s" : ""}
                        </li>
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
                          variant={isRecommended ? "default" : "outline"}
                          onClick={handleManageSubscription}
                          disabled={createPortal.isPending}
                        >
                          {isRecommended && <ArrowRight className="h-3.5 w-3.5 mr-1.5" />}
                          Changer de plan
                        </Button>
                      ) : (
                        <Button
                          className="mt-4 w-full"
                          variant={isRecommended ? "default" : "outline"}
                          onClick={() => handleSelectPlan(plan.slug)}
                          disabled={isLoading || createCheckout.isPending}
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : isRecommended ? (
                            <Rocket className="h-3.5 w-3.5 mr-1.5" />
                          ) : null}
                          Sélectionner
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Secondary upgrade CTA for users on lower plans - suggest the "jump" plan */}
        {currentSlug !== "GROWTH" && currentSlug !== "PRO" && plans.data && (
          (() => {
            const jumpSlug = currentSlug === "FREE" ? "PRO" : "GROWTH";
            const jumpPlan = plans.data.find((p) => p.slug === jumpSlug);
            const jumpKey = getUpgradeKey(currentSlug, jumpSlug);
            const jumpAdvantages = upgradeAdvantages[jumpKey];
            if (!jumpPlan || !jumpAdvantages) return null;

            return (
              <Card className="border border-dashed border-foreground/10 bg-muted/20">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-blue-100 dark:from-violet-900 dark:to-blue-900">
                        <Crown className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                      </div>
                      <div>
                        <p className="font-medium text-sm sm:text-base">
                          Besoin de plus ? Découvrez le plan {jumpPlan.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {jumpPlan.creditsPerMonth.toLocaleString()} crédits/mois &bull; {jumpPlan.maxAgents} agents &bull; {jumpPlan.maxMembers} membres
                          {jumpSlug === "GROWTH" ? " &bull; Domaine personnalisé &bull; Support prioritaire" : " &bull; White Label &bull; BYOK"}
                        </p>
                      </div>
                    </div>
                    {hasSubscription ? (
                      <Button
                        variant="outline"
                        onClick={handleManageSubscription}
                        disabled={createPortal.isPending}
                        className="shrink-0 gap-1.5 w-full sm:w-auto"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                        Voir le {jumpPlan.name}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => handleSelectPlan(jumpPlan.slug)}
                        disabled={loadingPlan === jumpPlan.slug || createCheckout.isPending}
                        className="shrink-0 gap-1.5 w-full sm:w-auto"
                      >
                        {loadingPlan === jumpPlan.slug ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <ArrowRight className="h-3.5 w-3.5" />
                        )}
                        Découvrir le {jumpPlan.name}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })()
        )}

        {/* Credit History */}
        <Card>
          <CardHeader><CardTitle>Historique de consommation</CardTitle></CardHeader>
          <CardContent>
            {creditLogs.data?.items && creditLogs.data.items.length > 0 ? (
              <div className="space-y-2">
                {creditLogs.data.items.map((log) => (
                  <div key={log.id} className="flex items-center justify-between py-2.5 sm:py-3 border-b border-border/50 last:border-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 min-w-0">
                      <span className="text-xs text-muted-foreground w-auto sm:w-32 shrink-0">
                        {new Date(log.createdAt).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <Badge variant="secondary" className="w-fit">{actionLabels[log.action] ?? log.action}</Badge>
                    </div>
                    <span className="text-sm font-medium shrink-0 ml-2">-{log.credits}</span>
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
