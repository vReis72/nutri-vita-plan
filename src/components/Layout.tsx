
import React from "react";
import { Link, Outlet } from "react-router-dom";
import { 
  Home, 
  Users, 
  Utensils, 
  BarChart, 
  Calculator, 
  Settings,
  LogOut
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
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <AppHeader />
          <div className="flex-1 p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <span className="text-xl font-bold text-nutri-secondary">
            NutriVita
          </span>
          <span className="text-nutri-primary font-semibold">Plan</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link to={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
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
          <SidebarMenuButton asChild tooltip="Configurações">
            <Link to="/settings" className="w-full">
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
  
  return (
    <header className="border-b bg-white py-3 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold text-nutri-secondary">NutriVita Plan</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="hidden md:flex">
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
          <Avatar>
            <AvatarImage src="" alt="Nutricionista" />
            <AvatarFallback className="bg-nutri-primary text-white">N</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Layout;
