
import { Food, Meal } from "../foods/types";

export interface DietPlan {
  id: string;
  patientId: string;
  name: string;
  goal: 'weightLoss' | 'weightGain' | 'maintenance';
  totalCalories: number;
  macronutrients: {
    carbs: number;
    proteins: number;
    fats: number;
  };
  meals: Meal[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
