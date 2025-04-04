
import React from "react";
import { Link } from "react-router-dom";
import { Patient } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronRight, BarChart, Clipboard, CalendarClock } from "lucide-react";
import TransferPatientDialog from "@/components/TransferPatientDialog";

interface PatientCardProps {
  patient: Patient;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient }) => {
  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return "Abaixo do peso";
    if (bmi < 25) return "Peso normal";
    if (bmi < 30) return "Sobrepeso";
    if (bmi < 35) return "Obesidade Grau I";
    if (bmi < 40) return "Obesidade Grau II";
    return "Obesidade Grau III";
  };

  const getGoalLabel = (goal: string) => {
    switch (goal) {
      case "weightLoss":
        return "Emagrecimento";
      case "weightGain":
        return "Ganho de massa";
      case "maintenance":
        return "Manutenção";
      default:
        return "Não definido";
    }
  };

  const calculateBMI = (weight: number, height: number) => {
    // Altura deve estar em metros, então convertemos de cm para m
    const heightInM = height / 100;
    return (weight / (heightInM * heightInM)).toFixed(1);
  };

  const bmi = parseFloat(calculateBMI(patient.weight, patient.height));

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src="" alt={patient.name} />
              <AvatarFallback className="bg-nutri-primary text-white">
                {patient.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{patient.name}</CardTitle>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-nutri-primary/10 text-nutri-primary">
                  {getGoalLabel(patient.goal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
          <div>
            <p className="text-gray-500">Idade</p>
            <p className="font-medium">{patient.age} anos</p>
          </div>
          <div>
            <p className="text-gray-500">IMC</p>
            <p className="font-medium">{bmi} ({getBMIStatus(bmi)})</p>
          </div>
          <div>
            <p className="text-gray-500">Peso</p>
            <p className="font-medium">{patient.weight} kg</p>
          </div>
          <div>
            <p className="text-gray-500">Altura</p>
            <p className="font-medium">{patient.height} cm</p>
          </div>
        </div>

        <div className="flex mt-4 gap-2">
          <Button asChild variant="default" className="flex-1">
            <Link to={`/patient/${patient.id}`}>
              <span>Ver paciente</span>
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <TransferPatientDialog patient={patient} />
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientCard;
