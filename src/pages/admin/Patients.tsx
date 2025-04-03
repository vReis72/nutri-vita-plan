
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import PatientCard from "@/components/PatientCard";
import TransferPatientDialog from "@/components/TransferPatientDialog";
import { PatientWithProfile } from "@/types/auth.types";
import { Skeleton } from "@/components/ui/skeleton";

const AdminPatients = () => {
  const { getAllPatients, getAllNutritionists } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);

  const { 
    data: patients, 
    isLoading, 
    error,
    refetch: refetchPatients
  } = useQuery({
    queryKey: ['admin-patients'],
    queryFn: getAllPatients
  });

  const { data: nutritionists = [] } = useQuery({
    queryKey: ['admin-nutritionists'],
    queryFn: getAllNutritionists
  });

  const filteredPatients = patients?.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.nutritionistName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const patientsWithNutritionist = filteredPatients?.filter(
    patient => patient.nutritionistId !== null && patient.nutritionistId !== undefined
  );

  const patientsWithoutNutritionist = filteredPatients?.filter(
    patient => patient.nutritionistId === null || patient.nutritionistId === undefined
  );

  const handleTransferClick = (patientId: string) => {
    setSelectedPatientId(patientId);
    setIsTransferDialogOpen(true);
  };

  const handleTransferComplete = () => {
    setIsTransferDialogOpen(false);
    setSelectedPatientId(null);
    refetchPatients();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Pacientes
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Gerencie todos os pacientes do sistema
        </p>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Buscar pacientes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="with-nutritionist">Com Nutricionista</TabsTrigger>
          <TabsTrigger value="without-nutritionist">Sem Nutricionista</TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="all" className="m-0">
            <PatientsList 
              patients={filteredPatients} 
              isLoading={isLoading} 
              error={error}
              onTransferClick={handleTransferClick}
            />
          </TabsContent>
          
          <TabsContent value="with-nutritionist" className="m-0">
            <PatientsList 
              patients={patientsWithNutritionist} 
              isLoading={isLoading} 
              error={error}
              onTransferClick={handleTransferClick}
            />
          </TabsContent>
          
          <TabsContent value="without-nutritionist" className="m-0">
            <PatientsList 
              patients={patientsWithoutNutritionist} 
              isLoading={isLoading} 
              error={error}
              onTransferClick={handleTransferClick}
            />
          </TabsContent>
        </div>
      </Tabs>

      {selectedPatientId && nutritionists.length > 0 && (
        <TransferPatientDialog
          patient={patients?.find(p => p.id === selectedPatientId) || {
            id: selectedPatientId,
            name: "Paciente",
            age: 0,
            gender: "male",
            height: 0,
            weight: 0,
            goal: "maintenance",
            profileName: "",
            createdAt: new Date(),
            updatedAt: new Date()
          }}
          open={isTransferDialogOpen}
          onOpenChange={setIsTransferDialogOpen}
          onTransferComplete={handleTransferComplete}
        />
      )}
    </div>
  );
};

interface PatientsListProps {
  patients?: PatientWithProfile[];
  isLoading: boolean;
  error: unknown;
  onTransferClick: (patientId: string) => void;
}

const PatientsList = ({ patients, isLoading, error, onTransferClick }: PatientsListProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">
          Erro ao carregar pacientes. Por favor, tente novamente.
        </p>
      </div>
    );
  }

  if (!patients || patients.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 dark:text-gray-400">
          Nenhum paciente encontrado.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {patients.map((patient) => (
        <PatientCard
          key={patient.id}
          patient={patient as any}
          showTransfer={true}
          onTransferClick={() => onTransferClick(patient.id)}
        />
      ))}
    </div>
  );
};

export default AdminPatients;
