
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://wvfmonuesegwebrxyqqx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2Zm1vbnVlc2Vnd2Vicnh5cXF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2ODc2MzUsImV4cCI6MjA1OTI2MzYzNX0.I2uAkUse18VEE6ZGFyiSnFmzyEDfR-fCTmgCuZoMn18";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: typeof window !== 'undefined' ? localStorage : undefined
  }
});

// Extend the Database type from types.ts
declare global {
  interface Database extends Database {
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
            id: string;
            code: string;
            email?: string;
            role: "patient" | "nutritionist" | "admin";
            created_by?: string;
            created_at: string;
            expires_at: string;
            used_at?: string;
            used_by?: string;
          };
          Insert: {
            id?: string;
            code: string;
            email?: string;
            role?: "patient" | "nutritionist" | "admin";
            created_by?: string;
            created_at?: string;
            expires_at?: string;
            used_at?: string;
            used_by?: string;
          };
          Update: {
            id?: string;
            code?: string;
            email?: string;
            role?: "patient" | "nutritionist" | "admin";
            created_by?: string;
            created_at?: string;
            expires_at?: string;
            used_at?: string;
            used_by?: string;
          };
        };
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
      Functions: {
        use_invitation: {
          Args: {
            invitation_code: string;
            user_id: string;
          };
          Returns: boolean;
        };
      };
    };
  }
}
