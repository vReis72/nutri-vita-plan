import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PatientWithProfile } from "@/types/auth.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, UserCog } from "lucide-react";
import TransferPatientDialog from "@/components/TransferPatientDialog";

const Patients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState<PatientWithProfile[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<PatientWithProfile[]>([]);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientWithProfile | null>(null);
  const { getAllPatients } = useAuth();

  useEffect(() => {
    const fetchPatients = async () => {
      const fetchedPatients = await getAllPatients();
      setPatients(fetchedPatients);
      setFilteredPatients(fetchedPatients);
    };

    fetchPatients();
  }, [getAllPatients]);

  useEffect(() => {
    const results = patients.filter((patient) =>
      patient.profileName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(results);
  }, [searchTerm, patients]);

  const handleTransferClick = (patient: PatientWithProfile) => {
    setSelectedPatient(patient);
    setIsTransferOpen(true);
  };

  const handleTransferClose = () => {
    setIsTransferOpen(false);
    setSelectedPatient(null);
  };

  const handlePatientTransferred = () => {
    // Refresh patient list
    getAllPatients().then(fetchedPatients => {
      setPatients(fetchedPatients);
      setFilteredPatients(fetchedPatients);
    });
  };

  const getGoalBadge = (goal?: string) => {
    switch (goal) {
      case "weightLoss":
        return <Badge variant="destructive">Emagrecimento</Badge>;
      case "weightGain":
        return <Badge variant="default">Ganho de massa</Badge>;
      case "maintenance":
        return <Badge variant="outline">Manutenção</Badge>;
      default:
        return <Badge variant="secondary">Não definido</Badge>;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Pacientes</h2>
          <p className="text-muted-foreground">
            Gerencie os pacientes e transfira para outros nutricionistas.
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pacientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar pacientes..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Foto</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Objetivo</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">
                      <Avatar>
                        {patient.photoUrl ? (
                          <AvatarImage src={patient.photoUrl} alt={patient.profileName} />
                        ) : (
                          <AvatarFallback>{getInitials(patient.profileName)}</AvatarFallback>
                        )}
                      </Avatar>
                    </TableCell>
                    <TableCell>{patient.profileName}</TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell>{patient.phone}</TableCell>
                    <TableCell>{getGoalBadge(patient.goal)}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" onClick={() => handleTransferClick(patient)}>
                        <UserCog className="mr-2 h-4 w-4" />
                        Transferir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPatients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Nenhum paciente encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {selectedPatient && (
        <TransferPatientDialog
          open={isTransferOpen}
          onClose={handleTransferClose}
          patient={selectedPatient}
          onTransferred={handlePatientTransferred}
        />
      )}
    </div>
  );
};

export default Patients;
