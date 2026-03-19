"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { PremiumLockOverlay } from "./premium-lock-overlay";
import { Sparkles } from "lucide-react";

interface QuestionCategory {
  id: string;
  label: string;
  description?: string | null;
  count: number;
  color?: string | null;
}

interface QuestionCategoriesChartProps {
  data: QuestionCategory[];
  isLocked: boolean;
  isLoading?: boolean;
}

const PLACEHOLDER_DATA: QuestionCategory[] = [
  { id: "1", label: "Questions techniques", count: 45, color: "#0084ff" },
  { id: "2", label: "Tarification", count: 38, color: "#10b981" },
  { id: "3", label: "Gestion de compte", count: 29, color: "#f59e0b" },
  { id: "4", label: "Intégrations", count: 22, color: "#8b5cf6" },
  { id: "5", label: "Support général", count: 18, color: "#ef4444" },
  { id: "6", label: "Facturation", count: 14, color: "#06b6d4" },
  { id: "7", label: "Sécurité", count: 11, color: "#ec4899" },
];

export function QuestionCategoriesChart({ data, isLocked, isLoading }: QuestionCategoriesChartProps) {
  const displayData = isLocked ? PLACEHOLDER_DATA : data;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            Catégories IA des questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] animate-pulse bg-muted/40 rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden border-2 border-dashed border-border/50" style={isLocked ? {} : { borderStyle: 'solid', borderColor: 'hsl(var(--border))' }}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            Catégories IA des questions
          </CardTitle>
          {!isLocked && (
            <Badge variant="secondary" className="bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-0">
              IA
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className={isLocked ? "select-none" : ""}>
          {displayData.length > 0 ? (
            <div className="space-y-6">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={displayData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis
                    type="category"
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    width={140}
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
                    formatter={(value: number) => [`${value} questions`, "Total"]}
                    cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
                  />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]} animationDuration={1000}>
                    {displayData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || "#6b7280"} fillOpacity={0.85} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {!isLocked && displayData.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {displayData.map((cat) => (
                    <div key={cat.id} className="flex items-center gap-2 text-sm">
                      <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color || "#6b7280" }} />
                      <span className="text-muted-foreground truncate">{cat.label}</span>
                      <span className="font-medium ml-auto">{cat.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-12">
              Pas assez de données pour la catégorisation. Les catégories apparaîtront automatiquement.
            </p>
          )}
        </div>
      </CardContent>

      {isLocked && <PremiumLockOverlay />}
    </Card>
  );
}
