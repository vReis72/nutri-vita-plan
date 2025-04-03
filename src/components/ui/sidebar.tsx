
// src/components/ui/sidebar.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutGroup, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Home, 
  Users, 
  Calculator, 
  ClipboardList, 
  Utensils, 
  Settings, 
  LogOut
} from "lucide-react";

interface SidebarProps {
  className?: string;
  items?: {
    title: string;
    href: string;
    icon: React.ElementType;
  }[];
}

export function Sidebar({ className, items }: SidebarProps) {
  const location = useLocation();
  const { logout, profile } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <div className="rounded-md bg-gradient-to-r from-nutri-secondary to-nutri-primary p-4 text-white flex flex-col">
            <h2 className="mb-2 font-semibold">Bem-vindo(a),</h2>
            <p className="text-sm opacity-90">{profile?.name || "Usuário"}</p>
            <div className="mt-1 px-2 py-1 text-xs bg-white/20 rounded-full w-fit">
              {profile?.role === "nutritionist" && "Nutricionista"}
              {profile?.role === "patient" && "Paciente"}
              {profile?.role === "admin" && "Administrador"}
            </div>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Navegação
          </h2>
          <LayoutGroup>
            <div className="space-y-1">
              {items?.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground relative",
                      isActive ? "text-nutri-primary" : "text-gray-600 dark:text-gray-300"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-indicator"
                        className="absolute left-0 w-1 h-full bg-nutri-primary rounded-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground text-gray-600 dark:text-gray-300"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </button>
            </div>
          </LayoutGroup>
        </div>
      </div>
    </div>
  );
}
