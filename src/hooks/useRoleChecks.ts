
import { Profile } from "@/types/auth.types";

export const useRoleChecks = (profile: Profile | null) => {
  const isNutritionist = () => profile?.role === "nutritionist";
  const isPatient = () => profile?.role === "patient";
  const isAdmin = () => profile?.role === "admin";

  const isPatientOfCurrentNutritionist = (patientId: string) => {
    // Simplified for now, but can be expanded with actual logic
    // Returning true as a default since the original implementation also returns true
    return true;
  };

  return {
    isNutritionist,
    isPatient,
    isAdmin,
    isPatientOfCurrentNutritionist,
  };
};
