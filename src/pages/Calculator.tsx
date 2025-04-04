
import React from "react";
import NutriCalculator from "@/components/NutriCalculator";
import { useAuth } from "@/contexts/AuthContext";

const Calculator = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Calculadora Nutricional</h1>
        <p className="text-gray-500 mt-1">
          {user?.role === "nutritionist" 
            ? "Calcule métricas corporais e necessidades nutricionais dos seus pacientes" 
            : "Calcule suas métricas corporais e necessidades nutricionais"}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        <NutriCalculator />
      </div>
    </div>
  );
};

export default Calculator;
