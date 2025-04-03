
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

import { Sidebar, SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar";
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
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-nutri-secondary transition-colors duration-300 dark:text-white">
              NutriVita
            </span>
            <span className="text-nutri-primary font-semibold transition-colors duration-300">Plan</span>
          </div>
        </div>

        <div className="flex-1 py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Menu</h2>
            <div className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.path}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground relative group",
                    location.pathname === item.path 
                      ? "text-nutri-primary bg-accent/50" 
                      : "text-gray-600 dark:text-gray-300"
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                  <ChevronRight className={cn(
                    "ml-auto h-4 w-4 opacity-0 transition-all",
                    location.pathname === item.path ? "opacity-100" : "group-hover:opacity-70"
                  )} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t p-3">
          <Link
            to="/profile"
            className={cn(
              "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground mb-1",
              location.pathname === "/profile" 
                ? "text-nutri-primary bg-accent/50" 
                : "text-gray-600 dark:text-gray-300"
            )}
          >
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </Link>
          
          <Link
            to="/settings"
            className={cn(
              "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              location.pathname === "/settings" 
                ? "text-nutri-primary bg-accent/50" 
                : "text-gray-600 dark:text-gray-300"
            )}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Configurações</span>
          </Link>
        </div>
      </div>
    </Sidebar>
  );
};

const AppHeader = () => {
  const { profile, logout } = useAuth();
  
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
                {profile?.name.charAt(0) || "N"}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Layout;
