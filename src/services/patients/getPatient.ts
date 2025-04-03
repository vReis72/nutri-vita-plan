
import { supabase } from "@/integrations/supabase/client";
import { PatientWithProfile } from "./types";

/**
 * Busca um paciente pelo ID
 */
export const getPatientById = async (id: string): Promise<PatientWithProfile> => {
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
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Erro ao buscar paciente ${id}:`, error);
    throw new Error(`Erro ao buscar paciente: ${error.message}`);
  }

  return {
    id: data.id,
    name: data.profiles.name,
    profileName: data.profiles.name,
    nutritionistId: data.nutritionist_id,
    age: data.age,
    gender: data.gender,
    height: data.height,
    weight: data.weight,
    email: data.email,
    phone: data.phone,
    goal: data.goal,
    notes: data.notes,
    photoUrl: data.profiles.photo_url,
    nutritionistName: data.nutritionists?.profiles?.name,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at)
  };
};

/**
 * Busca um paciente pelo ID do perfil
 */
export const getPatientByProfileId = async (profileId: string): Promise<PatientWithProfile | null> => {
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
    .eq('profile_id', profileId)
    .maybeSingle();

  if (error) {
    console.error(`Erro ao buscar paciente com profile_id ${profileId}:`, error);
    throw new Error(`Erro ao buscar paciente: ${error.message}`);
  }

  if (!data) return null;

  return {
    id: data.id,
    name: data.profiles.name,
    profileName: data.profiles.name,
    nutritionistId: data.nutritionist_id,
    age: data.age,
    gender: data.gender,
    height: data.height,
    weight: data.weight,
    email: data.email,
    phone: data.phone,
    goal: data.goal,
    notes: data.notes,
    photoUrl: data.profiles.photo_url,
    nutritionistName: data.nutritionists?.profiles?.name,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at)
  };
};
