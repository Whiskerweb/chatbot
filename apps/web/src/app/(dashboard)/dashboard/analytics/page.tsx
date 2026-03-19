"use client";

import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KPICard } from "@/components/dashboard/kpi-card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Users, TrendingUp, Clock, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("30d");

  const overview = trpc.analytics.overview.useQuery({ period });
  const topQuestions = trpc.analytics.topQuestions.useQuery({ limit: 20 });
  const gaps = trpc.analytics.unanswered.useQuery({ limit: 20 });
  const creditLogs = trpc.analytics.credits.useQuery({ period });

  if (overview.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Aggregate credit logs by day for a simple chart representation
  const creditsByDay = new Map<string, number>();
  creditLogs.data?.forEach((log) => {
    const day = new Date(log.createdAt).toLocaleDateString("fr-FR");
    creditsByDay.set(day, (creditsByDay.get(day) ?? 0) + log.credits);
  });

  return (
    <div>
      <Header title="Analytics" description="Performances de vos chatbots" />
      <div className="p-8 space-y-8">
        {/* Period selector */}
        <div className="flex justify-end">
          <Select value={period} onValueChange={(v) => setPeriod(v as any)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 jours</SelectItem>
              <SelectItem value="30d">30 jours</SelectItem>
              <SelectItem value="90d">90 jours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Conversations"
            value={overview.data?.conversations.total ?? 0}
            change={overview.data?.conversations.vsPrevious}
            icon={MessageSquare}
          />
          <KPICard
            title="Messages"
            value={overview.data?.messages.total ?? 0}
            change={overview.data?.messages.vsPrevious}
            icon={Users}
          />
          <KPICard
            title="Déflection"
            value={`${overview.data?.deflectionRate.value ?? 0}%`}
            change={overview.data?.deflectionRate.vsPrevious}
            icon={TrendingUp}
          />
          <KPICard
            title="Crédits utilisés"
            value={overview.data?.creditsUsed.total ?? 0}
            icon={Clock}
            description={`${overview.data?.creditsUsed.remaining ?? 0} restants`}
          />
        </div>

        {/* Credit consumption by day */}
        {creditsByDay.size > 0 && (
          <Card>
            <CardHeader><CardTitle>Consommation de crédits par jour</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Array.from(creditsByDay.entries()).slice(-14).map(([day, credits]) => (
                  <div key={day} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-20">{day}</span>
                    <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-foreground rounded-full"
                        style={{
                          width: `${Math.min(100, (credits / Math.max(1, ...Array.from(creditsByDay.values()))) * 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium w-12 text-right">{credits}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top Questions */}
          <Card>
            <CardHeader><CardTitle>Top questions fréquentes</CardTitle></CardHeader>
            <CardContent>
              {topQuestions.data && topQuestions.data.length > 0 ? (
                <div className="space-y-2">
                  {topQuestions.data.map((q, i) => (
                    <div key={q.id} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground w-8">{i + 1}.</span>
                        <span className="text-sm">{q.question}</span>
                      </div>
                      <Badge variant="secondary">{q.count}x</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Pas encore de données.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Gaps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Questions sans réponse
                {gaps.data && gaps.data.length > 0 && <Badge variant="warning">{gaps.data.length}</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {gaps.data && gaps.data.length > 0 ? (
                <div className="space-y-2">
                  {gaps.data.map((q, i) => (
                    <div key={q.id} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                      <span className="text-sm">{q.question}</span>
                      <Badge variant="destructive">{q.count}x</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Aucun gap documentaire détecté.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
