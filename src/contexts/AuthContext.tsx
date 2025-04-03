import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  Session,
  User,
  AuthChangeEvent,
  Provider,
} from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import {
  createNutritionistProfile,
  getNutritionistByProfileId,
  updateNutritionistProfile,
  fetchAllNutritionists,
  NutritionistWithProfile,
} from "@/services/nutritionistService";
import { Profile } from "@/types";
import { getPatientsByNutritionistId, PatientWithProfile } from "@/services/patientService";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  nutritionist: NutritionistWithProfile | null;
  loading: boolean;
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [nutritionist, setNutritionist] = useState<NutritionistWithProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
      setSession(session);
      console.log(`Auth event: ${event}`);
    });
  }, []);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setNutritionist(null);
    }
  }, [user]);

  useEffect(() => {
    if (profile && profile.role === "nutritionist") {
      fetchNutritionistProfile();
    } else {
      setNutritionist(null);
    }
  }, [profile]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      let { data: profile, error, status } = await supabase
        .from("profiles")
        .select(`name, photo_url, role`)
        .eq("id", user?.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (profile) {
        setProfile({
          id: user!.id,
          name: profile.name,
          photoUrl: profile.photo_url || null,
          role: profile.role,
        });
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchNutritionistProfile = async () => {
    setLoading(true);
    try {
      const nutritionistProfile = await getNutritionistByProfileId(user!.id);
      setNutritionist(nutritionistProfile);
    } catch (error: any) {
      console.error("Error fetching nutritionist profile:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, role: "nutritionist" | "patient" | "admin") => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        const updates = {
          id: data.user.id,
          name: name,
          photo_url: null,
          role: role,
          updated_at: new Date(),
        };

        let { error: profileError } = await supabase.from("profiles").insert(updates);

        if (profileError) {
          throw profileError;
        }

        if (role === "nutritionist") {
          await createNutritionistProfile(data.user.id);
        }

        setProfile({
          id: data.user.id,
          name: updates.name,
          photoUrl: null,
          role: role,
        });
        setUser(data.user);
        navigate("/", { replace: true });
      }
    } catch (error: any) {
      console.error("Error signing up:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        setUser(data.user);
      }
    } catch (error: any) {
      console.error("Error logging in:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithProvider = async (provider: Provider) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        }
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error(`Error logging in with ${provider}:`, error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      let { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      setUser(null);
      setProfile(null);
      navigate("/login", { replace: true });
    } catch (error: any) {
      console.error("Error signing out:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: { name: string; photoUrl: string | null }) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ name: updates.name, photo_url: updates.photoUrl })
        .eq("id", user?.id);

      if (error) {
        throw error;
      }

      setProfile((prevProfile) =>
        prevProfile ? { ...prevProfile, name: updates.name, photoUrl: updates.photoUrl } : null
      );

      if (nutritionist) {
        await updateNutritionistProfile(user!.id, {
          name: updates.name,
          photoUrl: updates.photoUrl,
        });
        fetchNutritionistProfile();
      }
    } catch (error: any) {
      console.error("Error updating profile:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const isNutritionist = () => profile?.role === "nutritionist";
  const isPatient = () => profile?.role === "patient";
  const isAdmin = () => profile?.role === "admin";

  const isPatientOfCurrentNutritionist = (patientId: string) => {
    if (!nutritionist) return false;
    
    return true;
  };

  const getAllNutritionists = async () => {
    try {
      return await fetchAllNutritionists();
    } catch (error) {
      console.error("Erro ao buscar nutricionistas:", error);
      return [];
    }
  };

  const getAllPatients = async () => {
    try {
      if (isAdmin()) {
        const { getAllPatients } = await import('@/services/patientService');
        return await getAllPatients();
      } else if (isNutritionist() && nutritionist) {
        return await getPatientsByNutritionistId(nutritionist.id);
      }
      return [];
    } catch (error) {
      console.error("Erro ao buscar pacientes:", error);
      return [];
    }
  };

  const value: AuthContextType = {
    session,
    user,
    profile,
    nutritionist,
    loading,
    signup,
    login,
    loginWithProvider,
    logout,
    updateProfile,
    isNutritionist,
    isPatient,
    isAdmin,
    isPatientOfCurrentNutritionist,
    getAllNutritionists,
    getAllPatients,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
