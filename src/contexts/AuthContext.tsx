
import React, { createContext, ReactNode, useContext } from "react";
import { useAuth as useAuthHook } from "@/hooks/useAuth";
import { useRoleChecks } from "@/hooks/useRoleChecks";
import { useDataFetching } from "@/hooks/useDataFetching";
import { useNotifications } from "@/hooks/useNotifications";
import { AuthContextType, NutritionistProfile } from "@/types/auth.types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuthHook();
  const roleChecks = useRoleChecks(auth.profile);
  const dataFetching = useDataFetching(auth.profile, auth.nutritionist?.id || null);
  const notificationsSystem = useNotifications();

  // Garantir que o perfil de nutricionista seja corretamente convertido
  const nutritionistProfile = auth.nutritionist ? {
    id: auth.nutritionist.id,
    profileId: auth.nutritionist.profileId,
    specialization: auth.nutritionist.specialization || null,
    biography: auth.nutritionist.biography || null,
    yearsOfExperience: auth.nutritionist.yearsOfExperience || 0,
    createdAt: auth.nutritionist.createdAt || new Date(),
    updatedAt: auth.nutritionist.updatedAt || new Date()
  } as NutritionistProfile : null;

  // Criar um valor de contexto adequadamente tipado que corresponda a AuthContextType
  const value: AuthContextType = {
    user: auth.user,
    profile: auth.profile,
    nutritionist: nutritionistProfile,
    patient: auth.patient,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    login: auth.login,
    logout: auth.logout,
    register: auth.register,
    signup: auth.signup,
    loginWithProvider: auth.loginWithProvider,
    updateProfile: auth.updateProfile,
    ...roleChecks,
    ...dataFetching,
    notifications: notificationsSystem.notifications,
    unreadNotificationsCount: notificationsSystem.hasUnreadNotifications ? 1 : 0,
    markNotificationAsRead: notificationsSystem.markNotificationAsRead,
    markAllNotificationsAsRead: notificationsSystem.markAllNotificationsAsRead,
    hasUnreadNotifications: notificationsSystem.hasUnreadNotifications,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
