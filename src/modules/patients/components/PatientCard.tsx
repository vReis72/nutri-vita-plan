
import { Patient } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRightIcon, ScaleIcon, UtensilsIcon, UserCheckIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

interface PatientCardProps {
  patient: Patient;
}

const PatientCard = ({ patient }: PatientCardProps) => {
  // Função para calcular IMC
  const calculateBMI = (weight: number, height: number) => {
    const heightInM = height / 100;
    return (weight / (heightInM * heightInM));
  };

  // Determina a cor da barra de progresso do IMC
  const getBMIIndicatorColor = (bmi: number) => {
    if (bmi < 18.5) return "info";
    if (bmi < 25) return "success";
    if (bmi < 30) return "warning";
    return "danger";
  };

  // Obtém o ícone correspondente ao objetivo do paciente
  const getGoalIcon = (goal: string) => {
    switch (goal) {
      case "weightLoss":
        return <ScaleIcon className="h-4 w-4" />;
      case "weightGain":
        return <UserCheckIcon className="h-4 w-4" />;
      case "maintenance":
      default:
        return <UtensilsIcon className="h-4 w-4" />;
    }
  };

  const bmi = calculateBMI(patient.weight, patient.height);
  
  return (
    <TooltipProvider>
      <Card className="overflow-hidden hover:shadow-md transition-shadow border-t-2 border-t-nutri-primary">
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border border-nutri-primary/20">
                <AvatarImage src={patient.profilePhoto || ""} alt={patient.name} />
                <AvatarFallback className="bg-gradient-to-br from-nutri-primary to-nutri-secondary text-white">
                  {patient.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg font-display">{patient.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{patient.age} anos</p>
              </div>
            </div>
            <div className="flex items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="p-1.5 rounded-full bg-nutri-light dark:bg-nutri-dark/30">
                    {getGoalIcon(patient.goal)}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {patient.goal === "weightLoss" ? "Emagrecimento" : 
                      patient.goal === "weightGain" ? "Ganho de massa" : "Manutenção"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="mt-3 space-y-3">
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>IMC: {bmi.toFixed(1)}</span>
                <span>
                  {bmi < 18.5 ? "Abaixo do peso" : 
                    bmi < 25 ? "Peso normal" : 
                    bmi < 30 ? "Sobrepeso" : "Obesidade"}
                </span>
              </div>
              <Progress 
                value={Math.min(Math.max(bmi / 40 * 100, 5), 100)} 
                variant={getBMIIndicatorColor(bmi)} 
                size="sm"
              />
            </div>
            
            <div className="flex justify-end">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button asChild size="sm">
                    <Link to={`/patients/${patient.id}`}>
                      <span className="flex items-center">
                        Ver detalhes
                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                      </span>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ver detalhes do paciente</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default PatientCard;
