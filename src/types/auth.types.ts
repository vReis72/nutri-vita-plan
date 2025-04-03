
export interface AuthUser {
  id: string;
  email?: string;
}

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
  nutritionistId?: string;
  nutritionistName?: string;
  age?: number;
  gender?: 'male' | 'female';
  height?: number;
  weight?: number;
  email?: string;
  phone?: string;
  goal?: 'weightLoss' | 'weightGain' | 'maintenance';
  notes?: string;
  photoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  nutritionist: NutritionistWithProfile | null;
  isLoading: boolean;
  signup: (email: string, password: string, name: string, role: "nutritionist" | "patient" | "admin") => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithProvider: (provider: "google") => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: { name: string; photoUrl: string | null }) => Promise<void>;
  isNutritionist: () => boolean;
  isPatient: () => boolean;
  isAdmin: () => boolean;
  isPatientOfCurrentNutritionist: (patientId: string) => boolean;
  getAllNutritionists: () => Promise<NutritionistWithProfile[]>;
  getAllPatients: () => Promise<PatientWithProfile[]>;
  transferPatient: (patientId: string, newNutritionistId: string) => Promise<void>;
  notifications: any[];
  hasUnreadNotifications: boolean;
  markAllNotificationsAsRead: () => void;
  markNotificationAsRead: (id: string) => void;
}
