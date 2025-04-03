
import { supabase } from "@/integrations/supabase/client";
import { PatientCreateData, PatientUpdateData } from "./types";

/**
 * Cria um novo paciente
 */
export const createPatient = async (
  profileId: string,
  data: PatientCreateData
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
  data: PatientUpdateData
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
