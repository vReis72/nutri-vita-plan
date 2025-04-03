
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Profile, PatientWithProfile, NutritionistWithProfile } from "@/types/auth.types";

export const useDataFetching = (profile: Profile | null, nutritionistId: string | null) => {
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [loadingNutritionists, setLoadingNutritionists] = useState(false);

  /**
   * Obtém o perfil completo de um paciente pelo ID
   */
  const getPatientProfile = async (id: string): Promise<PatientWithProfile | null> => {
    try {
      // Busca os detalhes do paciente
      const { data: patientData, error: patientError } = await supabase
        .from("patients")
        .select(`
          id, 
          profile_id, 
          nutritionist_id, 
          age, 
          gender, 
          height, 
          weight, 
          goal, 
          notes, 
          created_at, 
          updated_at,
          email,
          phone
        `)
        .eq("id", id)
        .single();

      if (patientError) throw patientError;
      if (!patientData) return null;

      // Busca os detalhes do perfil do paciente
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, name, photo_url")
        .eq("id", patientData.profile_id)
        .single();

      if (profileError && profileError.code !== "PGRST116") throw profileError;

      // Busca os detalhes do nutricionista (se aplicável)
      let nutritionistName = "";
      if (patientData.nutritionist_id) {
        const { data: nutritionist, error: nutritionistError } = await supabase
          .from("nutritionists")
          .select("profile_id")
          .eq("id", patientData.nutritionist_id)
          .single();

        if (!nutritionistError && nutritionist) {
          const { data: nutritionistProfile } = await supabase
            .from("profiles")
            .select("name")
            .eq("id", nutritionist.profile_id)
            .single();

          if (nutritionistProfile) {
            nutritionistName = nutritionistProfile.name;
          }
        }
      }

      return {
        id: patientData.id,
        profileName: profileData?.name || "Desconhecido",
        name: profileData?.name || "Desconhecido",
        nutritionistId: patientData.nutritionist_id || undefined,
        nutritionistName: nutritionistName || undefined,
        photoUrl: profileData?.photo_url || undefined,
        email: patientData.email || undefined,
        phone: patientData.phone || undefined,
        age: patientData.age || 0,
        gender: patientData.gender || "male",
        height: patientData.height || 0,
        weight: patientData.weight || 0,
        goal: patientData.goal || "maintenance",
        notes: patientData.notes,
        createdAt: new Date(patientData.created_at),
        updatedAt: new Date(patientData.updated_at)
      };
    } catch (error) {
      console.error("Erro ao buscar perfil do paciente:", error);
      return null;
    }
  };

  /**
   * Obtém todos os pacientes do nutricionista atual ou todos os pacientes (para admin)
   */
  const getAllPatients = async (): Promise<PatientWithProfile[]> => {
    setLoadingPatients(true);
    try {
      let query = supabase.from("patients").select(`
        id, 
        profile_id, 
        nutritionist_id, 
        age, 
        gender, 
        height, 
        weight, 
        goal, 
        notes, 
        created_at, 
        updated_at,
        email,
        phone
      `);

      // Se for nutricionista, filtrar apenas por seus pacientes
      if (profile?.role === "nutritionist" && nutritionistId) {
        query = query.eq("nutritionist_id", nutritionistId);
      }

      const { data: patientsData, error } = await query;

      if (error) throw error;

      // Buscar informações adicionais para cada paciente
      const enhancedPatients = await Promise.all(
        patientsData.map(async (patient) => {
          // Buscar perfil
          const { data: profileData } = await supabase
            .from("profiles")
            .select("name, photo_url")
            .eq("id", patient.profile_id)
            .single();

          // Buscar nome do nutricionista (se aplicável)
          let nutritionistName = "";
          if (patient.nutritionist_id) {
            const { data: nutritionist } = await supabase
              .from("nutritionists")
              .select("profile_id")
              .eq("id", patient.nutritionist_id)
              .single();

            if (nutritionist) {
              const { data: nutritionistProfile } = await supabase
                .from("profiles")
                .select("name")
                .eq("id", nutritionist.profile_id)
                .single();

              if (nutritionistProfile) {
                nutritionistName = nutritionistProfile.name;
              }
            }
          }

          return {
            id: patient.id,
            profileName: profileData?.name || "Desconhecido",
            name: profileData?.name || "Desconhecido",
            nutritionistId: patient.nutritionist_id || undefined,
            nutritionistName: nutritionistName || undefined,
            photoUrl: profileData?.photo_url || undefined,
            email: patient.email || undefined,
            phone: patient.phone || undefined,
            age: patient.age || 0,
            gender: patient.gender || "male",
            height: patient.height || 0,
            weight: patient.weight || 0,
            goal: patient.goal || "maintenance",
            notes: patient.notes,
            createdAt: new Date(patient.created_at),
            updatedAt: new Date(patient.updated_at)
          };
        })
      );

      return enhancedPatients;
    } catch (error) {
      console.error("Erro ao buscar pacientes:", error);
      return [];
    } finally {
      setLoadingPatients(false);
    }
  };

  /**
   * Obtém todos os nutricionistas (apenas para admin)
   */
  const getAllNutritionists = async (): Promise<NutritionistWithProfile[]> => {
    setLoadingNutritionists(true);
    try {
      const { data: nutritionistsData, error } = await supabase
        .from("nutritionists")
        .select(`
          id, 
          profile_id, 
          specialization, 
          license_number
        `);

      if (error) throw error;

      // Buscar informações adicionais para cada nutricionista
      const enhancedNutritionists = await Promise.all(
        nutritionistsData.map(async (nutritionist) => {
          // Buscar perfil
          const { data: profileData } = await supabase
            .from("profiles")
            .select("name, photo_url")
            .eq("id", nutritionist.profile_id)
            .single();

          // Buscar email
          const { data: userData } = await supabase
            .from("auth")
            .select("email")
            .eq("id", nutritionist.profile_id)
            .single();

          return {
            id: nutritionist.id,
            userId: nutritionist.profile_id,
            profileId: nutritionist.profile_id,
            name: profileData?.name || "Desconhecido",
            email: userData?.email || "email@example.com",
            photoUrl: profileData?.photo_url,
            specialization: nutritionist.specialization,
            biography: nutritionist.license_number,
            yearsOfExperience: 0,
            specialties: nutritionist.specialization ? [nutritionist.specialization] : [],
            bio: nutritionist.license_number || ""
          };
        })
      );

      return enhancedNutritionists;
    } catch (error) {
      console.error("Erro ao buscar nutricionistas:", error);
      return [];
    } finally {
      setLoadingNutritionists(false);
    }
  };

  /**
   * Transfere um paciente para outro nutricionista
   */
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

  // Verifica se um paciente pertence ao nutricionista atual
  const isPatientOfCurrentNutritionist = (patientId: string): boolean => {
    // Implementação simplificada - na prática, você poderia querer verificar no banco de dados
    if (!profile || profile.role !== "nutritionist" || !nutritionistId) {
      return false;
    }
    
    // Para administradores, permitir acesso a todos os pacientes
    if (profile.role === "admin") {
      return true;
    }
    
    return true; // Por simplicidade, assumimos que sim neste momento
  };

  return {
    getPatientProfile,
    getAllPatients,
    getAllNutritionists,
    transferPatient,
    isPatientOfCurrentNutritionist,
    loadingPatients,
    loadingNutritionists
  };
};
