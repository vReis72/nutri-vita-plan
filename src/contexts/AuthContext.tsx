
import React, { createContext, useContext, useState, useEffect } from "react";

type UserRole = "nutritionist" | "patient";

interface User {
  id: string;
  name: string;
  role: UserRole;
  photoUrl?: string;
  patientId?: string; // Apenas para pacientes, referência ao seu ID
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isNutritionist: () => boolean;
  isPatient: () => boolean;
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
      
      // Exemplo: nutricionista login@nutricionista.com / senha123
      if (email === "login@nutricionista.com" && password === "senha123") {
        const nutritionist: User = {
          id: "nutr-1",
          name: "Dr. Ana Silva",
          role: "nutritionist",
          photoUrl: "",
        };
        setUser(nutritionist);
        localStorage.setItem("currentUser", JSON.stringify(nutritionist));
        return;
      }
      
      // Exemplo: paciente paciente@email.com / senha123
      if (email === "paciente@email.com" && password === "senha123") {
        const patient: User = {
          id: "user-1",
          name: "Maria Silva",
          role: "patient",
          patientId: "patient-1", // ID do paciente no sistema
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

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isNutritionist, isPatient }}>
      {children}
    </AuthContext.Provider>
  );
};
