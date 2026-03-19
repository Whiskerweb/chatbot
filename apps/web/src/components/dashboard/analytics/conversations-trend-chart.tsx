"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface ConversationsTrendChartProps {
  data: Array<{ date: string; count: number }>;
  isLoading?: boolean;
}

export function ConversationsTrendChart({ data, isLoading }: ConversationsTrendChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>Tendance des conversations</CardTitle></CardHeader>
        <CardContent>
          <div className="h-[300px] animate-pulse bg-muted/40 rounded-xl" />
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
        <CardTitle className="text-base font-semibold">Tendance des conversations</CardTitle>
      </CardHeader>
      <CardContent className="p-0 pb-4 pr-4">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorConversations" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0084ff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0084ff" stopOpacity={0} />
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
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                fontSize: "13px",
              }}
              labelStyle={{ color: "hsl(var(--muted-foreground))", marginBottom: 4 }}
              formatter={(value: number) => [value, "Conversations"]}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#0084ff"
              strokeWidth={2.5}
              fill="url(#colorConversations)"
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
