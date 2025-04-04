
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, isNutritionist, isPatient, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Redirecionamento quando o usuário já está autenticado
  useEffect(() => {
    if (user) {
      redirectBasedOnRole();
    }
  }, [user]);

  const redirectBasedOnRole = () => {
    if (isNutritionist()) {
      navigate("/", { replace: true });
    } else if (isPatient()) {
      navigate("/patient/progress", { replace: true });
    } else if (isAdmin()) {
      navigate("/admin/nutritionists", { replace: true });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      toast.success("Login realizado com sucesso!");
      redirectBasedOnRole();
    } catch (error: any) {
      toast.error(`Falha no login: ${error.message || 'Verifique suas credenciais.'}`);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-nutri-secondary">NutriVita<span className="text-nutri-primary">Plan</span></h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Faça login para acessar sua conta</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Digite suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-nutri-primary hover:bg-nutri-secondary" 
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 text-sm">
            <div className="text-gray-500 dark:text-gray-400 text-center">
              <p className="font-medium mb-2">Credenciais de teste:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  <p className="font-semibold">Nutricionista:</p>
                  <p>login@nutricionista.com</p>
                  <p>senha123</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  <p className="font-semibold">Paciente:</p>
                  <p>paciente@email.com</p>
                  <p>senha123</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  <p className="font-semibold">Administrador:</p>
                  <p>admin@email.com</p>
                  <p>admin123</p>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                Você também pode se registrar para criar uma nova conta
              </p>
              <Button 
                variant="link" 
                className="px-0 text-nutri-primary"
                onClick={() => navigate("/signup")}
              >
                Criar conta
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
