"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Cpu } from "lucide-react";

const MODEL_LABELS: Record<string, string> = {
  GPT4O_MINI: "GPT-4o Mini",
  GPT4O: "GPT-4o",
  CLAUDE_HAIKU: "Claude Haiku",
  CLAUDE_SONNET: "Claude Sonnet",
  CLAUDE_OPUS: "Claude Opus",
  GEMINI_FLASH: "Gemini Flash",
  GEMINI_PRO: "Gemini Pro",
  GROK: "Grok",
};

const MODEL_COLORS: Record<string, string> = {
  GPT4O_MINI: "#10a37f",
  GPT4O: "#10a37f",
  CLAUDE_HAIKU: "#d97706",
  CLAUDE_SONNET: "#d97706",
  CLAUDE_OPUS: "#d97706",
  GEMINI_FLASH: "#4285f4",
  GEMINI_PRO: "#4285f4",
  GROK: "#8b5cf6",
};

interface ModelUsageData {
  model: string;
  count: number;
  avgLatencyMs: number;
  avgTokens: number;
  totalCredits: number;
}

interface ModelUsageChartProps {
  data: ModelUsageData[];
  isLoading?: boolean;
}

export function ModelUsageChart({ data, isLoading }: ModelUsageChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Cpu className="h-4 w-4 text-muted-foreground" />
            Utilisation par modèle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] animate-pulse bg-muted/40 rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Cpu className="h-4 w-4 text-muted-foreground" />
            Utilisation par modèle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-12">
            Pas encore de données.
          </p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    label: MODEL_LABELS[d.model] || d.model,
    color: MODEL_COLORS[d.model] || "#6b7280",
  }));

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Cpu className="h-4 w-4 text-muted-foreground" />
          Utilisation par modèle
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={Math.max(200, chartData.length * 48)}>
          <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              type="category"
              dataKey="label"
              axisLine={false}
              tickLine={false}
              width={120}
              tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                fontSize: "13px",
              }}
              formatter={(_value: number, _name: string, props: any) => {
                const item = props.payload;
                return [
                  `${item.count} messages · ${item.avgLatencyMs}ms · ${item.avgTokens} tokens/msg · ${item.totalCredits} crédits`,
                  item.label,
                ];
              }}
              cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
            />
            <Bar dataKey="count" radius={[0, 6, 6, 0]} animationDuration={800}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Stats table below */}
        <div className="mt-4 border-t border-border/50 pt-4">
          <div className="grid gap-2">
            {chartData.map((item) => (
              <div key={item.model} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.label}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{item.avgLatencyMs}ms</span>
                  <span>{item.avgTokens} tok</span>
                  <span className="font-medium text-foreground">{item.count} msg</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
