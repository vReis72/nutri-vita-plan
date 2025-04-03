
import React from "react";
import { Link, Outlet } from "react-router-dom";
import { 
  Home, 
  Users, 
  Utensils, 
  BarChart, 
  Calculator, 
  Settings,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export const Layout = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = React.useState(!isMobile);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-md transition-transform duration-300 ease-in-out border-r",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          isMobile && "md:hidden"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-nutri-secondary">
                NutriVita
              </span>
              <span className="ml-1 text-nutri-primary font-semibold">Plan</span>
            </Link>
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                <X size={20} />
              </Button>
            )}
          </div>

          {/* Menu Items */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            <Link
              to="/"
              className="flex items-center px-4 py-3 text-gray-700 rounded-md hover:bg-nutri-light hover:text-nutri-secondary transition-colors"
            >
              <Home size={20} className="mr-3" />
              Dashboard
            </Link>
            <Link
              to="/patients"
              className="flex items-center px-4 py-3 text-gray-700 rounded-md hover:bg-nutri-light hover:text-nutri-secondary transition-colors"
            >
              <Users size={20} className="mr-3" />
              Pacientes
            </Link>
            <Link
              to="/diet-plans"
              className="flex items-center px-4 py-3 text-gray-700 rounded-md hover:bg-nutri-light hover:text-nutri-secondary transition-colors"
            >
              <Utensils size={20} className="mr-3" />
              Planos Alimentares
            </Link>
            <Link
              to="/assessments"
              className="flex items-center px-4 py-3 text-gray-700 rounded-md hover:bg-nutri-light hover:text-nutri-secondary transition-colors"
            >
              <BarChart size={20} className="mr-3" />
              Avaliações
            </Link>
            <Link
              to="/calculator"
              className="flex items-center px-4 py-3 text-gray-700 rounded-md hover:bg-nutri-light hover:text-nutri-secondary transition-colors"
            >
              <Calculator size={20} className="mr-3" />
              Calculadora
            </Link>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <Link
              to="/settings"
              className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-nutri-light hover:text-nutri-secondary transition-colors"
            >
              <Settings size={20} className="mr-3" />
              Configurações
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div 
        className={cn(
          "flex-1 transition-all duration-300",
          sidebarOpen ? (isMobile ? "ml-0" : "ml-64") : "ml-0"
        )}
      >
        {/* Navbar */}
        <header className="bg-white shadow-sm py-3 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {!sidebarOpen && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-2"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu size={20} />
                </Button>
              )}
              <h1 className="text-xl font-semibold text-nutri-secondary">NutriVita Plan</h1>
            </div>
            <div className="flex items-center">
              <div className="rounded-full w-8 h-8 bg-nutri-primary text-white flex items-center justify-center">
                <span className="font-semibold">N</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
