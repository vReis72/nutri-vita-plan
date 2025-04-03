
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

interface Profile {
  id: string;
  name: string;
  photoUrl: string | null;
  role: "nutritionist" | "patient" | "admin";
}

interface NutritionistWithProfile {
  id: string;
  profileId: string;
  name: string;
  specialties: string[];
  bio: string;
  photoUrl: string | null;
}

interface PatientWithProfile {
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

interface AuthContextType {
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
      let { data, error } = await supabase
        .from("nutritionists")
        .select("*")
        .eq("profile_id", user!.id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setNutritionist({
          id: data.id,
          profileId: data.profile_id,
          name: profile!.name,
          specialties: data.specialties || [],
          bio: data.bio || "",
          photoUrl: profile!.photoUrl,
        });
      }
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
          updated_at: new Date().toISOString(),
        };

        let { error: profileError } = await supabase.from("profiles").insert(updates);

        if (profileError) {
          throw profileError;
        }

        if (role === "nutritionist") {
          const { error: nutritionistError } = await supabase
            .from("nutritionists")
            .insert({
              profile_id: data.user.id,
              specialties: [],
              bio: "",
            });

          if (nutritionistError) {
            throw nutritionistError;
          }
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
      console.log(`Tentando login com ${provider}`);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
        }
      });

      if (error) {
        console.error(`Erro ao fazer login com ${provider}:`, error);
        throw error;
      }
    } catch (error: any) {
      console.error(`Erro ao fazer login com ${provider}:`, error.message);
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
        await supabase
          .from("nutritionists")
          .update({ bio: nutritionist.bio, specialties: nutritionist.specialties })
          .eq("profile_id", user!.id);
          
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
      const { data, error } = await supabase
        .from('nutritionists')
        .select(`
          id,
          profile_id,
          specialties,
          bio,
          profiles (
            name,
            photo_url
          )
        `);
        
      if (error) throw error;
      
      return (data || []).map(item => ({
        id: item.id,
        profileId: item.profile_id,
        name: item.profiles?.name || 'Nome não disponível',
        specialties: item.specialties || [],
        bio: item.bio || '',
        photoUrl: item.profiles?.photo_url || null,
      }));
    } catch (error) {
      console.error("Erro ao buscar nutricionistas:", error);
      return [];
    }
  };

  const getAllPatients = async () => {
    try {
      if (isAdmin()) {
        const { data, error } = await supabase
          .from('patients')
          .select(`
            id,
            name,
            age,
            gender,
            height,
            weight,
            email,
            phone,
            goal,
            notes,
            photo_url,
            nutritionist_id,
            created_at,
            updated_at,
            nutritionists:nutritionist_id(
              profiles(name)
            )
          `);
          
        if (error) throw error;
        
        return (data || []).map(item => ({
          id: item.id,
          name: item.name,
          profileName: item.name,
          age: item.age,
          gender: item.gender,
          height: item.height,
          weight: item.weight,
          email: item.email,
          phone: item.phone,
          goal: item.goal,
          notes: item.notes,
          photoUrl: item.photo_url || '',
          nutritionistName: item.nutritionists?.profiles?.name || 'Sem nutricionista',
          createdAt: new Date(item.created_at),
          updatedAt: new Date(item.updated_at),
        }));
      } else if (isNutritionist() && nutritionist) {
        const { data, error } = await supabase
          .from('patients')
          .select(`
            id,
            name,
            age,
            gender,
            height,
            weight,
            email,
            phone,
            goal,
            notes,
            photo_url,
            created_at,
            updated_at
          `)
          .eq('nutritionist_id', nutritionist.id);
          
        if (error) throw error;
        
        return (data || []).map(item => ({
          id: item.id,
          name: item.name,
          profileName: item.name,
          age: item.age,
          gender: item.gender,
          height: item.height,
          weight: item.weight,
          email: item.email,
          phone: item.phone,
          goal: item.goal,
          notes: item.notes,
          photoUrl: item.photo_url || '',
          nutritionistName: profile?.name || 'Sem informação',
          createdAt: new Date(item.created_at),
          updatedAt: new Date(item.updated_at),
        }));
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
