import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DashboardFiltersProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
}

export function DashboardFilters({ filters, onFiltersChange }: DashboardFiltersProps) {
  const eventTypes = ["shows/festivais", "executivo", "futebol", "infantil", "tour"];
  const genders = ["Masculino", "Feminino", "Não-binário", "Prefiro não dizer"];
  const ageBands = ["18-24", "25-34", "35-44", "45-54", "55+"];
  const transportModes = ["Carro próprio", "Uber/Taxi", "Transporte público", "A pé", "Bicicleta"];

  const clearFilter = (filterName: string) => {
    onFiltersChange({ ...filters, [filterName]: null });
  };

  return (
    <Card className="p-4">
      <div className="flex flex-wrap gap-4">
        {/* Date Range */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateRange?.from ? (
                filters.dateRange.to ? (
                  <>
                    {format(filters.dateRange.from, "dd MMM yyyy", { locale: ptBR })} -{" "}
                    {format(filters.dateRange.to, "dd MMM yyyy", { locale: ptBR })}
                  </>
                ) : (
                  format(filters.dateRange.from, "dd MMM yyyy", { locale: ptBR })
                )
              ) : (
                <span>Selecione o período</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={filters.dateRange?.from}
              selected={filters.dateRange}
              onSelect={(range) => onFiltersChange({ ...filters, dateRange: range })}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        {/* Event Type */}
        <div className="flex gap-2">
          <Select
            value={filters.eventType || ""}
            onValueChange={(value) => onFiltersChange({ ...filters, eventType: value })}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Tipo de evento" />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filters.eventType && (
            <Button variant="ghost" size="icon" onClick={() => clearFilter("eventType")}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Gender */}
        <div className="flex gap-2">
          <Select value={filters.gender || ""} onValueChange={(value) => onFiltersChange({ ...filters, gender: value })}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Gênero" />
            </SelectTrigger>
            <SelectContent>
              {genders.map((gender) => (
                <SelectItem key={gender} value={gender}>
                  {gender}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filters.gender && (
            <Button variant="ghost" size="icon" onClick={() => clearFilter("gender")}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Age Band */}
        <div className="flex gap-2">
          <Select value={filters.ageBand || ""} onValueChange={(value) => onFiltersChange({ ...filters, ageBand: value })}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Faixa etária" />
            </SelectTrigger>
            <SelectContent>
              {ageBands.map((age) => (
                <SelectItem key={age} value={age}>
                  {age}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filters.ageBand && (
            <Button variant="ghost" size="icon" onClick={() => clearFilter("ageBand")}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Transport Mode */}
        <div className="flex gap-2">
          <Select
            value={filters.transportMode || ""}
            onValueChange={(value) => onFiltersChange({ ...filters, transportMode: value })}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Transporte" />
            </SelectTrigger>
            <SelectContent>
              {transportModes.map((mode) => (
                <SelectItem key={mode} value={mode}>
                  {mode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filters.transportMode && (
            <Button variant="ghost" size="icon" onClick={() => clearFilter("transportMode")}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
