export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      about: {
        Row: {
          description: string
          id: string
          skills: string[] | null
        }
        Insert: {
          description: string
          id?: string
          skills?: string[] | null
        }
        Update: {
          description?: string
          id?: string
          skills?: string[] | null
        }
        Relationships: []
      }
      articles: {
        Row: {
          date: string
          excerpt: string
          id: string
          link: string
          title: string
        }
        Insert: {
          date: string
          excerpt: string
          id?: string
          link: string
          title: string
        }
        Update: {
          date?: string
          excerpt?: string
          id?: string
          link?: string
          title?: string
        }
        Relationships: []
      }
      contact: {
        Row: {
          email: string
          github: string | null
          id: string
          linkedin: string | null
        }
        Insert: {
          email: string
          github?: string | null
          id?: string
          linkedin?: string | null
        }
        Update: {
          email?: string
          github?: string | null
          id?: string
          linkedin?: string | null
        }
        Relationships: []
      }
      feedback: {
        Row: {
          city: string | null
          country: string | null
          created_at: string
          id: string
          ip_address: string | null
          latitude: number | null
          longitude: number | null
          region: string | null
          target: string
          text: string | null
          type: string
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string
          id?: string
          ip_address?: string | null
          latitude?: number | null
          longitude?: number | null
          region?: string | null
          target: string
          text?: string | null
          type: string
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string
          id?: string
          ip_address?: string | null
          latitude?: number | null
          longitude?: number | null
          region?: string | null
          target?: string
          text?: string | null
          type?: string
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      hero: {
        Row: {
          description: string
          id: string
          profile_image: string
          title: string
        }
        Insert: {
          description: string
          id?: string
          profile_image: string
          title: string
        }
        Update: {
          description?: string
          id?: string
          profile_image?: string
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          email: string
          id: string
          is_admin: boolean | null
        }
        Insert: {
          email: string
          id: string
          is_admin?: boolean | null
        }
        Update: {
          email?: string
          id?: string
          is_admin?: boolean | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          demo: string | null
          description: string
          github: string | null
          id: string
          image: string
          tags: string[] | null
          title: string
        }
        Insert: {
          demo?: string | null
          description: string
          github?: string | null
          id: string
          image: string
          tags?: string[] | null
          title: string
        }
        Update: {
          demo?: string | null
          description?: string
          github?: string | null
          id?: string
          image?: string
          tags?: string[] | null
          title?: string
        }
        Relationships: []
      }
      secrets: {
        Row: {
          groq_api_key: string
          id: number
        }
        Insert: {
          groq_api_key: string
          id?: number
        }
        Update: {
          groq_api_key?: string
          id?: number
        }
        Relationships: []
      }
      users: {
        Row: {
          auth_id: string
          email: string
          id: string
          is_admin: boolean | null
        }
        Insert: {
          auth_id: string
          email: string
          id?: string
          is_admin?: boolean | null
        }
        Update: {
          auth_id?: string
          email?: string
          id?: string
          is_admin?: boolean | null
        }
        Relationships: []
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
