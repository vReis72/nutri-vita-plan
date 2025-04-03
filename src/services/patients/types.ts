
import { Patient } from "@/types";

/**
 * Interface estendida para pacientes com informações de perfil
 */
export interface PatientWithProfile extends Omit<Patient, 'createdAt' | 'updatedAt'> {
  profileName: string;
  nutritionistId?: string;
  nutritionistName?: string;
  photoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Dados de entrada para criação de um paciente
 */
export interface PatientCreateData {
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

/**
 * Dados de entrada para atualização de um paciente
 */
export interface PatientUpdateData extends PatientCreateData {}
