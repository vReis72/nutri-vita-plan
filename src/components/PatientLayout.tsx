
import React from "react";
import { Link, Outlet, useLocation, Navigate } from "react-router-dom";
import { Home, BarChart, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { NotificationsPopover } from "@/components/NotificationsPopover";
import { Sidebar, SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar";

// Menu items para pacientes
const patientMenuItems = [
  {
    title: "Meu Progresso",
    icon: Home,
    path: "/patient/progress",
  },
  {
    title: "Minhas Avaliações",
    icon: BarChart,
    path: "/patient/assessments",
  },
];

export const PatientLayout = () => {
  const { logout, user, profile, isPatient } = useAuth();
  
  // Redirecionar se não for paciente ou se o usuário não estiver autenticado
  if (!user || !isPatient()) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background transition-colors duration-300">
        <PatientSidebar />
        <main className="flex-1 flex flex-col">
          <header className="border-b py-3 px-4 bg-background transition-colors duration-300 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="text-foreground transition-colors duration-300" />
                <h1 className="text-xl font-semibold text-nutri-secondary transition-colors duration-300 dark:text-white">NutriVita<span className="text-nutri-primary">Plan</span></h1>
              </div>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <NotificationsPopover />
                
                <Button variant="outline" size="sm" onClick={logout} className="hidden md:flex">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
                
                <Avatar className="border-2 border-transparent hover:border-nutri-primary transition-all duration-200">
                  <AvatarImage src="" alt="Paciente" />
                  <AvatarFallback className="bg-nutri-primary text-white">
                    {profile?.name.charAt(0) || "P"}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>
          <div className="flex-1 p-3 md:p-6 transition-all duration-200">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

const PatientSidebar = () => {
  const location = useLocation();
  const { profile } = useAuth();
  
  return (
    <Sidebar>
      <div className="flex flex-col h-full">
        <div className="flex flex-col items-center gap-2 p-4 border-b">
          <Avatar className="h-20 w-20">
            <AvatarImage src="" alt="Paciente" />
            <AvatarFallback className="bg-nutri-primary text-xl text-white">
              {profile?.name.charAt(0) || "P"}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <p className="font-semibold">{profile?.name || "Paciente"}</p>
            <p className="text-sm text-gray-500">Área do Paciente</p>
          </div>
        </div>

        <div className="flex-1 py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Menu</h2>
            <div className="space-y-1">
              {patientMenuItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.path}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                    location.pathname === item.path 
                      ? "text-nutri-primary bg-accent/50"
                      : "text-gray-600 dark:text-gray-300"
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t p-3">
          <Link
            to="/patient/profile"
            className={cn(
              "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors w-full",
              location.pathname === "/patient/profile"
                ? "text-nutri-primary bg-accent/50"
                : "text-gray-600 dark:text-gray-300"
            )}
          >
            <User className="mr-2 h-4 w-4" />
            <span>Meu Perfil</span>
          </Link>
        </div>
      </div>
    </Sidebar>
  );
};

export default PatientLayout;
