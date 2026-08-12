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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      cms_case_studies: {
        Row: {
          approach: string[]
          challenge: string
          client: string
          created_at: string | null
          id: string
          industry: string
          quote: Json | null
          results: Json
          service_slugs: string[]
          services: string[]
          slug: string
          summary: string
          title: string
          updated_at: string | null
          year: string
        }
        Insert: {
          approach?: string[]
          challenge: string
          client: string
          created_at?: string | null
          id?: string
          industry: string
          quote?: Json | null
          results?: Json
          service_slugs?: string[]
          services?: string[]
          slug: string
          summary: string
          title: string
          updated_at?: string | null
          year: string
        }
        Update: {
          approach?: string[]
          challenge?: string
          client?: string
          created_at?: string | null
          id?: string
          industry?: string
          quote?: Json | null
          results?: Json
          service_slugs?: string[]
          services?: string[]
          slug?: string
          summary?: string
          title?: string
          updated_at?: string | null
          year?: string
        }
        Relationships: []
      }
      cms_posts: {
        Row: {
          author_id: string | null
          body: string[]
          category: string
          created_at: string | null
          date: string
          excerpt: string
          id: string
          read_time: string
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          body?: string[]
          category: string
          created_at?: string | null
          date?: string
          excerpt: string
          id?: string
          read_time: string
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          body?: string[]
          category?: string
          created_at?: string | null
          date?: string
          excerpt?: string
          id?: string
          read_time?: string
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cms_services: {
        Row: {
          benefits: string[]
          created_at: string | null
          deliverables: string[]
          desc_short: string
          icon: string
          id: string
          intro: string
          plans: Json
          slug: string
          sort_order: number | null
          tagline: string
          title: string
          updated_at: string | null
        }
        Insert: {
          benefits?: string[]
          created_at?: string | null
          deliverables?: string[]
          desc_short: string
          icon: string
          id?: string
          intro: string
          plans?: Json
          slug: string
          sort_order?: number | null
          tagline: string
          title: string
          updated_at?: string | null
        }
        Update: {
          benefits?: string[]
          created_at?: string | null
          deliverables?: string[]
          desc_short?: string
          icon?: string
          id?: string
          intro?: string
          plans?: Json
          slug?: string
          sort_order?: number | null
          tagline?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      lead_submissions: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string | null
          name: string
          service_slug: string
          source: string | null
          status: string | null
          tier: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message?: string | null
          name: string
          service_slug: string
          source?: string | null
          status?: string | null
          tier: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string | null
          name?: string
          service_slug?: string
          source?: string | null
          status?: string | null
          tier?: string
        }
        Relationships: []
      }
      notification_settings: {
        Row: {
          created_at: string | null
          id: string
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_first_admin: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "user"
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
    Enums: {
      app_role: ["admin", "editor", "user"],
    },
  },
} as const
