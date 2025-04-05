
import React, { createContext, useContext, useState, useEffect } from "react";
import { useSupabaseAuth } from "./auth/useSupabaseAuth";
import { useAuthOperations } from "./auth/useAuthOperations";
import { AuthContextType, UserProfile } from "./auth/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Use our new hooks
  const { user, setUser } = useSupabaseAuth(setIsLoading);
  const {
    login,
    logout,
    isNutritionist,
    isPatient,
    isAdmin,
    isPatientOfCurrentNutritionist,
    transferPatient,
    notifications,
    loadNotifications,
    markNotificationAsRead,
    unreadNotificationsCount,
    getAllNutritionists,
    getAllPatients
  } = useAuthOperations(user, setUser);
  
  // Load user notifications when authenticated
  useEffect(() => {
    if (user) {
      loadNotifications(user.id);
    }
  }, [user]);

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
