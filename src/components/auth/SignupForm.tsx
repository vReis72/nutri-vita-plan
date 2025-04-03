
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRole } from "@/types/auth.types";

interface SignupFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  name: string;
  setName: (name: string) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

const SignupForm = ({
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
  role,
  setRole,
  isLoading,
  onSubmit
}: SignupFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome completo</Label>
        <Input
          id="name"
          type="text"
          placeholder="Seu nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      
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
      
      <div className="space-y-2">
        <Label htmlFor="role">Tipo de conta</Label>
        <select
          id="role"
          className="w-full rounded-md border border-gray-300 bg-background px-3 py-2"
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
        >
          <option value="patient">Paciente</option>
          <option value="nutritionist">Nutricionista</option>
        </select>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-nutri-primary hover:bg-nutri-secondary" 
        disabled={isLoading}
      >
        {isLoading ? "Processando..." : "Cadastrar"}
      </Button>
    </form>
  );
};

export default SignupForm;
