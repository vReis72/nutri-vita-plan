
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

    try {
      console.log(`Tentando login com email: ${email}`);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("Erro no login:", error);
        setLoginError(error.message);
        toast.error(`Falha no login: ${error.message || 'Verifique suas credenciais.'}`);
        throw error;
      }

      console.log("Login bem-sucedido:", data);
      
      // Verificar se o perfil do usuário existe
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user?.id)
        .maybeSingle();
      
      if (profileError) {
        console.warn("Erro ao buscar perfil:", profileError);
        setLoginError("Erro ao carregar perfil de usuário.");
      } else if (!profileData) {
        console.warn("Perfil não encontrado para o usuário");
        
        // Tentar criar um perfil para o usuário
        try {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([{ 
              id: data.user?.id,
              name: data.user?.email || 'Usuário', 
              role: 'patient'
            }]);
            
          if (insertError) {
            console.error("Erro ao criar perfil:", insertError);
            setLoginError("Não foi possível criar um perfil para o usuário.");
          } else {
            console.log("Perfil criado com sucesso");
            toast.success("Login realizado com sucesso!");
            redirectBasedOnRole();
          }
        } catch (createError) {
          console.error("Erro ao criar perfil:", createError);
          setLoginError("Erro ao criar perfil de usuário.");
        }
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
                
                <div className="mt-5 pt-5 border-t">
                  <div className="text-gray-500 dark:text-gray-400 text-center">
                    <p className="font-medium mb-2">Credenciais de teste:</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-left">
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
                </div>
              </TabsContent>
              
              <TabsContent value="info">
                <div className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Sistema atualizado</AlertTitle>
                    <AlertDescription>
                      A configuração do banco de dados foi corrigida e o cadastro de novos usuários deve funcionar normalmente agora.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded">
                    <p className="font-semibold mb-2">Alterações realizadas:</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Criação do tipo <code>user_role</code> no banco de dados</li>
                      <li>Correção do trigger <code>handle_new_user</code> no Supabase</li>
                      <li>Ajustes na interface para melhor experiência do usuário</li>
                    </ul>
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
