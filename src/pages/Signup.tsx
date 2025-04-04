
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, AlertTriangleIcon, MailIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const signupSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(6, "Confirme sua senha"),
  role: z.enum(["patient", "nutritionist"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [dbError, setDbError] = useState<boolean>(false);
  const [showAuthErrorDialog, setShowAuthErrorDialog] = useState<boolean>(false);
  const [authErrorMessage, setAuthErrorMessage] = useState<string>("");
  const [tab, setTab] = useState<'signup' | 'login'>('signup');
  
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "patient",
    },
  });

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

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    
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

  const handleSignup = async (data: SignupFormData) => {
    setIsLoading(true);
    setErrorDetails(null);
    setDbError(false);
    setShowAuthErrorDialog(false);

    try {
      const { email, password, name, role } = data;
      
      console.log("Tentando criar usuário com:", { email, name, role });
      
      // Try to create the user with minimal options first
      const { data: authData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
          emailRedirectTo: window.location.origin + "/login",
        }
      });

      if (error) {
        console.error("Erro de autenticação:", error);
        setErrorDetails(JSON.stringify(error, null, 2));
        
        if (error.message?.includes("already registered")) {
          toast.error("Este e-mail já está registrado. Tente fazer login.");
          setTab('login');
        } else if (error.status === 500) {
          setDbError(true);
          setAuthErrorMessage("Erro interno no servidor de autenticação. Isso pode ser causado por um problema na configuração do banco de dados.");
          setShowAuthErrorDialog(true);
          toast.error("Erro no servidor. Entre em contato com o suporte técnico.");
        } else {
          toast.error(`Falha no registro: ${error.message || "Erro desconhecido"}`);
        }
        throw error;
      }

      if (authData && authData.user) {
        console.log("Usuário criado com sucesso:", authData.user.id);
        toast.success("Registro realizado com sucesso! Verifique seu email para confirmar sua conta.");
        
        // Aguardar um momento para garantir que o trigger handle_new_user seja executado
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        console.error("Dados de autenticação incompletos");
        setErrorDetails("Dados de autenticação retornados pelo Supabase estão incompletos");
        toast.error("Falha no registro: dados de autenticação incompletos");
      }
      
    } catch (error: any) {
      console.error("Erro detalhado ao registrar:", error);
      
      if (typeof error === 'object' && error !== null) {
        setErrorDetails(JSON.stringify(error, null, 2));
      } else {
        setErrorDetails(String(error));
      }
      
      // O tratamento específico dos erros já está sendo feito acima
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-nutri-secondary">NutriVita<span className="text-nutri-primary">Plan</span></h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Acesse a plataforma de nutrição</p>
          </div>

          {dbError && (
            <Alert variant="destructive" className="mb-4">
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Problema no banco de dados</AlertTitle>
              <AlertDescription>
                Detectamos um problema de configuração no banco de dados. 
                Por favor, entre em contato com o suporte técnico e informe o erro abaixo.
              </AlertDescription>
            </Alert>
          )}

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
              <TabsContent value="signup">
                <div className="mb-4">
                  <CardDescription>
                    Preencha os dados abaixo para criar sua conta
                  </CardDescription>
                </div>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSignup)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome completo</FormLabel>
                          <FormControl>
                            <Input placeholder="Seu nome completo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="seu.email@exemplo.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="******" {...field} />
                          </FormControl>
                          <FormDescription>
                            Mínimo de 6 caracteres
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirme sua senha</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="******" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de conta</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo de conta" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="patient">Paciente</SelectItem>
                              <SelectItem value="nutritionist">Nutricionista</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Escolha o tipo de conta que deseja criar
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full bg-nutri-primary hover:bg-nutri-secondary" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Cadastrando..." : "Cadastrar"}
                    </Button>
                    
                    <div className="text-center text-sm text-gray-500">
                      Problemas no cadastro?{" "}
                      <Link to="/login" className="font-semibold text-nutri-primary hover:underline">
                        Entre em contato
                      </Link>
                    </div>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="login">
                <div className="mb-4">
                  <CardDescription>
                    Digite suas credenciais para acessar o sistema
                  </CardDescription>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu.email@exemplo.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <FormLabel htmlFor="password">Senha</FormLabel>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="******"
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
                  
                  <div className="text-center text-sm text-gray-500">
                    <Link to="#" className="font-semibold text-nutri-primary hover:underline">
                      Esqueceu sua senha?
                    </Link>
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
              
              {errorDetails && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-xs overflow-auto max-h-40">
                  <p className="font-semibold text-red-600 dark:text-red-400 mb-1">Detalhes do erro (para suporte técnico):</p>
                  <pre className="whitespace-pre-wrap break-words text-red-600 dark:text-red-400">{errorDetails}</pre>
                </div>
              )}
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

      <Dialog open={showAuthErrorDialog} onOpenChange={setShowAuthErrorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangleIcon className="h-5 w-5 text-destructive" />
              Erro de Autenticação
            </DialogTitle>
            <DialogDescription>
              {authErrorMessage}
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted/50 p-3 rounded-md text-sm">
            <p className="font-medium">Possíveis causas:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>O tipo <code>user_role</code> não existe no banco de dados</li>
              <li>O trigger <code>handle_new_user</code> está com erro</li>
              <li>Há um problema de permissão no banco de dados</li>
            </ul>
          </div>
          <div className="bg-muted/30 p-3 rounded-md text-sm mt-2">
            <p className="font-medium">Alternativas:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Tente entrar com uma conta existente</li>
              <li>Use as credenciais de teste disponíveis na aba de login</li>
              <li>Entre em contato com o suporte técnico</li>
            </ul>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowAuthErrorDialog(false)}>
              Fechar
            </Button>
            <Button onClick={() => { setTab('login'); setShowAuthErrorDialog(false); }}>
              Ir para o Login
            </Button>
            <Button variant="secondary" onClick={() => window.location.href = "mailto:suporte@nutrivitaplan.com.br"} className="flex items-center gap-2">
              <MailIcon className="h-4 w-4" /> Contatar Suporte
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Signup;
