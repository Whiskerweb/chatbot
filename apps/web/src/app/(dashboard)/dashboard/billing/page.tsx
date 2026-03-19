import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditsBar } from "@/components/dashboard/credits-bar";
import { Check } from "lucide-react";

const plans = [
  { name: "Free", price: 0, credits: 100, current: true },
  { name: "Starter", price: 29, credits: 3000, current: false },
  { name: "Pro", price: 79, credits: 15000, current: false, popular: true },
  { name: "Growth", price: 199, credits: 50000, current: false },
  { name: "Business", price: 399, credits: 200000, current: false },
];

export default function BillingPage() {
  return (
    <div>
      <Header title="Billing" description="Gérez votre abonnement et vos crédits" />
      <div className="p-6 space-y-6">
        <CreditsBar used={45} total={100} />

        {/* Current Plan */}
        <Card>
          <CardHeader>
            <CardTitle>Plan actuel</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">Free</p>
              <p className="text-sm text-muted-foreground">100 crédits/mois &bull; 1 agent &bull; 30 sources</p>
            </div>
            <Button>Changer de plan</Button>
          </CardContent>
        </Card>

        {/* Plan comparison */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {plans.map((plan) => (
            <Card key={plan.name} className={plan.popular ? "border-primary shadow-md" : plan.current ? "border-green-500" : ""}>
              <CardContent className="p-6 text-center">
                {plan.popular && <Badge className="mb-2">Populaire</Badge>}
                {plan.current && <Badge variant="success" className="mb-2">Actuel</Badge>}
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold">{plan.price}$</span>
                  <span className="text-muted-foreground">/mois</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {plan.credits.toLocaleString()} crédits/mois
                </p>
                <Button className="mt-4 w-full" variant={plan.current ? "outline" : "default"} disabled={plan.current}>
                  {plan.current ? "Plan actuel" : "Sélectionner"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Credit History */}
        <Card>
          <CardHeader>
            <CardTitle>Historique de consommation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { date: "19 mars 14:30", action: "MESSAGE_AI", agent: "Support Client", credits: 1, model: "GPT-4o Mini" },
                { date: "19 mars 14:28", action: "MESSAGE_AI", agent: "Support Client", credits: 1, model: "GPT-4o Mini" },
                { date: "19 mars 12:00", action: "INDEXING", agent: "FAQ Produit", credits: 2, model: "—" },
                { date: "18 mars 16:45", action: "MESSAGE_AI", agent: "Support Client", credits: 3, model: "GPT-4o" },
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-32">{log.date}</span>
                    <Badge variant="secondary">{log.action}</Badge>
                    <span className="text-sm">{log.agent}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{log.model}</span>
                    <span className="text-sm font-medium">-{log.credits}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
