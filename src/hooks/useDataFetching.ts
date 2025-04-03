
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PatientWithProfile, Profile, NutritionistWithProfile } from "@/types/auth.types";

export const useDataFetching = (profile: Profile | null, nutritionistId: string | null) => {
  const [patientsLoading, setPatientsLoading] = useState(false);
  
  const getPatientProfile = async (id: string): Promise<PatientWithProfile | null> => {
    try {
      // Get patient data
      const { data: patient, error: patientError } = await supabase
        .from('patients')
        .select('*')
        .eq('id', id)
        .single();
      
      if (patientError) {
        console.error("Error fetching patient:", patientError);
        return null;
      }
      
      if (!patient) return null;
      
      // Get profile data for the patient
      if (patient.profile_id) {
        const { data: patientProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', patient.profile_id)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Error fetching patient profile:", profileError);
        }
        
        // Get nutritionist name if assigned
        let nutritionistName = null;
        if (patient.nutritionist_id) {
          const { data: nutritionist, error: nutritionistError } = await supabase
            .from('nutritionists')
            .select(`
              *,
              profile:profile_id (
                name
              )
            `)
            .eq('id', patient.nutritionist_id)
            .single();
            
          if (nutritionistError && nutritionistError.code !== 'PGRST116') {
            console.error("Error fetching nutritionist:", nutritionistError);
          }
          
          if (nutritionist && nutritionist.profile) {
            nutritionistName = nutritionist.profile.name;
          }
        }
        
        return {
          id: patient.id,
          name: patientProfile?.name || 'Unknown',
          profileName: patientProfile?.name || 'Unknown',
          nutritionistId: patient.nutritionist_id,
          nutritionistName: nutritionistName,
          photoUrl: patientProfile?.photo_url,
          email: patient.email,
          phone: patient.phone,
          age: patient.age || 0,
          gender: patient.gender || 'male',
          height: patient.height || 0,
          weight: patient.weight || 0,
          goal: patient.goal || 'maintenance',
          notes: patient.notes,
          createdAt: new Date(patient.created_at),
          updatedAt: new Date(patient.updated_at)
        };
      }
      
      return null;
    } catch (error) {
      console.error("Error in getPatientProfile:", error);
      return null;
    }
  };
  
  const getAllPatients = async (): Promise<PatientWithProfile[]> => {
    try {
      setPatientsLoading(true);
      
      let query = supabase
        .from('patients')
        .select(`
          *,
          profile:profile_id (
            name,
            photo_url
          )
        `);
      
      // Filter patients by nutritionist if the user is a nutritionist
      if (profile?.role === 'nutritionist' && nutritionistId) {
        query = query.eq('nutritionist_id', nutritionistId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching patients:", error);
        return [];
      }
      
      // Map the data to our PatientWithProfile interface
      return data.map(patient => ({
        id: patient.id,
        name: patient.profile?.name || 'Unknown',
        profileName: patient.profile?.name || 'Unknown',
        nutritionistId: patient.nutritionist_id,
        photoUrl: patient.profile?.photo_url,
        email: patient.email,
        phone: patient.phone,
        age: patient.age || 0,
        gender: patient.gender || 'male',
        height: patient.height || 0,
        weight: patient.weight || 0,
        goal: patient.goal || 'maintenance',
        notes: patient.notes,
        createdAt: new Date(patient.created_at),
        updatedAt: new Date(patient.updated_at)
      }));
    } catch (error) {
      console.error("Error in getAllPatients:", error);
      return [];
    } finally {
      setPatientsLoading(false);
    }
  };
  
  const getAllNutritionists = async (): Promise<NutritionistWithProfile[]> => {
    try {
      // Cannot query auth table, so we'll get nutritionists from the profiles and nutritionists tables
      const { data: nutritionistProfiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'nutritionist');
      
      if (profileError) {
        console.error("Error fetching nutritionist profiles:", profileError);
        return [];
      }
      
      const nutritionists: NutritionistWithProfile[] = [];
      
      // For each nutritionist profile, get their nutritionist data
      for (const profileData of nutritionistProfiles) {
        const { data: nutritionistData, error: nutritionistError } = await supabase
          .from('nutritionists')
          .select('*')
          .eq('profile_id', profileData.id)
          .single();
        
        if (nutritionistError && nutritionistError.code !== 'PGRST116') {
          console.error("Error fetching nutritionist data:", nutritionistError);
          continue;
        }
        
        if (nutritionistData) {
          nutritionists.push({
            id: nutritionistData.id,
            userId: profileData.id,
            profileId: nutritionistData.profile_id,
            name: profileData.name,
            email: '', // We don't have email from profiles table
            photoUrl: profileData.photo_url,
            specialization: nutritionistData.specialization,
            biography: nutritionistData.license_number,
            yearsOfExperience: 0,
            specialties: nutritionistData.specialization ? [nutritionistData.specialization] : [],
            bio: nutritionistData.license_number || ""
          });
        }
      }
      
      return nutritionists;
    } catch (error) {
      console.error("Error in getAllNutritionists:", error);
      return [];
    }
  };
  
  const transferPatient = async (patientId: string, newNutritionistId: string): Promise<void> => {
    try {
      // Check if user is admin or nutritionist
      if (profile && (profile.role === 'admin' || profile.role === 'nutritionist')) {
        const { error } = await supabase
          .from('patients')
          .update({ nutritionist_id: newNutritionistId })
          .eq('id', patientId);
        
        if (error) {
          console.error("Error transferring patient:", error);
          throw error;
        }
      } else {
        throw new Error("Unauthorized to transfer patients");
      }
    } catch (error) {
      console.error("Error in transferPatient:", error);
      throw error;
    }
  };
  
  return {
    getPatientProfile,
    getAllPatients,
    getAllNutritionists,
    transferPatient,
    patientsLoading
  };
};
