
import React, { createContext, useContext, useState, useEffect } from "react";

type UserRole = "nutritionist" | "patient";

interface User {
  id: string;
  name: string;
  role: UserRole;
  photoUrl?: string;
  patientId?: string; // Apenas para pacientes, referência ao seu ID
  nutritionistId?: string; // Para pacientes: ID do nutricionista responsável
  associatedPatients?: string[]; // Para nutricionistas: lista de IDs de pacientes
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isNutritionist: () => boolean;
  isPatient: () => boolean;
  isPatientOfCurrentNutritionist: (patientId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simular verificação de localStorage ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulando uma autenticação
      // Em uma implementação real, aqui seria uma chamada à API
      
      // Exemplo: nutricionista 1 - Ana login@nutricionista.com / senha123
      if (email === "login@nutricionista.com" && password === "senha123") {
        const nutritionist: User = {
          id: "nutr-1",
          name: "Dr. Ana Silva",
          role: "nutritionist",
          photoUrl: "",
          associatedPatients: ["patient-1", "patient-2"] // IDs dos pacientes vinculados
        };
        setUser(nutritionist);
        localStorage.setItem("currentUser", JSON.stringify(nutritionist));
        return;
      }
      
      // Exemplo: nutricionista 2 - Carlos carlos@nutricionista.com / senha123
      if (email === "carlos@nutricionista.com" && password === "senha123") {
        const nutritionist: User = {
          id: "nutr-2",
          name: "Dr. Carlos Oliveira",
          role: "nutritionist",
          photoUrl: "",
          associatedPatients: ["patient-3"] // IDs dos pacientes vinculados
        };
        setUser(nutritionist);
        localStorage.setItem("currentUser", JSON.stringify(nutritionist));
        return;
      }
      
      // Exemplo: paciente 1 - Maria (vinculado à Dra. Ana)
      if (email === "paciente@email.com" && password === "senha123") {
        const patient: User = {
          id: "user-1",
          name: "Maria Silva",
          role: "patient",
          patientId: "patient-1", // ID do paciente no sistema
          nutritionistId: "nutr-1" // Vinculado à Dra. Ana
        };
        setUser(patient);
        localStorage.setItem("currentUser", JSON.stringify(patient));
        return;
      }
      
      // Exemplo: paciente 2 - João (vinculado à Dra. Ana)
      if (email === "joao@email.com" && password === "senha123") {
        const patient: User = {
          id: "user-2",
          name: "João Santos",
          role: "patient",
          patientId: "patient-2", // ID do paciente no sistema
          nutritionistId: "nutr-1" // Vinculado à Dra. Ana
        };
        setUser(patient);
        localStorage.setItem("currentUser", JSON.stringify(patient));
        return;
      }
      
      // Exemplo: paciente 3 - Pedro (vinculado ao Dr. Carlos)
      if (email === "pedro@email.com" && password === "senha123") {
        const patient: User = {
          id: "user-3",
          name: "Pedro Costa",
          role: "patient",
          patientId: "patient-3", // ID do paciente no sistema
          nutritionistId: "nutr-2" // Vinculado ao Dr. Carlos
        };
        setUser(patient);
        localStorage.setItem("currentUser", JSON.stringify(patient));
        return;
      }
      
      throw new Error("Credenciais inválidas");
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  const isNutritionist = () => {
    return user?.role === "nutritionist";
  };

  const isPatient = () => {
    return user?.role === "patient";
  };
  
  // Verifica se um paciente está associado ao nutricionista atual
  const isPatientOfCurrentNutritionist = (patientId: string) => {
    if (!user || user.role !== "nutritionist" || !user.associatedPatients) {
      return false;
    }
    return user.associatedPatients.includes(patientId);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      logout, 
      isNutritionist, 
      isPatient,
      isPatientOfCurrentNutritionist
    }}>
      {children}
    </AuthContext.Provider>
  );
};
