
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

  // Redirect when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      redirectBasedOnRole();
    }
  }, [isAuthenticated, isNutritionist, isPatient, isAdmin]);

  const redirectBasedOnRole = () => {
    console.log("Redirecting based on role");
    
    if (isNutritionist()) {
      console.log("User is nutritionist, redirecting to /");
      navigate("/", { replace: true });
    } else if (isPatient()) {
      console.log("User is patient, redirecting to /patient/progress");
      navigate("/patient/progress", { replace: true });
    } else if (isAdmin()) {
      console.log("User is admin, redirecting to /admin/nutritionists");
      navigate("/admin/nutritionists", { replace: true });
    } else {
      console.log("No role determined for redirect");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Login attempt with:", email);
      await login(email, password);
      toast.success("Login realizado com sucesso!");
      
      // Automatic redirect happens in the useEffect when isAuthenticated updates
    } catch (error: any) {
      console.error("Erro de login:", error);
      toast.error(`Falha no login: ${error.message || "Verifique suas credenciais"}`);
      
      // Add additional user feedback for common error cases
      if (error.message?.includes("Invalid login credentials")) {
        toast.error("Email ou senha incorretos. Verifique as credenciais de teste abaixo.");
      }
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
      console.log("Registration attempt:", { email, name, role });
      await register(email, password, name, role);
      toast.success("Cadastro realizado com sucesso! Você já pode fazer login.");
      setIsSignUp(false); // Volta para a tela de login
    } catch (error: any) {
      console.error("Erro de cadastro:", error);
      toast.error(`Falha no cadastro: ${error.message || "Tente novamente"}`);
      
      // Add specific error handling for common registration issues
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
