
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Profile, NutritionistWithProfile } from "@/types/auth.types";

export const useProfileData = (user: User | null) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [nutritionist, setNutritionist] = useState<NutritionistWithProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setNutritionist(null);
      setLoading(false);
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
          specialties: data.specialization ? [data.specialization] : [],
          bio: data.license_number || "",
          photoUrl: profile!.photoUrl,
        });
      }
    } catch (error: any) {
      console.error("Error fetching nutritionist profile:", error.message);
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
          .update({ 
            license_number: nutritionist.bio,
            specialization: nutritionist.specialties.length > 0 ? nutritionist.specialties[0] : null 
          })
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

  return {
    profile,
    nutritionist,
    loading,
    updateProfile,
    fetchProfile,
  };
};
