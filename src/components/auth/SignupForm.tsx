
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

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

export const SignupForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [invitationCode, setInvitationCode] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<any | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Verificar se há um código de convite na URL
  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      setInvitationCode(code);
      verifyInvitationCode(code);
    }
  }, [searchParams]);

  // Verificar a validade do código de convite
  const verifyInvitationCode = async (code: string) => {
    try {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('code', code)
        .is('used_at', null)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error) {
        console.error("Erro ao verificar convite:", error);
        toast.error("Código de convite inválido ou expirado");
        return;
      }

      if (data) {
        setInvitation(data);
        toast.success("Convite válido!");
        
        // Pré-preencher o email se estiver definido no convite
        if (data.email) {
          form.setValue('email', data.email);
        }
        
        // Definir a função com base no convite
        if (data.role) {
          form.setValue('role', data.role);
        }
      }
    } catch (error) {
      console.error("Erro ao verificar convite:", error);
    }
  };
  
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

  const handleSignup = async (data: SignupFormData) => {
    setIsLoading(true);
    setSignupError(null);

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
        }
      });

      if (error) {
        console.error("Erro de autenticação:", error);
        
        if (error.message?.includes("already registered")) {
          setSignupError("Este e-mail já está registrado. Tente fazer login.");
          toast.error("Este e-mail já está registrado. Tente fazer login.");
        } else {
          setSignupError(`Falha no registro: ${error.message || "Erro desconhecido"}`);
          toast.error(`Falha no registro: ${error.message || "Erro desconhecido"}`);
        }
        throw error;
      }

      if (authData && authData.user) {
        console.log("Usuário criado com sucesso:", authData.user.id);
        
        // Se há um código de convite, marcar como utilizado
        if (invitationCode) {
          try {
            const { data: invUseData, error: invError } = await supabase.rpc(
              'use_invitation', 
              { invitation_code: invitationCode, user_id: authData.user.id }
            );
            
            if (invError) {
              console.error("Erro ao usar convite:", invError);
            } else {
              console.log("Convite utilizado com sucesso:", invUseData);
            }
          } catch (err) {
            console.error("Erro ao processar convite:", err);
          }
        }
        
        toast.success("Registro realizado com sucesso!");
        
        // Aguardar um momento para garantir que o trigger handle_new_user seja executado
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        console.error("Dados de autenticação incompletos");
        setSignupError("Falha no registro: dados de autenticação incompletos");
        toast.error("Falha no registro: dados de autenticação incompletos");
      }
      
    } catch (error: any) {
      console.error("Erro detalhado ao registrar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSignup)} className="space-y-4">
        {invitationCode && invitation && (
          <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
            <AlertTitle className="text-green-800 dark:text-green-400">Convite válido</AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-500">
              Você está se registrando usando um convite {invitation.role === 'patient' ? 'de paciente' : 'de nutricionista'}.
            </AlertDescription>
          </Alert>
        )}
        
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
                <Input 
                  type="email" 
                  placeholder="seu.email@exemplo.com" 
                  disabled={invitation?.email !== null && invitation?.email !== undefined}
                  {...field} 
                />
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
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={invitation?.role !== null && invitation?.role !== undefined}
              >
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

        {signupError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro no registro</AlertTitle>
            <AlertDescription>
              {signupError}
            </AlertDescription>
          </Alert>
        )}

        <Button 
          type="submit" 
          className="w-full bg-nutri-primary hover:bg-nutri-secondary" 
          disabled={isLoading}
        >
          {isLoading ? "Cadastrando..." : "Cadastrar"}
        </Button>
      </form>
    </Form>
  );
};
