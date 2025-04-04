import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

type UserRole = "nutritionist" | "patient" | "admin";

interface Notification {
  id: string;
  title: string;
  message: string;
  date: Date;
  read: boolean;
  recipientId: string;
}

interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  photoUrl?: string;
  patientId?: string; 
  nutritionistId?: string;
  associatedPatients?: string[];
}

interface AuthContextType {
  user: UserProfile | null;
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
  getAllNutritionists: () => UserProfile[];
  getAllPatients: () => UserProfile[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Mock de notificações para teste (manteremos por enquanto)
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

// Mock de usuários para teste (manteremos por enquanto)
const mockUsers: UserProfile[] = [
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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Calcular o número de notificações não lidas
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Monitorar o estado de autenticação do Supabase
  useEffect(() => {
    // Configurar o listener de mudanças de autenticação PRIMEIRO
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        
        if (currentSession && currentSession.user) {
          // Buscar perfil do usuário do Supabase
          try {
            setTimeout(async () => {
              const { data: profileData, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', currentSession.user.id)
                .single();
                
              if (error) throw error;
              
              if (profileData) {
                const userProfile: UserProfile = {
                  id: profileData.id,
                  name: profileData.name,
                  role: profileData.role,
                  photoUrl: profileData.photo_url || undefined,
                };
                
                // Se for nutricionista, buscar pacientes associados
                if (profileData.role === 'nutritionist') {
                  const { data: nutritionistData } = await supabase
                    .from('nutritionists')
                    .select('id')
                    .eq('profile_id', profileData.id)
                    .single();
                    
                  if (nutritionistData) {
                    userProfile.nutritionistId = nutritionistData.id;
                    
                    // Buscar pacientes associados
                    const { data: patientData } = await supabase
                      .from('patients')
                      .select('id')
                      .eq('nutritionist_id', nutritionistData.id);
                      
                    if (patientData) {
                      userProfile.associatedPatients = patientData.map(p => p.id);
                    }
                  }
                }
                
                // Se for paciente, buscar nutricionista associado
                if (profileData.role === 'patient') {
                  const { data: patientData } = await supabase
                    .from('patients')
                    .select('id, nutritionist_id')
                    .eq('profile_id', profileData.id)
                    .single();
                    
                  if (patientData) {
                    userProfile.patientId = patientData.id;
                    userProfile.nutritionistId = patientData.nutritionist_id || undefined;
                  }
                }
                
                setUser(userProfile);
              }
            }, 0);
          } catch (error) {
            console.error('Erro ao buscar perfil:', error);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    );

    // DEPOIS verificar sessão existente
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      
      if (currentSession && currentSession.user) {
        // A busca do perfil vai acontecer via onAuthStateChange
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      // O usuário será definido pelo onAuthStateChange
      return;
    } catch (error: any) {
      console.error("Erro no login:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Erro no logout:", error);
      toast.error("Erro ao fazer logout.");
    }
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
      // Em uma implementação real, aqui seria uma chamada à API do Supabase
      
      // Verificar se o usuário atual é um nutricionista
      if (!user || user.role !== "nutritionist") {
        throw new Error("Somente nutricionistas podem transferir pacientes");
      }
      
      // Verificar se o paciente está associado ao nutricionista atual
      if (!isPatientOfCurrentNutritionist(patientId)) {
        throw new Error("Este paciente não está associado a você");
      }
      
      // Atualizar no Supabase
      const { error } = await supabase
        .from('patients')
        .update({ nutritionist_id: newNutritionistId })
        .eq('id', patientId);
        
      if (error) throw error;
      
      // Atualizar o estado local
      if (user.associatedPatients) {
        const updatedUser = { ...user };
        updatedUser.associatedPatients = updatedUser.associatedPatients.filter(
          id => id !== patientId
        );
        setUser(updatedUser);
      }
      
      toast.success("Paciente transferido com sucesso.");
      
      return;
    } catch (error: any) {
      toast.error(`Erro ao transferir paciente: ${error.message}`);
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
