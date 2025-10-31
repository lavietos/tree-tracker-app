import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Trophy, AlertTriangle } from "lucide-react";

interface DriversSectionProps {
  data: any;
  isLoading: boolean;
}

export function DriversSection({ data, isLoading }: DriversSectionProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-48 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const drivers = data?.drivers || { trophies: [], frustrations: [] };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Troféus (Q7) */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <CardTitle>Top Troféus</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">O que mais agradou (Q7)</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {drivers.trophies.slice(0, 10).map((item: any, index: number) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{item.label}</span>
                <span className="text-muted-foreground">{item.percentage}%</span>
              </div>
              <Progress value={item.percentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {item.count} de {item.total} respondentes
              </p>
            </div>
          ))}
          {drivers.trophies.length === 0 && (
            <p className="text-center text-muted-foreground py-8">Nenhum dado disponível</p>
          )}
        </CardContent>
      </Card>

      {/* Frustrações (Q8) */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <CardTitle>Top Frustrações</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">O que mais incomodou (Q8)</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {drivers.frustrations.slice(0, 10).map((item: any, index: number) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{item.label}</span>
                <span className="text-muted-foreground">{item.percentage}%</span>
              </div>
              <Progress value={item.percentage} className="h-2 bg-red-500/20" />
              <p className="text-xs text-muted-foreground">
                {item.count} de {item.total} respondentes
              </p>
            </div>
          ))}
          {drivers.frustrations.length === 0 && (
            <p className="text-center text-muted-foreground py-8">Nenhum dado disponível</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
