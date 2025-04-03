
import React from "react";
import NutriCalculator from "@/components/NutriCalculator";

const Calculator = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Calculadora Nutricional</h1>
        <p className="text-gray-500 mt-1">Calcule métricas corporais e necessidades nutricionais</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        <NutriCalculator />
      </div>
    </div>
  );
};

export default Calculator;
