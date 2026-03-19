import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  description?: string;
}

export function KPICard({ title, value, change, icon: Icon, description }: KPICardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <Card className="transition-all duration-200 ease-apple hover:shadow-apple-hover hover:-translate-y-0.5">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-normal text-muted-foreground">{title}</p>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted/60">
            <Icon className="h-[18px] w-[18px] text-muted-foreground" strokeWidth={1.5} />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <p className="text-3xl font-light tracking-tight">{value}</p>
          {change !== undefined && change !== 0 && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium",
                isPositive && "bg-emerald-50 text-emerald-600",
                isNegative && "bg-red-50 text-red-600",
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
      </CardContent>
    </Card>
  );
}
