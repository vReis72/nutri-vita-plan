
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginResponse, setLoginResponse] = useState<any>(null);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const { user, isNutritionist, isPatient, isAdmin } = useAuth();
  const navigate = useNavigate();

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
    setLoginError(null);
    setLoginResponse(null);

    try {
      console.log(`Tentando login com email: ${email}`);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("Erro no login:", error);
        setLoginError(error.message);
        setLoginResponse({ error });
        toast.error(`Falha no login: ${error.message || 'Verifique suas credenciais.'}`);
        throw error;
      }

      console.log("Login bem-sucedido:", data);
      setLoginResponse({ data });
      
      // Verificar se o perfil do usuário existe
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user?.id)
        .single();
      
      if (profileError) {
        console.warn("Perfil não encontrado ou incompleto:", profileError);
        // Continuamos mesmo sem perfil, o AuthContext tentará lidar com isso
      } else {
        console.log("Perfil encontrado:", profileData);
      }
      
      toast.success("Login realizado com sucesso!");
      redirectBasedOnRole();
    } catch (error: any) {
      console.error("Erro detalhado:", error);
      // Não exibimos toast aqui porque já fizemos isso acima
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDebugInfo = () => {
    setShowDebugInfo(!showDebugInfo);
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
              
              {loginError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erro de autenticação</AlertTitle>
                  <AlertDescription>
                    {loginError}
                  </AlertDescription>
                </Alert>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-nutri-primary hover:bg-nutri-secondary" 
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
            
            {showDebugInfo && loginResponse && (
              <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-auto max-h-40">
                <p className="font-semibold mb-1">Informações de depuração:</p>
                <pre className="whitespace-pre-wrap break-words">
                  {JSON.stringify(loginResponse, null, 2)}
                </pre>
              </div>
            )}
            
            <div className="mt-4 text-right">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleDebugInfo}
                className="text-xs text-gray-500"
              >
                {showDebugInfo ? "Ocultar" : "Depurar"}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 text-sm">
            <div className="text-gray-500 dark:text-gray-400 text-center">
              <p className="font-medium mb-2">É necessário criar uma conta no SupaBase</p>
              <div className="grid grid-cols-1 gap-3 text-left">
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  <p className="font-semibold mb-1">Importante:</p>
                  <p>É necessário criar uma conta no registro para usar o sistema.</p>
                  <p>As credenciais de teste anteriores não funcionarão.</p>
                  <p>Para usar o sistema, crie uma conta na página de cadastro.</p>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                Não tem uma conta ainda?{" "}
                <Link to="/signup" className="font-medium text-nutri-primary hover:underline">
                  Registre-se
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
