
export type UserRole = "admin" | "nutritionist" | "patient";

export interface User {
  id: string;
  email: string | null;
  role: UserRole;
}

export interface Profile {
  id: string;
  userId: string;
  name: string;
  photoUrl?: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface NutritionistProfile {
  id: string;
  profileId: string;
  specialization?: string | null;
  biography?: string | null;
  yearsOfExperience?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PatientProfile {
  id: string;
  profileId: string;
  nutritionistId?: string | null;
  age?: number | null;
  gender?: 'male' | 'female' | null;
  height?: number | null;
  weight?: number | null;
  goal?: 'weightLoss' | 'weightGain' | 'maintenance' | null;
  notes?: string | null;
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

export interface PatientWithProfile {
  id: string;
  name: string;
  profileName: string;
  nutritionistId?: string | null;
  nutritionistName?: string | null;
  photoUrl?: string | null;
  email?: string | null;
  phone?: string | null;
  age?: number | null;
  gender?: 'male' | 'female' | null;
  height?: number | null;
  weight?: number | null;
  goal?: 'weightLoss' | 'weightGain' | 'maintenance' | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface NutritionistWithProfile {
  id: string;
  userId: string;
  profileId: string;
  name: string;
  email?: string | null;
  photoUrl?: string | null;
  specialization?: string | null;
  biography?: string | null;
  yearsOfExperience?: number;
  specialties?: string[] | null;
  bio?: string | null;
  // Adding these fields to match NutritionistProfile
  createdAt: Date;
  updatedAt: Date;
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
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  loginWithProvider: (provider: string) => Promise<void>;
  getPatientProfile: (id: string) => Promise<PatientWithProfile | null>;
  getAllPatients: () => Promise<PatientWithProfile[]>;
  getAllNutritionists: () => Promise<NutritionistWithProfile[]>;
  transferPatient: (patientId: string, nutritionistId: string) => Promise<void>;
  isAdmin: () => boolean;
  isNutritionist: () => boolean;
  isPatient: () => boolean;
  isPatientOfCurrentNutritionist: (patientId: string) => boolean;
  unreadNotificationsCount: number;
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  hasUnreadNotifications: boolean;
  updateProfile: (updates: { name: string; photoUrl: string | null }) => Promise<void>;
}
