
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Profile, PatientWithProfile, NutritionistWithProfile } from "@/types/auth.types";

export const useDataFetching = (profile: Profile | null, nutritionistId: string | null) => {
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [loadingNutritionists, setLoadingNutritionists] = useState(false);
  
  const getAllNutritionists = async (): Promise<NutritionistWithProfile[]> => {
    setLoadingNutritionists(true);
    try {
      let { data, error } = await supabase
        .from("nutritionists")
        .select(`
          id,
          profile_id,
          specialization,
          license_number,
          profiles:profile_id (
            name,
            photo_url,
            id
          )
        `);

      if (error) throw error;

      const nutritionists: NutritionistWithProfile[] = data.map((item: any) => ({
        id: item.id,
        userId: item.profiles.id,
        profileId: item.profile_id,
        name: item.profiles.name,
        email: "", // This would need to be fetched from auth if needed
        photoUrl: item.profiles.photo_url,
        specialization: item.specialization,
        biography: item.license_number,
        specialties: item.specialization ? [item.specialization] : [],
        bio: item.license_number || ""
      }));

      return nutritionists;
    } catch (error) {
      console.error("Erro ao buscar nutricionistas:", error);
      return [];
    } finally {
      setLoadingNutritionists(false);
    }
  };
  
  const getAllPatients = async (): Promise<PatientWithProfile[]> => {
    setLoadingPatients(true);
    try {
      // Se o perfil for um nutricionista, buscar apenas seus pacientes
      let query = supabase
        .from("patients")
        .select(`
          id,
          phone,
          email,
          weight,
          goal,
          age,
          gender,
          height,
          notes,
          nutritionist_id,
          nutritionists:nutritionist_id (
            id,
            profiles:profile_id (
              name
            )
          ),
          profiles:profile_id (
            name,
            photo_url
          )
        `);
        
      if (profile?.role === "nutritionist" && nutritionistId) {
        query = query.eq("nutritionist_id", nutritionistId);
      }

      let { data, error } = await query;

      if (error) throw error;

      const patients = data.map((patient: any) => {
        return {
          id: patient.id,
          profileName: patient.profiles?.name || "Sem nome",
          nutritionistId: patient.nutritionist_id,
          nutritionistName: patient.nutritionists?.profiles?.name,
          photoUrl: patient.profiles?.photo_url,
          email: patient.email,
          phone: patient.phone,
          age: patient.age || 0,
          gender: patient.gender || "male",
          height: patient.height || 0,
          weight: patient.weight || 0,
          goal: patient.goal || "maintenance",
          notes: patient.notes,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      });

      return patients;
    } catch (error) {
      console.error("Erro ao buscar pacientes:", error);
      return [];
    } finally {
      setLoadingPatients(false);
    }
  };
  
  const getPatientProfile = async (id: string): Promise<PatientWithProfile | null> => {
    try {
      let { data, error } = await supabase
        .from("patients")
        .select(`
          id,
          phone,
          email,
          weight,
          goal,
          age,
          gender,
          height,
          notes,
          nutritionist_id,
          nutritionists:nutritionist_id (
            id,
            profiles:profile_id (
              name
            )
          ),
          profiles:profile_id (
            name,
            photo_url
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        profileName: data.profiles?.name || "Sem nome",
        nutritionistId: data.nutritionist_id,
        nutritionistName: data.nutritionists?.profiles?.name,
        photoUrl: data.profiles?.photo_url,
        email: data.email,
        phone: data.phone,
        age: data.age || 0,
        gender: data.gender || "male",
        height: data.height || 0,
        weight: data.weight || 0,
        goal: data.goal || "maintenance",
        notes: data.notes,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      console.error("Erro ao buscar perfil do paciente:", error);
      return null;
    }
  };
  
  const transferPatient = async (patientId: string, nutritionistId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from("patients")
        .update({ nutritionist_id: nutritionistId })
        .eq("id", patientId);
        
      if (error) throw error;
    } catch (error) {
      console.error("Erro ao transferir paciente:", error);
      throw error;
    }
  };

  return {
    getAllPatients,
    getAllNutritionists,
    getPatientProfile,
    transferPatient,
    loadingPatients,
    loadingNutritionists
  };
};
