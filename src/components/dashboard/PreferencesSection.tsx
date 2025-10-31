import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PreferencesSectionProps {
  data: any;
  isLoading: boolean;
}

export function PreferencesSection({ data, isLoading }: PreferencesSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    );
  }

  const preferences = data?.preferences || [];

  const filteredPreferences = preferences
    .filter((pref: any) => pref.label.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, 20);

  const maxCount = Math.max(...preferences.map((p: any) => p.count));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferências e Programação (Q10)</CardTitle>
        <p className="text-sm text-muted-foreground">Top 20 preferências dos participantes</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar preferências..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Word Cloud Style List */}
        <div className="flex flex-wrap gap-2 min-h-[200px]">
          {filteredPreferences.map((pref: any, index: number) => {
            const size = Math.max(12, Math.min(32, (pref.count / maxCount) * 32));
            const opacity = Math.max(0.5, pref.count / maxCount);

            return (
              <Badge
                key={index}
                variant="secondary"
                className="transition-all hover:scale-110"
                style={{
                  fontSize: `${size}px`,
                  opacity: opacity,
                  padding: `${size / 4}px ${size / 2}px`,
                }}
              >
                {pref.label} ({pref.count})
              </Badge>
            );
          })}
          {filteredPreferences.length === 0 && (
            <p className="text-center text-muted-foreground w-full py-8">
              {searchTerm ? "Nenhuma preferência encontrada" : "Nenhum dado disponível"}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
