
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import PatientCard from "@/components/PatientCard";
import { mockPatients } from "@/data/mockData";
import { UserPlus, Search, Filter } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Patients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGoal, setFilterGoal] = useState("all");
  const { user, isPatientOfCurrentNutritionist } = useAuth();

  // Filtramos os pacientes para mostrar apenas os vinculados ao nutricionista atual
  const nutritionisPatientsOnly = useMemo(() => {
    return mockPatients.filter(patient => {
      // Se o usuário logado for um nutricionista e tiver pacientes associados
      if (user?.role === "nutritionist" && user.associatedPatients) {
        return isPatientOfCurrentNutritionist(patient.id);
      }
      return false;
    });
  }, [user, isPatientOfCurrentNutritionist]);

  const filteredPatients = useMemo(() => {
    return nutritionisPatientsOnly.filter((patient) => {
      const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGoal = filterGoal === "all" || patient.goal === filterGoal;
      return matchesSearch && matchesGoal;
    });
  }, [nutritionisPatientsOnly, searchTerm, filterGoal]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pacientes</h1>
          <p className="text-gray-500 mt-1">Gerencie seus pacientes</p>
        </div>
        <Button 
          className="mt-4 md:mt-0 bg-nutri-primary hover:bg-nutri-secondary"
          asChild
        >
          <Link to="/patients/new">
            <UserPlus size={18} className="mr-2" />
            Novo Paciente
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar pacientes..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <Select value={filterGoal} onValueChange={setFilterGoal}>
            <SelectTrigger>
              <Filter size={16} className="mr-2" />
              <SelectValue placeholder="Filtrar por objetivo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os objetivos</SelectItem>
              <SelectItem value="weightLoss">Emagrecimento</SelectItem>
              <SelectItem value="weightGain">Ganho de massa</SelectItem>
              <SelectItem value="maintenance">Manutenção</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredPatients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPatients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">Nenhum paciente encontrado</h3>
          <p className="text-gray-500 mt-1">
            {nutritionisPatientsOnly.length === 0 
              ? "Você ainda não possui pacientes cadastrados."
              : "Tente modificar os filtros ou adicione um novo paciente."}
          </p>
        </div>
      )}
    </div>
  );
};

export default Patients;
