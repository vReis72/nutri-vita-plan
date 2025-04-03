
import React from "react";
import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("nutritionist" | "patient" | "admin")[];
  checkPatientAccess?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = ["nutritionist", "patient", "admin"],
  checkPatientAccess = false
}) => {
  const { user, profile, isLoading, isPatientOfCurrentNutritionist } = useAuth();
  const params = useParams();
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (profile && profile.role && !allowedRoles.includes(profile.role)) {
    // Redirecionar para a rota apropriada baseado no papel do usuário
    if (profile.role === "patient") {
      return <Navigate to="/patient/progress" replace />;
    } else if (profile.role === "nutritionist") {
      return <Navigate to="/" replace />;
    } else if (profile.role === "admin") {
      return <Navigate to="/admin/nutritionists" replace />;
    }
    return <Navigate to="/login" replace />;
  }
  
  // Verificar se um nutricionista está tentando acessar informações de um paciente que não é seu
  if (checkPatientAccess && profile?.role === "nutritionist" && params.patientId) {
    const canAccessPatient = isPatientOfCurrentNutritionist(params.patientId);
    if (!canAccessPatient) {
      // Redirecionar para a lista de pacientes com uma mensagem de erro
      return <Navigate to="/patients" replace />;
    }
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
