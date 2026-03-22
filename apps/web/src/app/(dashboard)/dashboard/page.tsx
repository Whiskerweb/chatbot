"use client";

import { Header } from "@/components/dashboard/header";
import { KPICard } from "@/components/dashboard/kpi-card";
import { CreditsBar } from "@/components/dashboard/credits-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Users, TrendingUp, UserPlus, Bot } from "lucide-react";
import Link from "next/link";
import { trpc } from "@/lib/trpc";

export default function DashboardPage() {
  const overview = trpc.analytics.overview.useQuery({ period: "30d" });
  const agents = trpc.agents.list.useQuery();
  const usage = trpc.billing.getUsage.useQuery();
  const topQuestions = trpc.analytics.topQuestions.useQuery({ limit: 5 });
  const gaps = trpc.analytics.unanswered.useQuery({ limit: 5 });

  const isLoading = overview.isLoading || agents.isLoading || usage.isLoading;

  return (
    <div>
      <Header title="Dashboard" description="Vue d'ensemble de votre chatbot" />
      <div className="p-4 md:p-8 space-y-6 md:space-y-8">
        {/* Credits Bar */}
        <CreditsBar
          used={usage.data?.creditsUsed ?? 0}
          total={usage.data?.creditsTotal ?? 100}
        />

        {/* KPI Cards */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Conversations"
            value={overview.data?.conversations.total ?? 0}
            change={overview.data?.conversations.vsPrevious}
            icon={MessageSquare}
            description="ce mois"
          />
          <KPICard
            title="Messages traités"
            value={overview.data?.messages.total ?? 0}
            change={overview.data?.messages.vsPrevious}
            icon={Users}
            description="ce mois"
          />
          <KPICard
            title="Taux de déflection"
            value={`${overview.data?.deflectionRate.value ?? 0}%`}
            change={overview.data?.deflectionRate.vsPrevious}
            icon={TrendingUp}
            description="conversations auto-résolues"
          />
          <KPICard
            title="Leads capturés"
            value={overview.data?.leadsCapture.total ?? 0}
            change={overview.data?.leadsCapture.vsPrevious}
            icon={UserPlus}
            description="ce mois"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top Questions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top 5 questions fréquentes</CardTitle>
            </CardHeader>
            <CardContent>
              {topQuestions.data && topQuestions.data.length > 0 ? (
                <div className="space-y-3">
                  {topQuestions.data.map((item, i) => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground w-6">{i + 1}.</span>
                        <span className="text-sm">{item.question}</span>
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">{item.count}x</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  Les questions fréquentes apparaîtront ici une fois que votre chatbot recevra des messages.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Gaps documentaires */}
          <Card className={gaps.data && gaps.data.length > 0 ? "border-orange-200 bg-orange-50/50" : ""}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                Questions sans réponse
                {gaps.data && gaps.data.length > 0 && <Badge variant="warning">Action requise</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {gaps.data && gaps.data.length > 0 ? (
                <div className="space-y-3">
                  {gaps.data.map((item, i) => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-orange-200 last:border-0">
                      <span className="text-sm">{item.question}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{item.count}x</span>
                        <Link href="/dashboard/agents" className="text-xs text-primary hover:underline">
                          Compléter
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  Aucun gap documentaire détecté. Votre documentation couvre bien les questions posées.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Active Agents */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Agents actifs</CardTitle>
          </CardHeader>
          <CardContent>
            {agents.data && agents.data.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {agents.data.map((agent) => (
                  <Link key={agent.id} href={`/dashboard/agents/${agent.id}`} className="block">
                    <div className="rounded-2xl shadow-apple p-5 hover:shadow-apple-hover hover:-translate-y-0.5 transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/60">
                          <Bot className="h-[18px] w-[18px] text-foreground" strokeWidth={1.5} />
                        </div>
                        <div>
                          <p className="font-medium">{agent.name}</p>
                          <div className="flex items-center gap-1">
                            <div className={`h-2 w-2 rounded-full ring-2 ring-white ${agent.isActive ? "bg-green-500" : "bg-gray-300"}`} />
                            <span className="text-xs text-muted-foreground">{agent.isActive ? "Actif" : "Inactif"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-between text-sm text-muted-foreground">
                        <span>{agent._count.conversations} conversations</span>
                        <span>{agent._count.sources} sources</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Bot className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-3 text-sm text-muted-foreground">Aucun agent créé</p>
                <Link href="/dashboard/agents" className="text-sm text-primary hover:underline">
                  Créer votre premier agent
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
