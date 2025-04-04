
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
