
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState<"nutritionist" | "patient" | "admin">("patient");
  const [isLoading, setIsLoading] = useState(false);
  const { user, login, signup, isNutritionist, isPatient, isAdmin } = useAuth();
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success("Login realizado com sucesso!");
      // O redirecionamento acontece pelo useEffect quando o usuário for definido
    } catch (error: any) {
      console.error("Erro de login:", error);
      toast.error(`Falha no login: ${error.message || "Verifique suas credenciais"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!name) {
      toast.error("Por favor, informe seu nome");
      setIsLoading(false);
      return;
    }

    try {
      await signup(email, password, name, role);
      toast.success("Cadastro realizado com sucesso! Verifique seu email para confirmação.");
      setIsSignUp(false); // Volta para a tela de login
    } catch (error: any) {
      console.error("Erro de cadastro:", error);
      toast.error(`Falha no cadastro: ${error.message || "Tente novamente"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-nutri-secondary">NutriVita<span className="text-nutri-primary">Plan</span></h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {isSignUp ? "Crie sua conta para acessar o sistema" : "Faça login para acessar sua conta"}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isSignUp ? "Cadastro" : "Login"}</CardTitle>
            <CardDescription>
              {isSignUp ? "Preencha seus dados para criar uma conta" : "Digite suas credenciais para acessar o sistema"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}
              
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
              
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="role">Tipo de conta</Label>
                  <select
                    id="role"
                    className="w-full rounded-md border border-gray-300 bg-background px-3 py-2"
                    value={role}
                    onChange={(e) => setRole(e.target.value as "nutritionist" | "patient" | "admin")}
                  >
                    <option value="patient">Paciente</option>
                    <option value="nutritionist">Nutricionista</option>
                  </select>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-nutri-primary hover:bg-nutri-secondary" 
                disabled={isLoading}
              >
                {isLoading ? "Processando..." : isSignUp ? "Cadastrar" : "Entrar"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 text-sm">
            <button 
              type="button" 
              onClick={() => setIsSignUp(!isSignUp)} 
              className="text-nutri-primary hover:underline"
            >
              {isSignUp ? "Já possui uma conta? Faça login" : "Não possui uma conta? Cadastre-se"}
            </button>
            
            {!isSignUp && (
              <div className="text-gray-500 dark:text-gray-400 text-center mt-4">
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
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
