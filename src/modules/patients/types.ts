
import { Assessment, DietPlan } from "@/types";

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  height: number; // em cm
  weight: number; // em kg
  email: string;
  phone: string;
  goal: 'weightLoss' | 'weightGain' | 'maintenance';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  // Adicionando campo para múltiplas fotos de acompanhamento
  progressPhotos?: {
    id: string;
    url: string;
    date: Date;
    caption?: string;
  }[];
  profilePhoto?: string;
}
