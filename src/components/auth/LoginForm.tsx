
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { isNutritionist, isPatient, isAdmin } = useAuth();
  const navigate = useNavigate();

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
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
  );
};
