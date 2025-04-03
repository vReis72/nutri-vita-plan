
import React, { createContext, ReactNode, useContext } from "react";
import { useAuth as useAuthHook } from "@/hooks/useAuth";
import { useRoleChecks } from "@/hooks/useRoleChecks";
import { useDataFetching } from "@/hooks/useDataFetching";
import { useNotifications } from "@/hooks/useNotifications";
import { AuthContextType } from "@/types/auth.types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuthHook();
  const roleChecks = useRoleChecks(auth.profile);
  const dataFetching = useDataFetching(auth.profile, auth.nutritionist?.id || null);
  const notificationsSystem = useNotifications();

  // Create a properly typed context value that matches AuthContextType
  const value: AuthContextType = {
    user: auth.user,
    profile: auth.profile,
    nutritionist: auth.nutritionist,
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
