
import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Home, BarChart, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider, 
  SidebarTrigger 
} from "@/components/ui/sidebar";

// Menu items para pacientes
const patientMenuItems = [
  {
    title: "Meu Progresso",
    icon: Home,
    path: "/",
  },
  {
    title: "Minhas Avaliações",
    icon: BarChart,
    path: "/my-assessments",
  },
];

export const PatientLayout = () => {
  const { logout, user } = useAuth();
  
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
                
                <Button variant="outline" size="sm" onClick={logout} className="hidden md:flex">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
                
                <Avatar className="border-2 border-transparent hover:border-nutri-primary transition-all duration-200">
                  <AvatarImage src="" alt="Paciente" />
                  <AvatarFallback className="bg-nutri-primary text-white">
                    {user?.name.charAt(0) || "P"}
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
  const { user } = useAuth();
  
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex flex-col items-center gap-2 p-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="" alt="Paciente" />
            <AvatarFallback className="bg-nutri-primary text-xl text-white">
              {user?.name.charAt(0) || "P"}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <p className="font-semibold">{user?.name || "Paciente"}</p>
            <p className="text-sm text-gray-500">Área do Paciente</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {patientMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} 
                    data-active={location.pathname === item.path}>
                    <Link to={item.path} className="group">
                      <item.icon className={cn(
                        "h-4 w-4 transition-transform duration-200", 
                        location.pathname === item.path ? "text-nutri-primary" : ""
                      )} />
                      <span className={cn(
                        location.pathname === item.path ? "font-medium" : ""
                      )}>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-3 py-2">
          <SidebarMenuButton asChild tooltip="Meu Perfil">
            <Link to="/my-profile" className={cn(
              "w-full transition-colors",
              location.pathname === "/my-profile" ? "text-nutri-primary" : ""
            )}>
              <User className="h-4 w-4" />
              <span>Meu Perfil</span>
            </Link>
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default PatientLayout;
