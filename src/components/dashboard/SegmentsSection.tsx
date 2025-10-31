import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

interface SegmentsSectionProps {
  data: any;
  isLoading: boolean;
}

export function SegmentsSection({ data, isLoading }: SegmentsSectionProps) {
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

  const segments = data?.segments || {
    byEventType: [],
    byGender: [],
    byAge: [],
    byTransport: [],
  };

  const chartConfig = {
    nps: {
      label: "NPS",
      color: "hsl(var(--primary))",
    },
    netEase: {
      label: "Net Ease",
      color: "hsl(var(--secondary))",
    },
  };

  const renderChart = (data: any[], dataKey: "nps" | "netEase", title: string) => {
    const getColor = (value: number) => {
      if (dataKey === "nps") {
        if (value >= 50) return "#22c55e";
        if (value >= 0) return "#eab308";
        return "#ef4444";
      } else {
        if (value >= 40) return "#22c55e";
        if (value >= 0) return "#eab308";
        return "#ef4444";
      }
    };

    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium">{title}</h4>
        <ChartContainer config={chartConfig} className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis type="number" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Bar dataKey={dataKey} radius={[0, 4, 4, 0]}>
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry[dataKey])} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise por Segmentos</CardTitle>
        <p className="text-sm text-muted-foreground">NPS e Net Ease por diferentes dimensões</p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="eventType" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="eventType">Tipo de Evento</TabsTrigger>
            <TabsTrigger value="gender">Gênero</TabsTrigger>
            <TabsTrigger value="age">Idade</TabsTrigger>
            <TabsTrigger value="transport">Transporte</TabsTrigger>
          </TabsList>

          <TabsContent value="eventType" className="space-y-4">
            {renderChart(segments.byEventType, "nps", "NPS por Tipo de Evento")}
            {renderChart(segments.byEventType, "netEase", "Net Ease por Tipo de Evento")}
          </TabsContent>

          <TabsContent value="gender" className="space-y-4">
            {renderChart(segments.byGender, "nps", "NPS por Gênero")}
            {renderChart(segments.byGender, "netEase", "Net Ease por Gênero")}
          </TabsContent>

          <TabsContent value="age" className="space-y-4">
            {renderChart(segments.byAge, "nps", "NPS por Faixa Etária")}
            {renderChart(segments.byAge, "netEase", "Net Ease por Faixa Etária")}
          </TabsContent>

          <TabsContent value="transport" className="space-y-4">
            {renderChart(segments.byTransport, "nps", "NPS por Transporte")}
            {renderChart(segments.byTransport, "netEase", "Net Ease por Transporte")}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
