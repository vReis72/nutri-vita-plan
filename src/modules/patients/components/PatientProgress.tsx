
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockProgress } from "@/data/mockData";
import ProgressChart from "@/components/ProgressChart";
import { useAuth } from "@/contexts/AuthContext";

const PatientProgress = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Meu Progresso</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Acompanhe sua evolução ao longo do tempo
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ProgressChart
          title="Minha Evolução"
          data={mockProgress}
          lines={[
            { dataKey: "peso", name: "Peso (kg)", color: "#4ECDC4" },
            { dataKey: "imc", name: "IMC", color: "#FF6B6B" },
            { dataKey: "gordura", name: "% Gordura", color: "#1A535C" },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Peso Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-nutri-primary">
                {mockProgress[mockProgress.length - 1].peso} kg
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Meta: 65 kg
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">IMC</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-nutri-primary">
                {mockProgress[mockProgress.length - 1].imc}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Classificação: Normal
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">% Gordura</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-nutri-primary">
                {mockProgress[mockProgress.length - 1].gordura}%
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Meta: 20%
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Próxima Consulta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="w-2 h-14 bg-nutri-primary rounded-full mr-3"></div>
              <div>
                <p className="font-medium">Dr. Ana Silva</p>
                <p className="text-sm text-gray-500">26/04/2025, 14:00</p>
                <p className="text-sm mt-1">Avaliação mensal e ajuste no plano alimentar</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientProgress;
