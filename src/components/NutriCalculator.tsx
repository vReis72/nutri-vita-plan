
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { mockPatients } from "@/data/mockData";
import { Patient } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

const NutriCalculator = () => {
  // Estado para identificar se os dados foram buscados de um paciente
  const [fromPatient, setFromPatient] = useState(false);
  const [selectedTab, setSelectedTab] = useState("imc");
  const { toast } = useToast();
  const { user, isPatientOfCurrentNutritionist } = useAuth();
  
  // Estados para os cálculos
  const [gender, setGender] = useState("female");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("sedentary");
  
  // Selecionar paciente (para nutricionistas)
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [availablePatients, setAvailablePatients] = useState<Patient[]>([]);
  
  // Cálculo de IMC
  const [imc, setImc] = useState<number | null>(null);
  const [imcClass, setImcClass] = useState("");
  
  // Cálculo de Metabolismo Basal
  const [bmr, setBmr] = useState<number | null>(null);
  const [tdee, setTdee] = useState<number | null>(null);
  
  // Carrega os pacientes disponíveis para o nutricionista
  useEffect(() => {
    if (user?.role === "nutritionist" && user.associatedPatients) {
      const filteredPatients = mockPatients.filter(patient => 
        isPatientOfCurrentNutritionist(patient.id)
      );
      setAvailablePatients(filteredPatients);
    }
  }, [user, isPatientOfCurrentNutritionist]);
  
  // Função para carregar dados do paciente selecionado
  const loadPatientData = (patientId: string) => {
    const selectedPatient = mockPatients.find(p => p.id === patientId);
    if (selectedPatient) {
      setAge(selectedPatient.age.toString());
      setGender(selectedPatient.gender);
      setWeight(selectedPatient.weight.toString());
      setHeight(selectedPatient.height.toString());
      setFromPatient(true);
      
      // Calcular automaticamente com os dados carregados
      calculateIMC(selectedPatient.weight, selectedPatient.height);
      calculateBMR(
        selectedPatient.weight, 
        selectedPatient.height, 
        selectedPatient.age, 
        selectedPatient.gender
      );
      
      toast({
        title: "Dados carregados",
        description: `Os dados de ${selectedPatient.name} foram carregados com sucesso.`,
      });
    }
  };
  
  // Função para recalcular quando o paciente muda
  const handlePatientChange = (patientId: string) => {
    setSelectedPatientId(patientId);
    if (patientId) {
      loadPatientData(patientId);
    } else {
      // Limpar campos se "Selecione um paciente" for escolhido
      setAge("");
      setGender("female");
      setWeight("");
      setHeight("");
      setFromPatient(false);
      setImc(null);
      setBmr(null);
      setTdee(null);
    }
  };
  
  // Função para calcular IMC
  const calculateIMC = (w: number, h: number) => {
    if (w > 0 && h > 0) {
      const heightInM = h / 100;
      const imcValue = w / (heightInM * heightInM);
      setImc(parseFloat(imcValue.toFixed(2)));

      // Classificação do IMC
      if (imcValue < 18.5) {
        setImcClass("Abaixo do peso");
      } else if (imcValue < 25) {
        setImcClass("Peso normal");
      } else if (imcValue < 30) {
        setImcClass("Sobrepeso");
      } else if (imcValue < 35) {
        setImcClass("Obesidade Grau I");
      } else if (imcValue < 40) {
        setImcClass("Obesidade Grau II");
      } else {
        setImcClass("Obesidade Grau III");
      }
    }
  };
  
  // Função para calcular BMR (Taxa Metabólica Basal)
  const calculateBMR = (w: number, h: number, a: number, g: string) => {
    if (w > 0 && h > 0 && a > 0) {
      let bmrValue = 0;
      
      // Fórmula de Mifflin-St Jeor
      if (g === "male") {
        bmrValue = 10 * w + 6.25 * h - 5 * a + 5;
      } else {
        bmrValue = 10 * w + 6.25 * h - 5 * a - 161;
      }
      
      setBmr(Math.round(bmrValue));
      
      // TDEE (Gasto Energético Total Diário)
      let activityMultiplier = 1.2; // Sedentário
      
      switch (activityLevel) {
        case "light":
          activityMultiplier = 1.375; // Atividade leve
          break;
        case "moderate":
          activityMultiplier = 1.55; // Atividade moderada
          break;
        case "active":
          activityMultiplier = 1.725; // Atividade intensa
          break;
        case "veryActive":
          activityMultiplier = 1.9; // Atividade muito intensa
          break;
      }
      
      setTdee(Math.round(bmrValue * activityMultiplier));
    }
  };
  
  const handleIMCCalculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    
    if (isNaN(w) || isNaN(h)) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, insira peso e altura válidos.",
        variant: "destructive"
      });
      return;
    }
    
    calculateIMC(w, h);
  };
  
  const handleBMRCalculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age);
    
    if (isNaN(w) || isNaN(h) || isNaN(a)) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, insira todos os dados necessários.",
        variant: "destructive"
      });
      return;
    }
    
    calculateBMR(w, h, a, gender);
  };
  
  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
  };
  
  // Determina o texto informativo com base no papel do usuário
  const getInstructionText = () => {
    if (user?.role === "nutritionist") {
      return fromPatient 
        ? "Usando dados do paciente selecionado. Você pode alterar os valores para calcular cenários diferentes."
        : "Selecione um paciente para carregar seus dados ou insira os valores manualmente.";
    } else {
      return "Insira seus dados para calcular seus índices nutricionais.";
    }
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-display">Calculadora Nutricional</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Campo para seleção de paciente (apenas para nutricionista) */}
          {user?.role === "nutritionist" && (
            <div className="space-y-2">
              <Label htmlFor="patient">Selecionar Paciente</Label>
              <Select
                value={selectedPatientId}
                onValueChange={handlePatientChange}
              >
                <SelectTrigger id="patient">
                  <SelectValue placeholder="Selecione um paciente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Inserir dados manualmente</SelectItem>
                  {availablePatients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-1">{getInstructionText()}</p>
            </div>
          )}
          
          {/* Tabs para diferentes calculadoras */}
          <Tabs 
            defaultValue="imc" 
            value={selectedTab} 
            onValueChange={handleTabChange} 
            className="w-full"
          >
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="imc">Cálculo de IMC</TabsTrigger>
              <TabsTrigger value="metabolism">Metabolismo Basal</TabsTrigger>
            </TabsList>
            
            {/* Calculadora de IMC */}
            <TabsContent value="imc" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="0.0"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Altura (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="0"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleIMCCalculate}
              >
                Calcular IMC
              </Button>
              
              {imc !== null && (
                <div className="rounded-lg bg-slate-50 dark:bg-slate-900 p-4 mt-4">
                  <h3 className="font-medium mb-2">Resultado</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">IMC</p>
                      <p className="text-2xl font-bold text-nutri-primary">{imc}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Classificação</p>
                      <p className="text-lg font-medium">{imcClass}</p>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            {/* Calculadora de Metabolismo Basal */}
            <TabsContent value="metabolism" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Idade</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="0"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Sexo</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Masculino</SelectItem>
                      <SelectItem value="female">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight-bmr">Peso (kg)</Label>
                  <Input
                    id="weight-bmr"
                    type="number"
                    placeholder="0.0"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height-bmr">Altura (cm)</Label>
                  <Input
                    id="height-bmr"
                    type="number"
                    placeholder="0"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="activity">Nível de Atividade</Label>
                  <Select value={activityLevel} onValueChange={setActivityLevel}>
                    <SelectTrigger id="activity">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentário (pouco ou nenhum exercício)</SelectItem>
                      <SelectItem value="light">Leve (exercício 1-3x/semana)</SelectItem>
                      <SelectItem value="moderate">Moderado (exercício 3-5x/semana)</SelectItem>
                      <SelectItem value="active">Ativo (exercício 6-7x/semana)</SelectItem>
                      <SelectItem value="veryActive">Muito ativo (exercício intenso diário)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleBMRCalculate}
              >
                Calcular Metabolismo
              </Button>
              
              {bmr !== null && (
                <div className="rounded-lg bg-slate-50 dark:bg-slate-900 p-4 mt-4">
                  <h3 className="font-medium mb-2">Resultado</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Taxa Metabólica Basal (TMB)</p>
                      <p className="text-2xl font-bold text-nutri-primary">{bmr} kcal/dia</p>
                      <p className="text-xs text-muted-foreground mt-1">Calorias necessárias em repouso</p>
                    </div>
                    {tdee !== null && (
                      <div>
                        <p className="text-sm text-muted-foreground">Gasto Energético Total (GET)</p>
                        <p className="text-2xl font-bold text-nutri-secondary">{tdee} kcal/dia</p>
                        <p className="text-xs text-muted-foreground mt-1">Calorias totais para manter o peso</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutriCalculator;
