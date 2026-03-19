"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface CreditConsumptionChartProps {
  data: Array<{ date: string; credits: number }>;
  isLoading?: boolean;
}

export function CreditConsumptionChart({ data, isLoading }: CreditConsumptionChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>Consommation de crédits</CardTitle></CardHeader>
        <CardContent>
          <div className="h-[260px] animate-pulse bg-muted/40 rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  const formattedData = data.map(d => ({
    ...d,
    label: new Date(d.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
  }));

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Consommation de crédits</CardTitle>
      </CardHeader>
      <CardContent className="p-0 pb-4 pr-4">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCredits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              width={50}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                fontSize: "13px",
              }}
              formatter={(value: number) => [value, "Crédits"]}
            />
            <Area
              type="monotone"
              dataKey="credits"
              stroke="#f59e0b"
              strokeWidth={2.5}
              fill="url(#colorCredits)"
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
