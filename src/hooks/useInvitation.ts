
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Invitation } from "@/contexts/auth/types";

export const useInvitation = (searchParams: URLSearchParams) => {
  const [invitationCode, setInvitationCode] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<Invitation | null>(null);

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
        setInvitation(data as Invitation);
        toast.success("Convite válido!");
      }
    } catch (error) {
      console.error("Erro ao verificar convite:", error);
    }
  };

  return {
    invitationCode,
    invitation,
    setInvitation
  };
};
