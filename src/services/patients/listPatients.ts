
import { supabase } from "@/integrations/supabase/client";
import { PatientWithProfile } from "./types";

/**
 * Busca todos os pacientes
 */
export const getAllPatients = async (): Promise<PatientWithProfile[]> => {
  const { data, error } = await supabase
    .from('patients')
    .select(`
      id,
      profile_id,
      nutritionist_id,
      age,
      gender,
      height,
      weight,
      email,
      phone,
      goal,
      notes,
      created_at,
      updated_at,
      profiles:profile_id (
        name,
        photo_url
      ),
      nutritionists:nutritionist_id (
        profiles (
          name
        )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Erro ao buscar pacientes:", error);
    throw new Error(`Erro ao buscar pacientes: ${error.message}`);
  }

  return data.map(item => ({
    id: item.id,
    name: item.profiles.name,
    profileName: item.profiles.name,
    nutritionistId: item.nutritionist_id,
    age: item.age,
    gender: item.gender,
    height: item.height,
    weight: item.weight,
    email: item.email,
    phone: item.phone,
    goal: item.goal,
    notes: item.notes,
    photoUrl: item.profiles.photo_url,
    nutritionistName: item.nutritionists?.profiles?.name,
    createdAt: new Date(item.created_at),
    updatedAt: new Date(item.updated_at)
  }));
};

/**
 * Busca pacientes de um nutricionista específico
 */
export const getPatientsByNutritionistId = async (nutritionistId: string): Promise<PatientWithProfile[]> => {
  const { data, error } = await supabase
    .from('patients')
    .select(`
      id,
      profile_id,
      nutritionist_id,
      age,
      gender,
      height,
      weight,
      email,
      phone,
      goal,
      notes,
      created_at,
      updated_at,
      profiles:profile_id (
        name,
        photo_url
      )
    `)
    .eq('nutritionist_id', nutritionistId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Erro ao buscar pacientes do nutricionista ${nutritionistId}:`, error);
    throw new Error(`Erro ao buscar pacientes: ${error.message}`);
  }

  return data.map(item => ({
    id: item.id,
    name: item.profiles.name,
    profileName: item.profiles.name,
    nutritionistId: item.nutritionist_id,
    age: item.age,
    gender: item.gender,
    height: item.height,
    weight: item.weight,
    email: item.email,
    phone: item.phone,
    goal: item.goal,
    notes: item.notes,
    photoUrl: item.profiles.photo_url,
    nutritionistName: undefined, // Não precisamos carregar o nome do nutricionista pois já sabemos qual é
    createdAt: new Date(item.created_at),
    updatedAt: new Date(item.updated_at)
  }));
};
