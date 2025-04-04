
import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { 
  Home, 
  Users, 
  Utensils, 
  BarChart, 
  Calculator, 
  Settings,
  LogOut,
  ChevronRight,
  User
} from "lucide-react";

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
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

// Menu items
const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    path: "/",
  },
  {
    title: "Pacientes",
    icon: Users,
    path: "/patients",
  },
  {
    title: "Planos Alimentares",
    icon: Utensils,
    path: "/diet-plans",
  },
  {
    title: "Avaliações",
    icon: BarChart,
    path: "/assessments",
  },
  {
    title: "Calculadora",
    icon: Calculator,
    path: "/calculator",
  },
];

export const Layout = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background transition-colors duration-300">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <AppHeader />
          <div className="flex-1 p-3 md:p-6 transition-all duration-200">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

const AppSidebar = () => {
  const location = useLocation();
  
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <span className="text-xl font-bold text-nutri-secondary transition-colors duration-300 dark:text-white">
            NutriVita
          </span>
          <span className="text-nutri-primary font-semibold transition-colors duration-300">Plan</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
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
                      <ChevronRight className={cn(
                        "ml-auto h-4 w-4 opacity-0 transition-all",
                        location.pathname === item.path ? "opacity-100" : "group-hover:opacity-70"
                      )} />
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
          <SidebarMenuButton asChild tooltip="Perfil">
            <Link to="/profile" className={cn(
              "w-full transition-colors",
              location.pathname === "/profile" ? "text-nutri-primary" : ""
            )}>
              <User className="h-4 w-4" />
              <span>Perfil</span>
            </Link>
          </SidebarMenuButton>
        </div>
        <div className="px-3 py-2">
          <SidebarMenuButton asChild tooltip="Configurações">
            <Link to="/settings" className={cn(
              "w-full transition-colors",
              location.pathname === "/settings" ? "text-nutri-primary" : ""
            )}>
              <Settings className="h-4 w-4" />
              <span>Configurações</span>
            </Link>
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

const AppHeader = () => {
  const { toggleSidebar } = useSidebar();
  const { user, logout } = useAuth();
  
  return (
    <header className="border-b py-3 px-4 bg-background transition-colors duration-300 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="text-foreground transition-colors duration-300" />
          <h1 className="text-xl font-semibold text-nutri-secondary transition-colors duration-300 dark:text-white">NutriVita Plan</h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <Button variant="outline" size="sm" onClick={logout} className="hidden md:flex">
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
          
          <Link to="/profile">
            <Avatar className="border-2 border-transparent hover:border-nutri-primary transition-all duration-200">
              <AvatarImage src="" alt="Nutricionista" />
              <AvatarFallback className="bg-nutri-primary text-white">
                {user?.name.charAt(0) || "N"}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Layout;
