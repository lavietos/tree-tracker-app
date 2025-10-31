import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface NPSVibeMatrixProps {
  data: any;
  isLoading: boolean;
}

export function NPSVibeMatrix({ data, isLoading }: NPSVibeMatrixProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  const matrix = data?.matrix || {
    highVibeHighNPS: { percentage: 0, count: 0 },
    highVibeLowNPS: { percentage: 0, count: 0 },
    lowVibeHighNPS: { percentage: 0, count: 0 },
    lowVibeLowNPS: { percentage: 0, count: 0 },
  };

  const getQuadrantColor = (key: string) => {
    switch (key) {
      case "highVibeHighNPS":
        return "bg-green-500/20 border-green-500 hover:bg-green-500/30";
      case "highVibeLowNPS":
        return "bg-yellow-500/20 border-yellow-500 hover:bg-yellow-500/30";
      case "lowVibeHighNPS":
        return "bg-blue-500/20 border-blue-500 hover:bg-blue-500/30";
      case "lowVibeLowNPS":
        return "bg-red-500/20 border-red-500 hover:bg-red-500/30";
      default:
        return "";
    }
  };

  const getQuadrantLabel = (key: string) => {
    switch (key) {
      case "highVibeHighNPS":
        return "Alta Vibe × Alto NPS";
      case "highVibeLowNPS":
        return "Alta Vibe × Baixo NPS";
      case "lowVibeHighNPS":
        return "Baixa Vibe × Alto NPS";
      case "lowVibeLowNPS":
        return "Baixa Vibe × Baixo NPS";
      default:
        return "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Matriz NPS × Vibe</CardTitle>
        <p className="text-sm text-muted-foreground">Distribuição de experiência por quadrante</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(matrix).map(([key, value]: [string, any]) => (
            <Card
              key={key}
              className={`cursor-pointer transition-all ${getQuadrantColor(key)} border-2`}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{getQuadrantLabel(key)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">{value.percentage}%</span>
                  <Badge variant="secondary">n = {value.count}</Badge>
                </div>
                {value.count < 100 && (
                  <Badge variant="outline" className="mt-2 bg-yellow-500/10">
                    Amostra pequena
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
