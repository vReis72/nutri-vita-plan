
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
      console.log(`Attempting login with ${provider}`);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
        }
      });

      if (error) {
        console.error(`Error logging in with ${provider}:`, error);
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
      navigate("/login", { replace: true });
    } catch (error: any) {
      console.error("Error signing out:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    session,
    user,
    profile,
    nutritionist,
    signup,
    login,
    loginWithProvider,
    logout,
    updateProfile,
    isLoading: loading || profileLoading,
  };
};
