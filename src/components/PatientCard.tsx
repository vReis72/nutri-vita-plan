
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Patient } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  ChevronRight, 
  ActivitySquare, 
  Apple, 
  Utensils, 
  Scale, 
  ChevronDown 
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import TransferPatientDialog from "@/components/TransferPatientDialog";
import { motion } from "framer-motion";

interface PatientCardProps {
  patient: Patient;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient }) => {
  const [showDetails, setShowDetails] = useState(false);

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

  const getGoalIcon = (goal: string) => {
    switch (goal) {
      case "weightLoss":
        return <Scale className="h-4 w-4" />;
      case "weightGain":
        return <ActivitySquare className="h-4 w-4" />;
      case "maintenance":
        return <Utensils className="h-4 w-4" />;
      default:
        return <Apple className="h-4 w-4" />;
    }
  };

  const calculateBMI = (weight: number, height: number) => {
    // Altura deve estar em metros, então convertemos de cm para m
    const heightInM = height / 100;
    return (weight / (heightInM * heightInM)).toFixed(1);
  };

  const bmi = parseFloat(calculateBMI(patient.weight, patient.height));

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -5 }}
      >
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-t-4 border-t-nutri-primary">
          <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <Avatar className="h-14 w-14 border-2 border-nutri-primary/30 transition-all duration-300 hover:border-nutri-primary">
                  <AvatarImage src={patient.profilePhoto || ""} alt={patient.name} />
                  <AvatarFallback className="bg-gradient-to-br from-nutri-primary to-nutri-secondary text-white font-medium">
                    {patient.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg font-display tracking-tight">{patient.name}</CardTitle>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-nutri-primary/10 text-nutri-primary">
                          {getGoalIcon(patient.goal)}
                          {getGoalLabel(patient.goal)}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Objetivo principal do paciente</p>
                      </TooltipContent>
                    </Tooltip>
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
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <p className="text-gray-500">IMC</p>
                      <p className="font-medium">{bmi}</p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{getBMIStatus(bmi)}</p>
                  </TooltipContent>
                </Tooltip>
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

            <div className="mt-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full flex items-center justify-between text-nutri-secondary"
                onClick={() => setShowDetails(!showDetails)}
              >
                <span>{showDetails ? "Ocultar detalhes" : "Ver detalhes"}</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showDetails ? 'rotate-180' : ''}`} />
              </Button>

              {showDetails && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 border-t pt-2"
                >
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="font-medium truncate">{patient.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Telefone</p>
                      <p className="font-medium">{patient.phone}</p>
                    </div>
                  </div>
                  
                  {patient.progressPhotos && patient.progressPhotos.length > 0 && (
                    <div className="mt-3">
                      <p className="text-gray-500 text-sm mb-1">Fotos de progresso</p>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {patient.progressPhotos.slice(0, 3).map((photo) => (
                          <div key={photo.id} className="relative min-w-14 h-14 rounded-md overflow-hidden">
                            <img 
                              src={photo.url} 
                              alt={photo.caption || "Progresso"} 
                              className="object-cover w-full h-full"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                              <span className="text-[10px] text-white p-1">
                                {new Date(photo.date).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                          </div>
                        ))}
                        {patient.progressPhotos.length > 3 && (
                          <div className="min-w-14 h-14 rounded-md bg-nutri-primary/10 flex items-center justify-center">
                            <span className="text-xs text-nutri-primary font-medium">+{patient.progressPhotos.length - 3}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            <div className="flex mt-4 gap-2">
              <Button asChild variant="default" className="flex-1 bg-nutri-primary hover:bg-nutri-secondary transition-colors duration-300">
                <Link to={`/patient/${patient.id}`}>
                  <span>Ver paciente</span>
                  <ChevronRight className="ml-1 h-4 w-4 animate-pulse" />
                </Link>
              </Button>
              <TransferPatientDialog patient={patient} />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </TooltipProvider>
  );
};

export default PatientCard;
