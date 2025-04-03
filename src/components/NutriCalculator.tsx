
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export const NutriCalculator = () => {
  const [formData, setFormData] = useState({
    weight: "",
    height: "",
    age: "",
    gender: "female",
    activityLevel: "moderate",
  });

  const [results, setResults] = useState({
    bmi: null,
    bmr: null,
    tdee: null,
    macros: {
      carbs: null,
      proteins: null,
      fats: null,
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };

  const activityLabels = {
    sedentary: "Sedentário (pouco ou nenhum exercício)",
    light: "Levemente ativo (exercício leve 1-3 dias/semana)",
    moderate: "Moderadamente ativo (exercício moderado 3-5 dias/semana)",
    active: "Muito ativo (exercício intenso 6-7 dias/semana)",
    veryActive: "Extremamente ativo (exercício intenso diário ou trabalho físico)",
  };

  const calculateResults = () => {
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const age = parseFloat(formData.age);

    if (!weight || !height || !age) {
      return;
    }

    // Calcular IMC
    const bmi = weight / Math.pow(height / 100, 2);

    // Calcular TMB (Mifflin-St Jeor)
    let bmr;
    if (formData.gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Calcular TDEE
    const activity = formData.activityLevel as keyof typeof activityMultipliers;
    const tdee = bmr * activityMultipliers[activity];

    // Calcular macronutrientes (exemplo para manutenção)
    // Proteína: 2g por kg de peso corporal
    // Gordura: 25% das calorias
    // Carboidratos: restante das calorias
    const proteins = weight * 2;
    const fats = (tdee * 0.25) / 9;
    const carbs = (tdee - (proteins * 4) - (fats * 9)) / 4;

    setResults({
      bmi: parseFloat(bmi.toFixed(1)),
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      macros: {
        carbs: Math.round(carbs),
        proteins: Math.round(proteins),
        fats: Math.round(fats),
      },
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Calculadora Nutricional</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="metrics">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="metrics">Métricas Corporais</TabsTrigger>
            <TabsTrigger value="macros">Macronutrientes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="metrics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  placeholder="Ex: 70"
                  value={formData.weight}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Altura (cm)</Label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  placeholder="Ex: 170"
                  value={formData.height}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Idade</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  placeholder="Ex: 30"
                  value={formData.age}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Sexo</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o sexo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="female">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="activityLevel">Nível de Atividade</Label>
                <Select
                  value={formData.activityLevel}
                  onValueChange={(value) => handleSelectChange("activityLevel", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o nível de atividade" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(activityLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button 
              className="w-full bg-nutri-primary hover:bg-nutri-secondary mt-4" 
              onClick={calculateResults}
            >
              Calcular
            </Button>
            
            {results.bmi && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-sm font-medium text-gray-500">IMC</h3>
                    <p className="text-2xl font-bold">{results.bmi}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {results.bmi < 18.5
                        ? "Abaixo do peso"
                        : results.bmi < 25
                        ? "Peso normal"
                        : results.bmi < 30
                        ? "Sobrepeso"
                        : "Obesidade"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-sm font-medium text-gray-500">TMB</h3>
                    <p className="text-2xl font-bold">{results.bmr} kcal</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Taxa Metabólica Basal
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-sm font-medium text-gray-500">TDEE</h3>
                    <p className="text-2xl font-bold">{results.tdee} kcal</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Gasto Energético Total Diário
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="macros">
            {results.macros.carbs ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Distribuição de Macronutrientes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4">
                        <h4 className="text-blue-800 font-medium">Carboidratos</h4>
                        <p className="text-2xl font-bold">{results.macros.carbs}g</p>
                        <p className="text-sm text-gray-600">
                          {Math.round(results.macros.carbs * 4)} kcal
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {Math.round((results.macros.carbs * 4 * 100) / results.tdee!)}% do total
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-red-50 border-red-200">
                      <CardContent className="p-4">
                        <h4 className="text-red-800 font-medium">Proteínas</h4>
                        <p className="text-2xl font-bold">{results.macros.proteins}g</p>
                        <p className="text-sm text-gray-600">
                          {Math.round(results.macros.proteins * 4)} kcal
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {Math.round((results.macros.proteins * 4 * 100) / results.tdee!)}% do total
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-yellow-50 border-yellow-200">
                      <CardContent className="p-4">
                        <h4 className="text-yellow-800 font-medium">Gorduras</h4>
                        <p className="text-2xl font-bold">{results.macros.fats}g</p>
                        <p className="text-sm text-gray-600">
                          {Math.round(results.macros.fats * 9)} kcal
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {Math.round((results.macros.fats * 9 * 100) / results.tdee!)}% do total
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Objetivos Calóricos Estimados</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Emagrecimento (déficit de 20%):</span>
                        <span className="font-medium">{Math.round(results.tdee! * 0.8)} kcal</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Manutenção:</span>
                        <span className="font-medium">{results.tdee} kcal</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Ganho de massa (superávit de 10%):</span>
                        <span className="font-medium">{Math.round(results.tdee! * 1.1)} kcal</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500">Preencha os dados na aba "Métricas Corporais" e clique em calcular.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NutriCalculator;
