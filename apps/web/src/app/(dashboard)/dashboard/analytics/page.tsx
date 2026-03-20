"use client";

import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KPICard } from "@/components/dashboard/kpi-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageSquare,
  Users,
  TrendingUp,
  Zap,
  Loader2,
  AlertTriangle,
  UserPlus,
  Timer,
  ThumbsUp,
  Hash,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { isFeatureAvailable } from "@chatbot/shared";
import dynamic from "next/dynamic";

// Dynamic imports for recharts components (client-only)
const ConversationsTrendChart = dynamic(
  () => import("@/components/dashboard/analytics/conversations-trend-chart").then((m) => m.ConversationsTrendChart),
  { ssr: false }
);
const CreditConsumptionChart = dynamic(
  () => import("@/components/dashboard/analytics/credit-consumption-chart").then((m) => m.CreditConsumptionChart),
  { ssr: false }
);
const ChannelDistributionChart = dynamic(
  () => import("@/components/dashboard/analytics/channel-distribution-chart").then((m) => m.ChannelDistributionChart),
  { ssr: false }
);
const QuestionCategoriesChart = dynamic(
  () => import("@/components/dashboard/analytics/question-categories-chart").then((m) => m.QuestionCategoriesChart),
  { ssr: false }
);
const SatisfactionChart = dynamic(
  () => import("@/components/dashboard/analytics/satisfaction-chart").then((m) => m.SatisfactionChart),
  { ssr: false }
);
const CreditBreakdownChart = dynamic(
  () => import("@/components/dashboard/analytics/credit-breakdown-chart").then((m) => m.CreditBreakdownChart),
  { ssr: false }
);


export default function AnalyticsPage() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("30d");
  const [agentId, setAgentId] = useState<string | undefined>(undefined);

  // Agent list for filter
  const agentsList = trpc.agents.list.useQuery();

  // All analytics queries with agentId filter
  const overview = trpc.analytics.overview.useQuery({ period, agentId });
  const topQuestions = trpc.analytics.topQuestions.useQuery({ limit: 20, agentId });
  const gaps = trpc.analytics.unanswered.useQuery({ limit: 20, agentId });
  const creditLogs = trpc.analytics.credits.useQuery({ period, agentId });
  const trend = trpc.analytics.conversationsTrend.useQuery({ period, agentId });
  const channels = trpc.analytics.channelDistribution.useQuery({ period, agentId });
  const satisfaction = trpc.analytics.satisfactionStats.useQuery({ period, agentId });
  const creditBreakdown = trpc.analytics.creditBreakdown.useQuery({ period, agentId });
  const performance = trpc.analytics.messagePerformance.useQuery({ period, agentId });

  const plan = overview.data?.plan ?? "FREE";
  const hasAiAnalytics = isFeatureAvailable(plan, "aiAnalytics");

  const categories = trpc.analytics.questionCategories.useQuery(
    { agentId },
    { enabled: hasAiAnalytics, retry: false }
  );

  if (overview.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Aggregate credit logs by day for the chart
  const creditsByDay = new Map<string, number>();
  creditLogs.data?.forEach((log) => {
    const day = new Date(log.createdAt).toISOString().split("T")[0];
    creditsByDay.set(day, (creditsByDay.get(day) ?? 0) + log.credits);
  });
  const creditsChartData = Array.from(creditsByDay.entries()).map(
    ([date, credits]) => ({ date, credits })
  );

  // Build sparkline data from trend
  const conversationSparkline = trend.data?.map((d) => d.count);
  const creditSparkline = creditsChartData.map((d) => d.credits);

  return (
    <div>
      <Header title="Analytics" description="Performances de vos chatbots" />

      <div className="p-8 space-y-8">
        {/* Filters row */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {agentsList.data && agentsList.data.length > 1 && (
              <Select
                value={agentId ?? "all"}
                onValueChange={(v) => setAgentId(v === "all" ? undefined : v)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Tous les agents" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les agents</SelectItem>
                  {agentsList.data.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <p className="text-sm text-muted-foreground hidden md:block">
              {agentId
                ? `Agent : ${agentsList.data?.find((a) => a.id === agentId)?.name}`
                : "Vue d\u2019ensemble de tous vos agents"}
            </p>
          </div>
          <Select
            value={period}
            onValueChange={(v) => setPeriod(v as "7d" | "30d" | "90d")}
          >
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 jours</SelectItem>
              <SelectItem value="30d">30 jours</SelectItem>
              <SelectItem value="90d">90 jours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* KPI Cards - 5 cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          <KPICard
            title="Conversations"
            value={overview.data?.conversations.total ?? 0}
            change={overview.data?.conversations.vsPrevious}
            icon={MessageSquare}
            sparklineData={conversationSparkline}
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
            description="Résolues sans escalade"
          />
          <KPICard
            title="Crédits"
            value={overview.data?.creditsUsed.total ?? 0}
            icon={Zap}
            description={`${overview.data?.creditsUsed.remaining ?? 0} restants`}
            sparklineData={creditSparkline.length > 1 ? creditSparkline : undefined}
          />
          <KPICard
            title="Leads capturés"
            value={overview.data?.leadsCapture.total ?? 0}
            change={overview.data?.leadsCapture.vsPrevious}
            icon={UserPlus}
          />
        </div>

        {/* Performance metrics row */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="transition-all duration-200 ease-apple hover:shadow-apple-hover hover:-translate-y-0.5">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950">
                  <Timer className="h-5 w-5 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Latence moyenne</p>
                  <p className="text-xl font-light tracking-tight">
                    {performance.data?.avgLatencyMs
                      ? `${(performance.data.avgLatencyMs / 1000).toFixed(1)}s`
                      : "—"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="transition-all duration-200 ease-apple hover:shadow-apple-hover hover:-translate-y-0.5">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950">
                  <ThumbsUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Feedback positif</p>
                  <p className="text-xl font-light tracking-tight">
                    {performance.data?.feedbackTotal
                      ? `${performance.data.feedbackPositiveRate}%`
                      : "—"}
                  </p>
                  {performance.data?.feedbackTotal ? (
                    <p className="text-xs text-muted-foreground">{performance.data.feedbackTotal} avis</p>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="transition-all duration-200 ease-apple hover:shadow-apple-hover hover:-translate-y-0.5">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-950">
                  <Hash className="h-5 w-5 text-violet-600 dark:text-violet-400" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tokens moy. / réponse</p>
                  <p className="text-xl font-light tracking-tight">
                    {performance.data?.avgTokensOutput
                      ? performance.data.avgTokensOutput.toLocaleString("fr-FR")
                      : "—"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conversations Trend - full width */}
        <ConversationsTrendChart
          data={trend.data ?? []}
          isLoading={trend.isLoading}
        />

        {/* Two-column: Credit Consumption + Credit Breakdown */}
        <div className="grid gap-6 lg:grid-cols-2">
          <CreditConsumptionChart
            data={creditsChartData}
            isLoading={creditLogs.isLoading}
          />
          <CreditBreakdownChart
            data={creditBreakdown.data ?? []}
            isLoading={creditBreakdown.isLoading}
          />
        </div>

        {/* Channel Distribution + Satisfaction */}
        <div className="grid gap-6 lg:grid-cols-2">
          <ChannelDistributionChart
            data={channels.data ?? []}
            isLoading={channels.isLoading}
          />
          <SatisfactionChart
            average={satisfaction.data?.average ?? 0}
            total={satisfaction.data?.total ?? 0}
            distribution={satisfaction.data?.distribution ?? []}
            isLoading={satisfaction.isLoading}
          />
        </div>

        {/* AI Question Categories - Premium gated */}
        <QuestionCategoriesChart
          data={categories.data ?? []}
          isLocked={!hasAiAnalytics}
          isLoading={hasAiAnalytics && categories.isLoading}
        />

        {/* Two-column: Top Questions + Gaps */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top Questions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Top questions fréquentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topQuestions.data && topQuestions.data.length > 0 ? (
                <div className="space-y-0 max-h-[500px] overflow-y-auto">
                  {topQuestions.data.map((q, i) => (
                    <div
                      key={q.id}
                      className="flex items-center justify-between py-3 border-b border-border/50 last:border-0"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className="text-xs font-medium text-muted-foreground w-6 shrink-0 text-right">
                          {i + 1}.
                        </span>
                        <span className="text-sm truncate">{q.question}</span>
                      </div>
                      <Badge variant="secondary" className="ml-3 shrink-0 tabular-nums">
                        {q.count}x
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-12">
                  Pas encore de données.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Gaps */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Questions sans réponse
                {gaps.data && gaps.data.length > 0 && (
                  <Badge variant="warning" className="ml-1">
                    {gaps.data.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {gaps.data && gaps.data.length > 0 ? (
                <div className="space-y-0 max-h-[500px] overflow-y-auto">
                  {gaps.data.map((q, i) => (
                    <div
                      key={q.id}
                      className="flex items-center justify-between py-3 border-b border-border/50 last:border-0"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className="text-xs font-medium text-muted-foreground w-6 shrink-0 text-right">
                          {i + 1}.
                        </span>
                        <span className="text-sm truncate">{q.question}</span>
                      </div>
                      <Badge variant="destructive" className="ml-3 shrink-0 tabular-nums">
                        {q.count}x
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-12">
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
