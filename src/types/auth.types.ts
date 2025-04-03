
import { Patient } from "@/types";

export type UserRole = "admin" | "nutritionist" | "patient";

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

export interface Profile {
  id: string;
  userId: string;
  name: string;
  photoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NutritionistProfile {
  id: string;
  profileId: string;
  specialization?: string;
  biography?: string;
  yearsOfExperience?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PatientProfile {
  id: string;
  profileId: string;
  nutritionistId?: string;
  age?: number;
  gender?: 'male' | 'female';
  height?: number;
  weight?: number;
  goal?: 'weightLoss' | 'weightGain' | 'maintenance';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  date: Date;
}

export interface PatientWithProfile extends Omit<Patient, 'createdAt' | 'updatedAt'> {
  id: string;
  profileName: string;
  nutritionistId?: string;
  nutritionistName?: string;
  photoUrl?: string;
  email?: string;
  phone?: string;
  age: number;
  gender: 'male' | 'female';
  height: number;
  weight: number;
  goal: 'weightLoss' | 'weightGain' | 'maintenance';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NutritionistWithProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  photoUrl?: string;
  specialization?: string;
  biography?: string;
  yearsOfExperience?: number;
}

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  nutritionist: NutritionistProfile | null;
  patient: PatientProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  getPatientProfile: (id: string) => Promise<PatientWithProfile | null>;
  getAllPatients: () => Promise<PatientWithProfile[]>;
  getAllNutritionists: () => Promise<NutritionistWithProfile[]>;
  transferPatient: (patientId: string, nutritionistId: string) => Promise<void>;
  isAdmin: () => boolean;
  isNutritionist: () => boolean;
  isPatient: () => boolean;
  isPatientOfCurrentNutritionist: (patientId: string) => boolean;
  unreadNotificationsCount: number;
}
