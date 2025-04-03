
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";

import Layout from "./components/Layout";
import PatientLayout from "./components/PatientLayout";
import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Patients from "./pages/Patients";
import Calculator from "./pages/Calculator";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import PatientProgress from "./pages/PatientProgress";
import PatientAssessments from "./pages/PatientAssessments";
import PatientProfile from "./pages/PatientProfile";

// Admin pages
import Nutritionists from "./pages/admin/Nutritionists";
import AdminPatients from "./pages/admin/Patients";
import Settings from "./pages/admin/Settings";

const queryClient = new QueryClient();

const App = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Rota pública de login */}
              <Route path="/login" element={<Login />} />
              
              {/* Rotas para nutricionistas */}
              <Route 
                element={
                  <ProtectedRoute allowedRoles={["nutritionist"]}>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route path="/" element={<Index />} />
                <Route path="/patients" element={<Patients />} />
                <Route path="/calculator" element={<Calculator />} />
                <Route path="/diet-plans" element={<PlaceholderPage title="Planos Alimentares" />} />
                <Route path="/assessments" element={<PlaceholderPage title="Avaliações" />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<PlaceholderPage title="Configurações" />} />
              </Route>
              
              {/* Rotas para pacientes */}
              <Route 
                element={
                  <ProtectedRoute allowedRoles={["patient"]}>
                    <PatientLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/patient" element={<Navigate to="/patient/progress" replace />} />
                <Route path="/patient/progress" element={<PatientProgress />} />
                <Route path="/patient/assessments" element={<PatientAssessments />} />
                <Route path="/patient/profile" element={<PatientProfile />} />
              </Route>
              
              {/* Rotas para admin */}
              <Route 
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/admin" element={<Navigate replace to="/admin/nutritionists" />} />
                <Route path="/admin/nutritionists" element={<Nutritionists />} />
                <Route path="/admin/patients" element={<AdminPatients />} />
                <Route path="/admin/settings" element={<Settings />} />
              </Route>
              
              {/* Rota inicial - Redirecionamento baseado em autenticação */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

// Componente temporário para páginas ainda não implementadas
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
      <p className="text-gray-500 dark:text-gray-400 mt-1">Esta página está em desenvolvimento</p>
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm text-center">
      <p className="text-lg text-gray-600 dark:text-gray-300">Conteúdo desta seção será implementado em breve.</p>
    </div>
  </div>
);

export default App;
