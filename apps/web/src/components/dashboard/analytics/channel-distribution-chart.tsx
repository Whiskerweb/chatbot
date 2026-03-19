"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const CHANNEL_LABELS: Record<string, string> = {
  WIDGET: "Widget",
  API: "API",
  SLACK: "Slack",
  WHATSAPP: "WhatsApp",
  TELEGRAM: "Telegram",
  DISCORD: "Discord",
};

const CHANNEL_COLORS: Record<string, string> = {
  WIDGET: "#0084ff",
  API: "#10b981",
  SLACK: "#e01e5a",
  WHATSAPP: "#25D366",
  TELEGRAM: "#0088cc",
  DISCORD: "#5865F2",
};

interface ChannelDistributionChartProps {
  data: Array<{ channel: string; count: number }>;
  isLoading?: boolean;
}

export function ChannelDistributionChart({ data, isLoading }: ChannelDistributionChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>Distribution par canal</CardTitle></CardHeader>
        <CardContent>
          <div className="h-[260px] animate-pulse bg-muted/40 rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  const total = data.reduce((sum, d) => sum + d.count, 0);
  const chartData = data.map(d => ({
    name: CHANNEL_LABELS[d.channel] || d.channel,
    value: d.count,
    color: CHANNEL_COLORS[d.channel] || "#6b7280",
    percentage: total > 0 ? Math.round((d.count / total) * 100) : 0,
  }));

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-base font-semibold">Distribution par canal</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-12">Pas encore de données.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Distribution par canal</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={95}
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
              formatter={(value: number, name: string) => [`${value} (${Math.round((value / total) * 100)}%)`, name]}
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
