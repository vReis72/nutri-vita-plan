
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { SignupForm } from "@/components/auth/SignupForm";
import { QuickLoginForm } from "@/components/auth/QuickLoginForm";
import { TestCredentials } from "@/components/auth/TestCredentials";

const Signup = () => {
  const [tab, setTab] = useState<'signup' | 'login'>('signup');
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirecionamento quando o usuário já está autenticado
  useEffect(() => {
    if (user) {
      redirectBasedOnRole();
    }
  }, [user]);

  const redirectBasedOnRole = () => {
    if (user?.role === "nutritionist") {
      navigate("/", { replace: true });
    } else if (user?.role === "patient") {
      navigate("/patient/progress", { replace: true });
    } else if (user?.role === "admin") {
      navigate("/admin/nutritionists", { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-nutri-secondary">NutriVita<span className="text-nutri-primary">Plan</span></h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Acesse a plataforma de nutrição</p>
        </div>

        <Card>
          <CardHeader>
            <Tabs value={tab} onValueChange={(value) => setTab(value as 'signup' | 'login')} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signup">Cadastrar</TabsTrigger>
                <TabsTrigger value="login">Login</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} className="w-full">
              <TabsContent value="signup">
                <div className="mb-4">
                  <CardDescription>
                    Preencha os dados abaixo para criar sua conta
                  </CardDescription>
                </div>
                <SignupForm />
              </TabsContent>
              
              <TabsContent value="login">
                <div className="mb-4">
                  <CardDescription>
                    Digite suas credenciais para acessar o sistema
                  </CardDescription>
                </div>
                
                <QuickLoginForm onSuccess={() => redirectBasedOnRole()} />
                
                <TestCredentials />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="text-center text-sm text-gray-500">
          <p>
            Ao se cadastrar, você concorda com nossos{" "}
            <Link to="#" className="font-semibold text-nutri-primary hover:underline">
              Termos de Serviço
            </Link>{" "}
            e{" "}
            <Link to="#" className="font-semibold text-nutri-primary hover:underline">
              Política de Privacidade
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
