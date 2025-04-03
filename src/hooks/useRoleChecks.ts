
import { Profile } from "@/types/auth.types";

export const useRoleChecks = (profile: Profile | null) => {
  const isNutritionist = () => profile?.role === "nutritionist";
  const isPatient = () => profile?.role === "patient";
  const isAdmin = () => profile?.role === "admin";

  const isPatientOfCurrentNutritionist = (patientId: string) => {
    // Simplificado por enquanto, mas pode ser expandido com lógica real
    // Retornando true como padrão
    return true;
  };

  return {
    isNutritionist,
    isPatient,
    isAdmin,
    isPatientOfCurrentNutritionist,
  };
};
