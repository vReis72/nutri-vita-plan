
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserCog, MoreVertical, UserPlus, Search } from "lucide-react";
import TransferPatientDialog from "@/components/TransferPatientDialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { PatientWithProfile, NutritionistWithProfile } from "@/types/auth.types";

const formatDate = (date: Date | string) => {
  if (!date) return "N/A";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).format(d);
};

const AdminPatients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState<PatientWithProfile[]>([]);
  const [nutritionists, setNutritionists] = useState<NutritionistWithProfile[]>([]);
  const [patientToTransfer, setPatientToTransfer] = useState<PatientWithProfile | null>(null);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const { toast } = useToast();
  const { getAllPatients, getAllNutritionists, transferPatient } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedPatients = await getAllPatients();
        const fetchedNutritionists = await getAllNutritionists();
        setPatients(fetchedPatients);
        setNutritionists(fetchedNutritionists);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar a lista de pacientes.",
        });
      }
    };

    fetchData();
  }, [getAllPatients, getAllNutritionists, toast]);

  const handleTransferDialogOpen = (patient: PatientWithProfile) => {
    setPatientToTransfer(patient);
    setIsTransferDialogOpen(true);
  };

  const handleTransferPatient = async (
    patientId: string,
    nutritionistId: string
  ) => {
    try {
      await transferPatient(patientId, nutritionistId);
      
      // Update local state
      setPatients((prevPatients) =>
        prevPatients.map((p) =>
          p.id === patientId
            ? {
                ...p,
                nutritionistId: nutritionistId,
                nutritionistName: nutritionists.find((n) => n.id === nutritionistId)?.name || "",
              }
            : p
        )
      );
      
      setIsTransferDialogOpen(false);
      toast({
        title: "Paciente transferido",
        description: "O paciente foi transferido com sucesso.",
      });
    } catch (error) {
      console.error("Error transferring patient:", error);
      toast({
        variant: "destructive",
        title: "Erro ao transferir paciente",
        description: "Não foi possível transferir o paciente.",
      });
    }
  };

  const filteredPatients = patients.filter((patient) =>
    patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.profileName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.email && patient.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pacientes</h1>
          <p className="text-gray-500 mt-1">
            Gerencie e transfira os pacientes entre nutricionistas
          </p>
        </div>
        <Button className="mt-4 sm:mt-0">
          <UserPlus size={18} className="mr-2" />
          Novo Paciente
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar pacientes por nome ou email..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Nutricionista</TableHead>
              <TableHead>Data de Cadastro</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.name || patient.profileName}</TableCell>
                  <TableCell>{patient.email || "N/A"}</TableCell>
                  <TableCell>
                    {patient.nutritionistName || "Não atribuído"}
                  </TableCell>
                  <TableCell>{formatDate(patient.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 focus:ring-0"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleTransferDialogOpen(patient)}
                        >
                          <UserCog className="mr-2 h-4 w-4" />
                          Transferir Paciente
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  {patients.length === 0
                    ? "Não há pacientes cadastrados no sistema."
                    : "Nenhum paciente encontrado com o termo de busca."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TransferPatientDialog
        isOpen={isTransferDialogOpen}
        onClose={() => setIsTransferDialogOpen(false)}
        patient={patientToTransfer}
        nutritionists={nutritionists}
        onTransfer={handleTransferPatient}
      />
    </div>
  );
};

export default AdminPatients;
