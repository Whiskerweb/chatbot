"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Star } from "lucide-react";

const RATING_COLORS = ["#ef4444", "#f97316", "#f59e0b", "#84cc16", "#10b981"];
const RATING_LABELS = ["1 \u2605", "2 \u2605", "3 \u2605", "4 \u2605", "5 \u2605"];

interface SatisfactionChartProps {
  average: number;
  total: number;
  distribution: Array<{ rating: number; count: number }>;
  isLoading?: boolean;
}

export function SatisfactionChart({ average, total, distribution, isLoading }: SatisfactionChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>Satisfaction</CardTitle></CardHeader>
        <CardContent>
          <div className="h-[260px] animate-pulse bg-muted/40 rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  // Build full distribution (1-5)
  const chartData = [1, 2, 3, 4, 5].map(r => ({
    rating: RATING_LABELS[r - 1],
    count: distribution.find(d => d.rating === r)?.count ?? 0,
    color: RATING_COLORS[r - 1],
  }));

  if (total === 0) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-base font-semibold">Satisfaction</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-12">
            Aucune note reçue pour le moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Satisfaction</CardTitle>
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-2xl font-light tracking-tight">{average.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">/ 5 ({total} avis)</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 pb-4 pr-4">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="rating"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              width={30}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                fontSize: "13px",
              }}
              formatter={(value: number) => [`${value} avis`, "Total"]}
              cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} animationDuration={800}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
