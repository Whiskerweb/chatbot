import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  description?: string;
  sparklineData?: number[];
}

export function KPICard({ title, value, change, icon: Icon, description, sparklineData }: KPICardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  const sparkData = sparklineData?.map((v, i) => ({ v, i }));

  return (
    <Card className="transition-all duration-200 ease-apple hover:shadow-apple-hover hover:-translate-y-0.5">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center justify-between">
          <p className="text-xs md:text-sm font-normal text-muted-foreground">{title}</p>
          <div className="flex h-7 w-7 md:h-9 md:w-9 items-center justify-center rounded-lg md:rounded-xl bg-muted/60">
            <Icon className="h-3.5 w-3.5 md:h-[18px] md:w-[18px] text-muted-foreground" strokeWidth={1.5} />
          </div>
        </div>
        <div className="mt-2 md:mt-3 flex items-baseline gap-2">
          <p className="text-2xl md:text-3xl font-light tracking-tight">{value}</p>
          {change !== undefined && change !== 0 && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium",
                isPositive && "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
                isNegative && "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400",
              )}
            >
              {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {Math.abs(change)}%
            </span>
          )}
        </div>
        {description && (
          <p className="mt-1.5 text-xs text-muted-foreground">{description}</p>
        )}
        {sparkData && sparkData.length > 1 && (
          <div className="mt-3 -mb-1">
            <ResponsiveContainer width="100%" height={32}>
              <LineChart data={sparkData}>
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke={isNegative ? "#ef4444" : "#10b981"}
                  strokeWidth={1.5}
                  dot={false}
                  animationDuration={800}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
