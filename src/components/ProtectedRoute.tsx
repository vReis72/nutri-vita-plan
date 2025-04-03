
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
  const { user, isLoading, isPatientOfCurrentNutritionist } = useAuth();
  const params = useParams();
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirecionar para a rota apropriada baseado no papel do usuário
    if (user.role === "patient") {
      return <Navigate to="/patient/progress" replace />;
    } else if (user.role === "nutritionist") {
      return <Navigate to="/" replace />;
    } else if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }
  
  // Verificar se um nutricionista está tentando acessar informações de um paciente que não é seu
  if (checkPatientAccess && user.role === "nutritionist" && params.patientId) {
    const canAccessPatient = isPatientOfCurrentNutritionist(params.patientId);
    if (!canAccessPatient) {
      // Redirecionar para a lista de pacientes com uma mensagem de erro
      return <Navigate to="/patients" replace />;
    }
  }
  
  // Verificar se um paciente está tentando acessar informações de outro paciente
  if (checkPatientAccess && user.role === "patient" && params.patientId) {
    if (user.patientId !== params.patientId) {
      // Redirecionar para a página inicial do paciente
      return <Navigate to="/patient/progress" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
