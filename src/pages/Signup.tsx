
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

    try {
      const { email, password, name, role } = data;
      
      console.log("Tentando criar usuário com:", { email, name, role });
      
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
        
        if (error.message?.includes("already registered")) {
          toast.error("Este e-mail já está registrado. Tente fazer login.");
          setTab('login');
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
        toast.error("Falha no registro: dados de autenticação incompletos");
      }
      
    } catch (error: any) {
      console.error("Erro detalhado ao registrar:", error);
      // O tratamento específico dos erros já está sendo feito acima
    } finally {
      setIsLoading(false);
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
