
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

export const NotificationsPopover = () => {
  const { notifications, unreadNotificationsCount, markNotificationAsRead, markAllNotificationsAsRead } = useAuth();
  
  const handleMarkAsRead = (id: string) => {
    if (markNotificationAsRead) {
      markNotificationAsRead(id);
    }
  };
  
  const handleMarkAllAsRead = () => {
    if (markAllNotificationsAsRead) {
      markAllNotificationsAsRead();
    }
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {unreadNotificationsCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notificações</h3>
          {unreadNotificationsCount > 0 && (
            <Button variant="link" size="sm" className="h-auto p-0" onClick={handleMarkAllAsRead}>
              Marcar todas como lidas
            </Button>
          )}
        </div>
        {notifications && notifications.length > 0 ? (
          <ScrollArea className="h-[300px]">
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={cn(
                    "p-4 border-b last:border-0 hover:bg-muted/50 transition-colors", 
                    !notification.read && "bg-muted/20"
                  )}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h4 className={cn("text-sm font-medium", !notification.read && "font-semibold")}>
                      {notification.title}
                    </h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {format(notification.date, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">Nenhuma notificação</p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
