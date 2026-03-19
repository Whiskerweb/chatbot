import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KPICard } from "@/components/dashboard/kpi-card";
import { MessageSquare, Users, TrendingUp, Clock } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div>
      <Header title="Analytics" description="Performances de vos chatbots" />
      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KPICard title="Conversations" value="342" change={15} icon={MessageSquare} />
          <KPICard title="Messages" value="2,148" change={22} icon={Users} />
          <KPICard title="Déflection" value="73%" change={5} icon={TrendingUp} />
          <KPICard title="Temps de réponse" value="1.2s" change={-8} icon={Clock} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Conversations par jour</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
              Graphique Recharts — à connecter aux données réelles
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Consommation de crédits</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
              Graphique Recharts — à connecter aux données réelles
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Top 20 questions fréquentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-8">{i + 1}.</span>
                    <span className="text-sm">Question fréquente #{i + 1}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{Math.floor(Math.random() * 50 + 10)}x</Badge>
                    <span className="text-sm text-green-600">{Math.floor(Math.random() * 30 + 70)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
