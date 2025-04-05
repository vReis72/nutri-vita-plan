
import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "./types";

export const useSupabaseAuth = (setIsLoading: (isLoading: boolean) => void) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    console.log("Setting up auth state change listener");
    
    // Configure the auth state change listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.id);
        setSession(currentSession);
        
        if (currentSession && currentSession.user) {
          // Fetch user profile from Supabase
          try {
            setTimeout(async () => {
              console.log("Fetching profile for user:", currentSession.user.id);
              const { data: profileData, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', currentSession.user.id)
                .single();
                
              if (error) {
                console.error("Error fetching profile:", error);
                // If we can't find a profile, check if it's a first login and create a profile
                if (error.code === 'PGRST116') {
                  const userData = currentSession.user.user_metadata || {};
                  console.log("No profile found, using metadata:", userData);
                  
                  // Simple user profile from auth metadata
                  const userProfile: UserProfile = {
                    id: currentSession.user.id,
                    name: userData.name || userData.full_name || currentSession.user.email?.split('@')[0] || 'User',
                    role: 'patient', // Default role
                  };
                  setUser(userProfile);
                  setIsLoading(false);
                  return;
                }
                throw error;
              }
              
              if (profileData) {
                console.log("Profile found:", profileData);
                const userProfile: UserProfile = {
                  id: profileData.id,
                  name: profileData.name,
                  role: profileData.role,
                  photoUrl: profileData.photo_url || undefined,
                };
                
                // If nutritionist, fetch associated patients
                if (profileData.role === 'nutritionist') {
                  const { data: nutritionistData } = await supabase
                    .from('nutritionists')
                    .select('id')
                    .eq('profile_id', profileData.id)
                    .single();
                    
                  if (nutritionistData) {
                    userProfile.nutritionistId = nutritionistData.id;
                    
                    // Fetch associated patients
                    const { data: patientData } = await supabase
                      .from('patients')
                      .select('id')
                      .eq('nutritionist_id', nutritionistData.id);
                      
                    if (patientData) {
                      userProfile.associatedPatients = patientData.map(p => p.id);
                    }
                  }
                }
                
                // If patient, fetch associated nutritionist
                if (profileData.role === 'patient') {
                  const { data: patientData } = await supabase
                    .from('patients')
                    .select('id, nutritionist_id')
                    .eq('profile_id', profileData.id)
                    .single();
                    
                  if (patientData) {
                    userProfile.patientId = patientData.id;
                    userProfile.nutritionistId = patientData.nutritionist_id || undefined;
                  }
                }
                
                setUser(userProfile);
                setIsLoading(false);
              }
            }, 0);
          } catch (error) {
            console.error('Erro ao buscar perfil:', error);
            setUser(null);
            setIsLoading(false);
          }
        } else {
          console.log("No current session or user, setting user to null");
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // AFTER setting listener, check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Initial session check:", currentSession?.user?.id);
      setSession(currentSession);
      
      // Profile fetching will happen via onAuthStateChange
      if (!currentSession) {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, [setIsLoading]);

  return { user, setUser };
};
