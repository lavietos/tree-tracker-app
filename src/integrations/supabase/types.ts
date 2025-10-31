export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      dim_event: {
        Row: {
          capacity: number | null
          created_at: string | null
          event_code: string
          event_date: string
          event_id: string
          event_type: string
          name: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string | null
          event_code: string
          event_date: string
          event_id?: string
          event_type: string
          name: string
        }
        Update: {
          capacity?: number | null
          created_at?: string | null
          event_code?: string
          event_date?: string
          event_id?: string
          event_type?: string
          name?: string
        }
        Relationships: []
      }
      dim_respondent: {
        Row: {
          age_band: string | null
          created_at: string | null
          gender: string | null
          respondent_id: string
          transport_mode: string | null
        }
        Insert: {
          age_band?: string | null
          created_at?: string | null
          gender?: string | null
          respondent_id?: string
          transport_mode?: string | null
        }
        Update: {
          age_band?: string | null
          created_at?: string | null
          gender?: string | null
          respondent_id?: string
          transport_mode?: string | null
        }
        Relationships: []
      }
      fct_collection_quality: {
        Row: {
          complete_responses: number
          created_at: string | null
          event_id: string | null
          id: string
          invites_sent: number
          responses_total: number
          sent_delay_hours: number | null
        }
        Insert: {
          complete_responses?: number
          created_at?: string | null
          event_id?: string | null
          id?: string
          invites_sent?: number
          responses_total?: number
          sent_delay_hours?: number | null
        }
        Update: {
          complete_responses?: number
          created_at?: string | null
          event_id?: string | null
          id?: string
          invites_sent?: number
          responses_total?: number
          sent_delay_hours?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fct_collection_quality_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "dim_event"
            referencedColumns: ["event_id"]
          },
        ]
      }
      fct_micro_nps: {
        Row: {
          activation: string | null
          collected_at: string | null
          event_id: string | null
          id: string
          nps_score: number | null
        }
        Insert: {
          activation?: string | null
          collected_at?: string | null
          event_id?: string | null
          id?: string
          nps_score?: number | null
        }
        Update: {
          activation?: string | null
          collected_at?: string | null
          event_id?: string | null
          id?: string
          nps_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fct_micro_nps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "dim_event"
            referencedColumns: ["event_id"]
          },
        ]
      }
      fct_response: {
        Row: {
          answer_array: Json | null
          answer_numeric: number | null
          answer_value: string | null
          answered_at: string | null
          event_id: string | null
          question_id: string
          respondent_id: string | null
          response_id: string
        }
        Insert: {
          answer_array?: Json | null
          answer_numeric?: number | null
          answer_value?: string | null
          answered_at?: string | null
          event_id?: string | null
          question_id: string
          respondent_id?: string | null
          response_id?: string
        }
        Update: {
          answer_array?: Json | null
          answer_numeric?: number | null
          answer_value?: string | null
          answered_at?: string | null
          event_id?: string | null
          question_id?: string
          respondent_id?: string | null
          response_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fct_response_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "dim_event"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "fct_response_respondent_id_fkey"
            columns: ["respondent_id"]
            isOneToOne: false
            referencedRelation: "dim_respondent"
            referencedColumns: ["respondent_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
