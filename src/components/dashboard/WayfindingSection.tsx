import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

interface WayfindingSectionProps {
  data: any;
  isLoading: boolean;
}

export function WayfindingSection({ data, isLoading }: WayfindingSectionProps) {
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

  const wayfinding = data?.wayfinding || { distribution: [], bySegment: [] };

  const chartColors = ["#22c55e", "#84cc16", "#eab308", "#f97316", "#ef4444"];

  const chartConfig = {
    value: {
      label: "Porcentagem",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <div className="space-y-4">
      {/* Distribuição Geral */}
      <Card>
        <CardHeader>
          <CardTitle>Wayfinding - Distribuição (Q6)</CardTitle>
          <p className="text-sm text-muted-foreground">
            1 = Extremamente fácil | 5 = Muito difícil
          </p>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wayfinding.distribution}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="label"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  label={{ value: "%", angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                  {wayfinding.distribution.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Net Ease por Segmento */}
      <Card>
        <CardHeader>
          <CardTitle>Net Ease por Segmento</CardTitle>
          <p className="text-sm text-muted-foreground">Facilidade de navegação por grupo</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Segmento</th>
                  <th className="text-right p-2 font-medium">% Fácil (1-2)</th>
                  <th className="text-right p-2 font-medium">% Difícil (4-5)</th>
                  <th className="text-right p-2 font-medium">Net Ease</th>
                  <th className="text-right p-2 font-medium">n</th>
                </tr>
              </thead>
              <tbody>
                {wayfinding.bySegment
                  .sort((a: any, b: any) => a.netEase - b.netEase)
                  .map((segment: any, index: number) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="p-2">{segment.name}</td>
                      <td className="text-right p-2 text-green-600 dark:text-green-400">
                        {segment.easy}%
                      </td>
                      <td className="text-right p-2 text-red-600 dark:text-red-400">
                        {segment.difficult}%
                      </td>
                      <td
                        className={`text-right p-2 font-semibold ${
                          segment.netEase >= 40
                            ? "text-green-600 dark:text-green-400"
                            : segment.netEase >= 0
                            ? "text-yellow-600 dark:text-yellow-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {segment.netEase}%
                      </td>
                      <td className="text-right p-2 text-muted-foreground">{segment.count}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
