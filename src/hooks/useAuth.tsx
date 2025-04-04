
import { useState, useEffect } from "react";
import { Session, User as SupabaseUser, AuthChangeEvent, Provider } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Profile, PatientProfile, User } from "@/types/auth.types";
import { useProfileData } from "./useProfileData";
import { toast } from "sonner";

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const navigate = useNavigate();
  
  const { profile, nutritionist, loading: profileLoading, updateProfile } = useProfileData(supabaseUser);

  useEffect(() => {
    // Map Supabase user to our User type when profile is loaded
    if (supabaseUser && profile) {
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email || null,
        role: profile.role
      });
    } else if (!supabaseUser) {
      setUser(null);
    }
  }, [supabaseUser, profile]);

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial session:", session);
        setSession(session);
        setSupabaseUser(session?.user ?? null);
      } catch (error) {
        console.error("Erro ao obter a sessão:", error);
      } finally {
        setLoading(false);
      }
    };

    // Setup auth change listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      console.log(`Auth event: ${event}`);
      console.log("Session:", session);
      setSession(session);
      setSupabaseUser(session?.user ?? null);
    });

    // THEN check existing session
    getInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch patient data if the user has a patient role
  useEffect(() => {
    if (profile && profile.role === 'patient') {
      fetchPatientData(profile.id);
    }
  }, [profile]);

  const fetchPatientData = async (profileId: string) => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('profile_id', profileId)
        .single();
      
      if (error) {
        console.error("Error fetching patient data:", error);
        return;
      }
      
      if (data) {
        setPatient({
          id: data.id,
          profileId: data.profile_id,
          nutritionistId: data.nutritionist_id,
          age: data.age,
          gender: data.gender,
          height: data.height,
          weight: data.weight,
          goal: data.goal,
          notes: data.notes,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at)
        });
      }
    } catch (error) {
      console.error("Error in fetchPatientData:", error);
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
            name: name, // Add name to user metadata for automatic profile creation
          },
        },
      });

      if (error) {
        console.error("Signup error:", error);
        toast.error(`Erro de cadastro: ${error.message}`);
        throw error;
      }

      if (data.user) {
        console.log("User registered:", data.user);
        // Check if a profile already exists
        const { data: existingProfile, error: profileCheckError } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", data.user.id)
          .single();

        if (profileCheckError && profileCheckError.code !== 'PGRST116') {
          throw profileCheckError;
        }

        // If profile doesn't exist, create it
        if (!existingProfile) {
          const updates = {
            id: data.user.id,
            name: name,
            photo_url: null,
            role: role,
          };

          let { error: profileError } = await supabase.from("profiles").insert(updates);

          if (profileError) {
            throw profileError;
          }
        }

        if (role === "nutritionist") {
          // Check if nutritionist record exists
          const { data: existingNutritionist, error: nutritionistCheckError } = await supabase
            .from("nutritionists")
            .select("id")
            .eq("profile_id", data.user.id)
            .single();

          if (nutritionistCheckError && nutritionistCheckError.code !== 'PGRST116') {
            throw nutritionistCheckError;
          }

          // Create nutritionist record if it doesn't exist
          if (!existingNutritionist) {
            const { error: nutritionistError } = await supabase
              .from("nutritionists")
              .insert({
                profile_id: data.user.id,
                specialization: "",
                license_number: "",
              });

            if (nutritionistError) {
              throw nutritionistError;
            }
          }
        } else if (role === "patient") {
          // Check if patient record exists
          const { data: existingPatient, error: patientCheckError } = await supabase
            .from("patients")
            .select("id")
            .eq("profile_id", data.user.id)
            .single();

          if (patientCheckError && patientCheckError.code !== 'PGRST116') {
            throw patientCheckError;
          }

          // Create patient record if it doesn't exist
          if (!existingPatient) {
            const { error: patientError } = await supabase
              .from("patients")
              .insert({
                profile_id: data.user.id,
              });

            if (patientError) {
              throw patientError;
            }
          }
        }
        toast.success("Cadastro realizado com sucesso!");
      }
    } catch (error: any) {
      console.error("Erro ao registrar:", error.message);
      toast.error(`Erro ao registrar: ${error.message}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = signup; // Alias for signup function

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log("Attempting login with:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        toast.error(`Erro de login: ${error.message}`);
        throw error;
      }

      console.log("Login successful:", data);
      toast.success("Login realizado com sucesso!");
      return data;
    } catch (error: any) {
      console.error("Erro ao fazer login:", error.message);
      toast.error(`Erro ao fazer login: ${error.message}`);
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
        toast.error(`Erro ao fazer login com ${provider}: ${error.message}`);
        throw error;
      }
      toast.success(`Login com ${provider} iniciado. Redirecionando...`);
    } catch (error: any) {
      console.error(`Erro ao fazer login com ${provider}:`, error.message);
      toast.error(`Erro ao fazer login com ${provider}: ${error.message}`);
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
        console.error("Logout error:", error);
        toast.error(`Erro ao sair: ${error.message}`);
        throw error;
      }
      setUser(null);
      setSession(null);
      setPatient(null);
      toast.success("Logout realizado com sucesso!");
      navigate("/login", { replace: true });
    } catch (error: any) {
      console.error("Erro ao sair:", error.message);
      toast.error(`Erro ao sair: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !!user;

  return {
    session,
    user,
    profile,
    nutritionist,
    patient,
    signup,
    register,
    login,
    loginWithProvider,
    logout,
    updateProfile,
    isLoading: loading || profileLoading,
    isAuthenticated,
  };
};
