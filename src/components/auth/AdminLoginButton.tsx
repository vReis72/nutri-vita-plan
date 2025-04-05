
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserRole } from "@/contexts/auth/types";

export const AdminLoginButton = () => {
  const [isCreating, setIsCreating] = useState(false);
  
  const createAdmin = async () => {
    setIsCreating(true);
    
    try {
      // Verificar se o usuário admin já existe
      const { data: existingUser, error: checkError } = await supabase.auth.signInWithPassword({
        email: "admin@email.com",
        password: "admin123"
      });
      
      if (existingUser?.user) {
        toast.success("Usuário administrador já existe! Faça login com admin@email.com e senha admin123");
        setIsCreating(false);
        return;
      }
      
      // Criar o usuário admin
      const { data, error } = await supabase.auth.signUp({
        email: "admin@email.com",
        password: "admin123",
        options: {
          data: {
            name: "Administrador",
            role: "admin" as UserRole,
          },
        }
      });
      
      if (error) {
        console.error("Erro ao criar admin:", error);
        toast.error(`Falha ao criar administrador: ${error.message}`);
        throw error;
      }
      
      if (data && data.user) {
        toast.success("Usuário administrador criado com sucesso!");
        toast.info("Email: admin@email.com | Senha: admin123");
        
        // Verificar se o perfil foi criado corretamente
        setTimeout(async () => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
            
          if (!profileData || profileData.role !== 'admin') {
            // Tentar criar o perfil manualmente se necessário
            const { error: insertError } = await supabase
              .from('profiles')
              .insert([{ 
                id: data.user.id,
                name: 'Administrador', 
                role: 'admin'
              }]);
              
            if (insertError) {
              console.error("Erro ao criar perfil do admin:", insertError);
            }
          }
        }, 2000);
      }
    } catch (error) {
      console.error("Erro ao criar administrador:", error);
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={createAdmin} 
      disabled={isCreating}
      className="mt-2 w-full flex items-center justify-center text-xs"
    >
      {isCreating ? "Criando administrador..." : "Criar usuário administrador"}
    </Button>
  );
};
