import { Header } from "@/components/dashboard/header";
import { KPICard } from "@/components/dashboard/kpi-card";
import { CreditsBar } from "@/components/dashboard/credits-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Users, TrendingUp, UserPlus, Bot } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div>
      <Header title="Dashboard" description="Vue d'ensemble de votre chatbot" />
      <div className="p-6 space-y-6">
        {/* Credits Bar */}
        <CreditsBar used={45} total={100} />

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KPICard title="Conversations" value="128" change={12} icon={MessageSquare} description="ce mois" />
          <KPICard title="Messages traités" value="1,024" change={8} icon={Users} description="ce mois" />
          <KPICard title="Taux de déflection" value="73%" change={5} icon={TrendingUp} description="conversations auto-résolues" />
          <KPICard title="Leads capturés" value="24" change={-3} icon={UserPlus} description="ce mois" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top Questions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top 5 questions fréquentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { q: "Comment réinitialiser mon mot de passe ?", count: 45, answered: true },
                  { q: "Quels sont vos tarifs ?", count: 38, answered: true },
                  { q: "Comment contacter le support ?", count: 29, answered: true },
                  { q: "Proposez-vous une API ?", count: 22, answered: false },
                  { q: "Comment annuler mon abonnement ?", count: 18, answered: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground w-6">{i + 1}.</span>
                      <span className="text-sm">{item.q}</span>
                      {!item.answered && <Badge variant="warning">Sans réponse</Badge>}
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">{item.count}x</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Gaps documentaires */}
          <Card className="border-orange-200 bg-orange-50/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                Questions sans réponse
                <Badge variant="warning">Action requise</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { q: "Proposez-vous une API ?", count: 22 },
                  { q: "Intégration avec Salesforce ?", count: 15 },
                  { q: "RGPD et données personnelles ?", count: 12 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-orange-200 last:border-0">
                    <span className="text-sm">{item.q}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{item.count}x</span>
                      <Link href="/dashboard/agents" className="text-xs text-primary hover:underline">
                        Compléter
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Agents */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Agents actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                { name: "Support Client", status: true, conversations: 12, credits: 34 },
                { name: "FAQ Produit", status: true, conversations: 8, credits: 11 },
              ].map((agent, i) => (
                <Link key={i} href="/dashboard/agents" className="block">
                  <div className="rounded-lg border p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{agent.name}</p>
                        <div className="flex items-center gap-1">
                          <div className={`h-2 w-2 rounded-full ${agent.status ? "bg-green-500" : "bg-gray-300"}`} />
                          <span className="text-xs text-muted-foreground">{agent.status ? "Actif" : "Inactif"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-between text-sm text-muted-foreground">
                      <span>{agent.conversations} conversations</span>
                      <span>{agent.credits} crédits</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
