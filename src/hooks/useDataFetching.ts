
import { supabase } from "@/integrations/supabase/client";
import { NutritionistWithProfile, PatientWithProfile, Profile } from "@/types/auth.types";
import { getAllPatients as fetchAllPatients, getPatientsByNutritionistId } from "@/services/patients";

export const useDataFetching = (profile: Profile | null, nutritionistId: string | null) => {
  const getAllNutritionists = async (): Promise<NutritionistWithProfile[]> => {
    try {
      const { data, error } = await supabase
        .from('nutritionists')
        .select(`
          id,
          profile_id,
          specialization,
          license_number,
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
        specialties: item.specialization ? [item.specialization] : [],
        bio: item.license_number || '',
        photoUrl: item.profiles?.photo_url || null,
      }));
    } catch (error) {
      console.error("Erro ao buscar nutricionistas:", error);
      return [];
    }
  };

  const getAllPatients = async (): Promise<PatientWithProfile[]> => {
    try {
      if (profile?.role === "admin") {
        return await fetchAllPatients();
      } else if (profile?.role === "nutritionist" && nutritionistId) {
        return await getPatientsByNutritionistId(nutritionistId);
      }
      return [];
    } catch (error) {
      console.error("Erro ao buscar pacientes:", error);
      return [];
    }
  };

  const transferPatient = async (patientId: string, newNutritionistId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('patients')
        .update({ nutritionist_id: newNutritionistId })
        .eq('id', patientId);
        
      if (error) throw error;
    } catch (error) {
      console.error("Erro ao transferir paciente:", error);
      throw error;
    }
  };

  return {
    getAllNutritionists,
    getAllPatients,
    transferPatient,
  };
};
