
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState<"nutritionist" | "patient" | "admin">("patient");
  const [isLoading, setIsLoading] = useState(false);
  const { user, login, register, loginWithProvider, isNutritionist, isPatient, isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirecionamento quando o usuário já está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      redirectBasedOnRole();
    }
  }, [isAuthenticated]);

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
      await register(email, password, name, role);
      toast.success("Cadastro realizado com sucesso! Verifique seu email para confirmação.");
      setIsSignUp(false); // Volta para a tela de login
    } catch (error: any) {
      console.error("Erro de cadastro:", error);
      toast.error(`Falha no cadastro: ${error.message || "Tente novamente"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google") => {
    try {
      setIsLoading(true);
      console.log(`Iniciando login com ${provider}`);
      await loginWithProvider(provider);
      // O usuário será redirecionado para a página do provedor
    } catch (error: any) {
      console.error(`Erro ao fazer login com ${provider}:`, error);
      toast.error(`Falha ao conectar com ${provider}: ${error.message}`);
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

            {!isSignUp && (
              <>
                <div className="relative mt-6">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Ou continue com
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleSocialLogin("google")}
                    disabled={isLoading}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Google
                  </Button>
                </div>
              </>
            )}
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
