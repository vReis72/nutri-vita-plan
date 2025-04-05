
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginResponse, setLoginResponse] = useState<any>(null);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [tab, setTab] = useState<'login' | 'info'>('login');
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
        .maybeSingle();
      
      if (profileError) {
        console.warn("Erro ao buscar perfil:", profileError);
        setLoginError("Erro ao carregar perfil de usuário. O sistema pode estar com problemas de configuração.");
        setLoginResponse({ profileError });
      } else if (!profileData) {
        console.warn("Perfil não encontrado para o usuário");
        setLoginError("Perfil de usuário não encontrado. Possível problema com a configuração do banco de dados.");
        setLoginResponse({ profileError: "Perfil não encontrado" });
      } else {
        console.log("Perfil encontrado:", profileData);
        toast.success("Login realizado com sucesso!");
        redirectBasedOnRole();
      }
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
            <Tabs value={tab} onValueChange={(value) => setTab(value as 'login' | 'info')} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="info">Informações</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} className="w-full">
              <TabsContent value="login">
                <div className="mb-4">
                  <CardDescription>
                    Digite suas credenciais para acessar o sistema
                  </CardDescription>
                </div>
                
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
                  
                  <div className="text-center text-sm text-gray-500">
                    <Link to="/signup" className="font-medium text-nutri-primary hover:underline">
                      Registre-se
                    </Link>
                    {" "}se não tem uma conta
                  </div>
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
              </TabsContent>
              
              <TabsContent value="info">
                <div className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Estado do sistema</AlertTitle>
                    <AlertDescription>
                      Há um problema de configuração no banco de dados do Supabase que impede novos registros.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded">
                    <p className="font-semibold mb-2">Erro técnico:</p>
                    <p className="text-sm">O tipo <code>user_role</code> não existe ou há um problema com o trigger <code>handle_new_user</code>.</p>
                  </div>
                  
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded">
                    <p className="font-semibold mb-2">Credenciais de teste:</p>
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div>
                        <p className="font-semibold">Nutricionista:</p>
                        <p>Email: login@nutricionista.com</p>
                        <p>Senha: senha123</p>
                      </div>
                      <div>
                        <p className="font-semibold">Paciente:</p>
                        <p>Email: paciente@email.com</p>
                        <p>Senha: senha123</p>
                      </div>
                      <div>
                        <p className="font-semibold">Administrador:</p>
                        <p>Email: admin@email.com</p>
                        <p>Senha: admin123</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded border border-yellow-200 dark:border-yellow-800">
                    <p className="font-semibold text-yellow-800 dark:text-yellow-400 mb-2">Possíveis soluções:</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-yellow-800 dark:text-yellow-400">
                      <li>Verificar a configuração do Supabase e criar o tipo de enum <code>user_role</code></li>
                      <li>Corrigir o trigger <code>handle_new_user</code> no SQL do Supabase</li>
                      <li>Use as credenciais de teste acima para entrar no sistema</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
