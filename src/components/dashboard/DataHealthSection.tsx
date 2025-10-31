import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";

interface DataHealthSectionProps {
  data: any;
  isLoading: boolean;
}

export function DataHealthSection({ data, isLoading }: DataHealthSectionProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  const health = data?.health || {
    responseRate: 0,
    completeness: 0,
    delay: 0,
  };

  const getStatusIcon = (value: number, thresholdGood: number, thresholdBad: number, reverse = false) => {
    const isGood = reverse ? value <= thresholdGood : value >= thresholdGood;
    const isBad = reverse ? value >= thresholdBad : value <= thresholdBad;

    if (isGood) return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    if (isBad) return <XCircle className="h-5 w-5 text-red-500" />;
    return <AlertCircle className="h-5 w-5 text-yellow-500" />;
  };

  const getProgressColor = (value: number, thresholdGood: number, thresholdBad: number, reverse = false) => {
    const isGood = reverse ? value <= thresholdGood : value >= thresholdGood;
    const isBad = reverse ? value >= thresholdBad : value <= thresholdBad;

    if (isGood) return "bg-green-500";
    if (isBad) return "bg-red-500";
    return "bg-yellow-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saúde dos Dados</CardTitle>
        <p className="text-sm text-muted-foreground">Indicadores de qualidade da coleta</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Taxa de Resposta */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(health.responseRate, 20, 10)}
              <span className="font-medium">Taxa de Resposta</span>
            </div>
            <span className="text-2xl font-bold">{health.responseRate}%</span>
          </div>
          <Progress
            value={health.responseRate}
            className={`h-2 ${getProgressColor(health.responseRate, 20, 10)}`}
          />
          <p className="text-xs text-muted-foreground">Meta: ≥ 20%</p>
        </div>

        {/* Completude */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(health.completeness, 90, 70)}
              <span className="font-medium">Completude</span>
            </div>
            <span className="text-2xl font-bold">{health.completeness}%</span>
          </div>
          <Progress value={health.completeness} className={`h-2 ${getProgressColor(health.completeness, 90, 70)}`} />
          <p className="text-xs text-muted-foreground">Meta: ≥ 90% de respostas completas</p>
        </div>

        {/* Delay de Disparo */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(health.delay, 24, 48, true)}
              <span className="font-medium">Delay de Disparo</span>
            </div>
            <span className="text-2xl font-bold">{health.delay}h</span>
          </div>
          <Progress
            value={Math.min(100, (48 - health.delay) / 48 * 100)}
            className={`h-2 ${getProgressColor(health.delay, 24, 48, true)}`}
          />
          <p className="text-xs text-muted-foreground">Meta: 12-24h após evento</p>
        </div>
      </CardContent>
    </Card>
  );
}
