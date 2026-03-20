"use client";

import { useEffect, useState } from "react";
import { TrendingUp, AlertCircle } from "lucide-react";

const barData = [35, 48, 42, 65, 58, 78, 72, 85, 68, 92, 88, 95];
const topQuestions = [
  { text: "Comment réinitialiser ?", count: 234 },
  { text: "Quels sont les tarifs ?", count: 189 },
  { text: "Comment intégrer l'API ?", count: 156 },
];
const gaps = [
  "Migration des données",
  "Webhooks avancés",
];

export function AnalyticsIllustration() {
  const [barHeights, setBarHeights] = useState(barData.map(() => 0));
  const [showKpis, setShowKpis] = useState(false);
  const [showGaps, setShowGaps] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowKpis(true), 400);
    const t2 = setTimeout(() => {
      setBarHeights(barData);
    }, 800);
    const t3 = setTimeout(() => setShowGaps(true), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[360px] rounded-2xl bg-gradient-to-br from-background via-background to-muted/30 overflow-hidden">
      <div className="absolute inset-4 flex flex-col">
        {/* KPI Row */}
        <div className="grid grid-cols-3 gap-2 pb-4 border-b border-border/40">
          {[
            { label: "Déflection", value: "76%", change: "+5%", up: true },
            { label: "Messages", value: "8.4K", change: "+18%", up: true },
            { label: "CSAT", value: "4.6", change: "+0.3", up: true },
          ].map((kpi, i) => (
            <div
              key={kpi.label}
              className={`rounded-lg bg-card shadow-apple p-2 text-center transition-all duration-500 ease-apple ${
                showKpis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <p className="text-[9px] text-muted-foreground">{kpi.label}</p>
              <p className="text-sm font-semibold mt-0.5">{kpi.value}</p>
              <span className="text-[9px] text-emerald-600 font-medium">{kpi.change}</span>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="flex-1 py-4">
          <div className="flex items-center gap-1.5 mb-3">
            <TrendingUp className="h-3 w-3 text-muted-foreground" strokeWidth={1.5} />
            <span className="text-[10px] text-muted-foreground font-medium">Activité — 12 dernières semaines</span>
          </div>
          <div className="flex items-end gap-[3px] h-20">
            {barHeights.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-foreground/10 transition-all duration-700 ease-apple"
                style={{
                  height: `${h}%`,
                  transitionDelay: `${i * 60}ms`,
                  background: h > 80
                    ? "hsl(var(--foreground) / 0.25)"
                    : "hsl(var(--foreground) / 0.1)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Bottom: questions + gaps */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border/40">
          {/* Top questions */}
          <div>
            <p className="text-[10px] text-muted-foreground font-medium mb-2">Top questions</p>
            <div className="space-y-1.5">
              {topQuestions.map((q) => (
                <div key={q.text} className="flex items-center justify-between">
                  <span className="text-[10px] text-foreground truncate pr-2">{q.text}</span>
                  <span className="text-[9px] text-muted-foreground font-mono shrink-0">{q.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Documentation gaps */}
          <div>
            <p className="text-[10px] text-muted-foreground font-medium mb-2">Gaps détectés</p>
            <div className="space-y-1.5">
              {gaps.map((gap, i) => (
                <div
                  key={gap}
                  className={`flex items-center gap-1.5 transition-all duration-500 ease-apple ${
                    showGaps ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                  }`}
                  style={{ transitionDelay: `${i * 150}ms` }}
                >
                  <AlertCircle className="h-3 w-3 text-amber-500 shrink-0" strokeWidth={2} />
                  <span className="text-[10px] text-foreground">{gap}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
