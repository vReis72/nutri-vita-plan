
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";

import Layout from "./components/Layout";
import PatientLayout from "./components/PatientLayout";
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

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
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
                <Route path="/" element={<PatientProgress />} />
                <Route path="/my-assessments" element={<PatientAssessments />} />
                <Route path="/my-profile" element={<PatientProfile />} />
              </Route>
              
              {/* Rotas de redirecionamento e Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

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
