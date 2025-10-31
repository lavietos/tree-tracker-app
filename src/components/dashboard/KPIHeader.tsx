import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Info, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPIHeaderProps {
  data: any;
  isLoading: boolean;
}

export function KPIHeader({ data, isLoading }: KPIHeaderProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const { nps, netEase, vibePositive, responseRate, delayHours, sampleSize } = data?.kpis || {};

  const getTrendIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (value < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getColorClass = (value: number, thresholdGood: number, thresholdBad: number) => {
    if (value >= thresholdGood) return "text-green-600 dark:text-green-400";
    if (value <= thresholdBad) return "text-red-600 dark:text-red-400";
    return "text-yellow-600 dark:text-yellow-400";
  };

  return (
    <div className="space-y-2">
      {sampleSize < 100 && (
        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
          Amostra pequena (n = {sampleSize})
        </Badge>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* NPS Geral */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">NPS Geral</CardTitle>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <div className={`text-3xl font-bold ${getColorClass(nps?.value || 0, 50, 0)}`}>
                      {nps?.value || 0}
                    </div>
                    {nps?.trend !== undefined && getTrendIcon(nps.trend)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {nps?.promoters}% promotores · {nps?.detractors}% detratores
                  </p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="font-semibold">NPS = % Promotores (9-10) - % Detratores (0-6)</p>
              <p className="text-sm mt-1">Mede a probabilidade de recomendação</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Net Ease */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">Net Ease (Wayfinding)</CardTitle>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <div className={`text-3xl font-bold ${getColorClass(netEase?.value || 0, 40, 0)}`}>
                      {netEase?.value || 0}%
                    </div>
                    {netEase?.trend !== undefined && getTrendIcon(netEase.trend)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {netEase?.easy}% fácil · {netEase?.difficult}% difícil
                  </p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="font-semibold">Net Ease = % Fácil (1-2) - % Difícil (4-5)</p>
              <p className="text-sm mt-1">Facilidade de navegação no local</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Vibe/Intenção */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">Vibe Positiva</CardTitle>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <div className={`text-3xl font-bold ${getColorClass(vibePositive?.value || 0, 70, 40)}`}>
                      {vibePositive?.value || 0}%
                    </div>
                    {vibePositive?.trend !== undefined && getTrendIcon(vibePositive.trend)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Intenção de retorno</p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="font-semibold">% "Já comprei" + "Voltarei"</p>
              <p className="text-sm mt-1">Questão 9 - Intenção de retorno</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Taxa de Resposta */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">Taxa de Resposta</CardTitle>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <div className={`text-3xl font-bold ${getColorClass(responseRate?.value || 0, 20, 10)}`}>
                      {responseRate?.value || 0}%
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {responseRate?.responses || 0} / {responseRate?.invites || 0} convites
                  </p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="font-semibold">responses_total / invites_sent × 100</p>
              <p className="text-sm mt-1">Meta: ≥ 20%</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Delay de Disparo */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">Delay Disparo</CardTitle>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <div className={`text-3xl font-bold ${getColorClass(24 - (delayHours?.value || 24), 12, 0)}`}>
                      {delayHours?.value || 0}h
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Tempo até envio</p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="font-semibold">sent_delay_hours</p>
              <p className="text-sm mt-1">Meta: 12-24h após evento</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
