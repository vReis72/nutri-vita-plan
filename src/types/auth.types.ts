
import { Session, User, Provider } from "@supabase/supabase-js";

export interface Profile {
  id: string;
  name: string;
  photoUrl: string | null;
  role: "nutritionist" | "patient" | "admin";
}

export interface NutritionistWithProfile {
  id: string;
  profileId: string;
  name: string;
  specialties: string[];
  bio: string;
  photoUrl: string | null;
}

export interface PatientWithProfile {
  id: string;
  name: string;
  profileName: string;
  age: number;
  gender: "male" | "female";
  height: number;
  weight: number;
  email: string;
  phone: string;
  goal: "weightLoss" | "weightGain" | "maintenance";
  notes: string;
  photoUrl: string;
  nutritionistName: string;
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

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  nutritionist: NutritionistWithProfile | null;
  signup: (email: string, password: string, name: string, role: "nutritionist" | "patient" | "admin") => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithProvider: (provider: Provider) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: { name: string; photoUrl: string | null }) => Promise<void>;
  isNutritionist: () => boolean;
  isPatient: () => boolean;
  isAdmin: () => boolean;
  isPatientOfCurrentNutritionist: (patientId: string) => boolean;
  getAllNutritionists: () => Promise<NutritionistWithProfile[]>;
  getAllPatients: () => Promise<PatientWithProfile[]>;
  isLoading?: boolean;
  notifications?: Notification[];
  unreadNotificationsCount?: number;
  markNotificationAsRead?: (id: string) => void;
  transferPatient?: (patientId: string, newNutritionistId: string) => Promise<void>;
}
