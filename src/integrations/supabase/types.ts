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
      assessments: {
        Row: {
          arm_circumference: number | null
          basal_metabolic_rate: number | null
          bmi: number
          body_fat_percentage: number | null
          calf_circumference: number | null
          created_at: string
          date: string
          hip_circumference: number | null
          id: string
          notes: string | null
          patient_id: string
          waist_circumference: number | null
          weight: number
        }
        Insert: {
          arm_circumference?: number | null
          basal_metabolic_rate?: number | null
          bmi: number
          body_fat_percentage?: number | null
          calf_circumference?: number | null
          created_at?: string
          date?: string
          hip_circumference?: number | null
          id?: string
          notes?: string | null
          patient_id: string
          waist_circumference?: number | null
          weight: number
        }
        Update: {
          arm_circumference?: number | null
          basal_metabolic_rate?: number | null
          bmi?: number
          body_fat_percentage?: number | null
          calf_circumference?: number | null
          created_at?: string
          date?: string
          hip_circumference?: number | null
          id?: string
          notes?: string | null
          patient_id?: string
          waist_circumference?: number | null
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "assessments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      diet_plans: {
        Row: {
          carbs_percentage: number
          created_at: string
          fats_percentage: number
          goal: Database["public"]["Enums"]["patient_goal"] | null
          id: string
          name: string
          notes: string | null
          patient_id: string
          proteins_percentage: number
          total_calories: number
          updated_at: string
        }
        Insert: {
          carbs_percentage: number
          created_at?: string
          fats_percentage: number
          goal?: Database["public"]["Enums"]["patient_goal"] | null
          id?: string
          name: string
          notes?: string | null
          patient_id: string
          proteins_percentage: number
          total_calories: number
          updated_at?: string
        }
        Update: {
          carbs_percentage?: number
          created_at?: string
          fats_percentage?: number
          goal?: Database["public"]["Enums"]["patient_goal"] | null
          id?: string
          name?: string
          notes?: string | null
          patient_id?: string
          proteins_percentage?: number
          total_calories?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "diet_plans_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      foods: {
        Row: {
          calories: number
          carbs: number
          category: string | null
          created_at: string
          fats: number
          fiber: number | null
          id: string
          name: string
          portion: string
          proteins: number
          updated_at: string
        }
        Insert: {
          calories: number
          carbs: number
          category?: string | null
          created_at?: string
          fats: number
          fiber?: number | null
          id?: string
          name: string
          portion: string
          proteins: number
          updated_at?: string
        }
        Update: {
          calories?: number
          carbs?: number
          category?: string | null
          created_at?: string
          fats?: number
          fiber?: number | null
          id?: string
          name?: string
          portion?: string
          proteins?: number
          updated_at?: string
        }
        Relationships: []
      }
      invitations: {
        Row: {
          code: string
          created_at: string
          created_by: string | null
          email: string | null
          expires_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          code: string
          created_at?: string
          created_by?: string | null
          email?: string | null
          expires_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string | null
          email?: string | null
          expires_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: []
      }
      meal_foods: {
        Row: {
          created_at: string
          food_id: string
          id: string
          meal_id: string
          quantity: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          food_id: string
          id?: string
          meal_id: string
          quantity: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          food_id?: string
          id?: string
          meal_id?: string
          quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_foods_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "foods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_foods_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
        ]
      }
      meals: {
        Row: {
          created_at: string
          diet_plan_id: string
          id: string
          name: string
          time: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          diet_plan_id: string
          id?: string
          name: string
          time: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          diet_plan_id?: string
          id?: string
          name?: string
          time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meals_diet_plan_id_fkey"
            columns: ["diet_plan_id"]
            isOneToOne: false
            referencedRelation: "diet_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      nutritionists: {
        Row: {
          created_at: string
          id: string
          license_number: string | null
          profile_id: string
          specialization: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          license_number?: string | null
          profile_id: string
          specialization?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          license_number?: string | null
          profile_id?: string
          specialization?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "nutritionists_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          age: number | null
          created_at: string
          email: string | null
          gender: Database["public"]["Enums"]["gender_type"] | null
          goal: Database["public"]["Enums"]["patient_goal"] | null
          height: number | null
          id: string
          notes: string | null
          nutritionist_id: string | null
          phone: string | null
          profile_id: string | null
          updated_at: string
          weight: number | null
        }
        Insert: {
          age?: number | null
          created_at?: string
          email?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          goal?: Database["public"]["Enums"]["patient_goal"] | null
          height?: number | null
          id?: string
          notes?: string | null
          nutritionist_id?: string | null
          phone?: string | null
          profile_id?: string | null
          updated_at?: string
          weight?: number | null
        }
        Update: {
          age?: number | null
          created_at?: string
          email?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          goal?: Database["public"]["Enums"]["patient_goal"] | null
          height?: number | null
          id?: string
          notes?: string | null
          nutritionist_id?: string | null
          phone?: string | null
          profile_id?: string | null
          updated_at?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "patients_nutritionist_id_fkey"
            columns: ["nutritionist_id"]
            isOneToOne: false
            referencedRelation: "nutritionists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patients_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          name: string
          photo_url: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          name: string
          photo_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          photo_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      is_nutritionist: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      use_invitation: {
        Args: {
          invitation_code: string
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      gender_type: "male" | "female"
      patient_goal: "weightLoss" | "weightGain" | "maintenance"
      user_role: "patient" | "nutritionist" | "admin"
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
