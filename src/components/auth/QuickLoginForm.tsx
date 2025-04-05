
import React, { useState } from "react";
import { toast } from "sonner";
import { Label, Input, Button } from "@/components/ui/"; 
import { supabase } from "@/integrations/supabase/client";

interface QuickLoginFormProps {
  onSuccess?: () => void;
}

export const QuickLoginForm = ({ onSuccess }: QuickLoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(`Falha no login: ${error.message || 'Verifique suas credenciais.'}`);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
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
          name="password"
          type="password"
          placeholder="******"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
        <a href="#" className="font-semibold text-nutri-primary hover:underline">
          Esqueceu sua senha?
        </a>
      </div>
    </form>
  );
};
