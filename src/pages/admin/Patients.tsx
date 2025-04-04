
import React, { useState, useMemo } from "react";
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
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { 
  ArrowRightLeft, 
  Search, 
  Filter, 
  Apple, 
  ChevronRight, 
  Utensils,
  Scale,
  UserCheck
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const AdminPatients = () => {
  const { getAllPatients, getAllNutritionists } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [nutritionistFilter, setNutritionistFilter] = useState("all");
  
  const patients = getAllPatients();
  const nutritionists = getAllNutritionists();

  const filteredPatients = useMemo(() => {
    return patients.filter(patient => {
      const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesNutritionist = nutritionistFilter === "all" || patient.nutritionistId === nutritionistFilter;
      return matchesSearch && matchesNutritionist;
    });
  }, [patients, searchTerm, nutritionistFilter]);

  const getGoalIcon = (goal: string) => {
    switch (goal) {
      case "weightLoss":
        return <Scale className="h-4 w-4" />;
      case "weightGain":
        return <UserCheck className="h-4 w-4" />;
      case "maintenance":
        return <Utensils className="h-4 w-4" />;
      default:
        return <Apple className="h-4 w-4" />;
    }
  };
  
  const getBMIIndicatorColor = (bmi: number) => {
    if (bmi < 18.5) return "bg-blue-400";
    if (bmi < 25) return "bg-green-400";
    if (bmi < 30) return "bg-yellow-400";
    if (bmi < 35) return "bg-orange-400";
    return "bg-red-400";
  };

  const calculateBMI = (weight: number, height: number) => {
    const heightInM = height / 100;
    return (weight / (heightInM * heightInM));
  };
  
  // Variáveis para animação dos cards
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } }
  };
  
  return (
    <TooltipProvider>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-gray-100">
              Pacientes
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Gerencie os pacientes da plataforma
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <div className="flex items-center bg-nutri-light dark:bg-nutri-dark/30 rounded-full px-3 py-1.5">
              <span className="text-sm font-medium text-nutri-secondary mr-2">Total:</span>
              <span className="text-sm font-bold text-nutri-primary">{filteredPatients.length}</span>
            </div>
          </div>
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
            <Select value={nutritionistFilter} onValueChange={setNutritionistFilter}>
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
        
        {filteredPatients.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {filteredPatients.map(patient => {
              const nutritionist = nutritionists.find(n => n.id === patient.nutritionistId);
              const bmi = calculateBMI(patient.weight, patient.height);
              
              return (
                <motion.div key={patient.id} variants={item}>
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
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                                  {nutritionist ? (
                                    <>
                                      <UserCheck className="h-3 w-3 text-nutri-primary" />
                                      {nutritionist.name}
                                    </>
                                  ) : (
                                    "Sem nutricionista"
                                  )}
                                </p>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{nutritionist ? "Nutricionista responsável" : "Sem nutricionista associado"}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="p-1.5 rounded-full bg-nutri-light dark:bg-nutri-dark/30">
                                {getGoalIcon(patient.goal || "maintenance")}
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
                    <CardContent className="p-4 pt-0">
                      <div className="mt-4 space-y-3">
                        <div>
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>IMC: {bmi.toFixed(1)}</span>
                            <span>
                              {bmi < 18.5 ? "Abaixo do peso" : 
                                bmi < 25 ? "Peso normal" : 
                                bmi < 30 ? "Sobrepeso" : 
                                bmi < 35 ? "Obesidade I" : 
                                bmi < 40 ? "Obesidade II" : "Obesidade III"}
                            </span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${getBMIIndicatorColor(bmi)}`} 
                              style={{ width: `${Math.min(Math.max(bmi / 40 * 100, 5), 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between">
                          <Button size="sm" variant="outline" className="flex-1 mr-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="flex items-center">
                                  <ChevronRight className="mr-2 h-4 w-4" />
                                  Ver Detalhes
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Ver detalhes do paciente</p>
                              </TooltipContent>
                            </Tooltip>
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 ml-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="flex items-center">
                                  <ArrowRightLeft className="mr-2 h-4 w-4" />
                                  Transferir
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Transferir para outro nutricionista</p>
                              </TooltipContent>
                            </Tooltip>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <div className="text-center py-12 animate-fade-in">
            <Apple className="mx-auto h-12 w-12 text-nutri-primary/50 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Nenhum paciente encontrado</h3>
            <p className="text-gray-500 mt-1">
              Tente modificar os filtros ou adicione novos pacientes ao sistema.
            </p>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default AdminPatients;
