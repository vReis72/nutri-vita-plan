
import { Session, User } from "@supabase/supabase-js";

export type UserRole = "nutritionist" | "patient" | "admin";

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: Date;
  read: boolean;
  recipientId: string;
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  photoUrl?: string;
  patientId?: string; 
  nutritionistId?: string;
  associatedPatients?: string[];
}

export interface Invitation {
  id: string;
  code: string;
  email?: string;
  role: UserRole;
  created_by?: string;
  created_at: string;
  expires_at: string;
  used_at?: string;
  used_by?: string;
}

export interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isNutritionist: () => boolean;
  isPatient: () => boolean;
  isAdmin: () => boolean;
  isPatientOfCurrentNutritionist: (patientId: string) => boolean;
  transferPatient: (patientId: string, newNutritionistId: string) => Promise<void>;
  notifications: Notification[];
  markNotificationAsRead: (notificationId: string) => void;
  unreadNotificationsCount: number;
  getAllNutritionists: () => UserProfile[];
  getAllPatients: () => UserProfile[];
}
