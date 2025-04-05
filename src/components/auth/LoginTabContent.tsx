
import React from "react";
import { Link } from "react-router-dom";
import { CardDescription } from "@/components/ui/card";
import { LoginForm } from "./LoginForm";
import { TestCredentials } from "./TestCredentials";
import { AdminLoginButton } from "./AdminLoginButton";

export const LoginTabContent = () => {
  return (
    <>
      <div className="mb-4">
        <CardDescription>
          Digite suas credenciais para acessar o sistema
        </CardDescription>
      </div>
      
      <LoginForm />
      
      <div className="text-center text-sm text-gray-500 mt-4">
        <Link to="/signup" className="font-medium text-nutri-primary hover:underline">
          Registre-se
        </Link>
        {" "}se não tem uma conta
      </div>
      
      <div className="mt-4 border-t pt-4">
        <AdminLoginButton />
      </div>
      
      <TestCredentials />
    </>
  );
};
