
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatsCard from "@/components/StatsCard";
import PatientCard from "@/components/PatientCard";
import ProgressChart from "@/components/ProgressChart";
import { mockPatients, mockProgress } from "@/data/mockData";
import { Users, TrendingUp, Utensils, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Dashboard = () => {
  // Mostrar apenas os últimos 4 pacientes
  const recentPatients = [...mockPatients].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  ).slice(0, 4);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Bem-vindo ao NutriVita Plan</p>
        </div>
        <div className="mt-4 md:mt-0 space-x-3">
          <Button asChild variant="outline">
            <Link to="/calculator">
              Calculadora
            </Link>
          </Button>
          <Button asChild className="bg-nutri-primary hover:bg-nutri-secondary">
            <Link to="/patients/new">
              Novo Paciente
            </Link>
          </Button>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total de Pacientes"
          value={mockPatients.length}
          icon={<Users size={24} />}
          trend="up"
          trendValue="+2"
        />
        <StatsCard
          title="Avaliações este mês"
          value="12"
          icon={<TrendingUp size={24} />}
          trend="up"
          trendValue="+5"
        />
        <StatsCard
          title="Planos Alimentares"
          value="8"
          icon={<Utensils size={24} />}
          trend="neutral"
          trendValue="0"
        />
        <StatsCard
          title="Consultas Agendadas"
          value="5"
          icon={<Calendar size={24} />}
          trend="down"
          trendValue="-2"
        />
      </div>

      {/* Gráfico de progresso e pacientes recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProgressChart
            title="Progresso do Paciente (Maria)"
            data={mockProgress}
            lines={[
              { dataKey: "peso", name: "Peso (kg)", color: "#4ECDC4" },
              { dataKey: "imc", name: "IMC", color: "#FF6B6B" },
              { dataKey: "gordura", name: "% Gordura", color: "#1A535C" },
            ]}
          />
        </div>
        <div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Próximas Consultas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-10 bg-nutri-primary rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium">Maria Silva</p>
                    <p className="text-sm text-gray-500">Hoje, 14:00</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-10 bg-nutri-primary rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium">João Santos</p>
                    <p className="text-sm text-gray-500">Amanhã, 10:30</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-10 bg-nutri-primary rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium">Ana Oliveira</p>
                    <p className="text-sm text-gray-500">25/04, 15:30</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pacientes recentes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Pacientes Recentes</h2>
          <Button variant="link" asChild className="text-nutri-secondary">
            <Link to="/patients">Ver todos</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentPatients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
