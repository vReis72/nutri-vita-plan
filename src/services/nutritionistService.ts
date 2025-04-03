
import { supabase } from "@/integrations/supabase/client";

/**
 * Interface para o perfil de nutricionista
 */
export interface Nutritionist {
  id: string;
  profile_id: string;
  name: string;
  photo_url?: string;
  specialization?: string;
  license_number?: string;
  patientCount?: number;
}

/**
 * Busca todos os nutricionistas
 */
export const getAllNutritionists = async (): Promise<Nutritionist[]> => {
  const { data, error } = await supabase
    .from('nutritionists')
    .select(`
      id,
      profile_id,
      specialization,
      license_number,
      profiles (name, photo_url)
    `);

  if (error) {
    console.error("Erro ao buscar nutricionistas:", error);
    throw new Error(`Erro ao buscar nutricionistas: ${error.message}`);
  }

  // Buscar a contagem de pacientes para cada nutricionista
  const nutritionists = await Promise.all(
    data.map(async (item) => {
      // Contar pacientes
      const { count, error: countError } = await supabase
        .from('patients')
        .select('id', { count: 'exact', head: true })
        .eq('nutritionist_id', item.id);

      if (countError) {
        console.error(`Erro ao contar pacientes do nutricionista ${item.id}:`, countError);
      }

      return {
        id: item.id,
        profile_id: item.profile_id,
        name: item.profiles.name,
        photo_url: item.profiles.photo_url,
        specialization: item.specialization,
        license_number: item.license_number,
        patientCount: count || 0
      };
    })
  );

  return nutritionists;
};

/**
 * Busca um nutricionista pelo ID
 */
export const getNutritionistById = async (id: string): Promise<Nutritionist> => {
  const { data, error } = await supabase
    .from('nutritionists')
    .select(`
      id,
      profile_id,
      specialization,
      license_number,
      profiles (name, photo_url)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Erro ao buscar nutricionista com id ${id}:`, error);
    throw new Error(`Erro ao buscar nutricionista: ${error.message}`);
  }

  // Contar pacientes
  const { count, error: countError } = await supabase
    .from('patients')
    .select('id', { count: 'exact', head: true })
    .eq('nutritionist_id', id);

  if (countError) {
    console.error(`Erro ao contar pacientes do nutricionista ${id}:`, countError);
  }

  return {
    id: data.id,
    profile_id: data.profile_id,
    name: data.profiles.name,
    photo_url: data.profiles.photo_url,
    specialization: data.specialization,
    license_number: data.license_number,
    patientCount: count || 0
  };
};

/**
 * Busca um nutricionista pelo ID do perfil
 */
export const getNutritionistByProfileId = async (profileId: string): Promise<Nutritionist | null> => {
  const { data, error } = await supabase
    .from('nutritionists')
    .select(`
      id, 
      profile_id,
      specialization,
      license_number,
      profiles (name, photo_url)
    `)
    .eq('profile_id', profileId)
    .maybeSingle();

  if (error) {
    console.error(`Erro ao buscar nutricionista com profile_id ${profileId}:`, error);
    throw new Error(`Erro ao buscar nutricionista: ${error.message}`);
  }

  if (!data) return null;

  // Contar pacientes
  const { count, error: countError } = await supabase
    .from('patients')
    .select('id', { count: 'exact', head: true })
    .eq('nutritionist_id', data.id);

  if (countError) {
    console.error(`Erro ao contar pacientes do nutricionista ${data.id}:`, countError);
  }

  return {
    id: data.id,
    profile_id: data.profile_id,
    name: data.profiles.name,
    photo_url: data.profiles.photo_url,
    specialization: data.specialization,
    license_number: data.license_number,
    patientCount: count || 0
  };
};

/**
 * Cria um novo registro de nutricionista para um usuário
 */
export const createNutritionist = async (
  profileId: string,
  data: { specialization?: string; license_number?: string }
): Promise<Nutritionist> => {
  // Verificar se o perfil já está associado a um nutricionista
  const existing = await getNutritionistByProfileId(profileId);
  if (existing) {
    throw new Error("Este perfil já está registrado como nutricionista");
  }

  // Criar o registro de nutricionista
  const { data: newNutritionist, error } = await supabase
    .from('nutritionists')
    .insert([
      {
        profile_id: profileId,
        ...data
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar nutricionista:", error);
    throw new Error(`Erro ao criar nutricionista: ${error.message}`);
  }

  // Buscar o perfil associado
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('name, photo_url')
    .eq('id', profileId)
    .single();

  if (profileError) {
    console.error(`Erro ao buscar perfil ${profileId}:`, profileError);
    throw new Error(`Erro ao buscar perfil: ${profileError.message}`);
  }

  return {
    id: newNutritionist.id,
    profile_id: newNutritionist.profile_id,
    name: profile.name,
    photo_url: profile.photo_url,
    specialization: newNutritionist.specialization,
    license_number: newNutritionist.license_number,
    patientCount: 0
  };
};

/**
 * Atualiza os dados de um nutricionista
 */
export const updateNutritionist = async (
  id: string,
  data: { specialization?: string; license_number?: string }
): Promise<Nutritionist> => {
  const { data: updatedData, error } = await supabase
    .from('nutritionists')
    .update(data)
    .eq('id', id)
    .select(`
      id, 
      profile_id,
      specialization,
      license_number
    `)
    .single();

  if (error) {
    console.error(`Erro ao atualizar nutricionista ${id}:`, error);
    throw new Error(`Erro ao atualizar nutricionista: ${error.message}`);
  }

  // Buscar o perfil associado
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('name, photo_url')
    .eq('id', updatedData.profile_id)
    .single();

  if (profileError) {
    console.error(`Erro ao buscar perfil ${updatedData.profile_id}:`, profileError);
    throw new Error(`Erro ao buscar perfil: ${profileError.message}`);
  }

  // Contar pacientes
  const { count, error: countError } = await supabase
    .from('patients')
    .select('id', { count: 'exact', head: true })
    .eq('nutritionist_id', id);

  if (countError) {
    console.error(`Erro ao contar pacientes do nutricionista ${id}:`, countError);
  }

  return {
    id: updatedData.id,
    profile_id: updatedData.profile_id,
    name: profile.name,
    photo_url: profile.photo_url,
    specialization: updatedData.specialization,
    license_number: updatedData.license_number,
    patientCount: count || 0
  };
};

/**
 * Remove um registro de nutricionista (mas não remove o perfil)
 */
export const deleteNutritionist = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('nutritionists')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Erro ao excluir nutricionista ${id}:`, error);
    throw new Error(`Erro ao excluir nutricionista: ${error.message}`);
  }
};
