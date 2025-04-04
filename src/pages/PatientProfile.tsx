
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { mockPatients } from "@/data/mockData";

const PatientProfile = () => {
  const { user } = useAuth();
  
  // Buscar dados do paciente pelo ID armazenado no contexto
  const patientData = mockPatients.find(p => p.id === user?.patientId) || mockPatients[0];
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Meu Perfil</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Suas informações pessoais e dados de acompanhamento
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <CardTitle>Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src="" alt={patientData.name} />
              <AvatarFallback className="bg-nutri-primary text-xl text-white">
                {patientData.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="w-full space-y-2">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600 dark:text-gray-400">Nome:</span>
                <span className="font-medium">{patientData.name}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600 dark:text-gray-400">Idade:</span>
                <span className="font-medium">{patientData.age} anos</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600 dark:text-gray-400">Email:</span>
                <span className="font-medium">{patientData.email}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600 dark:text-gray-400">Telefone:</span>
                <span className="font-medium">{patientData.phone}</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-gray-600 dark:text-gray-400">Objetivo:</span>
                <span className="font-medium">
                  {patientData.goal === "weightLoss" && "Emagrecimento"}
                  {patientData.goal === "weightGain" && "Ganho de massa"}
                  {patientData.goal === "maintenance" && "Manutenção"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Meu Plano Alimentar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Café da Manhã (07:00)</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between border-b pb-2">
                    <span>Iogurte natural</span>
                    <span className="text-gray-600">200g</span>
                  </li>
                  <li className="flex justify-between border-b pb-2">
                    <span>Granola</span>
                    <span className="text-gray-600">2 colheres de sopa</span>
                  </li>
                  <li className="flex justify-between pb-2">
                    <span>Maçã</span>
                    <span className="text-gray-600">1 unidade</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Almoço (12:00)</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between border-b pb-2">
                    <span>Arroz integral</span>
                    <span className="text-gray-600">4 colheres de sopa</span>
                  </li>
                  <li className="flex justify-between border-b pb-2">
                    <span>Frango grelhado</span>
                    <span className="text-gray-600">120g</span>
                  </li>
                  <li className="flex justify-between border-b pb-2">
                    <span>Brócolis</span>
                    <span className="text-gray-600">3 colheres de sopa</span>
                  </li>
                  <li className="flex justify-between pb-2">
                    <span>Salada verde</span>
                    <span className="text-gray-600">à vontade</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Jantar (19:00)</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between border-b pb-2">
                    <span>Sopa de legumes</span>
                    <span className="text-gray-600">1 concha</span>
                  </li>
                  <li className="flex justify-between border-b pb-2">
                    <span>Omelete</span>
                    <span className="text-gray-600">2 ovos</span>
                  </li>
                  <li className="flex justify-between pb-2">
                    <span>Tomate</span>
                    <span className="text-gray-600">1 unidade</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Orientações Gerais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>• Beber no mínimo 2 litros de água por dia</p>
            <p>• Evitar o consumo de alimentos processados e ultraprocessados</p>
            <p>• Realizar atividade física pelo menos 3 vezes por semana</p>
            <p>• Evitar o consumo de bebidas alcoólicas</p>
            <p>• Priorizar o consumo de alimentos in natura ou minimamente processados</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientProfile;
