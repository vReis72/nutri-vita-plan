
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Invitation } from "@/contexts/auth/types";

interface InvitationAlertProps {
  invitation: Invitation | null;
}

export const InvitationAlert = ({ invitation }: InvitationAlertProps) => {
  if (!invitation) return null;
  
  return (
    <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
      <AlertTitle className="text-green-800 dark:text-green-400">Convite válido</AlertTitle>
      <AlertDescription className="text-green-700 dark:text-green-500">
        Você está se registrando usando um convite {invitation.role === 'patient' ? 'de paciente' : 'de nutricionista'}.
      </AlertDescription>
    </Alert>
  );
};
