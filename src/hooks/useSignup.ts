
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SignupFormData } from "@/components/auth/SignupForm";

export const useSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignup = async (data: SignupFormData, invitationCode: string | null) => {
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

  return {
    isLoading,
    signupError,
    handleSignup
  };
};
