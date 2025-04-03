import { supabase } from "@/integrations/supabase/client";
import { Patient } from "@/types";

/**
 * Interface estendida para pacientes
 */
export interface PatientWithProfile extends Omit<Patient, 'createdAt' | 'updatedAt'> {
  profileName: string;
  nutritionistId?: string;
  photoUrl?: string;
  nutritionistName?: string;
  createdAt: Date;
  updatedAt: Date;
}

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

/**
 * Cria um novo paciente
 */
export const createPatient = async (
  profileId: string,
  data: {
    nutritionist_id?: string;
    age?: number;
    gender?: 'male' | 'female';
    height?: number;
    weight?: number;
    email?: string;
    phone?: string;
    goal?: 'weightLoss' | 'weightGain' | 'maintenance';
    notes?: string;
  }
): Promise<string> => {
  const { data: result, error } = await supabase
    .from('patients')
    .insert([
      {
        profile_id: profileId,
        ...data
      }
    ])
    .select('id')
    .single();

  if (error) {
    console.error("Erro ao criar paciente:", error);
    throw new Error(`Erro ao criar paciente: ${error.message}`);
  }

  return result.id;
};

/**
 * Atualiza um paciente existente
 */
export const updatePatient = async (
  id: string,
  data: {
    nutritionist_id?: string;
    age?: number;
    gender?: 'male' | 'female';
    height?: number;
    weight?: number;
    email?: string;
    phone?: string;
    goal?: 'weightLoss' | 'weightGain' | 'maintenance';
    notes?: string;
  }
): Promise<void> => {
  const { error } = await supabase
    .from('patients')
    .update(data)
    .eq('id', id);

  if (error) {
    console.error(`Erro ao atualizar paciente ${id}:`, error);
    throw new Error(`Erro ao atualizar paciente: ${error.message}`);
  }
};

/**
 * Remove um paciente
 */
export const deletePatient = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('patients')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Erro ao excluir paciente ${id}:`, error);
    throw new Error(`Erro ao excluir paciente: ${error.message}`);
  }
};
