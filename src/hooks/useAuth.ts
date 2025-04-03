
import { useState, useEffect } from "react";
import { Session, User, AuthChangeEvent, Provider } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/auth.types";
import { useProfileData } from "./useProfileData";

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const { profile, nutritionist, loading: profileLoading, updateProfile } = useProfileData(user);

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Erro ao obter a sessão:", error);
      } finally {
        setLoading(false);
      }
    };

    // Configurar ouvinte de alterações de autenticação PRIMEIRO
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      setSession(session);
      setUser(session?.user ?? null);
      console.log(`Evento de autenticação: ${event}`);
    });

    // DEPOIS verificar a sessão existente
    getInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
              specialization: "",
              license_number: "",
            });

          if (nutritionistError) {
            throw nutritionistError;
          }
        }

        setUser(data.user);
        navigate("/", { replace: true });
      }
    } catch (error: any) {
      console.error("Erro ao registrar:", error.message);
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
        throw error;
      }

      if (data.user) {
        console.log("Login successful:", data.user);
        setUser(data.user);
      }
    } catch (error: any) {
      console.error("Erro ao fazer login:", error.message);
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
      navigate("/login", { replace: true });
    } catch (error: any) {
      console.error("Erro ao sair:", error.message);
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
