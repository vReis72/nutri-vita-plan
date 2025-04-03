
import { useState } from "react";
import { Notification } from "@/types/auth.types";

// Notificações de exemplo, poderá ser conectado ao supabase posteriormente
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Nova avaliação",
      message: "Você tem uma nova avaliação agendada para amanhã às 14h00",
      read: false,
      date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 horas atrás
    },
    {
      id: "2",
      title: "Plano alimentar atualizado",
      message: "Seu plano alimentar foi atualizado pelo nutricionista",
      read: true,
      date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 dia atrás
    },
  ]);

  const hasUnreadNotifications = notifications.some(n => !n.read);

  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return {
    notifications,
    hasUnreadNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  };
};
