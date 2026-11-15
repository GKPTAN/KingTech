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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      cart: {
        Row: {
          product_id: string | null
          quantity: number | null
          user_id: string | null
        }
        Insert: {
          product_id?: string | null
          quantity?: number | null
          user_id?: string | null
        }
        Update: {
          product_id?: string | null
          quantity?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_reviews: {
        Row: {
          comment: string | null
          date: string
          id: number
          name: string
          product_id: string
          rating: number
          verified: boolean
        }
        Insert: {
          comment?: string | null
          date?: string
          id?: number
          name: string
          product_id: string
          rating: number
          verified?: boolean
        }
        Update: {
          comment?: string | null
          date?: string
          id?: number
          name?: string
          product_id?: string
          rating?: number
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand: string
          code: string
          content: Json[] | null
          department: string
          descount: string | null
          descount_pix: string | null
          id: string
          img: string[]
          main_informations: Json[] | null
          name: string
          number_rating: number
          prev_price: number | null
          price_in_card_store: number
          price_part_in_card_store: number
          price_pix: number | null
          quantity: number | null
          rating: number
          specs: Json | null
          star_1: number
          star_2: number
          star_3: number
          star_4: number
          star_5: number
          subcategory: string
          tags: string[] | null
          variations: Json[] | null
        }
        Insert: {
          brand: string
          code: string
          content?: Json[] | null
          department: string
          descount?: string | null
          descount_pix?: string | null
          id?: string
          img: string[]
          main_informations?: Json[] | null
          name: string
          number_rating?: number
          prev_price?: number | null
          price_in_card_store: number
          price_part_in_card_store: number
          price_pix?: number | null
          quantity?: number | null
          rating?: number
          specs?: Json | null
          star_1?: number
          star_2?: number
          star_3?: number
          star_4?: number
          star_5?: number
          subcategory: string
          tags?: string[] | null
          variations?: Json[] | null
        }
        Update: {
          brand?: string
          code?: string
          content?: Json[] | null
          department?: string
          descount?: string | null
          descount_pix?: string | null
          id?: string
          img?: string[]
          main_informations?: Json[] | null
          name?: string
          number_rating?: number
          prev_price?: number | null
          price_in_card_store?: number
          price_part_in_card_store?: number
          price_pix?: number | null
          quantity?: number | null
          rating?: number
          specs?: Json | null
          star_1?: number
          star_2?: number
          star_3?: number
          star_4?: number
          star_5?: number
          subcategory?: string
          tags?: string[] | null
          variations?: Json[] | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          city: string
          country: string
          created_at: string | null
          date_birth: string
          email: string
          full_name: string
          gender: string
          id: string
          ip_user: string
          loc: string
          region: string
          role: string | null
          username: string
        }
        Insert: {
          city: string
          country: string
          created_at?: string | null
          date_birth: string
          email: string
          full_name: string
          gender: string
          id: string
          ip_user: string
          loc: string
          region: string
          role?: string | null
          username: string
        }
        Update: {
          city?: string
          country?: string
          created_at?: string | null
          date_birth?: string
          email?: string
          full_name?: string
          gender?: string
          id?: string
          ip_user?: string
          loc?: string
          region?: string
          role?: string | null
          username?: string
        }
        Relationships: []
      }
      unverified_profiles: {
        Row: {
          city: string
          country: string
          created_at: string
          date_birth: string
          email: string
          full_name: string
          gender: string
          id: string
          ipUser: string
          loc: string
          password_hash: string
          region: string
          role: string
          username: string
          verification_code: string
          verified: boolean
        }
        Insert: {
          city: string
          country: string
          created_at?: string
          date_birth: string
          email: string
          full_name: string
          gender: string
          id?: string
          ipUser: string
          loc: string
          password_hash: string
          region: string
          role?: string
          username: string
          verification_code: string
          verified?: boolean
        }
        Update: {
          city?: string
          country?: string
          created_at?: string
          date_birth?: string
          email?: string
          full_name?: string
          gender?: string
          id?: string
          ipUser?: string
          loc?: string
          password_hash?: string
          region?: string
          role?: string
          username?: string
          verification_code?: string
          verified?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_unverified_profiles: { Args: never; Returns: undefined }
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
