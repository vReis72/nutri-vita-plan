
export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  height: number; // em cm
  weight: number; // em kg
  email?: string; // Tornando opcional para compatibilidade com PatientWithProfile
  phone: string;
  goal: 'weightLoss' | 'weightGain' | 'maintenance';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Assessment {
  id: string;
  patientId: string;
  date: Date;
  weight: number; // em kg
  bodyFatPercentage?: number;
  bmi: number;
  waistCircumference?: number; // em cm
  hipCircumference?: number; // em cm
  armCircumference?: number; // em cm
  calfCircumference?: number; // em cm
  basalMetabolicRate: number; // em kcal
  notes?: string;
}

export interface Food {
  id: string;
  name: string;
  portion: string;
  calories: number;
  carbs: number;
  proteins: number;
  fats: number;
  fiber?: number;
  category: string;
}

export interface Meal {
  id: string;
  name: string;
  time: string;
  foods: {
    foodId: string;
    food: Food;
    quantity: number;
  }[];
}

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
