
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import TestCredentials from "@/components/auth/TestCredentials";
import { UserRole } from "@/types/auth.types";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("patient");
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, login, register, loginWithProvider, isNutritionist, isPatient, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Verificar autenticação e redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      console.log("Usuário autenticado, redirecionando com base no perfil");
      redirectBasedOnRole();
    }
  }, [isAuthenticated]);

  const redirectBasedOnRole = () => {
    console.log("Redirecionando com base na função");
    
    // Adicionar um pequeno atraso para garantir que os estados estejam atualizados
    setTimeout(() => {
      if (isNutritionist()) {
        console.log("Usuário é nutricionista, redirecionando para /");
        navigate("/", { replace: true });
      } else if (isPatient()) {
        console.log("Usuário é paciente, redirecionando para /patient/progress");
        navigate("/patient/progress", { replace: true });
      } else if (isAdmin()) {
        console.log("Usuário é administrador, redirecionando para /admin/nutritionists");
        navigate("/admin/nutritionists", { replace: true });
      } else {
        console.log("Função não determinada para redirecionamento");
        // Redirecionar para uma página segura caso não seja possível determinar a função
        navigate("/", { replace: true });
      }
    }, 500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    
    setIsLoading(true);

    try {
      console.log("Tentativa de login com:", email);
      await login(email, password);
      toast.success("Login realizado com sucesso!");
      
      // O redirecionamento automático acontece no useEffect quando isAuthenticated é atualizado
    } catch (error: any) {
      console.error("Erro de login:", error);
      toast.error(`Falha no login: ${error.message || "Verifique suas credenciais"}`);
      
      // Adicionar feedback de usuário adicional para casos de erro comuns
      if (error.message?.includes("Invalid login credentials")) {
        toast.error("Email ou senha incorretos. Verifique as credenciais de teste abaixo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !name) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    
    setIsLoading(true);

    try {
      console.log("Tentativa de cadastro:", { email, name, role });
      await register(email, password, name, role);
      toast.success("Cadastro realizado com sucesso! Você já pode fazer login.");
      setIsSignUp(false); // Volta para a tela de login
    } catch (error: any) {
      console.error("Erro de cadastro:", error);
      toast.error(`Falha no cadastro: ${error.message || "Tente novamente"}`);
      
      // Lidar com erros específicos de registro comuns
      if (error.message?.includes("already registered")) {
        toast.error("Este email já está registrado. Tente fazer login.");
      }
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
            {isSignUp ? (
              <SignupForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                name={name}
                setName={setName}
                role={role}
                setRole={setRole}
                isLoading={isLoading}
                onSubmit={handleSignUp}
              />
            ) : (
              <LoginForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                isLoading={isLoading}
                onSubmit={handleLogin}
                onSocialLogin={handleSocialLogin}
              />
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
            
            {!isSignUp && <TestCredentials />}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
