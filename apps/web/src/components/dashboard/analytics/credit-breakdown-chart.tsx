"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const ACTION_LABELS: Record<string, string> = {
  MESSAGE_AI: "Messages IA",
  INDEXING: "Indexation",
  REINDEX: "Ré-indexation",
  SYNC: "Synchronisation",
  EXPORT: "Export",
  WEBHOOK: "Webhook",
  TRANSLATION: "Traduction",
  AI_SUGGESTION: "Suggestions IA",
};

const ACTION_COLORS: Record<string, string> = {
  MESSAGE_AI: "#0084ff",
  INDEXING: "#10b981",
  REINDEX: "#06b6d4",
  SYNC: "#8b5cf6",
  EXPORT: "#f59e0b",
  WEBHOOK: "#f97316",
  TRANSLATION: "#ec4899",
  AI_SUGGESTION: "#6366f1",
};

interface CreditBreakdownChartProps {
  data: Array<{ action: string; credits: number }>;
  isLoading?: boolean;
}

export function CreditBreakdownChart({ data, isLoading }: CreditBreakdownChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-base font-semibold">Ventilation des crédits</CardTitle></CardHeader>
        <CardContent>
          <div className="h-[260px] animate-pulse bg-muted/40 rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  const total = data.reduce((sum, d) => sum + d.credits, 0);
  const chartData = data
    .filter((d) => d.credits > 0)
    .map((d) => ({
      name: ACTION_LABELS[d.action] || d.action,
      value: d.credits,
      color: ACTION_COLORS[d.action] || "#6b7280",
    }))
    .sort((a, b) => b.value - a.value);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-base font-semibold">Ventilation des crédits</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-12">Pas encore de données.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Ventilation des crédits</CardTitle>
          <span className="text-sm text-muted-foreground">{total.toLocaleString("fr-FR")} crédits</span>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              animationDuration={800}
              animationEasing="ease-out"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                fontSize: "13px",
              }}
              formatter={(value: number, name: string) => [
                `${value.toLocaleString("fr-FR")} (${total > 0 ? Math.round((value / total) * 100) : 0}%)`,
                name,
              ]}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span style={{ color: "hsl(var(--foreground))", fontSize: "12px" }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
