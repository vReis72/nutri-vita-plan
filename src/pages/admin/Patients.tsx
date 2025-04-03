
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ArrowRightLeft, Search, Filter } from "lucide-react";
import { NutritionistWithProfile, PatientWithProfile } from "@/types/auth.types";

const AdminPatients = () => {
  const { getAllPatients, getAllNutritionists } = useAuth();
  const [patients, setPatients] = useState<PatientWithProfile[]>([]);
  const [nutritionists, setNutritionists] = useState<NutritionistWithProfile[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientsData = await getAllPatients();
        const nutritionistsData = await getAllNutritionists();
        
        setPatients(patientsData);
        setNutritionists(nutritionistsData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };
    
    fetchData();
  }, [getAllPatients, getAllNutritionists]);
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Pacientes</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Gerencie os pacientes da plataforma</p>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar pacientes..."
            className="pl-10"
          />
        </div>
        <div className="w-full md:w-64">
          <Select>
            <SelectTrigger>
              <Filter size={16} className="mr-2" />
              <SelectValue placeholder="Filtrar por nutricionista" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os nutricionistas</SelectItem>
              {nutritionists.map(nutritionist => (
                <SelectItem key={nutritionist.id} value={nutritionist.id}>
                  {nutritionist.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map(patient => {
          const nutritionist = nutritionists.find(n => n.id === patient.nutritionistId);
          
          return (
            <Card key={patient.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={patient.photoUrl || ""} alt={patient.name} />
                      <AvatarFallback className="bg-nutri-primary text-white">
                        {patient.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{patient.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {nutritionist ? `Nutricionista: ${nutritionist.name}` : "Sem nutricionista"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex justify-between mt-4">
                  <Button size="sm" variant="outline">
                    Ver Detalhes
                  </Button>
                  <Button size="sm" variant="outline">
                    <ArrowRightLeft className="mr-2 h-4 w-4" />
                    Transferir
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminPatients;
