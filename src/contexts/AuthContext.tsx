
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

type UserRole = "nutritionist" | "patient" | "admin";

interface Notification {
  id: string;
  title: string;
  message: string;
  date: Date;
  read: boolean;
  recipientId: string;
}

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
  isAdmin: () => boolean;
  isPatientOfCurrentNutritionist: (patientId: string) => boolean;
  transferPatient: (patientId: string, newNutritionistId: string) => Promise<void>;
  notifications: Notification[];
  markNotificationAsRead: (notificationId: string) => void;
  unreadNotificationsCount: number;
  getAllNutritionists: () => User[];
  getAllPatients: () => User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Mock de notificações para teste
const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Nova avaliação",
    message: "Sua nova avaliação foi agendada para amanhã às 15h",
    date: new Date(),
    read: false,
    recipientId: "user-1"
  },
  {
    id: "2",
    title: "Plano alimentar atualizado",
    message: "Seu nutricionista atualizou seu plano alimentar",
    date: new Date(),
    read: true,
    recipientId: "user-1"
  },
  {
    id: "3",
    title: "Novo paciente",
    message: "Maria Silva foi adicionada à sua lista de pacientes",
    date: new Date(),
    read: false,
    recipientId: "nutr-1"
  }
];

// Mock de usuários para teste
const mockUsers: User[] = [
  // Nutricionistas
  {
    id: "nutr-1",
    name: "Dr. Ana Silva",
    role: "nutritionist",
    photoUrl: "",
    associatedPatients: ["patient-1", "patient-2"]
  },
  {
    id: "nutr-2",
    name: "Dr. Carlos Oliveira",
    role: "nutritionist",
    photoUrl: "",
    associatedPatients: ["patient-3"]
  },
  {
    id: "nutr-3",
    name: "Dr. Marta Souza",
    role: "nutritionist",
    photoUrl: "",
    associatedPatients: []
  },
  // Pacientes
  {
    id: "user-1",
    name: "Maria Silva",
    role: "patient",
    patientId: "patient-1",
    nutritionistId: "nutr-1"
  },
  {
    id: "user-2",
    name: "João Santos",
    role: "patient",
    patientId: "patient-2",
    nutritionistId: "nutr-1"
  },
  {
    id: "user-3",
    name: "Pedro Costa",
    role: "patient",
    patientId: "patient-3",
    nutritionistId: "nutr-2"
  },
  // Admin
  {
    id: "admin-1",
    name: "Admin",
    role: "admin"
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Calcular o número de notificações não lidas
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Simular verificação de localStorage ao iniciar
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error("Erro ao analisar usuário do localStorage:", error);
          localStorage.removeItem("currentUser"); // Remove dados inválidos
        }
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  // Carregar notificações do usuário quando ele for autenticado
  useEffect(() => {
    if (user) {
      // Em uma implementação real, aqui seria uma chamada à API
      const userNotifications = mockNotifications.filter(
        notification => notification.recipientId === user.id
      );
      setNotifications(userNotifications);
    } else {
      setNotifications([]);
    }
  }, [user]);

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
      
      // Exemplo: admin
      if (email === "admin@email.com" && password === "admin123") {
        const admin: User = {
          id: "admin-1",
          name: "Admin",
          role: "admin"
        };
        setUser(admin);
        localStorage.setItem("currentUser", JSON.stringify(admin));
        return;
      }
      
      throw new Error("Credenciais inválidas");
    } catch (error) {
      console.error("Erro no login:", error);
      localStorage.removeItem("currentUser"); // Limpa dados em caso de erro
      setUser(null);
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
  
  const isAdmin = () => {
    return user?.role === "admin";
  };
  
  // Verifica se um paciente está associado ao nutricionista atual
  const isPatientOfCurrentNutritionist = (patientId: string) => {
    if (!user || user.role !== "nutritionist" || !user.associatedPatients) {
      return false;
    }
    return user.associatedPatients.includes(patientId);
  };
  
  // Transferir um paciente para outro nutricionista
  const transferPatient = async (patientId: string, newNutritionistId: string) => {
    try {
      // Em uma implementação real, aqui seria uma chamada à API
      
      // Verificar se o usuário atual é um nutricionista
      if (!user || user.role !== "nutritionist") {
        throw new Error("Somente nutricionistas podem transferir pacientes");
      }
      
      // Verificar se o paciente está associado ao nutricionista atual
      if (!isPatientOfCurrentNutritionist(patientId)) {
        throw new Error("Este paciente não está associado a você");
      }
      
      // Atualizar o localStorage para simular a transferência
      
      // 1. Remover o paciente da lista do nutricionista atual
      const updatedUser = { ...user };
      if (updatedUser.associatedPatients) {
        updatedUser.associatedPatients = updatedUser.associatedPatients.filter(
          id => id !== patientId
        );
        setUser(updatedUser);
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      }
      
      // Simulando sucesso
      toast.success("Paciente transferido com sucesso.");
      
      return;
    } catch (error) {
      toast.error("Erro ao transferir paciente.");
      throw error;
    }
  };
  
  // Marcar uma notificação como lida
  const markNotificationAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map(notification => {
      if (notification.id === notificationId) {
        return { ...notification, read: true };
      }
      return notification;
    });
    setNotifications(updatedNotifications);
  };
  
  // Obter todos os nutricionistas (para admin)
  const getAllNutritionists = () => {
    return mockUsers.filter(user => user.role === "nutritionist");
  };
  
  // Obter todos os pacientes (para admin)
  const getAllPatients = () => {
    return mockUsers.filter(user => user.role === "patient");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      logout, 
      isNutritionist, 
      isPatient,
      isAdmin,
      isPatientOfCurrentNutritionist,
      transferPatient,
      notifications,
      markNotificationAsRead,
      unreadNotificationsCount,
      getAllNutritionists,
      getAllPatients
    }}>
      {children}
    </AuthContext.Provider>
  );
};
