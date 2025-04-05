
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export const InfoTab = () => {
  return (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Sistema atualizado</AlertTitle>
        <AlertDescription>
          A configuração do banco de dados foi corrigida e o cadastro de novos usuários deve funcionar normalmente agora.
        </AlertDescription>
      </Alert>
      
      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded">
        <p className="font-semibold mb-2">Alterações realizadas:</p>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Criação do tipo <code>user_role</code> no banco de dados</li>
          <li>Correção do trigger <code>handle_new_user</code> no Supabase</li>
          <li>Ajustes na interface para melhor experiência do usuário</li>
        </ul>
      </div>
      
      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded">
        <p className="font-semibold mb-2">Credenciais de teste:</p>
        <div className="grid grid-cols-1 gap-3 text-sm">
          <div>
            <p className="font-semibold">Nutricionista:</p>
            <p>Email: login@nutricionista.com</p>
            <p>Senha: senha123</p>
          </div>
          <div>
            <p className="font-semibold">Paciente:</p>
            <p>Email: paciente@email.com</p>
            <p>Senha: senha123</p>
          </div>
          <div>
            <p className="font-semibold">Administrador:</p>
            <p>Email: admin@email.com</p>
            <p>Senha: admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};
