import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { calculateKPIs, calculateMatrix, calculateDrivers, calculateWayfinding, calculateSegments, calculatePreferences, calculateHealth } from "@/lib/dashboardCalculations";

export function useDashboardData(filters: any) {
  return useQuery({
    queryKey: ["dashboard-data", filters],
    queryFn: async () => {
      // Fetch events
      let eventsQuery = supabase
        .from("dim_event")
        .select("*")
        .gte("event_date", filters.dateRange?.from?.toISOString().split("T")[0])
        .lte("event_date", filters.dateRange?.to?.toISOString().split("T")[0]);

      if (filters.eventType) {
        eventsQuery = eventsQuery.eq("event_type", filters.eventType);
      }

      const { data: events, error: eventsError } = await eventsQuery;
      if (eventsError) throw eventsError;

      const eventIds = events?.map((e) => e.event_id) || [];

      if (eventIds.length === 0) {
        return {
          kpis: calculateKPIs([], [], []),
          matrix: calculateMatrix([]),
          drivers: calculateDrivers([]),
          wayfinding: calculateWayfinding([]),
          segments: calculateSegments([], []),
          preferences: calculatePreferences([]),
          health: calculateHealth([]),
        };
      }

      // Fetch responses
      let responsesQuery = supabase
        .from("fct_response")
        .select("*, respondent:dim_respondent(*)")
        .in("event_id", eventIds);

      const { data: responses, error: responsesError } = await responsesQuery;
      if (responsesError) throw responsesError;

      // Filter by respondent attributes
      let filteredResponses = responses || [];
      if (filters.gender) {
        filteredResponses = filteredResponses.filter((r: any) => r.respondent?.gender === filters.gender);
      }
      if (filters.ageBand) {
        filteredResponses = filteredResponses.filter((r: any) => r.respondent?.age_band === filters.ageBand);
      }
      if (filters.transportMode) {
        filteredResponses = filteredResponses.filter((r: any) => r.respondent?.transport_mode === filters.transportMode);
      }

      // Fetch collection quality
      const { data: quality, error: qualityError } = await supabase
        .from("fct_collection_quality")
        .select("*")
        .in("event_id", eventIds);

      if (qualityError) throw qualityError;

      // Calculate all metrics
      return {
        kpis: calculateKPIs(filteredResponses, quality || [], events || []),
        matrix: calculateMatrix(filteredResponses),
        drivers: calculateDrivers(filteredResponses),
        wayfinding: calculateWayfinding(filteredResponses),
        segments: calculateSegments(filteredResponses, events || []),
        preferences: calculatePreferences(filteredResponses),
        health: calculateHealth(quality || []),
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
