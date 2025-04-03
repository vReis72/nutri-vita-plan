
import { supabase } from "@/integrations/supabase/client";
import { NutritionistWithProfile, PatientWithProfile, Profile } from "@/types/auth.types";

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
        const { data, error } = await supabase
          .from('patients')
          .select(`
            id,
            profile_id,
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
            nutritionist:nutritionist_id(
              profiles:profile_id(name)
            ),
            profile:profile_id(name)
          `);
          
        if (error) throw error;
        
        return (data || []).map(item => ({
          id: item.id,
          name: item.profile?.name || 'Nome não disponível',
          profileName: item.profile?.name || 'Nome não disponível',
          age: item.age || 0,
          gender: item.gender || 'male',
          height: item.height || 0,
          weight: item.weight || 0,
          email: item.email || '',
          phone: item.phone || '',
          goal: item.goal || 'maintenance',
          notes: item.notes || '',
          photoUrl: item.photo_url || '',
          nutritionistName: item.nutritionist?.profiles?.name || 'Sem nutricionista',
          createdAt: new Date(item.created_at),
          updatedAt: new Date(item.updated_at),
        }));
      } else if (profile?.role === "nutritionist" && nutritionistId) {
        const { data, error } = await supabase
          .from('patients')
          .select(`
            id,
            profile_id,
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
            updated_at,
            profile:profile_id(name)
          `)
          .eq('nutritionist_id', nutritionistId);
          
        if (error) throw error;
        
        return (data || []).map(item => ({
          id: item.id,
          name: item.profile?.name || 'Nome não disponível',
          profileName: item.profile?.name || 'Nome não disponível',
          age: item.age || 0,
          gender: item.gender || 'male',
          height: item.height || 0,
          weight: item.weight || 0,
          email: item.email || '',
          phone: item.phone || '',
          goal: item.goal || 'maintenance',
          notes: item.notes || '',
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
