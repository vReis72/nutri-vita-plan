
import React from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRole } from "@/contexts/auth/types";
import { InvitationAlert } from "./InvitationAlert";
import { useInvitation } from "@/hooks/useInvitation";
import { useSignup } from "@/hooks/useSignup";

const signupSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(6, "Confirme sua senha"),
  role: z.enum(["patient", "nutritionist", "admin"] as const),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export type SignupFormData = z.infer<typeof signupSchema>;

export const SignupForm = () => {
  const [searchParams] = useSearchParams();
  const { invitation, invitationCode } = useInvitation(searchParams);
  const { isLoading, signupError, handleSignup } = useSignup();
  
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "patient" as UserRole,
    },
  });

  // Preencher o formulário com dados do convite, se disponíveis
  React.useEffect(() => {
    if (invitation) {
      // Preencher o email se estiver definido no convite
      if (invitation.email) {
        form.setValue('email', invitation.email);
      }
      
      // Definir a função com base no convite
      if (invitation.role) {
        form.setValue('role', invitation.role as UserRole);
      }
    }
  }, [invitation, form]);

  const onSubmit = (data: SignupFormData) => {
    handleSignup(data, invitationCode);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InvitationAlert invitation={invitation} />
        
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
                  disabled={invitation?.email !== undefined}
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
                disabled={invitation?.role !== undefined}
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
