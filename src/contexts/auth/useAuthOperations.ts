
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, Notification } from "./types";
import { mockUsers, mockNotifications } from "./mockData";

export const useAuthOperations = (user: UserProfile | null, setUser: (user: UserProfile | null) => void) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Calculate unread notifications count
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  
  const loadNotifications = (userId: string) => {
    // In a real implementation, this would be a call to the API
    const userNotifications = mockNotifications.filter(
      notification => notification.recipientId === userId
    );
    setNotifications(userNotifications);
  };

  const login = async (email: string, password: string) => {
    try {
      console.log("Logging in with:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      console.log("Login successful, user will be set by onAuthStateChange");
      
      return;
    } catch (error: any) {
      console.error("Erro no login:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log("Logging out");
      await supabase.auth.signOut();
      setUser(null);
      console.log("Logged out successfully");
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
  
  // Verifies if a patient is associated with the current nutritionist
  const isPatientOfCurrentNutritionist = (patientId: string) => {
    if (!user || user.role !== "nutritionist" || !user.associatedPatients) {
      return false;
    }
    return user.associatedPatients.includes(patientId);
  };
  
  // Transfer a patient to another nutritionist
  const transferPatient = async (patientId: string, newNutritionistId: string) => {
    try {
      // Verify if the current user is a nutritionist
      if (!user || user.role !== "nutritionist") {
        throw new Error("Somente nutricionistas podem transferir pacientes");
      }
      
      // Verify if the patient is associated with the current nutritionist
      if (!isPatientOfCurrentNutritionist(patientId)) {
        throw new Error("Este paciente não está associado a você");
      }
      
      // Update in Supabase
      const { error } = await supabase
        .from('patients')
        .update({ nutritionist_id: newNutritionistId })
        .eq('id', patientId);
        
      if (error) throw error;
      
      // Update local state
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
  
  // Mark a notification as read
  const markNotificationAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map(notification => {
      if (notification.id === notificationId) {
        return { ...notification, read: true };
      }
      return notification;
    });
    setNotifications(updatedNotifications);
  };
  
  // Get all nutritionists (for admin)
  const getAllNutritionists = () => {
    return mockUsers.filter(user => user.role === "nutritionist");
  };
  
  // Get all patients (for admin)
  const getAllPatients = () => {
    return mockUsers.filter(user => user.role === "patient");
  };

  return {
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
  };
};
